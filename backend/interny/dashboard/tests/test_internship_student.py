from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.test import APIClient
from dashboard.models import InternshipStudent, Step, StepEvaluation, University, Career, Internship, Company, StudentCareer, TeacherUniversity
from authenticate.models import CustomUser, Role, User_Role

class InternshipStudentViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()

        student_role = Role.objects.create(name='student')
        teacher_role = Role.objects.create(name='teacher')

        self.student_user = CustomUser.objects.create_user(username='student', email='student@example.com', password='testpass')
        self.teacher_user = CustomUser.objects.create_user(username='teacher', email='teacher@example.com', password='testpass')
        User_Role.objects.create(user=self.student_user, role=student_role)
        User_Role.objects.create(user=self.teacher_user, role=teacher_role)

        university = University.objects.create(name='University A', country='Country A', campus='Campus A')
        career = Career.objects.create(university=university, name='Career A', area='Area A')
        internship = Internship.objects.create(name='Internship A', career=career)
        company = Company.objects.create(name='Company A', logo='logo.png')
        student_career = StudentCareer.objects.create(student=self.student_user, career=career)
        teacher_university = TeacherUniversity.objects.create(teacher=self.teacher_user, university=university, faculty='Faculty A')
        
        self.step1 = Step.objects.create(
            internship=internship,
            title='Step 1',
            number=1,
            instructions_key='step_1_instructions'
        )
        self.step2 = Step.objects.create(
            internship=internship,
            title='Step 2',
            number=2,
            instructions_key='step_2_instructions'
        )

        self.internship_student = InternshipStudent.objects.create(
            student_career=student_career,
            teacher=teacher_university,
            internship=internship,
            company=company,
            status='active',
            startDate='2024-01-01',
            endDate='2024-12-31'
        )

    def test_get_internship_student_as_student(self):
        self.client.force_authenticate(user=self.student_user)
        url = reverse('internship_student_detail', args=[self.internship_student.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('internship_student_id', response.data)

    def test_get_internship_student_as_teacher(self):
        self.client.force_authenticate(user=self.teacher_user)
        url = reverse('internship_student_detail', args=[self.internship_student.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('internship_student_id', response.data)

    def test_get_internship_student_not_authorized(self):
        another_user = CustomUser.objects.create_user(username='another', email='another@example.com', password='testpass')
        url = reverse('internship_student_detail', args=[self.internship_student.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
