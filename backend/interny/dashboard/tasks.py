import calendar
from datetime import datetime
from django.core.mail import send_mail
from .models import InternshipStudent
from .views import generate_token

def send_monthly_evaluation_emails():
    today = datetime.today()
    last_day_of_month = calendar.monthrange(today.year, today.month)[1]
    
    if today.day != last_day_of_month:
        return

    if today.weekday() >= 1:
        return
    
    students = InternshipStudent.objects.all()
    for student in students:
        token = generate_token(student.id, student.company.id)
        url = 'http://localhost:8000/dashboard/company-evaluation/' + token
        send_mail(
            'Monthly Evaluation',
            f'Hello,\n\n'
            f'Please, evaluate our student at this link, it will be accepted for a week:\n'
            f'{url}\n\n'
            f'Best regards,\nThe Interny Team',
            'from@example.com',
            [student.supervisor.email],
            fail_silently=False,
        )
