from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from unittest.mock import patch
from datetime import date

from authenticate.models import CustomUser, Role, User_Role
from dashboard.models import University, Career, Internship, StudentCareer, InternshipStudent, InternshipSupervisor, StepEvaluation, Step

class RegisterSupervisorTestCase(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(username='testuser', email='testuser@example.com', password='testpassword')
        self.client.force_authenticate(user=self.user)

        self.university = University.objects.create(name='Test University', country='Test Country', campus='Test Campus')
        self.career = Career.objects.create(university=self.university, name='Test Career', area='Test Area')
        self.student_career = StudentCareer.objects.create(student=self.user, career=self.career)

        self.internship = Internship.objects.create(name='Test Internship', career=self.career)
        self.internship_student = InternshipStudent.objects.create(
            student_career=self.student_career,
            internship=self.internship,
            startDate=date.today(),
            endDate=date.today()
        )
        self.step = Step.objects.create(title='Step 3', internship=self.internship, number=3)

        self.step_evaluation = StepEvaluation.objects.create(
            student_career=self.student_career,
            step=self.step,
            status=False
        )

        self.url = reverse('register_supervisor')

    def test_register_supervisor_success_new_user(self):
        data = {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'johndoe@example.com',
            'internship_id': str(self.internship_student.id)
        }

        with patch('dashboard.views.send_mail') as mock_send_mail:
            response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('message', response.data)

        internship_supervisor = InternshipSupervisor.objects.get(supervisor__email='johndoe@example.com')
        self.assertTrue(internship_supervisor.valid)

        step_evaluation = StepEvaluation.objects.get(student_career=self.student_career, step=self.step)
        self.assertTrue(step_evaluation.status)

        user = CustomUser.objects.get(email='johndoe@example.com')
        self.assertEqual(user.first_name, 'John')
        self.assertEqual(user.last_name, 'Doe')
        self.assertTrue(User_Role.objects.filter(user=user, role__name='supervisor').exists())

        mock_send_mail.assert_called_once()

    def test_register_supervisor_success_existing_user(self):
        existing_user = get_user_model().objects.create_user(username='existinguser', email='existinguser@example.com', first_name='Jane', last_name='Smith')

        data = {
            'first_name': 'Jane',
            'last_name': 'Smith',
            'email': 'existinguser@example.com',
            'internship_id': str(self.internship_student.id)
        }

        with patch('dashboard.views.send_mail') as mock_send_mail:
            response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('message', response.data)

        internship_supervisor = InternshipSupervisor.objects.get(supervisor=existing_user)
        self.assertTrue(internship_supervisor.valid)

        step_evaluation = StepEvaluation.objects.get(student_career=self.student_career, step=self.step)
        self.assertTrue(step_evaluation.status)

        mock_send_mail.assert_called_once()

    def test_missing_fields(self):
        data = {
            'first_name': 'John',
            'last_name': 'Doe',
        }

        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertIn('Missing required fields', response.data['error'])

    def test_internship_not_found(self):
        data = {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'johndoe@example.com',
            'internship_id': '00000000-0000-0000-0000-000000000000'
        }

        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('error', response.data)
        self.assertIn('InternshipStudent not found', response.data['error'])

    def test_existing_relation(self):
        existing_supervisor = get_user_model().objects.create_user(username='existingsupervisor', email='existingsupervisor@example.com', first_name='Existing', last_name='Supervisor')
        InternshipSupervisor.objects.create(internship_student=self.internship_student, supervisor=existing_supervisor)

        data = {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'existingsupervisor@example.com',
            'internship_id': str(self.internship_student.id)
        }

        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        self.assertIn('Supervisor already linked with this student', response.data['message'])
