from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from unittest.mock import patch
from datetime import date
from django.conf import settings
from smtplib import SMTPException
from django.core.mail import EmailMultiAlternatives
from django.db.models import Q

from authenticate.models import CustomUser, Role, User_Role
from dashboard.models import University, Career, StudentCareer, Internship, Step, StepEvaluation

class SendMassiveEmailTestCase(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(username='adminuser', email='adminuser@example.com', password='adminpassword')
        self.client.force_authenticate(user=self.user)

        self.university = University.objects.create(name='Test University', country='Test Country', campus='Test Campus')
        self.career1 = Career.objects.create(university=self.university, name='Test Career 1', area='Test Area 1')
        self.career2 = Career.objects.create(university=self.university, name='Test Career 2', area='Test Area 2')

        self.student_user1 = get_user_model().objects.create_user(username='studentuser1', email='student1@example.com', password='password')
        self.student_user2 = get_user_model().objects.create_user(username='studentuser2', email='student2@example.com', password='password')

        self.student_career1 = StudentCareer.objects.create(student=self.student_user1, career=self.career1)
        self.student_career2 = StudentCareer.objects.create(student=self.student_user2, career=self.career2)

        self.internship1 = Internship.objects.create(name='Test Internship 1', career=self.career1)
        self.step1 = Step.objects.create(title='Step 1', internship=self.internship1, number=1)
        self.step2 = Step.objects.create(title='Step 2', internship=self.internship1, number=2)

        self.step_evaluation1 = StepEvaluation.objects.create(student_career=self.student_career1, step=self.step1, status=False)
        self.step_evaluation2 = StepEvaluation.objects.create(student_career=self.student_career2, step=self.step2, status=False)

        self.url = reverse('send_massive_email')

    @patch('dashboard.views.EmailMultiAlternatives.send')
    def test_send_massive_email_success(self, mock_send):
        mock_send.return_value = True

        data = {
            'targets': {
                'careers': [str(self.career1.id)],
                'step_number': 1,
                'step_comparison': 'equal'
            },
            'mail_content': 'This is a test email.',
            'subject': 'Test Subject'
        }

        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        self.assertEqual(response.data['message'], 'Emails sent correctly')
        mock_send.assert_called_once()

    @patch('dashboard.views.EmailMultiAlternatives.send')
    def test_send_massive_email_missing_fields(self, mock_send):
        data = {
            'targets': {
                'careers': [str(self.career1.id)],
                'step_number': 1,
                'step_comparison': 'equal'
            }
        }

        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'Missing required fields')
        mock_send.assert_not_called()

    @patch('dashboard.views.EmailMultiAlternatives.send')
    def test_send_massive_email_no_recipients(self, mock_send):
        data = {
            'targets': {
                'careers': [],
                'step_number': 5,
                'step_comparison': 'equal'
            },
            'mail_content': 'This is a test email.',
            'subject': 'Test Subject'
        }

        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'No recipients found')
        mock_send.assert_not_called()

    @patch('dashboard.views.EmailMultiAlternatives.send')
    def test_send_massive_email_smtp_exception(self, mock_send):
        mock_send.side_effect = SMTPException("SMTP error occurred")

        data = {
            'targets': {
                'careers': [str(self.career1.id)],
                'step_number': 1,
                'step_comparison': 'equal'
            },
            'mail_content': 'This is a test email.',
            'subject': 'Test Subject'
        }

        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertIn('error', response.data)
        self.assertIn('SMTP error occurred', response.data['error'])
        mock_send.assert_called_once()
