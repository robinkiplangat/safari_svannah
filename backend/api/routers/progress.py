from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List
from pydantic import BaseModel
from datetime import datetime
from ...agents.agent_factory import AgentFactory

router = APIRouter()

class ProgressUpdate(BaseModel):
    user_id: str
    activity_type: str
    activity_id: str
    score: float
    time_spent: int
    completion_status: bool
    difficulty: str

class UserProgress(BaseModel):
    total_time_spent: int
    activities_completed: int
    average_score: float
    favorite_activities: List[str]
    current_level: str
    strengths: List[str]
    areas_for_improvement: List[str]

class ProgressRecommendation(BaseModel):
    next_difficulty: str
    recommended_activities: List[str]
    personalized_goals: List[str]
    celebration_message: str

@router.post("/update", response_model=Dict[str, Any])
async def update_progress(progress: ProgressUpdate):
    """Update user progress with new activity data"""
    try:
        progress_agent = AgentFactory.create_agent("progress")
        
        result = await progress_agent.process({
            "user_id": progress.user_id,
            "recent_activities": [{
                "activity_type": progress.activity_type,
                "activity_id": progress.activity_id,
                "score": progress.score,
                "time_spent": progress.time_spent,
                "completion_status": progress.completion_status,
                "difficulty": progress.difficulty,
                "timestamp": datetime.now()
            }],
            "current_level": "current",  # This would come from user profile
            "preferences": {}  # This would come from user preferences
        })
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user/{user_id}", response_model=UserProgress)
async def get_user_progress(user_id: str):
    """Get user's learning progress and statistics"""
    try:
        progress_agent = AgentFactory.create_agent("progress")
        
        result = await progress_agent.process({
            "user_id": user_id,
            "request_type": "progress_report"
        })
        
        return result["metrics"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/recommendations/{user_id}", response_model=ProgressRecommendation)
async def get_recommendations(user_id: str):
    """Get personalized activity recommendations"""
    try:
        progress_agent = AgentFactory.create_agent("progress")
        
        result = await progress_agent.process({
            "user_id": user_id,
            "request_type": "recommendations"
        })
        
        return result["recommendations"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/achievements/{user_id}")
async def get_achievements(user_id: str):
    """Get user's achievements and badges"""
    return {
        "achievements": [
            {
                "id": "first_story",
                "title": "Story Explorer",
                "description": "Completed your first story",
                "icon": "📚",
                "earned": True
            },
            {
                "id": "puzzle_master",
                "title": "Puzzle Master",
                "description": "Solved 5 puzzles perfectly",
                "icon": "🧩",
                "earned": False
            },
            {
                "id": "animal_friend",
                "title": "Animal Friend",
                "description": "Met all safari animals",
                "icon": "🦁",
                "earned": False
            }
        ]
    } 