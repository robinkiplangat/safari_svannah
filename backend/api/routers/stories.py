from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List
from pydantic import BaseModel
from ...agents.agent_factory import AgentFactory

router = APIRouter()

class StoryRequest(BaseModel):
    animal_name: str
    lesson_theme: str
    age_group: str = "2-4 years"
    language: str = "en"

class StoryResponse(BaseModel):
    title: str
    animal_character: str
    scenes: List[Dict[str, Any]]
    moral_summary: str
    parent_tips: List[str]

@router.post("/generate", response_model=StoryResponse)
async def generate_story(request: StoryRequest):
    """Generate a new educational story"""
    try:
        # Create story generator agent
        story_agent = AgentFactory.create_agent("story")
        
        # Generate story
        story_data = await story_agent.process({
            "animal_name": request.animal_name,
            "lesson_theme": request.lesson_theme,
            "age_group": request.age_group
        })
        
        # If translation is needed
        if request.language != "en":
            translation_agent = AgentFactory.create_agent("translation")
            story_data = await translation_agent.process({
                "text": story_data,
                "target_language": request.language,
                "content_type": "story",
                "context": f"Children's story about {request.animal_name}"
            })
        
        return story_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/themes")
async def get_story_themes():
    """Get available story themes/lessons"""
    return {
        "themes": [
            "Courage",
            "Friendship",
            "Sharing",
            "Patience",
            "Kindness",
            "Perseverance",
            "Honesty",
            "Responsibility"
        ]
    }

@router.get("/animals")
async def get_available_animals():
    """Get available animal characters"""
    return {
        "animals": [
            {"name": "Leo", "type": "Lion", "icon": "🦁"},
            {"name": "Zuri", "type": "Zebra", "icon": "🦓"},
            {"name": "Tembo", "type": "Elephant", "icon": "🐘"},
            {"name": "Twiga", "type": "Giraffe", "icon": "🦒"},
            {"name": "Kiboko", "type": "Hippo", "icon": "🦛"},
            {"name": "Chui", "type": "Leopard", "icon": "🐆"},
            {"name": "Nyati", "type": "Buffalo", "icon": "🐃"},
            {"name": "Punda", "type": "Donkey", "icon": "🫏"}
        ]
    } 