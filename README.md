---

# Interny

Interny is a prototype web application for managing university internships. This project was developed as a proof-of-concept and includes contributions from Pedro Pizarro (Frontend & Cloud) and Leonardo Silva (Full-stack).

## Getting Started

To get started with the application, follow the instructions below.

### Initializing the Web App

1. Open your terminal and run:

   ```bash
   docker-compose up
   ```

   **Note:** Sometimes this may fail. If it does, simply close the terminal and run the command again. There's no need to delete images or containers.

### Accessing the Application

- **Web Application:** [http://localhost:3000](http://localhost:3000)
- **Admin Panel:** [http://localhost:8000/admin](http://localhost:8000/admin)

### Creating a Superuser

To access the admin panel, you'll need to create a superuser. Follow these steps:

1. Enter the backend container:

   ```bash
   docker exec -it interny_backend_web_1 /bin/bash
   ```

2. Create the superuser:

   ```bash
   python3 manage.py createsuperuser
   ```

### Creating Test Users

To create test users, run the following commands:

1. Enter the `interny` directory:

   ```bash
   cd interny/
   ```

2. Create test users:

   ```bash
   python manage.py create_test_users
   ```

### Viewing Test Coverage

To view the coverage of the unit tests, use the following commands:

1. Run the coverage report:

   ```bash
   coverage run --source='.' manage.py test
   coverage report
   ```

2. For a more dynamic HTML report:

   ```bash
   coverage html
   ```

### Additional Notes

- The web application is a simple prototype for managing university internships.
- File storage is not set up on cloud S3, and the application was not exclusively developed by me.

---
