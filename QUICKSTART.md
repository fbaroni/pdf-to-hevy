# Quick Reference Guide

## Quick Start (TL;DR)

```bash
# 1. Setup
git clone https://github.com/fbaroni/pdf-to-hevy.git
cd pdf-to-hevy
cp .env.example .env
# Edit .env and set HEVY_API_KEY

# 2. Start
./start.sh

# 3. Import workflow in n8n UI
# Open http://localhost:5678
# Import: workflows/pdf-to-hevy-workflow.json

# 4. Test
./test.sh
```

## Common Commands

### Service Management
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart n8n
docker-compose restart n8n

# View logs
docker-compose logs -f n8n

# Check status
docker-compose ps
```

### Testing
```bash
# Run all tests
./test.sh

# Test specific workout
curl -X POST http://localhost:5678/webhook/upload-workout-pdf \
  -H "Content-Type: application/json" \
  -d @examples/full-body.json

# Quick test
curl -X POST http://localhost:5678/webhook/upload-workout-pdf \
  -H "Content-Type: application/json" \
  -d '{"mockText": "Workout: Test\nDate: 2024-01-15\n\nExercise: Bench Press\nSets: 3\nReps: 10, 10, 10\nWeight: 135, 135, 135"}'
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| HEVY_API_KEY | Yes | - | Your Hevy API key |
| N8N_PORT | No | 5678 | n8n web interface port |
| N8N_BASIC_AUTH_USER | No | admin | n8n username |
| N8N_BASIC_AUTH_PASSWORD | No | - | n8n password |
| WEBHOOK_URL | No | http://localhost:5678 | Webhook base URL |

## Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| http://localhost:5678 | GET | n8n UI |
| http://localhost:5678/webhook/upload-workout-pdf | POST | Upload workout PDF |

## PDF Format

```
Workout: [Name]
Date: [YYYY-MM-DD]

Exercise: [Name]
Sets: [Number]
Reps: [r1, r2, r3, ...]
Weight: [w1, w2, w3, ...]
```

## Supported Exercises

✅ Bench Press, Squats, Deadlifts
✅ Shoulder Press, Bicep Curls, Tricep Extension
✅ Lat Pulldown, Rows, Pull Ups, Push Ups
✅ Dumbbell Press, Leg Press, Lunges, Plank

## Success Response
```json
{
  "status": "success",
  "message": "Workout routine created successfully",
  "routine_name": "Full Body Strength",
  "exercises_count": 3
}
```

## Error Response
```json
{
  "status": "error",
  "message": "Failed to process workout PDF",
  "error": "Error details",
  "stage": "pdf-extraction"
}
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Workflow not found | Activate workflow in n8n UI |
| Invalid API key | Check HEVY_API_KEY in .env |
| Port already in use | Change N8N_PORT in .env |
| Permission denied | Run `sudo chown -R 1000:1000 n8n-data/` |
| Container won't start | Check logs: `docker-compose logs n8n` |

## File Structure

```
pdf-to-hevy/
├── src/                    # Helper modules
├── workflows/              # n8n workflows
├── examples/               # Test data
├── docker-compose.yml      # Docker config
├── .env                    # Your config (create from .env.example)
├── start.sh               # Quick start
└── test.sh                # Run tests
```

## Key Files

- `README.md` - Main documentation
- `ARCHITECTURE.md` - System architecture
- `WORKFLOW.md` - Workflow details
- `API.md` - API reference
- `EXAMPLES.md` - Test examples
- `CONTRIBUTING.md` - Contribution guide

## Next Steps

1. ✅ Setup complete
2. ✅ Workflow imported and activated
3. ✅ Test with examples
4. 📝 Customize exercise mappings (src/exerciseMapper.js)
5. 📝 Modify workflow as needed
6. 📝 Deploy to production

## Getting Help

- 📖 Check README.md for detailed docs
- 🐛 Open issue on GitHub
- 💬 Review closed issues
- 📚 Read n8n docs: https://docs.n8n.io/

## Useful Links

- **n8n UI**: http://localhost:5678
- **Webhook**: http://localhost:5678/webhook/upload-workout-pdf
- **n8n Docs**: https://docs.n8n.io/
- **Hevy API**: https://hevyapp.com/api
- **GitHub Repo**: https://github.com/fbaroni/pdf-to-hevy

---

💪 Happy lifting!
