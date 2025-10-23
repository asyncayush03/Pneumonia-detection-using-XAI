#!/bin/bash

# Medical Imaging Analysis Platform Deployment Script

set -e

echo "🚀 Starting deployment of Medical Imaging Analysis Platform..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p backend/static/uploads
mkdir -p backend/data
mkdir -p backend/models

# Set permissions
chmod 755 backend/static/uploads
chmod 755 backend/data
chmod 755 backend/models

# Build and start the application
echo "🔨 Building and starting the application..."
docker-compose up --build -d

# Wait for the application to start
echo "⏳ Waiting for application to start..."
sleep 30

# Check if the application is running
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ Application is running successfully!"
    echo "🌐 Frontend: http://localhost:5000"
    echo "🔧 API: http://localhost:5000/api"
    echo "📊 Health Check: http://localhost:5000/api/health"
else
    echo "❌ Application failed to start. Checking logs..."
    docker-compose logs
    exit 1
fi

echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Available endpoints:"
echo "  - Home: http://localhost:5000"
echo "  - Basic X-Ray: http://localhost:5000 (navigate to Basic X-Ray)"
echo "  - Advanced Analysis: http://localhost:5000 (navigate to Advanced Analysis)"
echo "  - Methodology: http://localhost:5000 (navigate to Methodology)"
echo "  - Model Comparison: http://localhost:5000 (navigate to Model Comparison)"
echo ""
echo "🛠️  Management commands:"
echo "  - View logs: docker-compose logs -f"
echo "  - Stop application: docker-compose down"
echo "  - Restart application: docker-compose restart"
echo "  - Update application: docker-compose up --build -d"