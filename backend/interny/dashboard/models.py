import uuid
from django.db import models
from authenticate.models import CustomUser
from django.db.models.signals import pre_delete
from django.dispatch import receiver

class University(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    campus = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Career(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    university = models.ForeignKey(University, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    area = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Internship(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    career = models.ForeignKey(Career, on_delete=models.CASCADE)
    Step = models.ManyToManyField('Step', related_name='internships')

    def __str__(self):
        return self.name

class TeacherUniversity(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    teacher = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    university = models.ForeignKey(University, on_delete=models.CASCADE)
    faculty = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.teacher.username} - {self.university.name}"

class Step(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=100)
    internship = models.ForeignKey(Internship, on_delete=models.CASCADE, related_name='steps')
    number = models.IntegerField()
    grade = models.FloatField(null=True, blank=True)
    weight = models.FloatField(null=True, blank=True)
    feedback = models.JSONField(null=True, blank=True)
    instructions_key = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.title

class StudentCareer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='student_profile', limit_choices_to={'user_role__role__name': 'student'})
    career = models.ForeignKey(Career, on_delete=models.CASCADE)
    progress = models.IntegerField(default=0)
    internship = models.ForeignKey(Internship, on_delete=models.CASCADE, related_name='student_internships', null=True, blank=True)

    class Meta:
        unique_together = ('student', 'career')

    def __str__(self):
        return f"{self.student.username} - {self.career}"

class DirectorUniversity(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    director = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    university = models.ForeignKey(University, on_delete=models.CASCADE)
    career = models.ForeignKey(Career, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.director.username} - {self.university.name} - {self.career.name}"

class CompanyEvaluation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    evaluation = models.JSONField(null=True, blank=True)
    internship_student = models.ForeignKey('InternshipStudent', on_delete=models.CASCADE)
    def __str__(self):
        return str(self.id)
    

class Company(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, null=True, blank=True)
    logo = models.CharField(max_length=255, null=True, blank=True)
    evaluation = models.ForeignKey(CompanyEvaluation, on_delete=models.CASCADE, null=True, blank=True)
    user_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True)


class InternshipStudent(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student_career = models.ForeignKey(StudentCareer, on_delete=models.CASCADE)
    teacher = models.ForeignKey(TeacherUniversity, on_delete=models.SET_NULL, related_name='students', null=True, blank=True)
    internship = models.ForeignKey(Internship, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True)
    valid = models.BooleanField(default=False)
    status = models.CharField(max_length=100, null=True, blank=True)
    grade = models.FloatField(null=True, blank=True)
    startDate = models.DateField()
    endDate = models.DateField()
    description = models.TextField(null=True, blank=True)
    meeting = models.BooleanField(default=False)
    supervisor = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, related_name='supervisors', null=True, blank=True)


    def __str__(self):
        return f"{self.student_career}"

class StepEvaluation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student_career = models.ForeignKey(StudentCareer, on_delete=models.CASCADE, related_name='step_evaluations')
    step = models.ForeignKey(Step, on_delete=models.CASCADE)
    status = models.BooleanField(default=False)
    date_completed = models.DateField(null=True, blank=True)
    comentary = models.TextField(null=True, blank=True)
    weight = models.FloatField(null=True, blank=True)
    feedback = models.JSONField(null=True, blank=True)
    grade = models.FloatField(null=True, blank=True)
    file_key = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"{self.student_career} - {self.step} - {self.status}"
    
class InternshipSupervisor(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    internship_student = models.ForeignKey(InternshipStudent, on_delete=models.CASCADE)
    supervisor = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    valid = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.supervisor} - {self.internship_student}"
    
class SupervisorEvaluation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    internship_supervisor = models.ForeignKey(InternshipSupervisor, on_delete=models.CASCADE)
    mandatory = models.BooleanField(default=False)
    evaluation = models.JSONField(null=True, blank=True)

    def __str__(self):
        return f"{self.evaluation} - {self.mandatory}"


@receiver(pre_delete, sender=InternshipStudent)
def delete_step_evaluations(sender, instance, **kwargs):
    StepEvaluation.objects.filter(student_career=instance.student_career).delete()
