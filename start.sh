#!/bin/bash

# Medical Imaging Analysis Platform - Quick Start Script

echo "🏥 Medical Imaging Analysis Platform"
echo "====================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Please run this script from the project root directory."
    exit 1
fi

echo "🚀 Starting the Medical Imaging Analysis Platform..."
echo ""

# Start the application
docker-compose up --build -d

echo ""
echo "⏳ Waiting for the application to start..."
echo "   This may take a few minutes on first run..."

# Wait for the application to be ready
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
    if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
        echo ""
        echo "✅ Application is ready!"
        echo ""
        echo "🌐 Access the application at:"
        echo "   Frontend: http://localhost:5000"
        echo "   API: http://localhost:5000/api"
        echo "   Health Check: http://localhost:5000/api/health"
        echo ""
        echo "📋 Available Features:"
        echo "   • Basic X-Ray Analysis"
        echo "   • Advanced AI Analysis with Heatmaps"
        echo "   • Model Comparison Dashboard"
        echo "   • Methodology Flow Visualization"
        echo "   • Model Optimization Reports"
        echo ""
        echo "🛠️  Management Commands:"
        echo "   • View logs: docker-compose logs -f"
        echo "   • Stop app: docker-compose down"
        echo "   • Restart: docker-compose restart"
        echo ""
        echo "⚠️  Medical Disclaimer:"
        echo "   This is a demonstration tool for educational purposes."
        echo "   Results are simulated and should not be used for medical diagnosis."
        echo ""
        echo "🎉 Enjoy exploring the Medical Imaging Analysis Platform!"
        exit 0
    fi
    
    attempt=$((attempt + 1))
    echo -n "."
    sleep 2
done

echo ""
echo "❌ Application failed to start within the expected time."
echo "   Checking logs for more information..."
echo ""

# Show logs
docker-compose logs --tail=20

echo ""
echo "🔧 Troubleshooting:"
echo "   1. Make sure Docker is running"
echo "   2. Check if port 5000 is available"
echo "   3. Try: docker-compose down && docker-compose up --build"
echo "   4. Check logs: docker-compose logs -f"

exit 1