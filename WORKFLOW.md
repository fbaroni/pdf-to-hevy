# Workflow Documentation

## PDF to Hevy Workflow

This document provides detailed information about the n8n workflow for converting PDF workouts to Hevy routines.

## Workflow Nodes

### 1. Webhook - Upload PDF
- **Type**: Webhook Trigger
- **Method**: POST
- **Path**: `/upload-workout-pdf`
- **Purpose**: Receives PDF files or mock data for processing

**Input Schema**:
```json
{
  "fileName": "string (optional)",
  "pdfData": "base64 string (optional)",
  "mockText": "string (optional, for testing)"
}
```

### 2. PDF Text Extractor
- **Type**: Function Node
- **Purpose**: Extracts text from PDF binary data
- **Dependencies**: Would use pdf-parse in production
- **Current State**: Uses mock data for MVP

**Logic**:
1. Receives PDF data from webhook
2. Validates data presence
3. Extracts text content
4. Returns extracted text with metadata

**Output**:
```json
{
  "pdfFileName": "workout.pdf",
  "extractedText": "...",
  "extractedAt": "ISO-8601 timestamp",
  "success": true
}
```

### 3. Workout Parser
- **Type**: Function Node
- **Purpose**: Converts raw text to structured workout data
- **Module**: src/workoutParser.js

**Logic**:
1. Parse workout name and date
2. Split text into exercise blocks
3. Extract sets, reps, and weights for each exercise
4. Build structured exercise objects

**Output**:
```json
{
  "parsedWorkout": {
    "routine_name": "Full Body Strength",
    "workout_date": "2024-01-15",
    "exercises": [
      {
        "exercise_name": "Bench Press",
        "sets": [
          {"set_index": 1, "reps": 8, "weight_kg": 135}
        ],
        "notes": ""
      }
    ]
  }
}
```

### 4. Exercise Mapper
- **Type**: Function Node
- **Purpose**: Maps exercise names to Hevy exercise IDs
- **Module**: src/exerciseMapper.js

**Mapping Strategy**:
1. Exact match lookup
2. Partial/fuzzy match
3. Fall back to original name if unmapped

**Output**:
```json
{
  "mappedWorkout": {
    "routine_name": "...",
    "exercises": [
      {
        "exercise_name": "Bench Press",
        "hevy_exercise_id": "bench_press",
        "hevy_exercise_title": "Bench Press (Barbell)",
        "mapping_confidence": "exact",
        "sets": [...]
      }
    ]
  },
  "unmappedExercises": [],
  "mappingStats": {
    "total": 3,
    "mapped": 3,
    "unmapped": 0
  }
}
```

### 5. Prepare Hevy Payload
- **Type**: Function Node
- **Purpose**: Formats data for Hevy API specification
- **Module**: src/hevyApiClient.js

**Transformation**:
- Converts internal format to Hevy API format
- Adds required fields (type, null values)
- Sets proper indexing

**Output**:
```json
{
  "title": "Full Body Strength",
  "exercises": [
    {
      "index": 0,
      "exercise_template_id": "bench_press",
      "title": "Bench Press (Barbell)",
      "notes": "",
      "sets": [
        {
          "type": "normal",
          "weight_kg": 135,
          "reps": 8,
          "distance_meters": null,
          "duration_seconds": null,
          "rpe": null
        }
      ]
    }
  ]
}
```

### 6. Hevy API - Create Routine
- **Type**: HTTP Request Node
- **URL**: `https://api.hevyapp.com/v1/routines`
- **Method**: POST
- **Authentication**: API Key via header

**Headers**:
```
api-key: ${HEVY_API_KEY}
Content-Type: application/json
```

**Response**:
- Success: Routine object with ID
- Error: Error message and status code

### 7. Check Success
- **Type**: IF Node
- **Condition**: `$json.success === true`
- **Purpose**: Routes to success or error handler

### 8. Success Response
- **Type**: Respond to Webhook Node
- **Status**: 200
- **Purpose**: Returns success message to caller

### 9. Error Handler
- **Type**: Function Node
- **Purpose**: Logs and formats error information
- **Features**: Timestamps, stage tracking, error details

### 10. Error Response
- **Type**: Respond to Webhook Node
- **Status**: 400
- **Purpose**: Returns error details to caller

## Data Flow

```
Input → Extract → Parse → Map → Prepare → API Call → Success/Error
```

## Error Handling Strategy

Each stage tracks errors with:
- `success`: boolean flag
- `error`: error message
- `stage`: where the error occurred

Errors are propagated through the workflow and formatted in the Error Handler before returning to the caller.

## Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| HEVY_API_KEY | Hevy API authentication | Yes |
| N8N_PORT | n8n web interface port | No (default: 5678) |
| N8N_BASIC_AUTH_USER | n8n login username | No |
| N8N_BASIC_AUTH_PASSWORD | n8n login password | No |

## Testing

### Manual Test
```bash
curl -X POST http://localhost:5678/webhook/upload-workout-pdf \
  -H "Content-Type: application/json" \
  -d @test-data.json
```

### Test Data Format
```json
{
  "fileName": "test.pdf",
  "mockText": "Workout: Test\nDate: 2024-01-15\n\nExercise: Bench Press\nSets: 3\nReps: 10, 10, 10\nWeight: 135, 135, 135"
}
```

## Extension Points

1. **PDF Extraction**: Replace mock with actual PDF parsing library
2. **Exercise Mapping**: Add AI-based fuzzy matching
3. **Validation**: Add schema validation for parsed data
4. **Notifications**: Add success/failure notifications
5. **Storage**: Save processed workouts to database

## Performance Considerations

- PDF extraction is synchronous - large PDFs may timeout
- Consider adding queue for batch processing
- Rate limiting on Hevy API calls
- Caching for exercise mappings

## Security Notes

- API keys stored in environment variables (never in code)
- Basic auth on n8n interface
- Webhook endpoint should be secured in production
- Input validation prevents injection attacks
