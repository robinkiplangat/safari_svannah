#!/bin/bash

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to handle cleanup on script exit
cleanup() {
    echo "Cleaning up..."
    make clean
    exit 0
}

# Set up trap for cleanup on script exit
trap cleanup SIGINT SIGTERM

# Main execution
echo "Starting Safari Savanna application..."

# Check dependencies first
echo "Checking dependencies..."
make check-deps || { echo "Required dependencies are missing. Please install them first."; exit 1; }

# Check if this is the first run
if [ ! -d "backend/venv" ] || [ ! -d "frontend/node_modules" ]; then
    echo "First time setup detected. Running setup..."
    make setup || { echo "Setup failed. Please check the error messages above."; exit 1; }
fi

# Start the application
echo "Starting servers..."
make run || { echo "Failed to start servers. Please check the error messages above."; exit 1; }

# Keep the script running
while true; do
    sleep 1
done 