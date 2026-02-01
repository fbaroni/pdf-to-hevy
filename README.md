# PDF to Hevy Workout Converter

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![n8n](https://img.shields.io/badge/n8n-Workflow-orange.svg)](https://n8n.io/)
[![AI Assisted](https://img.shields.io/badge/Development-AI_Assisted-purple.svg)](https://github.com/fbaroni/pdf-to-hevy/blob/main/LICENSE#ai-assistance-acknowledgment)

A spec-driven MVP that converts workout PDFs into Hevy routines using the Hevy API, built with Docker and n8n.

## 🎯 Overview

This project provides an automated workflow to extract workout information from PDF files and create structured workout routines in the Hevy fitness tracking app. The solution uses n8n for workflow automation, making it easy to extend and customize.

## 🏗️ Architecture

```
PDF Upload (Webhook)
    ↓
PDF Text Extraction
    ↓
Workout Parser
    ↓
Exercise Mapper
    ↓
Hevy Payload Preparation
    ↓
Hevy API Call
    ↓
Success/Error Response
```

### Components

1. **Webhook Node**: Receives PDF uploads via HTTP POST
2. **PDF Text Extractor**: Extracts text content from PDF files
3. **Workout Parser**: Parses text into structured workout data
4. **Exercise Mapper**: Maps exercise names to Hevy exercise IDs
5. **Hevy Payload Preparation**: Formats data for Hevy API
6. **Hevy API Caller**: Creates routine via Hevy API
7. **Error Handler**: Handles errors gracefully with detailed responses

## 📋 Prerequisites

- Docker and Docker Compose
- Hevy API key (obtain from [Hevy API documentation](https://hevyapp.com))
- Basic understanding of n8n workflows

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/fbaroni/pdf-to-hevy.git
cd pdf-to-hevy
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and set your configuration:

```env
# Required: Your Hevy API key
HEVY_API_KEY=your_actual_hevy_api_key

# Optional: n8n configuration
N8N_PORT=5678
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your_secure_password
```

### 3. Start the Services

```bash
docker-compose up -d
```

This will start n8n on `http://localhost:5678`

### 4. Import the Workflow

1. Open n8n in your browser: `http://localhost:5678`
2. Log in with the credentials from `.env` (default: admin/change_this_password)
3. Click on "Workflows" → "Import from File"
4. Select `workflows/pdf-to-hevy-workflow.json`
5. Activate the workflow

### 5. Test the Workflow

The webhook endpoint will be available at:
```
http://localhost:5678/webhook/upload-workout-pdf
```

Test with curl:
```bash
curl -X POST http://localhost:5678/webhook/upload-workout-pdf \
  -H "Content-Type: application/json" \
  -d '{"mockText": "Chest Day\n1. Bench Press - 4x10 @ 60kg\n2. Incline Press - 3x12 @ 40kg"}'
```

Expected response:
```json
{
  "routine": [{
    "id": "uuid",
    "title": "Chest Day",
    "exercises": [
      {
        "title": "Squat (Barbell)",
        "notes": "Bench Press",
        "sets": [{"weight_kg": 60, "reps": 10}, ...]
      }
    ]
  }]
}
```

## 📁 Project Structure

```
pdf-to-hevy/
├── docker-compose.yml          # Docker services configuration
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── README.md                   # This file
├── workflows/                  # n8n workflow definitions
│   └── pdf-to-hevy-workflow.json
└── src/                        # Helper JavaScript modules
    ├── pdfExtractor.js         # PDF text extraction logic
    ├── workoutParser.js        # Workout parsing logic
    ├── exerciseMapper.js       # Exercise name mapping
    └── hevyApiClient.js        # Hevy API client utilities
```

## 🔧 Workflow Details

### Input Format

The workflow accepts a POST request with JSON:

```json
{
  "mockText": "Workout Name\n1. Exercise Name - SetsxReps @ Weightkg"
}
```

**Example:**
```json
{
  "mockText": "Chest Day\n1. Bench Press - 4x10 @ 60kg\n2. Incline Press - 3x12 @ 40kg"
}
```

### Supported Text Format

The parser recognizes this format:
```
Workout Name
1. Exercise Name - SetsxReps @ Weightkg
2. Another Exercise - 3x12 @ 40kg
```

### Output Format

**Success Response** (200):
```json
{
  "routine": [{
    "id": "uuid",
    "title": "Chest Day",
    "exercises": [
      {
        "title": "Squat (Barbell)",
        "notes": "Bench Press",
        "sets": [{"weight_kg": 60, "reps": 10}, ...]
      }
    ]
  }]
}
```

> **Note:** Currently all exercises are mapped to "Squat (Barbell)" with the original exercise name stored in notes. Exercise mapping can be customized in the workflow.

**Error Response** (400):
```json
{
  "status": "error",
  "message": "Failed to process workout PDF",
  "error": "Error details",
  "stage": "pdf-extraction"
}
```

## 🎨 Customization

### Adding New Exercises

Edit `src/exerciseMapper.js` to add exercise mappings:

```javascript
const EXERCISE_MAP = {
  'your exercise name': { 
    id: 'hevy_exercise_id', 
    title: 'Display Name' 
  },
  // ... more exercises
};
```

### Modifying Parsing Logic

Update `src/workoutParser.js` to handle different PDF formats:

```javascript
function parseExerciseBlock(block) {
  // Customize parsing logic here
}
```

### Extending the Workflow

1. Open n8n UI
2. Edit the workflow
3. Add new nodes or modify existing ones
4. Export and save to `workflows/` directory

## 🔒 Security Best Practices

1. **Never commit `.env` file** - it contains sensitive credentials
2. **Use environment variables** - API key is loaded from `$env.HEVY_API_KEY`
3. **Rotate API keys regularly** - especially after any security incidents
4. **Enable HTTPS** in production environments
5. **Limit webhook access** - use authentication or IP whitelisting
6. **Monitor n8n logs** - check for unauthorized access attempts

> **Note**: The `n8n-data/` directory is automatically excluded from the repository as it may contain sensitive workflow execution data and credentials.

## 🐛 Troubleshooting

### Workflow Not Activating

- Check that all environment variables are set correctly
- Verify the Hevy API key is valid
- Check n8n logs: `docker-compose logs n8n`

### PDF Extraction Failing

- Ensure PDF is text-based (not scanned images)
- Check PDF format matches expected structure
- Review extraction logs in the workflow execution

### Hevy API Errors

- Verify API key is correct in `.env` file
- Check Hevy API status and rate limits
- Review API response in n8n execution logs
- Ensure `HEVY_API_KEY` environment variable is properly loaded

### Workflow Not Executing

- Check that workflow is active in n8n UI
- Verify webhook URL path matches your request
- Check n8n logs: `docker-compose logs n8n`
- Ensure environment variables are loaded: `docker exec container_name env | grep HEVY`

### Permission Errors

```bash
# Fix volume permissions
sudo chown -R 1000:1000 n8n-data/
```

## 📊 Monitoring

View workflow executions in n8n:
1. Navigate to "Executions" in n8n UI
2. Check execution history
3. Debug failed runs with detailed logs

## 🔄 Updating

To update the workflow:

```bash
# Pull latest changes
git pull

# Restart services
docker-compose down
docker-compose up -d

# Re-import workflow if needed
```

## 📝 Development

### Local Testing

```bash
# View logs
docker-compose logs -f n8n

# Restart n8n
docker-compose restart n8n

# Stop all services
docker-compose down
```

### Workflow Export

After making changes in n8n UI:
1. Click "..." menu on workflow
2. Select "Export"
3. Save to `workflows/pdf-to-hevy-workflow.json`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

> **Note**: This project was developed with AI assistance. See [LICENSE](LICENSE#ai-assistance-acknowledgment) for details about AI contributions.

## 📄 License

MIT License - feel free to use and modify as needed. This project includes significant AI assistance in development. See [LICENSE](LICENSE) for full details.

## 🙏 Acknowledgments

- [n8n](https://n8n.io/) - Workflow automation platform
- [Hevy](https://hevyapp.com/) - Fitness tracking app
- Built with clarity, modularity, and extensibility in mind

## 📞 Support

For issues or questions:
- Open a GitHub issue
- Check n8n documentation: https://docs.n8n.io/
- Review Hevy API documentation

## 🔮 Future Enhancements

- [ ] Support for scanned PDF images (OCR)
- [ ] Multiple PDF format parsers
- [ ] Bulk upload support
- [ ] Exercise auto-detection using AI
- [ ] Progress tracking dashboard
- [ ] Mobile app integration
- [ ] Scheduled imports from cloud storage

---

**Happy lifting! 💪**