from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.test import APIClient
from dashboard.models import InternshipStudent, Step, StepEvaluation, University, Career, Internship, Company, StudentCareer, TeacherUniversity
from authenticate.models import CustomUser, Role, User_Role

class InternshipStepViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()

        # Crear roles
        student_role = Role.objects.create(name='student')
        teacher_role = Role.objects.create(name='teacher')

        # Crear usuarios y asignar roles
        self.student_user = CustomUser.objects.create_user(username='student', email='student@example.com', password='testpass')
        self.teacher_user = CustomUser.objects.create_user(username='teacher', email='teacher@example.com', password='testpass')
        User_Role.objects.create(user=self.student_user, role=student_role)
        User_Role.objects.create(user=self.teacher_user, role=teacher_role)

        # Crear objetos relacionados
        university = University.objects.create(name='University A', country='Country A', campus='Campus A')
        career = Career.objects.create(university=university, name='Career A', area='Area A')
        internship = Internship.objects.create(name='Internship A', career=career)
        company = Company.objects.create(name='Company A', logo='logo.png')
        student_career = StudentCareer.objects.create(student=self.student_user, career=career)
        teacher_university = TeacherUniversity.objects.create(teacher=self.teacher_user, university=university, faculty='Faculty A')

        # Crear steps para el internship
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

    def test_post_internship_step_as_student(self):
        self.client.force_authenticate(user=self.student_user)
        url = reverse('internship_step_detail', args=[self.internship_student.id, self.step1.id])
        data = {
            'file_key': 'new_file_key'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'StepEvaluation updated successfully')

    def test_post_internship_step_as_teacher(self):
        self.client.force_authenticate(user=self.teacher_user)
        url = reverse('internship_step_detail', args=[self.internship_student.id, self.step2.id])
        data = {
            'status': 'Completed',
            'file_key': 'new_file_key',
            'date_completed': '2024-07-01',
            'comentary': 'Good job',
            'grade': 95,
            'internship_grade': 90,
            'feedback': '{"quality": "high"}'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'StepEvaluation updated successfully')

    def test_post_internship_step_not_authorized(self):
        another_user = CustomUser.objects.create_user(username='another', email='another@example.com', password='testpass')
        url = reverse('internship_step_detail', args=[self.internship_student.id, self.step1.id])
        data = {
            'file_key': 'new_file_key'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
