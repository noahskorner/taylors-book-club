from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(CustomUser)
admin.site.register(Club)
admin.site.register(Book)
admin.site.register(ClubBook)
admin.site.register(Post)
