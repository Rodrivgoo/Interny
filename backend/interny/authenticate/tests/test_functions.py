from django.core.management import call_command
from django.test import TestCase

class CreateTestUsersTestCase(TestCase):
    def test_create_test_users_command(self):
        call_command('create_test_users')