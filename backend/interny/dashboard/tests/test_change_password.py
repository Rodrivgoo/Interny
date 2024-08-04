from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse

class ChangePasswordTestCase(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(username='testuser', email='testuser@example.com', password='old_password')
        self.client.force_authenticate(user=self.user)

        self.url = reverse('change_password')

    def test_change_password_success(self):
        data = {
            'old_password': 'old_password',
            'new_password': 'new_password',
            'confirm_password': 'new_password'
        }

        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        self.assertEqual(response.data['message'], 'Password changed successfully')

        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('new_password'))

    def test_change_password_missing_fields(self):
        data = {
            'old_password': 'old_password',
            'new_password': 'new_password'
        }

        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'Old password, new password and confirm new password are required')

    def test_change_password_mismatch(self):
        data = {
            'old_password': 'old_password',
            'new_password': 'new_password',
            'confirm_password': 'different_password'
        }

        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'New password and confirm password do not match')

    def test_change_password_incorrect_old_password(self):
        data = {
            'old_password': 'incorrect_old_password',
            'new_password': 'new_password',
            'confirm_password': 'new_password'
        }

        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'Old password is incorrect')
