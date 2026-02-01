# Contributing to PDF to Hevy

Thank you for your interest in contributing to the PDF to Hevy project! This document provides guidelines for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/pdf-to-hevy.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test thoroughly
6. Submit a pull request

## Development Setup

### Prerequisites

- Docker and Docker Compose
- Git
- Text editor or IDE
- (Optional) Node.js for local JavaScript testing

### Setup

```bash
# Clone the repository
git clone https://github.com/fbaroni/pdf-to-hevy.git
cd pdf-to-hevy

# Copy environment variables
cp .env.example .env

# Edit .env and set your HEVY_API_KEY

# Start services
docker-compose up -d

# View logs
docker-compose logs -f n8n
```

## Project Structure

```
pdf-to-hevy/
├── src/                    # Helper JavaScript modules
│   ├── pdfExtractor.js    # PDF text extraction logic
│   ├── workoutParser.js   # Workout parsing logic
│   ├── exerciseMapper.js  # Exercise name mapping
│   └── hevyApiClient.js   # Hevy API client
├── workflows/              # n8n workflow JSON files
│   └── pdf-to-hevy-workflow.json
├── examples/               # Test data examples
│   ├── upper-body.json
│   ├── full-body.json
│   └── leg-day.json
├── docker-compose.yml      # Docker services
├── .env.example            # Environment variables template
├── README.md               # Main documentation
├── WORKFLOW.md             # Workflow documentation
├── API.md                  # API documentation
├── EXAMPLES.md             # Examples documentation
└── CONTRIBUTING.md         # This file
```

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Docker version)
   - Logs or error messages

### Suggesting Enhancements

1. Check if the enhancement has been suggested
2. Create a new issue with:
   - Clear title and description
   - Use case and benefits
   - Proposed implementation (if any)

### Code Contributions

#### Areas for Contribution

1. **PDF Extraction**
   - Implement real PDF parsing (replace mock)
   - Add support for scanned PDFs (OCR)
   - Handle different PDF formats

2. **Exercise Mapping**
   - Add more exercise mappings
   - Implement fuzzy matching
   - Add AI-based exercise detection

3. **Workflow Enhancements**
   - Add validation nodes
   - Implement retry logic
   - Add notifications
   - Create batch processing

4. **Documentation**
   - Improve existing docs
   - Add tutorials
   - Create video guides
   - Translate to other languages

5. **Testing**
   - Add unit tests
   - Create integration tests
   - Add test fixtures

#### Coding Standards

**JavaScript**:
- Use ES6+ features
- Follow standard.js style guide
- Add JSDoc comments for functions
- Keep functions small and focused
- Use meaningful variable names

**Example**:
```javascript
/**
 * Parse exercise block from text
 * @param {string} block - Exercise text block
 * @returns {Object|null} Parsed exercise or null
 */
function parseExerciseBlock(block) {
  if (!block) return null;
  // Implementation...
}
```

**n8n Workflows**:
- Use descriptive node names
- Add comments for complex logic
- Keep function nodes focused
- Handle errors gracefully
- Use environment variables for config

**Documentation**:
- Use clear, concise language
- Include code examples
- Add diagrams where helpful
- Keep formatting consistent

#### Pull Request Process

1. **Before submitting**:
   - Update documentation
   - Add/update tests
   - Ensure code follows style guide
   - Test thoroughly
   - Update CHANGELOG if applicable

2. **PR Description**:
   - Clear title describing the change
   - Reference related issues
   - Describe what changed and why
   - Include testing steps
   - Add screenshots for UI changes

3. **Review Process**:
   - Maintainers will review your PR
   - Address feedback and questions
   - Make requested changes
   - Once approved, it will be merged

### Adding New Exercises

To add exercise mappings:

1. Edit `src/exerciseMapper.js`
2. Add to `EXERCISE_MAP`:
```javascript
const EXERCISE_MAP = {
  // ... existing exercises
  'new exercise name': {
    id: 'hevy_exercise_id',
    title: 'Display Name'
  }
};
```
3. Add tests in examples
4. Update documentation

### Modifying the Workflow

1. Make changes in n8n UI
2. Test thoroughly
3. Export workflow:
   - Click "..." menu
   - Select "Export"
   - Save to `workflows/pdf-to-hevy-workflow.json`
4. Commit the updated JSON file
5. Update WORKFLOW.md if needed

## Testing

### Manual Testing

```bash
# Start services
./start.sh

# Run test suite
./test.sh

# Or test individual cases
curl -X POST http://localhost:5678/webhook/upload-workout-pdf \
  -H "Content-Type: application/json" \
  -d @examples/upper-body.json
```

### Test Checklist

- [ ] Workflow activates successfully
- [ ] PDF extraction works
- [ ] Workout parsing is correct
- [ ] Exercise mapping is accurate
- [ ] Hevy API call succeeds
- [ ] Error handling works
- [ ] Response format is correct

## Documentation

When adding features:

1. Update README.md if user-facing
2. Update WORKFLOW.md for workflow changes
3. Update API.md for API changes
4. Add examples to EXAMPLES.md
5. Update inline code comments

## Release Process

Maintainers will:

1. Review and merge PRs
2. Update version in package.json
3. Update CHANGELOG
4. Create GitHub release
5. Tag version

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the project
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information
- Other unprofessional conduct

## Questions?

- Open an issue for questions
- Check existing documentation
- Review closed issues for similar questions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be:
- Listed in README.md
- Mentioned in release notes
- Credited in commit messages

Thank you for contributing! 🎉
