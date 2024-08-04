from django.urls import path
from .views import job_list, job_detail, job_aplication

urlpatterns = [
    path('', job_list, name='get_jobs'),
    path('<uuid:job_id>/', job_detail, name='jobs'),
    path('aplly/<uuid:job_id>/', job_aplication, name='job_aplication')
]