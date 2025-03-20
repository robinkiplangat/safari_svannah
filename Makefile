.PHONY: setup setup-backend setup-frontend run run-backend run-frontend clean help

# Default target
all: setup run

# Setup both backend and frontend
setup: setup-backend setup-frontend

# Setup backend
setup-backend:
	@echo "Setting up backend..."
	@cd backend && \
	if [ ! -d "venv" ]; then \
		python -m venv venv; \
	fi && \
	. venv/bin/activate && \
	python -m pip install --upgrade pip && \
	pip install wheel setuptools && \
	pip install -r requirements.txt || { echo "Failed to install backend dependencies. Please check the error messages above."; exit 1; }

# Setup frontend
setup-frontend:
	@echo "Setting up frontend..."
	@cd frontend && \
	npm install || { echo "Failed to install frontend dependencies. Please check the error messages above."; exit 1; }

# Run both backend and frontend
run: run-backend run-frontend

# Run backend server
run-backend:
	@echo "Starting backend server..."
	@cd backend && \
	if [ ! -d "venv" ]; then \
		echo "Backend virtual environment not found. Please run 'make setup-backend' first."; \
		exit 1; \
	fi && \
	. venv/bin/activate && \
	uvicorn main:app --reload --port 8000

# Run frontend server
run-frontend:
	@echo "Starting frontend server..."
	@cd frontend && \
	if [ ! -d "node_modules" ]; then \
		echo "Frontend dependencies not found. Please run 'make setup-frontend' first."; \
		exit 1; \
	fi && \
	npm run dev

# Clean up generated files
clean:
	@echo "Cleaning up..."
	@rm -rf backend/venv
	@rm -rf frontend/node_modules
	@rm -rf frontend/.next
	@find . -type d -name "__pycache__" -exec rm -rf {} +
	@find . -type f -name "*.pyc" -delete

# Show help
help:
	@echo "Available commands:"
	@echo "  make setup        - Set up both backend and frontend"
	@echo "  make setup-backend - Set up only the backend"
	@echo "  make setup-frontend - Set up only the frontend"
	@echo "  make run         - Run both backend and frontend servers"
	@echo "  make run-backend - Run only the backend server"
	@echo "  make run-frontend - Run only the frontend server"
	@echo "  make clean       - Clean up generated files"
	@echo "  make help        - Show this help message"

# Development commands
dev: setup run

# Production build
build: setup
	@echo "Building frontend for production..."
	@cd frontend && npm run build

# Run tests
test:
	@echo "Running backend tests..."
	@cd backend && \
	. venv/bin/activate && \
	pytest
	@echo "Running frontend tests..."
	@cd frontend && npm test

# Database migrations
migrate:
	@echo "Running database migrations..."
	@cd backend && \
	. venv/bin/activate && \
	alembic upgrade head

# Create new migration
migrate-create:
	@echo "Creating new migration..."
	@cd backend && \
	. venv/bin/activate && \
	alembic revision --autogenerate -m "$(message)"

# Check dependencies
check-deps:
	@echo "Checking dependencies..."
	@command -v python3 >/dev/null 2>&1 || { echo "Python 3 is required but not installed."; exit 1; }
	@command -v npm >/dev/null 2>&1 || { echo "npm is required but not installed."; exit 1; }
	@command -v make >/dev/null 2>&1 || { echo "make is required but not installed."; exit 1; }
	@echo "All required dependencies are installed." 