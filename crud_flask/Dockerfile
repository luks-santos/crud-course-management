FROM python:3.12-slim

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV FLASK_APP=crud_flask

COPY requirements.txt requirements_test.txt ./
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir -r requirements_test.txt

# Copy project
COPY . .

# Make run_tests.sh executable
RUN chmod +x run_tests.sh

# Create directory for coverage reports
RUN mkdir -p coverage_html

# Install the application in development mode
RUN pip install -e .

# Expose port
EXPOSE 5000

# Default command runs tests and then starts the application
CMD ["sh", "-c", "./run_tests.sh && flask run --host=0.0.0.0 --port=5000"]