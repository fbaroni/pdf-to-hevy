# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PDF to Hevy System                          │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────┐
│   Client    │
│  (curl/app) │
└──────┬──────┘
       │
       │ HTTP POST /webhook/upload-workout-pdf
       │ { fileName, pdfData/mockText }
       ▼
┌──────────────────────────────────────────────────────────────────┐
│                         Docker Container                         │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                       n8n Workflow                         │  │
│  │                                                            │  │
│  │  ┌──────────────────────────────────────────────────┐    │  │
│  │  │  1. Webhook Trigger                              │    │  │
│  │  │     - Receives PDF upload                        │    │  │
│  │  │     - POST endpoint                              │    │  │
│  │  └────────────┬─────────────────────────────────────┘    │  │
│  │               ▼                                           │  │
│  │  ┌──────────────────────────────────────────────────┐    │  │
│  │  │  2. PDF Text Extractor (Function Node)          │    │  │
│  │  │     - Extracts text from PDF                     │    │  │
│  │  │     - Uses: src/pdfExtractor.js                  │    │  │
│  │  └────────────┬─────────────────────────────────────┘    │  │
│  │               ▼                                           │  │
│  │  ┌──────────────────────────────────────────────────┐    │  │
│  │  │  3. Workout Parser (Function Node)              │    │  │
│  │  │     - Parses workout metadata                    │    │  │
│  │  │     - Extracts exercises, sets, reps, weights    │    │  │
│  │  │     - Uses: src/workoutParser.js                 │    │  │
│  │  └────────────┬─────────────────────────────────────┘    │  │
│  │               ▼                                           │  │
│  │  ┌──────────────────────────────────────────────────┐    │  │
│  │  │  4. Exercise Mapper (Function Node)             │    │  │
│  │  │     - Maps exercise names to Hevy IDs            │    │  │
│  │  │     - Exact & fuzzy matching                     │    │  │
│  │  │     - Uses: src/exerciseMapper.js                │    │  │
│  │  └────────────┬─────────────────────────────────────┘    │  │
│  │               ▼                                           │  │
│  │  ┌──────────────────────────────────────────────────┐    │  │
│  │  │  5. Prepare Hevy Payload (Function Node)        │    │  │
│  │  │     - Formats for Hevy API spec                  │    │  │
│  │  │     - Uses: src/hevyApiClient.js                 │    │  │
│  │  └────────────┬─────────────────────────────────────┘    │  │
│  │               ▼                                           │  │
│  │  ┌──────────────────────────────────────────────────┐    │  │
│  │  │  6. Hevy API Call (HTTP Request Node)           │    │  │
│  │  │     - POST to Hevy API                           │    │  │
│  │  │     - Creates workout routine                    │    │  │
│  │  └────────────┬─────────────────────────────────────┘    │  │
│  │               ▼                                           │  │
│  │  ┌──────────────────────────────────────────────────┐    │  │
│  │  │  7. Check Success (IF Node)                     │    │  │
│  │  │     - Routes to success or error handler         │    │  │
│  │  └────────┬────────────────────────┬────────────────┘    │  │
│  │           ▼                        ▼                     │  │
│  │  ┌─────────────────┐    ┌──────────────────────────┐    │  │
│  │  │ Success Response│    │  Error Handler & Response │    │  │
│  │  │  (200 OK)       │    │  (400 Bad Request)        │    │  │
│  │  └─────────────────┘    └──────────────────────────┘    │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Environment Variables:                                         │
│  - HEVY_API_KEY                                                 │
│  - N8N_PORT, N8N_PROTOCOL, N8N_HOST                            │
│  - N8N_BASIC_AUTH_USER, N8N_BASIC_AUTH_PASSWORD                │
└──────────────────────────────────────────────────────────────────┘
       │
       │ Response
       ▼
┌─────────────┐
│   Client    │
│  (receives  │
│  response)  │
└─────────────┘
```

## Data Flow

### Input Data Structure

```json
{
  "fileName": "workout.pdf",
  "pdfData": "base64_encoded_pdf" // or
  "mockText": "Workout: ...\nExercise: ..."
}
```

### Stage 1: PDF Extraction
**Output:**
```json
{
  "pdfFileName": "workout.pdf",
  "extractedText": "Workout: Full Body...",
  "extractedAt": "2024-01-15T10:00:00Z",
  "success": true
}
```

### Stage 2: Workout Parsing
**Output:**
```json
{
  "parsedWorkout": {
    "routine_name": "Full Body Strength",
    "workout_date": "2024-01-15",
    "exercises": [
      {
        "exercise_name": "Bench Press",
        "sets": [
          { "set_index": 1, "reps": 8, "weight_kg": 135 }
        ],
        "notes": ""
      }
    ]
  },
  "success": true
}
```

### Stage 3: Exercise Mapping
**Output:**
```json
{
  "mappedWorkout": {
    "routine_name": "Full Body Strength",
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
  "mappingStats": { "total": 3, "mapped": 3, "unmapped": 0 }
}
```

### Stage 4: Hevy Payload
**Output:**
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

### Stage 5: API Response
**Success:**
```json
{
  "status": "success",
  "message": "Workout routine created successfully",
  "routine_name": "Full Body Strength",
  "exercises_count": 3
}
```

**Error:**
```json
{
  "status": "error",
  "message": "Failed to process workout PDF",
  "error": "Detailed error message",
  "stage": "pdf-extraction"
}
```

## Component Details

### Docker Container
- **Image**: `n8nio/n8n:latest`
- **Exposed Port**: 5678
- **Volumes**:
  - `./n8n-data:/home/node/.n8n` (persistent data)
  - `./workflows:/home/node/workflows:ro` (workflow definitions)
- **Network**: Bridge network for isolation

### n8n Workflow Nodes

| Node | Type | Purpose |
|------|------|---------|
| Webhook - Upload PDF | Webhook Trigger | Entry point for PDF uploads |
| PDF Text Extractor | Function | Extract text from PDF binary |
| Workout Parser | Function | Parse text to structured data |
| Exercise Mapper | Function | Map exercise names to Hevy IDs |
| Prepare Hevy Payload | Function | Format data for Hevy API |
| Hevy API - Create Routine | HTTP Request | Call Hevy API |
| Check Success | IF | Route to success/error handler |
| Success Response | Respond to Webhook | Return success message |
| Error Handler | Function | Format error details |
| Error Response | Respond to Webhook | Return error message |

### Helper Modules

```
src/
├── pdfExtractor.js      - PDF processing utilities
├── workoutParser.js     - Text parsing logic
├── exerciseMapper.js    - Exercise name mapping
└── hevyApiClient.js     - Hevy API utilities
```

## Error Handling Strategy

```
┌─────────────┐
│  Any Error  │
└──────┬──────┘
       │
       │ Adds: { success: false, error: "...", stage: "..." }
       │
       ▼
┌─────────────────┐
│  Error Handler  │
│  - Logs error   │
│  - Formats msg  │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Error Response  │
│  HTTP 400       │
└─────────────────┘
```

## Security Layers

1. **Environment Variables**
   - API keys stored in `.env` (not in code)
   - Docker secrets for production

2. **n8n Authentication**
   - Basic auth on UI
   - Configurable credentials

3. **Network Isolation**
   - Docker bridge network
   - No direct external access

4. **Input Validation**
   - Check for required fields
   - Validate data types
   - Sanitize inputs

## Scalability Considerations

### Current (MVP)
- Single n8n instance
- Synchronous processing
- In-memory data

### Future Enhancements
- **Horizontal Scaling**: Multiple n8n workers
- **Queue System**: Redis/RabbitMQ for async processing
- **Database**: PostgreSQL for persistence
- **Caching**: Redis for exercise mappings
- **Load Balancer**: nginx for distribution
- **Monitoring**: Prometheus + Grafana

## Extension Points

1. **PDF Extraction**: Replace mock with real parser
2. **Exercise Mapping**: Add AI/ML based matching
3. **Validation**: JSON schema validation
4. **Notifications**: Email/Slack on success/failure
5. **Storage**: Database for processed workouts
6. **Batch Processing**: Multiple PDFs at once
7. **User Management**: Multi-user support
8. **API Gateway**: Rate limiting, auth
9. **Analytics**: Usage tracking, metrics
10. **Mobile App**: Native iOS/Android clients

## Technology Stack

| Component | Technology |
|-----------|-----------|
| Container Runtime | Docker |
| Orchestration | Docker Compose |
| Workflow Engine | n8n |
| Language | JavaScript (ES6+) |
| API Integration | REST (Hevy API) |
| Documentation | Markdown |
| Version Control | Git |

## Deployment Options

### Local Development
```bash
docker-compose up -d
```

### Production
- Docker Swarm
- Kubernetes
- Cloud providers (AWS ECS, Google Cloud Run)
- Serverless (AWS Lambda with custom runtime)

### Cloud Platforms
- **Heroku**: Deploy with heroku.yml
- **DigitalOcean**: App Platform or Droplet
- **AWS**: ECS Fargate
- **Google Cloud**: Cloud Run
- **Azure**: Container Instances

## Monitoring & Observability

### Logs
- n8n execution logs
- Docker container logs
- Application error logs

### Metrics
- Request count
- Success/failure rate
- Processing time
- Error rate by stage

### Health Checks
- n8n health endpoint
- Webhook availability
- Hevy API connectivity

## Backup & Recovery

### Backup
- `n8n-data/` volume (workflow data, credentials)
- `.env` file (configuration)
- `workflows/` directory (workflow definitions)

### Recovery
1. Restore volumes
2. Restore .env
3. Import workflows
4. Restart containers

---

**Architecture Version**: 1.0.0
**Last Updated**: 2024-02-01
