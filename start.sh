#!/bin/bash

# PDF to Hevy - Quick Start Script

set -e

echo "🏋️  PDF to Hevy Converter - Quick Start"
echo "========================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed"
    echo "Please install Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: Docker Compose is not installed"
    echo "Please install Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  IMPORTANT: Please edit .env file and set your HEVY_API_KEY"
    echo ""
    read -p "Press Enter to continue after setting HEVY_API_KEY..."
fi

echo "🚀 Starting n8n service..."
docker-compose up -d

echo ""
echo "⏳ Waiting for n8n to start..."
sleep 5

# Check if n8n is running
if docker-compose ps | grep -q "pdf-to-hevy-n8n.*Up"; then
    echo "✅ n8n is running!"
    echo ""
    echo "📍 Next steps:"
    echo "1. Open n8n in your browser: http://localhost:5678"
    echo "2. Log in with credentials from .env file"
    echo "3. Import workflow: workflows/pdf-to-hevy-workflow.json"
    echo "4. Activate the workflow"
    echo ""
    echo "🧪 Test the workflow:"
    echo "curl -X POST http://localhost:5678/webhook/upload-workout-pdf \\"
    echo "  -H \"Content-Type: application/json\" \\"
    echo "  -d @examples/full-body.json"
    echo ""
    echo "📚 For more information, see README.md"
else
    echo "❌ Error: n8n failed to start"
    echo "Check logs with: docker-compose logs n8n"
    exit 1
fi
