# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-02-01

### Added
- Initial MVP release
- Docker Compose setup with n8n
- Complete n8n workflow for PDF to Hevy conversion
  - Webhook trigger for PDF upload
  - PDF text extraction (mock implementation)
  - Workout parser with structured data output
  - Exercise mapper with common exercises
  - Hevy API integration
  - Comprehensive error handling
- Helper JavaScript modules
  - `pdfExtractor.js` - PDF text extraction utilities
  - `workoutParser.js` - Workout parsing logic
  - `exerciseMapper.js` - Exercise name to Hevy ID mapping
  - `hevyApiClient.js` - Hevy API client utilities
- Example test data files
  - Upper body workout
  - Full body workout
  - Leg day workout
- Shell scripts
  - `start.sh` - Quick start script
  - `test.sh` - Testing script
- Comprehensive documentation
  - README.md with setup and usage
  - WORKFLOW.md with detailed workflow documentation
  - API.md with API reference
  - EXAMPLES.md with test examples
  - CONTRIBUTING.md with contribution guidelines
- Environment configuration
  - `.env.example` template
  - Docker Compose environment variables
- Project metadata
  - package.json
  - .gitignore
  - LICENSE (MIT)

### Features
- Convert workout PDFs to Hevy routines
- Automatic exercise name mapping
- Structured workout data parsing
- RESTful webhook API
- Error handling with detailed responses
- Modular and extensible architecture

### Supported Exercises
- Bench Press, Squats, Deadlifts
- Shoulder Press, Bicep Curls, Tricep Extension
- Lat Pulldown, Rows, Pull Ups, Push Ups
- Dumbbell Press, Leg Press, Lunges, Plank

## [Unreleased]

### Planned
- Real PDF parsing implementation (pdf-parse library)
- OCR support for scanned PDFs
- AI-based exercise detection
- Batch upload processing
- Web UI for easier interaction
- Additional exercise mappings
- Unit and integration tests
- CI/CD pipeline
- Docker Hub image
- Prometheus metrics
- Enhanced error recovery
