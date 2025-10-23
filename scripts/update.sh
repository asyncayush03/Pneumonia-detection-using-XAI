#!/bin/bash

# Update Medical Imaging Analysis Platform

set -e

echo "🔄 Updating Medical Imaging Analysis Platform..."

# Pull latest changes (if using git)
if [ -d ".git" ]; then
    echo "📥 Pulling latest changes..."
    git pull origin main
fi

# Rebuild and restart the application
echo "🔨 Rebuilding and restarting the application..."
docker-compose down
docker-compose up --build -d

# Wait for the application to start
echo "⏳ Waiting for application to start..."
sleep 30

# Check if the application is running
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ Application updated successfully!"
    echo "🌐 Application is running at: http://localhost:5000"
else
    echo "❌ Application failed to start after update. Checking logs..."
    docker-compose logs
    exit 1
fi

echo "🎉 Update completed successfully!"