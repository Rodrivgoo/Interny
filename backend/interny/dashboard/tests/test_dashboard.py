from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from rest_framework import status
from authenticate.models import CustomUser, Role, User_Role
from dashboard.models import (
    University, Career, Internship, StudentCareer, InternshipStudent, TeacherUniversity, DirectorUniversity,
    Company, Step, StepEvaluation, InternshipSupervisor, SupervisorEvaluation
)
from datetime import datetime
import uuid

class DashboardViewTests(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.student_user = CustomUser.objects.create_user(username='studentuser', email='student@example.com', password='testpassword')
        self.teacher_user = CustomUser.objects.create_user(username='teacheruser', email='teacher@example.com', password='testpassword')
        self.director_user = CustomUser.objects.create_user(username='directoruser', email='director@example.com', password='testpassword')
        self.supervisor_user = CustomUser.objects.create_user(username='supervisoruser', email='supervisor@example.com', password='testpassword')

        self.student_role = Role.objects.create(name='student')
        self.teacher_role = Role.objects.create(name='teacher')
        self.director_role = Role.objects.create(name='director')
        self.supervisor_role = Role.objects.create(name='supervisor')

        User_Role.objects.create(user=self.student_user, role=self.student_role)
        User_Role.objects.create(user=self.teacher_user, role=self.teacher_role)
        User_Role.objects.create(user=self.director_user, role=self.director_role)
        User_Role.objects.create(user=self.supervisor_user, role=self.supervisor_role)

        self.university = University.objects.create(name='Test University', country='Test Country', campus='Test Campus')
        self.career = Career.objects.create(university=self.university, name='Test Career', area='Test Area')
        self.internship = Internship.objects.create(name='Test Internship', career=self.career)

        self.step1 = Step.objects.create(title='Step 1', internship=self.internship, number=1)
        self.step2 = Step.objects.create(title='Step 2', internship=self.internship, number=2)

        self.student_career = StudentCareer.objects.create(student=self.student_user, career=self.career)

        self.company = Company.objects.create(name='Test Company')

        self.internship_student = InternshipStudent.objects.create(
            student_career=self.student_career,
            internship=self.internship,
            company=self.company,
            startDate=datetime.now(),
            endDate=datetime.now(),
            teacher=None,
            supervisor=None
        )

        self.step_evaluation1 = StepEvaluation.objects.create(
            student_career=self.student_career, step=self.step1, status=True, date_completed=datetime.now()
        )
        self.step_evaluation2 = StepEvaluation.objects.create(
            student_career=self.student_career, step=self.step2, status=False
        )

        self.teacher_university = TeacherUniversity.objects.create(teacher=self.teacher_user, university=self.university, faculty='Engineering')

        self.director_university = DirectorUniversity.objects.create(director=self.director_user, university=self.university, career=self.career)

        self.internship_supervisor = InternshipSupervisor.objects.create(internship_student=self.internship_student, supervisor=self.supervisor_user)


    def test_student_dashboard(self):
        self.client.force_authenticate(user=self.student_user)
        response = self.client.get(reverse('dashboard'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('student', response.data)

    def test_teacher_dashboard(self):
        self.client.force_authenticate(user=self.teacher_user)
        response = self.client.get(reverse('dashboard'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('students', response.data)

    def test_teacher_dashboard_no_university(self):
        self.teacher_university.delete()
        self.client.force_authenticate(user=self.teacher_user)
        response = self.client.get(reverse('dashboard'))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('error', response.data)

    def test_director_dashboard(self):
        self.client.force_authenticate(user=self.director_user)
        response = self.client.get(reverse('dashboard'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('students', response.data)

    def test_director_dashboard_no_university(self):
        self.director_university.delete()
        self.client.force_authenticate(user=self.director_user)
        response = self.client.get(reverse('dashboard'))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('error', response.data)

    def test_supervisor_dashboard(self):
        self.client.force_authenticate(user=self.supervisor_user)
        response = self.client.get(reverse('dashboard'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('students', response.data)

        
class SelectCareerTests(APITestCase):

    def setUp(self):
        self.client = APIClient()

        self.student_role = Role.objects.create(name='student')

        self.student_user = CustomUser.objects.create_user(username='studentuser', email='student@example.com', password='testpassword')

        User_Role.objects.create(user=self.student_user, role=self.student_role)

        self.university = University.objects.create(name='Test University', country='Test Country', campus='Test Campus')
        self.career = Career.objects.create(university=self.university, name='Test Career', area='Test Area')

    def test_user_already_has_career(self):
        StudentCareer.objects.create(student=self.student_user, career=self.career)
        self.client.force_authenticate(user=self.student_user)
        response = self.client.get(reverse('select_career'))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'User already has a career assigned')

    def test_no_careers_available(self):
        Career.objects.all().delete()  
        self.client.force_authenticate(user=self.student_user)
        response = self.client.get(reverse('select_career'))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], 'No careers available')

    def test_select_career_success(self):
        self.client.force_authenticate(user=self.student_user)
        response = self.client.get(reverse('select_career'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('careers', response.data)
