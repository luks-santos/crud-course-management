.PHONY: build up down logs test shell clean test-coverage

# Build the Docker images
build:
	@echo "Building Docker images..."
	docker compose build

# Start all services
up:
	@echo "Starting services..."
	docker compose up -d

# Stop all services
down:
	@echo "Stopping services..."
	docker compose down

# Show logs
logs:
	@echo "Showing logs..."
	docker compose logs -f

# Run tests in the container
test:
	@echo "Running tests..."
	docker compose exec backend ./run_tests.sh

# Open shell in backend container
shell:
	@echo "Opening shell in backend container..."
	docker compose exec backend /bin/bash

# Clean up Docker resources
clean:
	@echo "Cleaning up Docker resources..."
	docker compose down -v
	rm -rf coverage_html/*

# Show test coverage report
test-coverage:
	@echo "Opening test coverage report..."
	@if [ -f "./coverage_html/index.html" ]; then \
		open ./coverage_html/index.html || xdg-open ./coverage_html/index.html || echo "Coverage report generated at: ./coverage_html/index.html"; \
	else \
		echo "No coverage report found. Run 'make test' first."; \
	fi

# Database migrations
migrate:
	@echo "Running database migrations..."
	docker compose exec backend flask db migrate

migrate-upgrade:
	@echo "Applying database migrations..."
	docker compose exec backend flask db upgrade

# Initialize database
init-db:
	@echo "Initializing database..."
	docker compose exec backend flask db init

# Run the application in development mode
dev:
	@echo "Starting development server..."
	docker compose up backend

# Full setup (build, up, migrate, and seed data)
setup:
	@echo "Setting up the application..."
	@make build
	@make up
	@sleep 5
	@make migrate-upgrade
	@echo "Setup complete!"

# Show help
help:
	@echo "Available commands:"
	@echo "  make build          - Build Docker images"
	@echo "  make up             - Start all services"
	@echo "  make down           - Stop all services"
	@echo "  make logs           - Show logs"
	@echo "  make test           - Run tests"
	@echo "  make shell          - Open shell in backend container"
	@echo "  make clean          - Clean up Docker resources"
	@echo "  make test-coverage  - Show test coverage report"
	@echo "  make migrate        - Generate new migration"
	@echo "  make migrate-upgrade- Apply migrations"
	@echo "  make init-db        - Initialize database"
	@echo "  make dev            - Start development server"
	@echo "  make setup          - Full setup (build, up, migrate)"
	@echo "  make help           - Show this help message"