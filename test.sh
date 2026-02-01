#!/bin/bash

# PDF to Hevy - Test Script

echo "🧪 Testing PDF to Hevy Workflow"
echo "================================"
echo ""

WEBHOOK_URL="${WEBHOOK_URL:-http://localhost:5678/webhook/upload-workout-pdf}"

# Check if n8n is running
if ! docker-compose ps | grep -q "pdf-to-hevy-n8n.*Up"; then
    echo "❌ Error: n8n is not running"
    echo "Run './start.sh' to start the service"
    exit 1
fi

echo "✅ n8n is running"
echo ""

# Test 1: Basic Workout
echo "Test 1: Upper Body Workout"
echo "--------------------------"
RESPONSE=$(curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d @examples/upper-body.json)

echo "Response: $RESPONSE"
echo ""

# Test 2: Full Body Workout
echo "Test 2: Full Body Workout"
echo "-------------------------"
RESPONSE=$(curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d @examples/full-body.json)

echo "Response: $RESPONSE"
echo ""

# Test 3: Leg Day
echo "Test 3: Leg Day Workout"
echo "-----------------------"
RESPONSE=$(curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d @examples/leg-day.json)

echo "Response: $RESPONSE"
echo ""

# Test 4: Error Case (Empty Data)
echo "Test 4: Error Case (Empty Data)"
echo "--------------------------------"
RESPONSE=$(curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{}')

echo "Response: $RESPONSE"
echo ""

echo "✅ All tests completed!"
echo ""
echo "💡 Check n8n UI to see execution history:"
echo "   http://localhost:5678"
