# M&A Document Analyzer

A full-stack application that analyzes Mergers & Acquisitions documents using AI to extract key deal terms and information. Built with React frontend and NestJS backend, supporting Claude AI model.


## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- API keys for:
  - [Anthropic Claude](https://console.anthropic.com/)

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


