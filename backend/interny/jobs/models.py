from django.db import models
from dashboard.models import Career, Company, StudentCareer
import uuid

class Jobs(models.Model):
    job_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    company_id = models.ForeignKey(Company, on_delete=models.CASCADE)
    region = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    arrengement = models.CharField(max_length=255)
    employment = models.CharField(max_length=255)
    date_posted = models.DateField()
    about = models.TextField()
    careers = models.ManyToManyField(Career, related_name='jobs')

class JobAplication(models.Model):
    job_id = models.ForeignKey(Jobs, on_delete=models.CASCADE)
    student_career_id = models.ForeignKey(StudentCareer, on_delete=models.CASCADE)
    description = models.TextField()
