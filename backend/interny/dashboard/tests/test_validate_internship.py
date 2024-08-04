from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from datetime import date

from authenticate.models import CustomUser, Role, User_Role
from dashboard.models import University, Career, Internship, InternshipStudent, StudentCareer

class ValidateInternshipTestCase(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.teacher_user = get_user_model().objects.create_user(username='teacheruser', email='teacher@example.com', password='password')
        self.student_user = get_user_model().objects.create_user(username='studentuser', email='student@example.com', password='password')
        self.director_user = get_user_model().objects.create_user(username='directoruser', email='director@example.com', password='password')

        self.role_teacher = Role.objects.create(name='teacher')
        self.role_student = Role.objects.create(name='student')
        self.role_director = Role.objects.create(name='director')

        User_Role.objects.create(user=self.teacher_user, role=self.role_teacher)
        User_Role.objects.create(user=self.student_user, role=self.role_student)
        User_Role.objects.create(user=self.director_user, role=self.role_director)

        self.university = University.objects.create(name='Test University', country='Test Country', campus='Test Campus')
        self.career = Career.objects.create(university=self.university, name='Test Career', area='Test Area')
        self.internship = Internship.objects.create(name='Test Internship', career=self.career)
        self.student_career = StudentCareer.objects.create(student=self.student_user, career=self.career)
        self.internship_student = InternshipStudent.objects.create(internship=self.internship, student_career=self.student_career, valid=False, startDate=date.today(), endDate=date.today())

        self.url = reverse('validate_internship')

    def test_validate_internship_success(self):
        self.client.force_authenticate(user=self.teacher_user)
        data = {'internship_id': self.internship_student.id}

        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        self.assertEqual(response.data['message'], 'Internship validated successfully')

        self.internship_student.refresh_from_db()
        self.assertTrue(self.internship_student.valid)

    def test_validate_internship_already_valid(self):
        self.client.force_authenticate(user=self.teacher_user)
        self.internship_student.valid = True
        self.internship_student.save()

        data = {'internship_id': self.internship_student.id}
        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'Internship already validated')

    def test_validate_internship_not_found(self):
        self.client.force_authenticate(user=self.teacher_user)
        data = {'internship_id': 'non-existent-id'}

        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'Internship not found')

    def test_validate_internship_missing_id(self):
        self.client.force_authenticate(user=self.teacher_user)
        response = self.client.post(self.url, {}, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'Internship ID is required')

    def test_validate_internship_student_not_allowed(self):
        self.client.force_authenticate(user=self.student_user)
        data = {'internship_id': self.internship_student.id}

        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'Not allowed')

    def test_validate_internship_director_not_allowed(self):
        self.client.force_authenticate(user=self.director_user)
        data = {'internship_id': self.internship_student.id}

        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'Not allowed')

    def test_validate_internship_undefined_role(self):
        undefined_user = get_user_model().objects.create_user(username='undefineduser', email='undefined@example.com', password='password')
        self.client.force_authenticate(user=undefined_user)
        data = {'internship_id': self.internship_student.id}

        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'Role undefined')
