from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
from typing import Dict, Any

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Safari Savanna API",
    description="API for Safari Savanna educational platform",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

# Error handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

# Import routers
from .routers import stories, games, progress, translations

# Include routers
app.include_router(stories.router, prefix="/api/stories", tags=["stories"])
app.include_router(games.router, prefix="/api/games", tags=["games"])
app.include_router(progress.router, prefix="/api/progress", tags=["progress"])
app.include_router(translations.router, prefix="/api/translations", tags=["translations"]) 