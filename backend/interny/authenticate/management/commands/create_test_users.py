from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from faker import Faker
from authenticate.models import Role, User_Role
from dashboard.models import University, TeacherUniversity, Career, Step, StudentCareer, StepEvaluation, DirectorUniversity, InternshipStudent, Internship, Company
import json
import random

class Command(BaseCommand):
    help = 'Creates test users and related objects for testing purposes'

    def handle(self, *args, **options):
        fake = Faker()
        

        universities = [("UAI", "Chile", "Santiago"), ("U Andes", "Chile", "Santiago"), ("UDD", "Chile", "Santiago")]
        careers_per_university = {
            "UAI": [("Ingeniería Industrial", "Ingeniería"), ("Ingeniería Informática", "Informática")],
            "U Andes": [("Ingeniería Industrial", "Ingeniería"), ("Ingeniería Informática", "Informática")],
            "UDD": [("Ingeniería Industrial", "Ingeniería"), ("Ingeniería Informática", "Informática")]
        }
        company_names = ["Accenture", "Google", "Fintual", "Amazon", "Netflix", "Coca Cola", "Apple", "UAI", "Microsoft", "Globant","AWS" ]
        company_logos = ["id44tJQbVE/logo.jpeg","id6O2oGzv-/logo.jpeg", "idaD32QYZL/logo.jpeg", "idawOgYOsG/logo.jpeg", "ideQwN5lBE/logo.png", "idftrGPfCd/logo.jpeg", "idnrCPuv87/logo.jpeg", "idokXVV7qY/logo.jpeg", "idchmboHEZ/logo.jpeg", "idLuj71yk2/logo.jpeg","idkbmH8ed6/logo.jpeg"]


        for name, country, campus in universities:
            university, created = University.objects.get_or_create(
                name=name,
                country=country,
                campus=campus
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'University created: {university.name}'))

            if name in careers_per_university:
                careers = careers_per_university[name]
                for career_name, area in careers:
                    career, created = Career.objects.get_or_create(
                        name=career_name,
                        area=area,
                        university=university
                    )


            internship_names = ["Práctica Profesional", "Práctica Operaria"]
            for internship_name in internship_names:
                internship, created = Internship.objects.get_or_create(name=internship_name, career=career)

                if created:
                    self.stdout.write(self.style.SUCCESS(f'Internship created: {internship.name}'))

                    steps_info = [
                        ("Pasantía Inscrita", 1, 0, 0, [{}], None),
                        ("Pasantía Validada", 2, 0, 0, [{}], None),
                        ("Supervisores Registrados", 3, 0, 0,[{}], None),
                        ("Inscripción de proyecto", 4, 0, 0,[{}], None),
                        ("Reunión 1 a 1", 5, 0, 0, [{}], None),
                        ("Avance 1", 6, 0, 0.2, [{
                                        "title": "Introducción",
                                        "weight": 0.4,
                                        "commentary": "",
                                        "grade": 0
                                    },
                                    {
                                        "title": "Objetivos",
                                        "weight": 0.15,
                                        "commentary": "",
                                        "grade": 0
                                    },
                                    {
                                        "title": "Metodología / Medidas de desempeño",
                                        "weight": 0.15,
                                        "commentary": "",
                                        "grade": 0
                                    },
                                    {
                                        "title": "Planificación / Presentación",
                                        "weight": 0.15,
                                        "commentary": "",
                                        "grade": 0
                                    },
                                    {
                                        "title": "Proyecto Ingenieril",
                                        "weight": 0.15,
                                        "commentary": "",
                                        "grade": 0
                                    }], 
                        "internship/practicaprofesional/avance1/avance1.pdf"),
                                    
                        ("Avance 2", 7, 0, 0.2, [{
                                        "title": "Contexto / Resumen",
                                        "weight": 0.1,
                                        "commentary": "",
                                        "grade": 0
                                    },
                                    {
                                        "title": "Estado del Arte",
                                        "weight": 0.1,
                                        "commentary": "",
                                        "grade": 0
                                    },
                                    {
                                        "title": "Solución Escogida",
                                        "weight": 0.25,
                                        "commentary": "",
                                        "grade": 0
                                    },
                                    {
                                        "title": "Plan de Implementación",
                                        "weight": 0.15,
                                        "commentary": "",
                                        "grade": 0
                                    },
                                    {
                                        "title": "Análisis de Riesgo",
                                        "weight": 0.15,
                                        "commentary": "",
                                        "grade": 0
                                    },
                                    {
                                        "title": "Evaluación Económica",
                                        "weight": 0.1,
                                        "commentary": "",
                                        "grade": 0
                                    },
                                    {
                                        "title": "Resultados Esperados",
                                        "weight": 0.15,
                                        "commentary": "",
                                        "grade": 0
                                    }], 
                        "internship/practicaprofesional/avance2/avance2.pdf"),

                        ("Informe Final", 8, 0, 0.3, [{
                                        "title": "Contexto / Problema",
                                        "weight": 0.2,
                                        "commentary": "",
                                        "grade": 0
                                    },
                                    {
                                        "title": "Objetivos SMART",
                                        "weight": 0.1,
                                        "commentary": "",
                                        "grade": 0
                                    },
                                    {
                                        "title": "Estado del arte / Solución / Metodología",
                                        "weight": 0.2,
                                        "commentary": "",
                                        "grade": 0
                                    },
                                    {
                                        "title": "Metricas, desarrollo y plan de Implementación",
                                        "weight": 0.15,
                                        "commentary": "",
                                        "grade": 0
                                    },
                                    {
                                        "title": "Evalaución economíca",
                                        "weight": 0.1,
                                        "commentary": "",
                                        "grade": 0
                                    },
                                    {
                                        "title": "Resultados / Conclusiones",
                                        "weight": 0.15,
                                        "commentary": "",
                                        "grade": 0
                                    },
                                    {
                                        "title": "Formato, otrografía y redacción",
                                        "weight": 0.1,
                                        "commentary": "",
                                        "grade": 0
                                    }], 
                        "internship/practicaprofesional/informefinal/informefinal.pdf"),
                    ]
                    for step_title, step_number, grade, weight, feedback, instructions_key in steps_info:
                        step, step_created = Step.objects.get_or_create(
                            title=step_title,
                            internship=internship,
                            number=step_number,
                            grade=grade,
                            weight=weight,
                            feedback=feedback,
                            instructions_key=instructions_key
                        )
                        if step_created:
                            self.stdout.write(self.style.SUCCESS(f'Step created: {step.title}'))
                        else:
                            self.stdout.write(self.style.WARNING(f'Step already exists: {step.title}'))


        roles = []
        for role_name in ['student', 'teacher', 'director']:
            role, created = Role.objects.get_or_create(name=role_name)
            roles.append(role)


        existing_teachers = TeacherUniversity.objects.all()
        existing_universities = University.objects.all()
        existing_careers = Career.objects.all()

        User = get_user_model()

        user_counts = {'director': 5, 'teacher': 13, 'student': 81}

        for _ in range(user_counts['director']):
            first_name = fake.first_name()
            last_name = fake.last_name()
            email = f'{first_name.lower()}.{last_name.lower()}@example.com'
            username = f'{first_name.lower()}.{last_name.lower()}'
            user = User.objects.create(
                username=username,
                email=email,
                first_name=first_name,
                last_name=last_name,
                terms="Interny Director 2024"
            )

            user.set_password('contrasena_segura')
            user.save()
            role = Role.objects.get(name='director')
            User_Role.objects.create(user=user, role=role)

            university = fake.random_element(existing_universities)
            career = fake.random_element(existing_careers)
            DirectorUniversity.objects.create(director=user, university=university, career=career)

            self.stdout.write(self.style.SUCCESS(f'Director created: {user.username}'))

        for _ in range(user_counts['teacher']):
            first_name = fake.first_name()
            last_name = fake.last_name()
            email = f'{first_name.lower()}.{last_name.lower()}@example.com'
            username = f'{first_name.lower()}.{last_name.lower()}'
            user = User.objects.create(
                username=username,
                email=email,
                first_name=first_name,
                last_name=last_name,
                terms="Interny Teacher 2024"
            )

            user.set_password('contrasena_segura')
            user.save()
            role = Role.objects.get(name='teacher')
            User_Role.objects.create(user=user, role=role)

            university = fake.random_element(existing_universities)
            faculty = fake.word()
            TeacherUniversity.objects.create(teacher=user, university=university, faculty=faculty)

            self.stdout.write(self.style.SUCCESS(f'Teacher created: {user.username}'))

        existing_internships = Internship.objects.all()

        User = get_user_model()
        role_company, _ = Role.objects.get_or_create(name='company')

        for index in range(len(company_names)):
            company, created = Company.objects.get_or_create(
                name=company_names[index],
                logo=company_logos[index]
            )

            first_name = company_names[index]
            last_name = 'Admin'
            email = f'admin@{first_name.lower()}.com'
            username = f'{first_name.lower()}'
            user = User.objects.create(
                username=username,
                email=email,
                first_name=first_name,
                last_name=last_name,
                terms="Company-2024"
            )

            user.set_password('contrasena_segura')
            user.save()

            User_Role.objects.create(user=user, role=role_company)

            company.user_id = user
            company.save()

            self.stdout.write(self.style.SUCCESS(f'Company admin created: {user.username} for company: {company.name}'))


        for _ in range(user_counts['student']):
            first_name = fake.first_name()
            last_name = fake.last_name()
            email = f'{first_name.lower()}.{last_name.lower()}@example.com'
            username = f'{first_name.lower()}.{last_name.lower()}'
            user = User.objects.create(
                username=username,
                email=email,
                first_name=first_name,
                last_name=last_name,
                terms="Interny Student 2024"
            )

            user.set_password('contrasena_segura')
            user.save()
            role = Role.objects.get(name='student')
            User_Role.objects.create(user=user, role=role)

            university = fake.random_element(existing_universities)
            career = fake.random_element(existing_careers)
            progress = fake.random_int(0, 100)
            internship = fake.random_element(existing_internships)
            student_career = StudentCareer.objects.create(
                student=user,
                career=career,
                progress=progress,
                internship=internship
            )


            steps = internship.steps.all()

            step_status = {step.pk: False for step in steps}
            step_status[steps.first().pk] = True 

            step_status = True

            for step in steps:
                StepEvaluation.objects.create(
                    student_career=student_career,
                    step=step,
                    status=step_status,
                    date_completed=fake.date_this_year(before_today=True, after_today=False) if step_status else None,
                    grade=step.grade,
                    weight=step.weight,
                    feedback=step.feedback,
                    file_key=step.instructions_key
                )

                if step_status:
                    step_status = fake.boolean()

            teacher_university = fake.random_element(existing_teachers)
            valid = fake.random_element([True, False])
            start_date = fake.date_this_year(before_today=True, after_today=False)
            end_date = fake.date_this_year(before_today=False, after_today=True)
            
            for index in range(len(company_names)):
                company, created = Company.objects.get_or_create(
                    name=company_names[index],
                    logo=company_logos[index]
                )

            random_company_name = random.choice(company_names)
            random_company = Company.objects.get(name=random_company_name)

            InternshipStudent.objects.create(
                student_career=student_career,
                teacher=teacher_university,
                internship=internship,
                company=random_company,
                valid=valid,
                status="pending",
                startDate=start_date,
                endDate=end_date,
                description="Description of the Internship"
            )

            self.stdout.write(self.style.SUCCESS(f'Student created: {user.username}'))


        self.stdout.write(self.style.SUCCESS('Creation of test users and related objects completed'))