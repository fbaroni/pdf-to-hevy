# API Documentation

## Webhook Endpoint

### Upload Workout PDF

**Endpoint**: `POST /webhook/upload-workout-pdf`

**Description**: Converts a workout PDF into a Hevy routine.

#### Request

**Headers**:
```
Content-Type: application/json
```

**Body** (JSON):
```json
{
  "fileName": "string (optional)",
  "pdfData": "base64 string (optional)",
  "mockText": "string (optional, for testing)"
}
```

**Field Descriptions**:
- `fileName`: Name of the PDF file (optional, for metadata)
- `pdfData`: Base64 encoded PDF content (for production use)
- `mockText`: Plain text workout data (for testing without actual PDF)

#### Response

**Success Response** (200 OK):
```json
{
  "status": "success",
  "message": "Workout routine created successfully",
  "routine_name": "Full Body Strength",
  "exercises_count": 3
}
```

**Error Response** (400 Bad Request):
```json
{
  "status": "error",
  "message": "Failed to process workout PDF",
  "error": "Detailed error message",
  "stage": "pdf-extraction|workout-parsing|exercise-mapping|hevy-payload-preparation"
}
```

#### Examples

##### Test with Mock Data

```bash
curl -X POST http://localhost:5678/webhook/upload-workout-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "fileName": "workout.pdf",
    "mockText": "Workout: Upper Body\nDate: 2024-01-15\n\nExercise: Bench Press\nSets: 3\nReps: 10, 10, 10\nWeight: 135, 135, 135"
  }'
```

##### Test with JSON File

```bash
curl -X POST http://localhost:5678/webhook/upload-workout-pdf \
  -H "Content-Type: application/json" \
  -d @examples/full-body.json
```

##### Test with Base64 PDF (Future)

```bash
# Encode PDF to base64
PDF_BASE64=$(base64 -w 0 workout.pdf)

# Send request
curl -X POST http://localhost:5678/webhook/upload-workout-pdf \
  -H "Content-Type: application/json" \
  -d "{\"fileName\": \"workout.pdf\", \"pdfData\": \"$PDF_BASE64\"}"
```

## Expected PDF Format

The PDF should contain workout information in the following text format:

```
Workout: [Workout Name]
Date: [YYYY-MM-DD]

Exercise: [Exercise Name]
Sets: [Number of Sets]
Reps: [rep1, rep2, rep3, ...]
Weight: [weight1, weight2, weight3, ...]

Exercise: [Next Exercise Name]
Sets: [Number of Sets]
Reps: [rep1, rep2, rep3, ...]
Weight: [weight1, weight2, weight3, ...]
```

### Example PDF Content

```
Workout: Push Day
Date: 2024-01-20

Exercise: Bench Press
Sets: 4
Reps: 10, 8, 8, 6
Weight: 135, 145, 145, 155

Exercise: Shoulder Press
Sets: 3
Reps: 10, 10, 8
Weight: 95, 95, 105

Exercise: Tricep Extension
Sets: 3
Reps: 12, 12, 12
Weight: 40, 40, 40
```

## Supported Exercises

The following exercises are automatically mapped to Hevy IDs:

| Exercise Name | Hevy Title | Variations |
|--------------|------------|------------|
| Bench Press | Bench Press (Barbell) | bench press |
| Squats | Squat (Barbell) | squats, squat |
| Deadlifts | Deadlift (Barbell) | deadlifts, deadlift |
| Shoulder Press | Shoulder Press (Barbell) | shoulder press, overhead press |
| Bicep Curls | Bicep Curl (Barbell) | bicep curls, bicep curl |
| Tricep Extension | Tricep Extension | tricep extension |
| Lat Pulldown | Lat Pulldown | lat pulldown |
| Rows | Barbell Row | rows, barbell row |
| Pull Ups | Pull Up | pull ups, pull up |
| Push Ups | Push Up | push ups, push up |
| Dumbbell Press | Dumbbell Press | dumbbell press |
| Leg Press | Leg Press | leg press |
| Lunges | Lunges | lunges |
| Plank | Plank | plank |

### Adding New Exercises

To add new exercise mappings, edit `src/exerciseMapper.js`:

```javascript
const EXERCISE_MAP = {
  'your exercise': { 
    id: 'hevy_exercise_id', 
    title: 'Display Name' 
  },
  // Add more exercises...
};
```

## Error Handling

The API returns detailed error information when processing fails:

### Error Stages

1. **pdf-extraction**: Error extracting text from PDF
   - Missing PDF data
   - Invalid PDF format
   - Extraction library error

2. **workout-parsing**: Error parsing workout structure
   - Invalid text format
   - Missing required fields
   - Parse exception

3. **exercise-mapping**: Error mapping exercises
   - Invalid exercise data
   - Mapping failure

4. **hevy-payload-preparation**: Error preparing API payload
   - Invalid workout structure
   - Missing required fields

5. **hevy-api-call**: Error calling Hevy API
   - Invalid API key
   - Network error
   - API rate limit
   - Invalid payload

### Example Error Responses

**PDF Extraction Error**:
```json
{
  "status": "error",
  "message": "Failed to process workout PDF",
  "error": "No PDF data found in request",
  "stage": "pdf-extraction"
}
```

**Parsing Error**:
```json
{
  "status": "error",
  "message": "Failed to process workout PDF",
  "error": "Invalid text input for parsing",
  "stage": "workout-parsing"
}
```

**API Error**:
```json
{
  "status": "error",
  "message": "Failed to process workout PDF",
  "error": "Invalid API key",
  "stage": "hevy-api-call"
}
```

## Rate Limiting

- No rate limiting on the webhook endpoint (consider adding in production)
- Hevy API may have rate limits (check Hevy API documentation)
- Consider implementing queue for high-volume use

## Security

### Authentication

The webhook endpoint is currently open. For production:

1. **Add webhook authentication**:
   - API key in header
   - OAuth token
   - HMAC signature

2. **IP Whitelisting**:
   - Restrict to known IPs
   - Use VPN or firewall rules

3. **HTTPS**:
   - Use SSL/TLS in production
   - Configure reverse proxy (nginx, Caddy)

### Best Practices

- Never expose `.env` file
- Rotate API keys regularly
- Use environment-specific configurations
- Enable n8n basic auth
- Monitor for suspicious activity

## Monitoring

### Execution Logs

View in n8n UI:
1. Navigate to "Executions"
2. Check success/failure status
3. Review execution details

### Metrics to Track

- Total requests
- Success rate
- Error rate by stage
- Processing time
- Unmapped exercises

## Integration Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

async function uploadWorkout(workoutData) {
  try {
    const response = await axios.post(
      'http://localhost:5678/webhook/upload-workout-pdf',
      {
        fileName: 'workout.pdf',
        mockText: workoutData
      }
    );
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}
```

### Python

```python
import requests

def upload_workout(workout_data):
    response = requests.post(
        'http://localhost:5678/webhook/upload-workout-pdf',
        json={
            'fileName': 'workout.pdf',
            'mockText': workout_data
        }
    )
    if response.status_code == 200:
        print('Success:', response.json())
    else:
        print('Error:', response.json())
```

### cURL

```bash
curl -X POST http://localhost:5678/webhook/upload-workout-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "fileName": "workout.pdf",
    "mockText": "Workout: Test\n..."
  }'
```

## Troubleshooting

### Common Issues

**Issue**: "Webhook not found" error
- **Solution**: Ensure workflow is activated in n8n

**Issue**: Empty response
- **Solution**: Check n8n logs: `docker-compose logs n8n`

**Issue**: "Invalid API key" error
- **Solution**: Verify HEVY_API_KEY in `.env` file

**Issue**: Exercises not mapped
- **Solution**: Add custom mappings in `src/exerciseMapper.js`

### Debug Mode

Enable debug logging in n8n:
1. Add to `.env`: `N8N_LOG_LEVEL=debug`
2. Restart: `docker-compose restart n8n`
3. View logs: `docker-compose logs -f n8n`
