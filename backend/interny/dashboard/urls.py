from django.urls import path
from .views import DashboardView, register_supervisor, select_career, link_internship, send_massive_email, validate_internship, internship_step,internship_student, change_password, supervisor_evaluation, send_monthly_mail, send_final_evaluation, company_evaluation, get_evaluations
urlpatterns = [
    path('', DashboardView.as_view(), name='dashboard'),
    path('register-supervisor/', register_supervisor, name='register_supervisor'),
    path('select-career/', select_career, name='select_career'),
    path('link-internship/', link_internship, name='link_internship'),
    path('send-massive-email/', send_massive_email, name='send_massive_email'),
    path('validate-internship/', validate_internship, name='validate_internship'),
    path('change-password/', change_password, name='change_password'),
    path('<uuid:internship_student_id>/', internship_student, name='internship_student_detail'),
    path('<uuid:internship_student_id>/<uuid:step_id>/', internship_step, name='internship_step_detail'),
    path('supervisor/monthly/<str:token>/', supervisor_evaluation, name='supervisor_evaluation'),
    path('send-monthly-mail/', send_monthly_mail, name='send-monthly-mail'),
    path('send-final-evaluation/', send_final_evaluation, name='send-final-evaluation'),
    path('company-evaluation/<str:token>/', company_evaluation, name='company_evaluation'),
    path('get-evaluations/<uuid:internship_student_id>/', get_evaluations, name= "get_evaluations")

]
