from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os
import logging
from dotenv import load_dotenv
import time
from typing import Optional

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Global in-memory history
query_history = []

# Configuration
GEMINI_TIMEOUT = 15  # seconds
MAX_RETRIES = 2
MODEL_NAME = "gemini-pro"
USE_MOCK = os.getenv("USE_MOCK", "false").lower() == "true"

# Initialize Gemini client
gemini_api_key = os.getenv("GEMINI_API_KEY")
gemini_configured = False

if not gemini_api_key:
    logger.warning("GEMINI_API_KEY not found in environment variables")
    USE_MOCK = True
else:
    try:
        genai.configure(api_key=gemini_api_key)
        logger.info("Successfully configured Gemini client")
        gemini_configured = True
    except Exception as e:
        logger.warning(f"Failed to configure Gemini client: {str(e)}")
        USE_MOCK = True

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data model
class UserQuery(BaseModel):
    question: str


def get_mock_response(query: str) -> str:
    """Fallback mock response when Gemini API fails"""
    return f"""
            Visa Requirements: Schengen visa required for stays up to 90 days
            Passport Rules: Valid for at least 3 months beyond stay
            Additional Documents: Proof of accommodation, return ticket
            Health Requirements: None currently
            Travel Advisories: Check for local COVID restrictions

            Note: This is a mock response. Real API service is currently unavailable.
            Original question: {query}
            """

def ask_llm(query: str) -> str:
    # If in mock mode, return mock data immediately
    if USE_MOCK:
        logger.info("Using mock response (MOCK MODE ACTIVE)")
        return get_mock_response(query)

    prompt = f"""
As a professional travel assistant, list required documents for:
'{query}'

Format your response with these exact sections:
- **Visa Requirements**: 
- **Passport Rules**: 
- **Additional Documents**: 
- **Health Requirements**:
- **Travel Advisories**:

Provide concise, accurate information for each section.
"""

    last_error = None
    for attempt in range(MAX_RETRIES + 1):
        try:
            start_time = time.time()
            model = genai.GenerativeModel(MODEL_NAME)

            response = model.generate_content(
                prompt,
                request_options={"timeout": GEMINI_TIMEOUT * 1000}
            )

            latency = time.time() - start_time
            logger.info(f"Gemini API call succeeded in {latency:.2f}s")

            if not response.text:
                raise ValueError("Empty response from Gemini")

            return response.text

        except Exception as e:
            last_error = e
            latency = time.time() - start_time if 'start_time' in locals() else 0
            logger.warning(f"Attempt {attempt + 1} failed in {latency:.2f}s: {str(e)}")
            if attempt < MAX_RETRIES:
                time.sleep(1)
                continue

    logger.error(f"All {MAX_RETRIES} attempts failed. Falling back to mock data")
    return get_mock_response(query)

@app.get("/")
def root():
    status = "MOCK" if USE_MOCK else "ACTIVE"
    return {"message": f"Travel AI Assistant backend is running ({status} MODE)"}

@app.post("/query")
async def handle_query(query: UserQuery):
    if not query.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    try:
        response = ask_llm(query.question)
        query_history.append({
            "question": query.question,
            "response": response,
            "timestamp": time.time(),
            "is_mock": USE_MOCK or not gemini_configured
        })
        return {"response": response, "is_mock": USE_MOCK or not gemini_configured}
    except Exception as e:
        logger.error(f"Unexpected error in handle_query: {str(e)}")
        return {
            "response": get_mock_response(query.question),
            "is_mock": True
        }

@app.get("/history")
async def get_history():
    return {"history": query_history}

@app.get("/health")
async def health_check():
    if USE_MOCK:
        return {
            "status": "healthy (MOCK MODE)",
            "gemini_status": "disabled",
            "model": "mock-data"
        }
    
    try:
        test_model = genai.GenerativeModel(MODEL_NAME)
        _ = test_model.generate_content(
            "Say 'hello'",
            request_options={'timeout': 5000}
        )
        return {
            "status": "healthy",
            "gemini_status": "connected",
            "model": MODEL_NAME
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {
            "status": "unhealthy (falling back to mock)",
            "gemini_status": "disconnected",
            "model": MODEL_NAME,
            "error": str(e)
        }