# M&A Document Analyzer

A full-stack application that analyzes Mergers & Acquisitions documents using AI to extract key deal terms and information. Built with React frontend and NestJS backend, supporting Claude AI model.


## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- API keys for Claude

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd m-a-document-analyzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the project root:
   ```bash
   # Required
   CLAUDE_API_KEY=your_claude_api_key_here
   
   # Optional - enable/disable analysis enhancement
   ENABLE_ANALYSIS_ENHANCEMENT=true
   ```

## Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   npm run backend:dev

2. **Start the frontend development server**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

### Production Build

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Start the backend**
   ```bash
   npm run backend:start
   ```

## Things to improve

- Implement different features or find a library in JS to mimic frameworks used for developing agents such as chaining LLM output and ensuring LLM output format (or consider using Python for backend)
- Use RAG with a vector database to improve responses
- Add e2e testing for endpoints
- Add unit tests for services
- Use fuzzing for testing
- Add docx support (currently having issues with mimetype)
- Add PDF OCR for scanned documents
- Implement a rating system
- Generate suggestions to improve existing clauses
- Add a scraper to get K-8 reports about M&A for testing
- General code cleanliness and refactoring
- Add API rate limiting
- Add legal database integration


## Architecture Design

### using multiple calls to CLAUDE to validate JSON output
### File Upload Architecture
 Direct file upload to backend with FormData

###  using DTO
   ensuring that the output from the llm is in the correct format
###  API Error Handling
 Custom ApiError class with structured error responses


### Environment Configuration
Using .env files with Vite's import.meta.env for api keys and flaggs




