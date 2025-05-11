#!/bin/bash

echo "Starting Flask project tests..."

# Check if virtual environment exists and activate it
if [ -f "venv/bin/activate" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
else
    echo "Virtual environment not found. Make sure to set it up first."
fi

# Install test dependencies
echo "Installing test dependencies..."
pip install -r requirements_test.txt

# Create coverage directory if it doesn't exist
mkdir -p coverage_html

# Run unit tests with coverage
echo "Running unit tests with coverage..."
pytest tests/ -v \
    --cov=crud_flask \
    --cov-report=html:coverage_html \
    --cov-report=term-missing \
    --cov-branch

# Show coverage summary
echo "Test execution completed!"
echo "==========================================="
echo "Coverage Report Summary:"
coverage report

# Generate badge
echo "Generating coverage badge..."
coverage-badge -o coverage.svg

echo "==========================================="
echo "Coverage HTML report available at: coverage_html/index.html"
echo "Coverage badge available at: coverage.svg"
echo "==========================================="

# Optional: Open coverage report in browser (uncomment if desired)
# if command -v open >/dev/null 2>&1; then
#     open coverage_html/index.html
# elif command -v xdg-open >/dev/null 2>&1; then
#     xdg-open coverage_html/index.html
# fi

echo "Tests completed successfully!"