from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from datetime import datetime
from django.utils import timezone
from django.contrib.auth import get_user_model

from authenticate.models import CustomUser, Role, User_Role
from dashboard.models import University, Career, Internship, TeacherUniversity, DirectorUniversity, Company, Step, StepEvaluation, InternshipStudent, InternshipSupervisor, SupervisorEvaluation, StudentCareer

class LinkInternshipTestCase(TestCase):
    
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create(username='testuser', email='testuser@example.com', password='testpassword')
        self.client.force_authenticate(user=self.user)
        
        self.university = University.objects.create(name='Test University', country='Test Country', campus='Test Campus')
        self.career = Career.objects.create(university=self.university, name='Test Career', area='Test Area')
        self.student_career = StudentCareer.objects.create(student=self.user, career=self.career)
        
        self.teacher = get_user_model().objects.create(username='teacher', email='teacher@example.com', password='teacherpassword')
        self.teacher_university = TeacherUniversity.objects.create(teacher=self.teacher, university=self.university, faculty='Test Faculty')
        
        self.internship = Internship.objects.create(name='Test Internship', career=self.career)
        
        self.step1 = Step.objects.create(title='Step 1', internship=self.internship, number=1)
        self.step2 = Step.objects.create(title='Step 2', internship=self.internship, number=2)
        
        self.company_name = 'Test Company'
        self.start_date = timezone.now().date()
        self.end_date = timezone.now().date()
        self.description = 'Test internship description'
        
        self.url = reverse('link_internship')
    
    def test_link_internship_success(self):
        data = {
            'internship_id': str(self.internship.id),
            'teacher_id': str(self.teacher_university.id),
            'company_name': self.company_name,
            'startDate': self.start_date,
            'endDate': self.end_date,
            'description': self.description
        }
        
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('message', response.data)
        
        self.assertTrue(InternshipStudent.objects.filter(student_career=self.student_career, internship=self.internship).exists())
        self.assertTrue(Company.objects.filter(name=self.company_name).exists())
        self.assertTrue(StepEvaluation.objects.filter(student_career=self.student_career).exists())
    
    def test_missing_fields(self):
        data = {
            'internship_id': str(self.internship.id),
            'teacher_id': str(self.teacher_university.id),
            'company_name': self.company_name,
            'description': self.description
        }
        
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertIn('Missing fields', response.data['error'])
    

