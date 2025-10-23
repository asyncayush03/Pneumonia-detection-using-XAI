#!/bin/bash

# Stop Medical Imaging Analysis Platform

echo "🛑 Stopping Medical Imaging Analysis Platform..."

# Stop the application
docker-compose down

echo "✅ Application stopped successfully!"