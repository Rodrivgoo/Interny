from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Jobs, JobAplication
from dashboard.models import Company, Career, StudentCareer
from rest_framework import status
from datetime import date

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def job_list(request):
    if request.method == 'GET':
        if request.user.user_role.role.name == 'company':
            company = Company.objects.get(user_id=request.user.id)
            job = Jobs.objects.filter(company_id=company)

            jobs_data = [{
                'job_id': str(job.job_id),
                'title': job.title,
                'company_name': job.company_id.name,
                'company_logo': job.company_id.logo,
                'region': job.region,
                'city': job.city,
                'arrangement': job.arrengement
            }for job in job]

            return Response(jobs_data, status=status.HTTP_200_OK)

        else:
            try:
                user_career_id = request.user.student_profile.career.id
                jobs = Jobs.objects.filter(careers__id=user_career_id).distinct()

                jobs_data = [{
                    'job_id': str(job.job_id),
                    'title': job.title,
                    'company_name': job.company_id.name,
                    'company_logo': job.company_id.logo,
                    'region': job.region,
                    'city': job.city,
                    'arrangement': job.arrengement
                } for job in jobs]

                return Response(jobs_data)
            except Career.DoesNotExist:
                return Response({"error": "Career not found"}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    if request.method == 'POST':
        try:
            if request.user.user_role.role.name != 'company':
                return Response({"error": "Only companies can add jobs."}, status=status.HTTP_403_FORBIDDEN)
            if request.data.get('title') in Jobs.objects.values_list('title', flat=True):
                return Response({"error": "Job already exists."}, status=status.HTTP_400_BAD_REQUEST)
            
            company = Company.objects.get(user_id=request.user.id)
            title = request.data.get('title')
            region = request.data.get('region')
            city = request.data.get('city')
            arrengement = request.data.get('arrangement')
            employment = request.data.get('employment')
            about = request.data.get('about')
            careers_ids = request.data.get('careers_ids', '')

            careers_ids = [career_id.strip() for career_id in careers_ids.split(',') if career_id.strip()]

            job = Jobs.objects.create(
                company_id=company,
                title=title,
                region=region,
                city=city,
                date_posted=date.today(),
                arrengement=arrengement,
                employment=employment,
                about=about
            )

            for career_id in careers_ids:
                career = Career.objects.get(id=career_id)
                job.careers.add(career)

            return Response({"job_id": str(job.job_id)}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def job_detail(request, job_id):
    if request.method == 'GET':
        try:
            job = get_object_or_404(Jobs, job_id=job_id)

            job_data = {
                'title': job.title,
                'company_name': job.company_id.name,
                'company_logo': job.company_id.logo,
                'region': job.region,
                'city': job.city,
                'arrangement': job.arrengement,
                'employment': job.employment,
                'about': job.about
            }

            return Response(job_data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if request.method == 'POST':
        if request.user.user_role.role.name != 'company':
            return Response({"error": "Only company can edit jobs"}, status=status.HTTP_403_FORBIDDEN)
        else:
            try:
                job = get_object_or_404(Jobs, job_id=job_id)
                
                if job.company_id.user_id != request.user:
                    return Response({"error": "You are not authorized to edit this job"}, status=status.HTTP_403_FORBIDDEN)

                job.title = request.data.get('title', job.title)
                job.region = request.data.get('region', job.region)
                job.city = request.data.get('city', job.city)
                job.arrengement = request.data.get('arrengement', job.arrengement)
                job.employment = request.data.get('employment', job.employment)
                job.about = request.data.get('about', job.about)
                
                job.save()

                job_data = {
                    'title': job.title,
                    'company_name': job.company_id.name,
                    'company_logo': job.company_id.logo,
                    'region': job.region,
                    'city': job.city,
                    'arrangement': job.arrengement,
                    'employment': job.employment,
                    'about': job.about
                }

                return Response(job_data)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def job_aplication(request, job_id):

    if request.method == 'GET':
        if request.user.user_role.role.name == 'company':
            company = Company.objects.get(user_id=request.user.id)
            if request.user.id != company.user_id.id:
                return Response({"error": "You are not authorized to see this aplications"}, status=status.HTTP_403_FORBIDDEN)
            try:
                job = get_object_or_404(Jobs, job_id=job_id)

                job_aplications = JobAplication.objects.filter(job_id=job)

                job_aplications_data = [{
                    'student_name': job_aplication.student_career_id.student.first_name + ' ' + job_aplication.student_career_id.student.last_name,
                    'student_email': job_aplication.student_career_id.student.email,
                    'description': job_aplication.description,
                } for job_aplication in job_aplications]

                return Response(job_aplications_data)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"error": "Only company can see aplications"}, status=status.HTTP_403_FORBIDDEN)
    
    if request.method == 'POST':
        if request.user.user_role.role.name != 'student':
            return Response({"error": "Only students can aplly for jobs"}, status=status.HTTP_403_FORBIDDEN)
        
        else:
            career = StudentCareer.objects.get(student_id=request.user.id)

            valid = False
            for i in range(len(Jobs.objects.get(job_id=job_id).careers.all())):
                if career.career.id == Jobs.objects.get(job_id=job_id).careers.all()[i].id:
                    valid = True

            if valid == False:
               print(not career in Jobs.objects.get(job_id=job_id).careers.all())
               return Response({"error": "You are not authorized to apply for this job"}, status=status.HTTP_403_FORBIDDEN) 

            try:
                job = get_object_or_404(Jobs, job_id=job_id)
                
                job_aplication = JobAplication(
                    job_id=job,
                    student_career_id=career,
                    description=request.data.get('description')                
                )
                if JobAplication.objects.filter(job_id=job):
                    return Response({"error": "You have already applied for this job"}, status=status.HTTP_403_FORBIDDEN)

                job_aplication.save()


                job_aplications = JobAplication.objects.filter(job_id=job)

                job_aplications_data = [{
                    'description': request.data.get('description'),
                }]

                return Response(job_aplications_data)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)