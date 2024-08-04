from django.test import TestCase
from django.contrib.auth import get_user_model
from ..models import (
    University, Career, Internship, TeacherUniversity, Step,
    StudentCareer, DirectorUniversity, InternshipStudent,
    StepEvaluation, InternshipSupervisor, SupervisorEvaluation
)

User = get_user_model()

class ModelsTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password123')
        self.university = University.objects.create(name='Test University', country='Test Country', campus='Test Campus')
        self.career = Career.objects.create(university=self.university, name='Test Career', area='Test Area')
        self.internship = Internship.objects.create(name='Test Internship', career=self.career)
        self.teacher_university = TeacherUniversity.objects.create(teacher=self.user, university=self.university, faculty='Test Faculty')
        self.step = Step.objects.create(title='Test Step', internship=self.internship, number=1)
        self.student_career = StudentCareer.objects.create(student=self.user, career=self.career)
        self.director_university = DirectorUniversity.objects.create(director=self.user, university=self.university, career=self.career)
        self.internship_student = InternshipStudent.objects.create(
            student_career=self.student_career, internship=self.internship, startDate='2024-01-01', endDate='2024-02-01'
        )
        self.step_evaluation = StepEvaluation.objects.create(student_career=self.student_career, step=self.step, status=True)
        self.internship_supervisor = InternshipSupervisor.objects.create(internship_student=self.internship_student, supervisor=self.user, valid=True)
        self.supervisor_evaluation = SupervisorEvaluation.objects.create(internship_supervisor=self.internship_supervisor, mandatory=True)

    def test_models(self):
        self.assertEqual(str(self.university), 'Test University')
        self.assertEqual(str(self.career), 'Test Career')
        self.assertEqual(str(self.internship), 'Test Internship')
        self.assertEqual(str(self.teacher_university), f"{self.user.username} - Test University")
        self.assertEqual(str(self.step), 'Test Step')
        self.assertEqual(str(self.student_career), f"{self.user.username} - Test Career")
        self.assertEqual(str(self.director_university), f"{self.user.username} - Test University - Test Career")
        self.assertEqual(str(self.internship_student), f"{self.student_career}")
        self.assertEqual(str(self.step_evaluation), f"{self.student_career} - {self.step} - True")
        self.assertEqual(str(self.internship_supervisor), f"{self.user.username} - {self.internship_student}")

    def test_delete_step_evaluations_signal(self):
        self.assertEqual(StepEvaluation.objects.count(), 1)
        self.internship_student.delete()
        self.assertEqual(StepEvaluation.objects.count(), 0)
