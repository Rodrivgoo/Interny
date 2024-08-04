from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Role, User_Role
from .forms import CustomUserCreationForm, CustomUserChangeForm
from django.db import models

class UserRoleInline(admin.TabularInline):
    model = User_Role
    formfield_overrides = {
        models.ManyToManyField: {'empty_label': None},
    }
    extra = 0

class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_superuser', 'terms', 'get_roles_display')
    list_filter = ('is_superuser', 'user_role__role')

    fieldsets = (
        (None, {'fields': ('username', 'email', 'password', 'first_name', 'last_name', 'terms')}),
        ('Roles', {'fields': ('roles',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'first_name', 'last_name', 'terms', 'roles')}
        ),
    )
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('username',)

    filter_horizontal = ()

    def save_model(self, request, obj, form, change):
        if not change:
            user_role = User_Role(user=obj, role=form.cleaned_data['roles'])
            user_role.save()
        else:
            user_role = obj.user_role
            if user_role:
                user_role.role = form.cleaned_data['roles']
                user_role.save()
            else:
                new_user_role = User_Role(user=obj, role=form.cleaned_data['roles'])
                new_user_role.save()
        super().save_model(request, obj, form, change)

    def get_roles_display(self, obj):
        roles = obj.get_roles()
        return ', '.join(roles) if roles else '-'

    get_roles_display.short_description = 'Roles'

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'roles':
            kwargs['empty_label'] = None
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Role)
