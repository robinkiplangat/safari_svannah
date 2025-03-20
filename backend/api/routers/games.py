from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from pydantic import BaseModel
from ...agents.agent_factory import AgentFactory
from ...config.agent_config import PUZZLE_TYPES

router = APIRouter()

class GameRequest(BaseModel):
    puzzle_type: str
    difficulty: str
    animal_theme: str
    lesson_theme: str
    language: str = "en"

class GameResponse(BaseModel):
    puzzle_type: str
    difficulty: str
    title: str
    description: str
    elements: List[Dict[str, Any]]
    instructions: str
    reward_message: str
    learning_outcome: str

@router.post("/generate", response_model=GameResponse)
async def generate_game(request: GameRequest):
    """Generate a new educational game/puzzle"""
    try:
        # Validate puzzle type and difficulty
        if request.puzzle_type not in PUZZLE_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid puzzle type. Must be one of {list(PUZZLE_TYPES.keys())}"
            )
        
        if request.difficulty not in PUZZLE_TYPES[request.puzzle_type]:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid difficulty for {request.puzzle_type}"
            )
        
        # Create game designer agent
        game_agent = AgentFactory.create_agent("game")
        
        # Generate game
        game_data = await game_agent.process({
            "puzzle_type": request.puzzle_type,
            "difficulty": request.difficulty,
            "animal_theme": request.animal_theme,
            "lesson_theme": request.lesson_theme
        })
        
        # If translation is needed
        if request.language != "en":
            translation_agent = AgentFactory.create_agent("translation")
            game_data = await translation_agent.process({
                "text": game_data,
                "target_language": request.language,
                "content_type": "game",
                "context": f"Educational game about {request.animal_theme}"
            })
        
        return game_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/types")
async def get_game_types():
    """Get available game types and difficulties"""
    return {
        "puzzle_types": {
            "shape_matching": {
                "description": "Match shapes and patterns",
                "difficulties": ["easy", "medium", "hard"],
                "icon": "⬡"
            },
            "counting": {
                "description": "Count objects and numbers",
                "difficulties": ["easy", "medium", "hard"],
                "icon": "🔢"
            },
            "animal_sounds": {
                "description": "Match animals with their sounds",
                "difficulties": ["easy", "medium", "hard"],
                "icon": "🔊"
            },
            "memory": {
                "description": "Find matching pairs of cards",
                "difficulties": ["easy", "medium", "hard"],
                "icon": "🎴"
            }
        }
    }

@router.post("/submit-score")
async def submit_game_score(
    game_id: str,
    score: float,
    time_spent: int,
    completed: bool
):
    """Submit game score and progress"""
    try:
        # Create progress tracker agent
        progress_agent = AgentFactory.create_agent("progress")
        
        # Update progress
        result = await progress_agent.process({
            "activity_type": "game",
            "activity_id": game_id,
            "score": score,
            "time_spent": time_spent,
            "completion_status": completed
        })
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 