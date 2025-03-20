from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from pydantic import BaseModel
from ...agents.agent_factory import AgentFactory
from ...config.agent_config import SUPPORTED_LANGUAGES

router = APIRouter()

class TranslationRequest(BaseModel):
    text: str
    source_language: str = "en"
    target_language: str
    context: str
    content_type: str

class TranslationResponse(BaseModel):
    original_text: str
    translated_text: str
    language: str
    content_type: str
    cultural_notes: List[str]
    pronunciation_guide: str = None

@router.post("/translate", response_model=TranslationResponse)
async def translate_content(request: TranslationRequest):
    """Translate content while preserving educational value"""
    try:
        if request.target_language not in SUPPORTED_LANGUAGES:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported language. Must be one of {SUPPORTED_LANGUAGES}"
            )
        
        translation_agent = AgentFactory.create_agent("translation")
        
        result = await translation_agent.process({
            "text": request.text,
            "source_language": request.source_language,
            "target_language": request.target_language,
            "context": request.context,
            "content_type": request.content_type
        })
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/languages")
async def get_supported_languages():
    """Get list of supported languages"""
    return {
        "languages": [
            {
                "code": "en",
                "name": "English",
                "flag": "🇬🇧",
                "is_default": True
            },
            {
                "code": "sw",
                "name": "Swahili",
                "flag": "🇰🇪",
                "is_default": False
            },
            {
                "code": "fr",
                "name": "French",
                "flag": "🇫🇷",
                "is_default": False
            }
        ]
    }

@router.get("/language-progress/{user_id}")
async def get_language_progress(user_id: str):
    """Get user's progress in different languages"""
    return {
        "languages": [
            {
                "code": "en",
                "proficiency": "native",
                "stories_completed": 10,
                "games_completed": 15
            },
            {
                "code": "sw",
                "proficiency": "learning",
                "stories_completed": 5,
                "games_completed": 8
            },
            {
                "code": "fr",
                "proficiency": "beginner",
                "stories_completed": 2,
                "games_completed": 3
            }
        ]
    } 