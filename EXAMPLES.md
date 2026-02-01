# Example Test Data for PDF to Hevy Workflow

## Basic Workout Test

```json
{
  "fileName": "basic-workout.pdf",
  "mockText": "Workout: Upper Body Day\nDate: 2024-01-15\n\nExercise: Bench Press\nSets: 3\nReps: 10, 8, 6\nWeight: 135, 145, 155\n\nExercise: Shoulder Press\nSets: 3\nReps: 10, 10, 10\nWeight: 95, 95, 95"
}
```

## Full Body Workout Test

```json
{
  "fileName": "full-body.pdf",
  "mockText": "Workout: Full Body Strength\nDate: 2024-01-16\n\nExercise: Squats\nSets: 4\nReps: 10, 10, 8, 8\nWeight: 185, 185, 205, 205\n\nExercise: Bench Press\nSets: 3\nReps: 8, 8, 8\nWeight: 135, 135, 140\n\nExercise: Deadlifts\nSets: 3\nReps: 5, 5, 5\nWeight: 225, 225, 245\n\nExercise: Pull Ups\nSets: 3\nReps: 10, 8, 6\nWeight: 0, 0, 0"
}
```

## Leg Day Test

```json
{
  "fileName": "leg-day.pdf",
  "mockText": "Workout: Leg Day\nDate: 2024-01-17\n\nExercise: Squats\nSets: 5\nReps: 12, 10, 8, 8, 6\nWeight: 135, 155, 185, 185, 205\n\nExercise: Leg Press\nSets: 4\nReps: 15, 12, 12, 10\nWeight: 270, 315, 315, 360\n\nExercise: Lunges\nSets: 3\nReps: 12, 12, 12\nWeight: 50, 50, 50"
}
```

## Test with Unmapped Exercise

```json
{
  "fileName": "mixed-exercises.pdf",
  "mockText": "Workout: Mixed Routine\nDate: 2024-01-18\n\nExercise: Bench Press\nSets: 3\nReps: 10, 10, 10\nWeight: 135, 135, 135\n\nExercise: Custom Cable Fly\nSets: 3\nReps: 12, 12, 12\nWeight: 40, 40, 40"
}
```

## Curl Test Commands

### Basic Test
```bash
curl -X POST http://localhost:5678/webhook/upload-workout-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "fileName": "test-workout.pdf",
    "mockText": "Workout: Test\nDate: 2024-01-15\n\nExercise: Bench Press\nSets: 3\nReps: 10, 10, 10\nWeight: 135, 135, 135"
  }'
```

### Full Body Test
```bash
curl -X POST http://localhost:5678/webhook/upload-workout-pdf \
  -H "Content-Type: application/json" \
  -d @examples/full-body-test.json
```

### Error Test (Missing Data)
```bash
curl -X POST http://localhost:5678/webhook/upload-workout-pdf \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Expected Responses

### Success Response
```json
{
  "status": "success",
  "message": "Workout routine created successfully",
  "routine_name": "Upper Body Day",
  "exercises_count": 2
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Failed to process workout PDF",
  "error": "No PDF data found in request",
  "stage": "pdf-extraction"
}
```

## Saving Test Files

Create an `examples/` directory and save test cases:

```bash
mkdir examples
cat > examples/basic-workout.json << 'EOF'
{
  "fileName": "basic-workout.pdf",
  "mockText": "Workout: Upper Body Day\nDate: 2024-01-15\n\nExercise: Bench Press\nSets: 3\nReps: 10, 8, 6\nWeight: 135, 145, 155"
}
EOF
```

Then test with:
```bash
curl -X POST http://localhost:5678/webhook/upload-workout-pdf \
  -H "Content-Type: application/json" \
  -d @examples/basic-workout.json
```
