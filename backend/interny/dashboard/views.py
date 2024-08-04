from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist
from .models import StepEvaluation, StudentCareer, TeacherUniversity, Career, InternshipStudent, Internship, Step, DirectorUniversity, InternshipSupervisor, SupervisorEvaluation, Company, CompanyEvaluation
from authenticate.models import CustomUser, Role, User_Role
from authenticate.models import CustomUser
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from smtplib import SMTPException
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.db.models import Q
from datetime import datetime
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.db import transaction
import json
from itsdangerous import URLSafeSerializer
from decouple import config
from datetime import datetime, timedelta

URL = config('URL')

class DashboardView(APIView):
    def __init__(self):
        super().__init__()

    def get(self, request):
        try:
            if not request.user.is_authenticated:
                return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

            user_roles = request.user.get_roles()

            if 'teacher' in user_roles:
                return self.teacher_dashboard(request.user)
            elif 'student' in user_roles:
                return self.student_dashboard(request.user)
            elif 'director' in user_roles:
                return self.director_dashboard(request.user)
            elif 'supervisor' in user_roles:
                return self.supervisor_dashboard(request.user)
            elif 'company' in user_roles:
                return self.company_dashboard(request.user)
            else:
                return Response({'error': 'Role undefined'}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def get_student_progress(self, student_career, step_evaluations):
        student_progress = []
        completed_steps = [evaluation.step.number for evaluation in step_evaluations if evaluation.status]
        current_step = max(completed_steps) if completed_steps else 0

        for evaluation in step_evaluations:
            step = evaluation.step
            status = "done" if evaluation.status else "pending"
            date_completed = evaluation.date_completed.strftime("%d-%m-%Y") if evaluation.date_completed else None
            step_info = {
                "step_id":step.id,
                "step": step.number,
                "title": step.title,
                "status": status,
                "date": date_completed
            }
            student_progress.append(step_info)

        return current_step, student_progress

    def student_dashboard(self, user):
        try:
            student_career = StudentCareer.objects.get(student=user)
            career = student_career.career
            internships = Internship.objects.filter(career=career)
            actual_internships = InternshipStudent.objects.filter(student_career=student_career)

            steps = Step.objects.filter(internships__in=internships)
            step_evaluations = StepEvaluation.objects.filter(student_career=student_career)
            current_step, progress = self.get_student_progress(student_career, step_evaluations)

            available_teachers = self.get_available_teachers(career.university, career)
            student_info = {
                "id": user.id,
                "name": f"{user.first_name} {user.last_name}",
                "step": current_step,
                "career_name": student_career.career.name,
                "available_teachers": available_teachers,
                "possible_internships": list(internships.values("id", "name")),
                "actual_internships": list(actual_internships.values("id")),
            }

            internship_student = InternshipStudent.objects.filter(student_career=student_career).first()
            if internship_student:
                student_info["company_name"] = internship_student.company.name if internship_student.company.name else None
                student_info["company_logo"] = internship_student.company.logo if internship_student.company.logo else None
                student_info["valid"] = internship_student.valid
                student_info["status"] = internship_student.status
                student_info["end_date"] = internship_student.endDate
                student_info["start_date"] = internship_student.startDate
                student_info["teacher_name"] = internship_student.teacher.teacher.username if internship_student.teacher else None
                student_info["supervisor_name"] = internship_student.supervisor.username if internship_student.supervisor else None
            return Response({'student': student_info, 'progress': progress}, status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            return Response({'error': 'Information not found'}, status=status.HTTP_404_NOT_FOUND)
       
    def teacher_dashboard(self, user):
        try:
            teacher_university = TeacherUniversity.objects.filter(teacher=user).first()
            if not teacher_university:
                return Response({'error': 'The teacher does not have a university associated'}, status=status.HTTP_404_NOT_FOUND)

            internship_students = InternshipStudent.objects.filter(teacher=teacher_university)
            students_info = []

            for internship_student in internship_students:
                student_career = internship_student.student_career
                student = student_career.student
                step_evaluations = StepEvaluation.objects.filter(student_career=student_career)
                current_step, progress = self.get_student_progress(student_career, step_evaluations)
                company_name = internship_student.company.name if internship_student.company.name else "N/A"
                company_logo = internship_student.company.logo if internship_student.company.logo else "N/A"
                valid = internship_student.valid
                internship_student_id = internship_student.id
                student_info = {
                    "id": student.id,
                    "name": f"{student.first_name} {student.last_name}",
                    "company_name": company_name,
                    "company_logo": company_logo,
                    "step": current_step,
                    "steps": progress,
                    "valid": valid,
                    "internship_student_id": internship_student_id,
                }
                students_info.append(student_info)

            return Response({'students': students_info}, status=status.HTTP_200_OK)

        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def get_available_teachers(self, university, career):
        teachers = TeacherUniversity.objects.filter(university=university)
        available_teachers = [{"username": teacher.teacher.username, "email": teacher.teacher.email, "id": teacher.id} for teacher in teachers]
        return available_teachers

    def director_dashboard(self, user):
        try:
            director_university = DirectorUniversity.objects.filter(director=user).first()

            if not director_university:
                return Response({'error': 'The director does not have a university associated'}, status=status.HTTP_404_NOT_FOUND)

            students = StudentCareer.objects.filter(career=director_university.career)
            students_info = []

            for student_career in students:
                student = student_career.student
                step_evaluations = StepEvaluation.objects.filter(student_career=student_career)
                current_step, progress = self.get_student_progress(student_career, step_evaluations)
                internship_student = InternshipStudent.objects.filter(student_career=student_career).first()
                assigned_teacher = internship_student.teacher.teacher.username if internship_student and internship_student.teacher else None
                student_info = {
                    "id": student.id,
                    "name": f"{student.first_name} {student.last_name}",
                    "company": internship_student.company.name if internship_student and internship_student.company.name else "N/A",
                    "step": current_step,
                    "assigned_teacher": assigned_teacher,
                }
                students_info.append(student_info)

            return Response({'students': students_info}, status=status.HTTP_200_OK)

        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    def company_dashboard(self, user):
        try:
            company = Company.objects.get(user_id=user.id)

            my_info = {
                "username": company.user_id.username,
                "logo": company.logo,
                "email": company.user_id.email,
                "first_name": company.user_id.first_name,
            }

            return Response({'my_info': my_info}, status=status.HTTP_200_OK)

        except Company.DoesNotExist:
            return Response({'error': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)

    def supervisor_dashboard(self, user):
        try:
            supervisor = CustomUser.objects.get(id=user.id)

            students_info = []

            for internship_supervisor in InternshipSupervisor.objects.filter(supervisor=supervisor):
                internship_student = internship_supervisor.internship_student
                student_career = internship_student.student_career
                student = student_career.student

                step_evaluations = StepEvaluation.objects.filter(student_career=student_career)
                current_step, progress = self.get_student_progress(student_career, step_evaluations)

                supervisor_evaluations_info = []
                for evaluation in SupervisorEvaluation.objects.filter(internship_supervisor=internship_supervisor):
                    supervisor_evaluations_info.append({
                        "id": evaluation.id,
                        "mandatory": evaluation.mandatory,
                        "evaluation": evaluation.evaluation
                    })

                student_info = {
                    "student_name": f"{student.first_name} {student.last_name}",
                    "current_step": current_step,
                    "student_id": student.id,
                    "internship_student_id": internship_student.id,
                    "progress": progress,
                    "supervisor_evaluations": supervisor_evaluations_info,

                }
                students_info.append(student_info)

            return Response({'students': students_info}, status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            return Response({'error': 'Supervisor not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def select_career(request):
    user = request.user
    
    if hasattr(user, 'student_profile'):
        return Response({'error': 'User already has a career assigned'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        careers = Career.objects.all()
        if not careers:
            return Response({'error': 'No careers available'}, status=status.HTTP_404_NOT_FOUND)
        
        careers_data = [{'id': career.id, 'name': career.name, 'university': career.university.name, 'area': career.area} for career in careers]
        return Response({'careers': careers_data}, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def link_internship(request):
    internship_id = request.data.get('internship_id')
    teacher_id = request.data.get('teacher_id')
    company_name = request.data.get('company_name')
    company_logo = request.data.get('company_logo')
    startDate = request.data.get('startDate')
    endDate = request.data.get('endDate')
    description = request.data.get('description')

    missing_fields = []
    for field in ['internship_id', 'teacher_id', 'company_name', 'startDate', 'endDate']:
        if not request.data.get(field):
            missing_fields.append(field)

    if missing_fields:
        return Response({'error': f'Missing fields: {", ".join(missing_fields)}'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        student_career = StudentCareer.objects.get(student=request.user)
    except ObjectDoesNotExist:
        return Response({'error': 'Student Career not found'}, status=status.HTTP_404_NOT_FOUND)

    if InternshipStudent.objects.filter(student_career=student_career, internship__id=internship_id).exists():
        return Response({'error': 'Internship already linked to this user'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        internship = Internship.objects.get(id=internship_id)
    except ObjectDoesNotExist:
        return Response({'error': 'Internship not found'}, status=status.HTTP_404_NOT_FOUND)

    try:
        teacher = TeacherUniversity.objects.get(id=teacher_id)
    except ObjectDoesNotExist:
        return Response({'error': 'Teacher not found'}, status=status.HTTP_404_NOT_FOUND)

    steps = Step.objects.filter(internship=internship)

    step_evaluations = []
    with transaction.atomic():
       for index, step in enumerate(steps):
           step_info = {
               "id": step.id,
               "title": step.title,
               "number": step.number,
               "grade": step.grade,
               "weight": step.weight,
               "feedback": step.feedback,
               "instructions_key": step.instructions_key
           }

           if index == 0:
               step_evaluation = StepEvaluation.objects.create(
                   student_career=student_career,
                   step=step,
                   status=True,
                   date_completed=datetime.now(),
                   comentary=None,
                   weight=step.weight,
                   feedback=step.feedback,
                   grade=step.grade,
                   file_key=step.instructions_key
               )

               step_evaluations.append(step_evaluation)
           else:
               step_evaluation = StepEvaluation.objects.create(
                   student_career=student_career,
                   step=step,
                   status=False,
                   date_completed=None,
                   comentary=None,
                   weight=step.weight,
                   feedback=step.feedback,
                   grade=step.grade,
                   file_key=step.instructions_key
               )
               step_evaluations.append(step_evaluation)
       company, created = Company.objects.get_or_create(
           name=company_name,
           defaults={'logo': company_logo},

       )
       internship_student = InternshipStudent.objects.create(
           student_career=student_career,
           internship=internship,
           teacher=teacher,
           status="pending",
           company=company,
           valid=False,
           startDate=startDate,
           endDate=endDate,
           description=description
       )
    return Response({'message': 'Successfully registered'}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register_supervisor(request): 
    name = request.data.get('first_name')
    last_name = request.data.get('last_name')
    email = request.data.get('email')
    internship_id = request.data.get('internship_id')

    if not all([name, last_name, email, internship_id]):
        return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = CustomUser.objects.get(email=email)
        user_exists = True
    except CustomUser.DoesNotExist:
        password = get_random_string(length=12)
        user = CustomUser.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=name,
            last_name=last_name
        )

        supervisor_role, created = Role.objects.get_or_create(name='supervisor')
        User_Role.objects.create(user=user, role=supervisor_role)
        user_exists = False

    with transaction.atomic():
        try:
            internship_student = InternshipStudent.objects.get(id=internship_id)
        except InternshipStudent.DoesNotExist:
            return Response({'error': 'InternshipStudent not found'}, status=status.HTTP_404_NOT_FOUND)

        existing_relation = InternshipSupervisor.objects.filter(internship_student=internship_student, supervisor=user).exists()
        if existing_relation:
            return Response({'message': 'Supervisor already linked with this student'}, status=status.HTTP_200_OK)

        internship_supervisor = InternshipSupervisor.objects.create(
            internship_student=internship_student, 
            supervisor=user, 
            valid=True
        )

        StepEvaluation.objects.filter(student_career=internship_student.student_career, step__number=3).update(status=True, date_completed=datetime.now())

        internship_student.supervisor = user
        internship_student.save()

        if user_exists:
            send_mail(
                'Supervisor Link Notification',
                f'Hello {name} {last_name},\n\n'
                f'You have been linked as a supervisor for a new internship student.\n\n'
                f'You have been assigned the internship student {internship_student.student_career.student.first_name} {internship_student.student_career.student.last_name}.\n\n'
                f'Best regards,\nThe Interny Team',
                'from@example.com',
                [email],
                fail_silently=False,
            )
        else:
            change_password_url = f"{URL}change-password/"
            send_mail(
                'Welcome, Supervisor',
                f'Hello {name} {last_name},\n\n'
                f'An account has been created for you as a supervisor.\n'
                f'You have been assigned the internship student {internship_student.student_career.student.first_name} {internship_student.student_career.student.last_name}.\n\n'
                f'Your temporary password is: {password}\n\n'
                f'You can change your password using the following link: {change_password_url}\n\n'
                f'Best regards,\nThe Interny Team',
                'from@example.com',
                [email],
                fail_silently=False,
            )

    return Response({'message': 'Supervisor linked successfully'}, status=status.HTTP_201_CREATED)

def get_email_recipients(targets):
    emails = set()

    career_ids = targets.get('careers', [])
    step_number = targets.get('step_number', None)
    step_comparison = targets.get('step_comparison')

    student_careers = StudentCareer.objects.all()
    
    if career_ids:
        student_careers = student_careers.filter(career__id__in=career_ids)
    
    if step_number is not None and step_comparison is not None:
        if step_comparison == 'equal':
            step_filter = Q(step_evaluations__step__number=step_number)
        elif step_comparison == 'less':
            step_filter = Q(step_evaluations__step__number__lt=step_number)
        elif step_comparison == 'greater':
            step_filter = Q(step_evaluations__step__number__gt=step_number)
        student_careers = student_careers.filter(step_filter)
    
    emails.update(student_careers.values_list('student__email', flat=True))

    return list(emails)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_massive_email(request):
    try:
        email_targets = request.data.get('targets')
        mail_content = request.data.get('mail_content')
        subject = request.data.get('subject')

        if not email_targets or not mail_content or not subject:
            return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)

        to_email = get_email_recipients(email_targets)

        if not to_email:
            return Response({'error': 'No recipients found'}, status=status.HTTP_404_NOT_FOUND)

        from_email = settings.EMAIL_HOST_USER

        text_content = mail_content
        html_content = (
            f'<!DOCTYPE html>'
            f'<html>'
            f'<head>'
            f'    <meta charset="utf-8">'
            f'</head>'
            f'<body>'
            f'    <p>{mail_content}</p>'
            f'</body>'
            f'</html>'
        )

        msg = EmailMultiAlternatives(subject, text_content, from_email, to_email)
        msg.attach_alternative(html_content, "text/html")
        msg.send(fail_silently=False)

        return Response({'message': 'Emails sent correctly'}, status=status.HTTP_200_OK)

    except SMTPException as e:
        error_message = f"An error occurred while sending the email: {str(e)}"
        return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def validate_internship(request):
    try:
        if not request.user.is_authenticated:
            return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

        user_roles = request.user.get_roles()

        if 'teacher' in user_roles:
            internship_id = request.data.get('internship_id')
            if not internship_id:
                return Response({'error': 'Internship ID is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                internship_student = InternshipStudent.objects.get(id=internship_id)
                if internship_student.valid:
                    return Response({'error': 'Internship already validated'}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    internship_student.valid = True
                    internship_student.save()
                return Response({'message': 'Internship validated successfully'}, status=status.HTTP_200_OK)
            except:
                return Response({'error': 'Internship not found'}, status=status.HTTP_404_NOT_FOUND)

        elif 'student' in user_roles or 'director' in user_roles:
            return Response({'error': 'Not allowed'}, status=status.HTTP_403_FORBIDDEN)

        else:
            return Response({'error': 'Role undefined'}, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    try:
        if not request.user.is_authenticated:
            return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')

        if not old_password or not new_password or not confirm_password:
            return Response({'error': 'Old password, new password and confirm new password are required'}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({'error': 'New password and confirm password do not match'}, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(old_password):
            return Response({'error': 'Old password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def internship_student(request, internship_student_id):
    try:
        internship_student = InternshipStudent.objects.get(id=internship_student_id)
    except InternshipStudent.DoesNotExist:
        return Response({'error': 'Internship Student not found'}, status=status.HTTP_404_NOT_FOUND)
    
    user_role = request.user.user_role.role.name if hasattr(request.user, 'user_role') else None

    if request.user != internship_student.student_career.student and user_role != 'teacher':
        return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
    
    if user_role == 'teacher' and request.user != internship_student.teacher.teacher:
        return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        steps = Step.objects.filter(internship=internship_student.internship)
        steps_data = []

        for step in steps:
            try:
                evaluation = StepEvaluation.objects.get(student_career=internship_student.student_career, step=step)
                step_data = {
                    'id': step.id,
                    'title': step.title,
                    'number': step.number,
                    'status': 'Completed' if evaluation.status else 'pending',
                    'file_key': evaluation.file_key,
                    'date_completed': evaluation.date_completed,
                    'comentary': evaluation.comentary,
                    'feedback': evaluation.feedback,
                    'grade': evaluation.grade,
                    'weight': evaluation.weight,
                    'instructions_key': step.instructions_key
                }
            except StepEvaluation.DoesNotExist:
                step_data = {
                    'id': step.id,
                    'title': step.title,
                    'number': step.number,
                    'status': 'pending',
                    'file_key': None,
                    'date_completed': None,
                    'comentary': None,
                    'feedback': None,
                    'grade': None,
                    'weight': None, 
                    'instructions_key': None
                }
            steps_data.append(step_data)

        data = {
            'internship_student_id': internship_student.id,
            'status': internship_student.status,
            'student': internship_student.student_career.student.first_name + ' ' + internship_student.student_career.student.last_name,
            'career': internship_student.student_career.career.name,
            'teacher_assigned': internship_student.teacher.teacher.username if internship_student.teacher else None,
            'internship_id': internship_student.internship.id,
            'internship_name': internship_student.internship.name,
            'company_name': internship_student.company.name,
            'company_logo': internship_student.company.logo,
            'valid': internship_student.valid,
            'grade': internship_student.grade,
            'start_date': internship_student.startDate,
            'end_date': internship_student.endDate,
            'description': internship_student.description,
            'meeting': internship_student.meeting,
            'supervisor': internship_student.supervisor.username if internship_student.supervisor else None,
            'steps': steps_data
        }
        return Response(data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def internship_step(request, internship_student_id, step_id=None):
    try:
        internship_student = InternshipStudent.objects.get(id=internship_student_id)
        user_role = request.user.user_role.role.name if hasattr(request.user, 'user_role') else None
        
        if request.user != internship_student.student_career.student and user_role != 'teacher':
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        
        if user_role == 'teacher' and request.user != internship_student.teacher.teacher:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        
        internship = internship_student.internship
        
        if request.method == 'POST':
            if step_id is None:
                return Response({'error': 'Step ID is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                step = Step.objects.get(id=step_id, internship=internship)
                step_evaluation, created = StepEvaluation.objects.get_or_create(
                    student_career=internship_student.student_career,
                    step=step,
                )

                data = request.data

                if user_role == 'teacher':
                    step_evaluation.status = data.get('status') == 'Completed'
                    step_evaluation.file_key = data.get('file_key')
                    step_evaluation.date_completed = data.get('date_completed')
                    step_evaluation.comentary = data.get('comentary')
                    step_evaluation.grade = data.get('grade')
                    internship_student.grade = data.get('internship_grade')

                    internship_student.save()

                    if isinstance(data['feedback'], str):
                            step_evaluation.feedback = json.loads(data['feedback'])
                    else:
                        return Response({'error': 'Feedback must be a string'}, status=status.HTTP_400_BAD_REQUEST)

                else:
                    step_evaluation.file_key = data.get('file_key')

                step_evaluation.save()
                return Response({'message': 'StepEvaluation updated successfully'}, status=status.HTTP_200_OK)
            except Step.DoesNotExist:
                return Response({'error': 'Step not found'}, status=status.HTTP_404_NOT_FOUND)
    
    except InternshipStudent.DoesNotExist:
        return Response({'error': 'Internship Student not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
SECRET_KEY = config('SECRET_KEY')
SECURITY_PASSWORD_SALT = config('SECURITY_PASSWORD_SALT')

def generate_token(student_internship_id):
    serializer = URLSafeSerializer(SECRET_KEY)
    
    now = datetime.now()
    creation_date = now.isoformat()
    
    token_data = {
        'student_internship_id': student_internship_id,
        'creation_date': creation_date
    }
    token = serializer.dumps(token_data, salt=SECURITY_PASSWORD_SALT)
    return token

def decode_token(token):
    serializer = URLSafeSerializer(SECRET_KEY)
    try:
        decoded_token = serializer.loads(token, salt=SECURITY_PASSWORD_SALT)
        student_internship_id = decoded_token['student_internship_id']
        creation_date = datetime.fromisoformat(decoded_token['creation_date'])
        
        now = datetime.now()
        if now - creation_date > timedelta(weeks=1):
            return {'error': 'Token has expired'}
        
        return student_internship_id
    except Exception as e:
        return {'error': str(e)}
    
def supervisor_evaluation_list():
    try:
        supervisors = []
        for supervisor in InternshipSupervisor.objects.select_related('internship_student').all():
            supervisor_data = {
                'id': str(supervisor.id),
                'student': supervisor.internship_student.student_career.student.username,
                'supervisor': supervisor.supervisor.username,
                'email': supervisor.supervisor.email,
                'student_internship_id': str(supervisor.internship_student.id)
            }
            supervisors.append(supervisor_data)
        return supervisors
    except Exception as e:
        return {'error': str(e)}

@api_view(['GET'])
def send_monthly_mail(request):
    print("Start")
    supervisors = supervisor_evaluation_list()
    if 'error' in supervisors:
        print(supervisors['error'])
        return Response(supervisors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    for supervisor in supervisors:
        token = generate_token(supervisor['student_internship_id'])
        link = f"{URL}supervisor/monthly/{token}/evaluation"
        subject = "Monthly Evaluation Reminder"
        message = f"""
        <html>
        <body>
            <p>Dear {supervisor['supervisor']},</p>
            <p>Please complete the evaluation for {supervisor['student']} using the following link:</p>
            <p><a href="{link}">{link}</a></p>
            <p>Thank you.</p>
        </body>
        </html>
        """
        send_mail(subject, '', config('EMAIL_HOST_USER'), [supervisor['email']], html_message=message)
    print("Good")
    return Response({'message': 'Emails sent successfully!'}, status=status.HTTP_200_OK)

@api_view(['POST', 'GET'])
def supervisor_evaluation(request, token):
    if request.method == 'GET':
        token_data = decode_token(token)

        if isinstance(token_data, dict) and 'error' in token_data:
            return Response({'error': token_data['error']}, status=400)

        internship_student = InternshipStudent.objects.filter(id=token_data).first()

        if not internship_student:
            return Response("Access Denied", status=403)

        return Response(supervisor_evaluation_list(), status=status.HTTP_200_OK)

    if request.method == 'POST':
        token_data = decode_token(token)
        print(token_data)
        if isinstance(token_data, dict) and 'error' in token_data:
            return Response({'error': token_data['error']}, status=400)

        student_internship_id = token_data
        internship_student = InternshipStudent.objects.filter(id=student_internship_id).first()
        if not internship_student:
            return Response("Access Denied", status=403)

        evaluation_data = request.data.get('evaluation')
        if not evaluation_data:
            return Response({'error': 'Evaluation data is required'}, status=400)
        
        internship_supervisor = InternshipSupervisor.objects.filter(internship_student=internship_student).first()
        evaluation_data = request.data.get('evaluation', None)
        mandatory = request.data.get('mandatory', True)

        if evaluation_data is None:
            return Response({'error': 'Evaluation data is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            supervisor_evaluation = SupervisorEvaluation.objects.create(
                internship_supervisor=internship_supervisor,
                evaluation=evaluation_data,
                mandatory=mandatory
            )
            return Response({'message': 'Evaluation created successfully', 'evaluation_id': supervisor_evaluation.id}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['GET'])        
def send_final_evaluation(request):
    print("Sending emails...")
    supervisors = supervisor_evaluation_list()
    if 'error' in supervisors:
        print(supervisors)
        return Response(supervisors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    for supervisor in supervisors:
        token = generate_token(supervisor['student_internship_id'])
        link = f"{URL}supervisor/final/{token}/evaluation"
        subject = "Final Evaluation Reminder"
        message = f"""
        <html>
        <body>
            <p>Dear {supervisor['supervisor']},</p>
            <p>Please complete the evaluation for {supervisor['student']} using the following link:</p>
            <p><a href="{link}">{link}</a></p>
            <p>Thank you.</p>
        </body>
        </html>
        """
        send_mail(subject, '', config('EMAIL_HOST_USER'), [supervisor['email']], html_message=message)
    
    return Response({'message': 'Emails sent successfully!'}, status=status.HTTP_200_OK)

@api_view(['GET', 'POST'])
def company_evaluation(request, token):
    if request.method == 'GET':
        token_data = decode_token(token)
        if isinstance(token_data, dict) and 'error' in token_data:
            return Response({'error': token_data['error']}, status=400)

        internship_student = InternshipStudent.objects.filter(id=token_data).first()

        if not internship_student:
            return Response("Access Denied", status=403)

        return Response(supervisor_evaluation_list(), status=status.HTTP_200_OK)

    if request.method == 'POST':
        token_data = decode_token(token)
        if isinstance(token_data, dict) and 'error' in token_data:
            return Response({'error': token_data['error']}, status=400)

        student_internship_id = token_data
        internship_student = InternshipStudent.objects.filter(id=student_internship_id).first()
        if not internship_student:
            return Response("Access Denied", status=403)

        evaluation_data = request.data.get('evaluation')
        if not evaluation_data:
            return Response({'error': 'Evaluation data is required'}, status=400)
        
        evaluation_data = request.data.get('evaluation', None)

        if evaluation_data is None:
            return Response({'error': 'Evaluation data is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            company_evaluation = CompanyEvaluation.objects.create(
                internship_student=internship_student,
                evaluation=evaluation_data
            )
            print(company_evaluation)
            return Response({'message': 'Evaluation created successfully', 'evaluation_id': company_evaluation.id}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_evaluations(request, internship_student_id):
    try:
        internship_student = InternshipStudent.objects.get(id=internship_student_id)
    except InternshipStudent.DoesNotExist:
        return Response({'error': 'Internship Student not found'}, status=status.HTTP_404_NOT_FOUND)
    
    user_role = request.user.user_role.role.name if hasattr(request.user, 'user_role') else None

    if request.user != internship_student.student_career.student and user_role != 'teacher':
        return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
    
    if user_role == 'teacher':
        try:
            teacher = TeacherUniversity.objects.get(teacher=request.user)
            if teacher != internship_student.teacher:
                return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        except TeacherUniversity.DoesNotExist:
            return Response({'error': 'Teacher not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        company_evaluations = CompanyEvaluation.objects.filter(internship_student=internship_student)
        company_evaluations_data = [evaluation.evaluation for evaluation in company_evaluations]

        supervisor_evaluations = SupervisorEvaluation.objects.filter(internship_supervisor__internship_student=internship_student)
        supervisor_evaluations_data = [evaluation.evaluation for evaluation in supervisor_evaluations]

        data = {
            'company_evaluations': company_evaluations_data,
            'supervisor_evaluations': supervisor_evaluations_data
        }
        return Response(data, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)