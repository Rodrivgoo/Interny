from django.contrib import admin
from .models import JobAplication, Jobs
from dashboard.models import Company
from .forms import JobsAdminForm

@admin.register(JobAplication)
class JobAplicationAdmin(admin.ModelAdmin):
    list_display = ['get_job_title', 'student_career_id', 'description']

    def get_job_title(self, obj):
        return obj.job_id.title
    get_job_title.short_description = 'Job Title'

@admin.register(Jobs)
class JobsAdmin(admin.ModelAdmin):
    form = JobsAdminForm  # Usa el formulario personalizado
    list_display = ['title', 'get_company_name', 'region', 'city', 'arrengement', 'employment', 'date_posted', 'about']

    def get_company_name(self, obj):
        return obj.company_id.name
    get_company_name.short_description = 'Company Name'