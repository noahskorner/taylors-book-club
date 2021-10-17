const jwt = require("jsonwebtoken");
const { createResponse } = require("../common/functions");
const { Users, Roles } = require("../models");

const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const authorize = (permittedRoles) => {
  return async (req, res, next) => {
    const userId = req.user.id;

    await Users.findOne({
      where: { id: userId },
      include: { model: Roles, as: "roles", attributes: ["name"] },
    })
      .then((data) => {
        const user = data.toJSON();
        console.log(user);
        if (
          permittedRoles.some((r) =>
            user.roles.map((role) => role["name"]).includes(r)
          )
        ) {
          next();
        } else {
          return res.sendStatus(403);
        }
      })
      .catch((error) => {
        console.log(error);
        return res.sendStatus(403);
      });
  };
};

module.exports = {
  authenticate,
  authorize,
};
