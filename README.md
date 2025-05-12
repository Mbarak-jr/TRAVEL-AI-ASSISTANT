# Travel Document Assistant 🌍✈️

AI-powered assistant that helps travelers understand document requirements for international travel, built with FastAPI (Python) and Next.js.

![Application Screenshot](/screenshot.png)  
*Live Demo: [https://travel-ai-assistant-tau.vercel.app/](https://travel-ai-assistant-tau.vercel.app/)*

## Features ✨

- Natural language queries about travel documents
- Formatted responses with:
  - Visa requirements
  - Passport rules
  - Additional documents
  - Health requirements
  - Travel advisories
- Query history with local storage
- Responsive design (mobile & desktop)
- Error handling and fallback mock responses

## Tech Stack 🛠️

**Frontend:**
- Next.js 14 (App Router)
- Tailwind CSS
- Axios for API calls
- React Icons

**Backend:**
- Python FastAPI
- Google Gemini Pro (LLM)
- CORS middleware
- Comprehensive logging

## Project Structure
travel-document-assistant/
├── backend/ # FastAPI implementation
│ ├── main.py # Core API logic
│ ├── requirements.txt # Python dependencies
│ └── .env.example # Environment template
├── frontend/ # Next.js app
│ ├── src/app/ # App router
│ ├── tailwind.config.js # Tailwind config
│ └── .env.local.example # Frontend env template
└── README.md # This file


## Setup Instructions 🛠️

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend

Create virtual environment:

bash
python -m venv venv
# Linux/Mac:
source venv/bin/activate
# Windows:
.\venv\Scripts\activate

Install dependencies:

bash
pip install -r requirements.txt

Create .env file:

bash
cp .env.example .env
# Add your Gemini API key
GEMINI_API_KEY=your_key_here
FRONTEND_URL=https://travel-ai-assistant-tau.vercel.app

Run backend:

bash
uvicorn main:app --reload

Frontend Setup
Navigate to frontend folder:

bash
cd ../frontend
Install dependencies:

bash
npm install
Create .env.local file:

bash
cp .env.local.example .env.local
NEXT_PUBLIC_API_URL=https://your-render-backend-url.onrender.com
Run development server:

bash
npm run dev

Technical Implementation Highlights
Backend (FastAPI)
API Endpoints:

POST /query - Processes travel document queries
GET /history - Returns query history
GET /health - Service health check

Key Features:

Automatic fallback to mock responses
Request retry logic
Comprehensive logging
CORS configuration
Swagger documentation at /docs

Frontend (Next.js)
App Router: Uses Next.js 14's modern routing

UI Components:

Responsive layout with Tailwind
Animated loading states
Error handling display
Query history sidebar

State Management:

React hooks for state
LocalStorage persistence
Loading and error states

Deployment
Frontend: Deployed on Vercel
Backend: Deployed on Render

Prompt Engineering
The system uses this optimized prompt with Gemini:

As a professional travel assistant, list required documents for:
'{query}'

Format your response with these exact sections:
- **Visa Requirements**: 
- **Passport Rules**: 
- **Additional Documents**: 
- **Health Requirements**:
- **Travel Advisories**:

Provide concise, accurate information for each section.

Future Enhancements

User authentication
Multi-language support
Country-specific document templates
PDF report generation



