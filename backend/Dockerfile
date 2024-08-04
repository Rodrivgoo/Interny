# Use an official Python runtime as a parent image
FROM python:3.8

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory
WORKDIR /interny

# Install dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc \
    && apt-get install -y python3-dev default-libmysqlclient-dev build-essential

# Copy the requirements file and install dependencies
COPY requirements.txt /interny/
RUN pip install -r requirements.txt

# Copy the project code into the container
COPY . /interny/

# Expose port 8000 for Django app
EXPOSE 8000

# Start the Django development server
CMD ["sh", "-c", "python interny/manage.py makemigrations authenticate && python interny/manage.py makemigrations dashboard && python interny/manage.py makemigrations jobs && python interny/manage.py migrate && python interny/manage.py runserver 0.0.0.0:8000"]
