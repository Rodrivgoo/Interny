from django.test import TestCase
from django.contrib.auth import get_user_model
from authenticate.models import CustomUser, Role, User_Role

CustomUser = get_user_model()

class CustomUserManagerTestCase(TestCase):
    def test_create_user(self):
        user = CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='password123'
        )
        self.assertIsNotNone(user)
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_create_superuser(self):
        superuser = CustomUser.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='admin123'
        )
        self.assertIsNotNone(superuser)
        self.assertTrue(superuser.is_active)
        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)

    def test_get_roles(self):
        role = Role.objects.create(name='Admin')
        user = CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='password123'
        )
        user_role = User_Role.objects.create(user=user, role=role)
        roles = user.get_roles()
        self.assertIn('Admin', roles)
