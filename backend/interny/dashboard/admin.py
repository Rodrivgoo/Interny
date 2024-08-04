from django.contrib import admin
from django import forms
from .models import (
    TeacherUniversity, University, Career, StudentCareer, Step,
    StepEvaluation, DirectorUniversity, InternshipStudent, Internship,
    SupervisorEvaluation, InternshipSupervisor, Company, CompanyEvaluation
)
from .forms import DirectorUniversityForm, InternshipStudentAdminForm

class StepEvaluationInlineForm(forms.ModelForm):
    step = forms.ModelChoiceField(queryset=Step.objects.all(), empty_label=None)

    class Meta:
        model = StepEvaluation
        fields = '__all__'

class CustomStepEvaluationInline(admin.TabularInline):
    model = StepEvaluation
    form = StepEvaluationInlineForm
    extra = 0

    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        if obj:
            fieldsets.append(('Step evaluations', {'fields': ()}))
        return fieldsets

@admin.register(University)
class UniversityAdmin(admin.ModelAdmin):
    list_display = ['name', 'country', 'campus']
    list_filter = ['country', 'campus']
    search_fields = ['name', 'country', 'campus']

@admin.register(Career)
class CareerAdmin(admin.ModelAdmin):
    list_display = ['name', 'university', 'area']
    list_filter = ['university__name', 'university__country', 'area']
    search_fields = ['name', 'university__name', 'area']

@admin.register(TeacherUniversity)
class TeacherUniversityAdmin(admin.ModelAdmin):
    list_display = ['get_teacher_full_name', 'teacher_email', 'university', 'faculty']
    list_filter = ['university__name', 'university__country', 'faculty']
    search_fields = ['teacher__username', 'teacher__email', 'university__name', 'faculty']

    def teacher_email(self, obj):
        return obj.teacher.email

    def get_teacher_full_name(self, obj):
        return f"{obj.teacher.first_name} {obj.teacher.last_name}"
    get_teacher_full_name.short_description = 'Teacher Name'

@admin.register(StudentCareer)
class StudentCareerAdmin(admin.ModelAdmin):
    list_display = ['student', 'student_email', 'career', 'progress', 'assigned_teacher']
    list_filter = ['career__university__name', 'career__area']
    search_fields = ['student__username', 'student__email', 'career__name', 'career__university__name']
    inlines = [CustomStepEvaluationInline]
    exclude = ['steps']

    def student_email(self, obj):
        return obj.student.email

    def assigned_teacher(self, obj):
        internship_student = InternshipStudent.objects.filter(student_career=obj).first()
        if internship_student and internship_student.teacher:
            return internship_student.teacher.teacher.username
        return "No teacher assigned"

    assigned_teacher.short_description = "Assigned Teacher"

@admin.register(StepEvaluation)
class StepEvaluationAdmin(admin.ModelAdmin):
    list_display = ['get_student_name', 'get_step_title', 'get_internship_name', 'status','weight' ,'file_key', 'date_completed', 'comentary', 'feedback', 'grade']
    list_filter = ['step__internship__name', 'status']
    search_fields = ['student_career__student__first_name', 'student_career__student__last_name', 'step__title', 'step__internship__name']

    def get_student_name(self, obj):
        student = obj.student_career.student
        return f"{student.first_name} {student.last_name}" if student else ''
    get_student_name.short_description = 'Student Name'

    def get_step_title(self, obj):
        return obj.step.title if obj.step else ''
    get_step_title.short_description = 'Step Title'

    def get_internship_name(self, obj):
        return obj.step.internship.name if obj.step and obj.step.internship else ''
    get_internship_name.short_description = 'Internship Name'

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return [field.name for field in obj._meta.fields if field.name not in ('status', 'date_completed', 'step')]
        return []

@admin.register(DirectorUniversity)
class DirectorUniversityAdmin(admin.ModelAdmin):
    form = DirectorUniversityForm
    list_display = ['get_director_full_name', 'director_email', 'university', 'career']
    list_filter = ['university__name', 'university__country', 'career__name']
    search_fields = ['director__first_name', 'director__last_name', 'director__email', 'university__name', 'career__name']

    def director_email(self, obj):
        return obj.director.email
    
    def get_director_full_name(self, obj):
        return f"{obj.director.first_name} {obj.director.last_name}"
    get_director_full_name.short_description = 'Director Name'

@admin.register(InternshipStudent)
class InternshipStudentAdmin(admin.ModelAdmin):
    form = InternshipStudentAdminForm
    list_display = ['get_student_full_name', 'get_teacher_name', 'get_internship_name','get_company_name', 'grade', 'valid', 'startDate', 'endDate', 'description', 'meeting', 'supervisor']
    list_filter = ['valid', 'internship__name', 'company__name']
    search_fields = ['student_career__student__first_name', 'student_career__student__last_name', 'teacher__teacher__first_name', 'teacher__teacher__last_name', 'internship__name']

    def get_teacher_name(self, obj):
        teacher = obj.teacher.teacher if obj.teacher else None
        return f"{teacher.first_name} {teacher.last_name}" if teacher else ''
    get_teacher_name.short_description = 'Teacher Name'

    def get_student_full_name(self, obj):
        student = obj.student_career.student
        return f"{student.first_name} {student.last_name}"
    get_student_full_name.short_description = 'Student Name'

    def get_internship_name(self, obj):
        return obj.internship.name
    get_internship_name.short_description = 'Internship Name'

    def get_company_name(self, obj):
        return obj.company.name if obj.company else ''
    get_company_name.short_description = 'Company Name'



@admin.register(Step)
class StepAdmin(admin.ModelAdmin):
    list_display = ['title','get_step_id', 'get_internship_name', 'get_career_name', 'number', 'feedback', 'grade', 'instructions_key']
    list_filter = ['internship__career__name', 'title', 'internship__name']
    search_fields = ['title', 'internship__name', 'internship__career__name']

    def get_internship_name(self, obj):
        return obj.internship.name if obj.internship else ''
    get_internship_name.short_description = 'Internship Name'

    def get_career_name(self, obj):
        return obj.internship.career.name if obj.internship and obj.internship.career else ''
    get_career_name.short_description = 'Career Name'

    def get_step_id(self, obj):
        return obj.id if obj.id else ''
    get_step_id.short_description = 'Step ID'

@admin.register(Internship)
class InternshipAdmin(admin.ModelAdmin):
    list_display = ['name','get_university_name','get_career_name']
    list_filter = ['career__name', 'career__university__name']
    search_fields = ['name', 'career__name', 'career__university__name']

    def get_career_name(self, obj):
        return obj.career.name if obj.career else ''
    get_career_name.short_description = 'Career Name'
    
    def get_university_name(self, obj):
        return obj.career.university.name if obj.career and obj.career.university else ''
    get_university_name.short_description = 'University Name'

@admin.register(InternshipSupervisor)
class InternshipSupervisorAdmin(admin.ModelAdmin):
    list_display = ['supervisor_username', 'internship_student', 'valid']
    list_filter = ['valid']
    search_fields = ['supervisor__username', 'internship_student__id']

    def supervisor_username(self, obj):
        return obj.supervisor.username if obj.supervisor else ''
    supervisor_username.short_description = 'Supervisor Username'

@admin.register(SupervisorEvaluation)
class SupervisorEvaluationAdmin(admin.ModelAdmin):
    list_display = ['get_student_full_name', 'get_supervisor_name', 'get_company_name', 'evaluation']
    search_fields = ['evaluation', 'internship_supervisor__internship_student__student_career__student__first_name', 'internship_supervisor__internship_student__student_career__student__last_name', 'internship_supervisor__supervisor__first_name', 'internship_supervisor__supervisor__last_name', 'internship_supervisor__internship_student__company__name']

    def get_student_full_name(self, obj):
        student = obj.internship_supervisor.internship_student.student_career.student
        return f"{student.first_name} {student.last_name}"
    get_student_full_name.short_description = 'Student Name'

    def get_supervisor_name(self, obj):
        supervisor = obj.internship_supervisor.supervisor
        return f"{supervisor.first_name} {supervisor.last_name}"
    get_supervisor_name.short_description = 'Supervisor Name'

    def get_company_name(self, obj):
        company = obj.internship_supervisor.internship_student.company
        return company.name if company else ''
    get_company_name.short_description = 'Company Name'
    

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'logo']
    search_fields = ['name']

@admin.register(CompanyEvaluation)
class CompanyEvaluationAdmin(admin.ModelAdmin):
    list_display = ['evaluation', 'get_student_name', 'get_company_name']
    search_fields = ['evaluation', 'internship_student__student_career__student__username', 'internship_student__company__name']
    list_filter = ['internship_student__company__name']

    def get_student_name(self, obj):
        return obj.internship_student.student_career.student.username
    get_student_name.short_description = 'Student Name'

    def get_company_name(self, obj):
        return obj.internship_student.company.name
    get_company_name.short_description = 'Company Name'