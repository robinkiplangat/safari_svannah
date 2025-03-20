from typing import Dict, Any, List
from pydantic import BaseModel
from datetime import datetime
from .base_agent import BaseCrewAgent
from ..config.agent_config import AGENT_CONFIGS

class ActivityProgress(BaseModel):
    activity_type: str  # story, puzzle, game
    activity_id: str
    completion_status: bool
    score: float
    time_spent: int  # in seconds
    difficulty: str
    timestamp: datetime

class LearningMetrics(BaseModel):
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

class ProgressTrackerAgent(BaseCrewAgent):
    def __init__(self):
        super().__init__(AGENT_CONFIGS["progress_tracker"])
        
    async def process(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process user progress data and generate recommendations
        
        Args:
            data: Dictionary containing:
                - user_id: Unique identifier for the user
                - recent_activities: List of recent activity progress
                - current_level: Current difficulty level
                - preferences: User activity preferences
        
        Returns:
            Dictionary containing progress analysis and recommendations
        """
        # Convert recent activities to ActivityProgress objects
        activities = [
            ActivityProgress(**activity)
            for activity in data['recent_activities']
        ]
        
        # Analyze progress
        metrics = await self._analyze_progress(activities)
        
        # Generate recommendations
        recommendations = await self._generate_recommendations(
            metrics,
            data['current_level'],
            data['preferences']
        )
        
        return {
            "metrics": metrics.dict(),
            "recommendations": recommendations.dict()
        }
    
    async def _analyze_progress(self, activities: List[ActivityProgress]) -> LearningMetrics:
        """Analyze user's learning progress"""
        if not activities:
            return LearningMetrics(
                total_time_spent=0,
                activities_completed=0,
                average_score=0.0,
                favorite_activities=[],
                current_level="beginner",
                strengths=[],
                areas_for_improvement=[]
            )
        
        # Calculate metrics
        total_time = sum(a.time_spent for a in activities)
        completed = sum(1 for a in activities if a.completion_status)
        avg_score = sum(a.score for a in activities) / len(activities)
        
        # Find favorite activities
        activity_counts = {}
        for activity in activities:
            activity_counts[activity.activity_type] = activity_counts.get(activity.activity_type, 0) + 1
        favorites = sorted(activity_counts.items(), key=lambda x: x[1], reverse=True)[:3]
        
        # Analyze strengths and areas for improvement
        scores_by_type = {}
        for activity in activities:
            if activity.activity_type not in scores_by_type:
                scores_by_type[activity.activity_type] = []
            scores_by_type[activity.activity_type].append(activity.score)
        
        strengths = [
            activity_type
            for activity_type, scores in scores_by_type.items()
            if sum(scores) / len(scores) >= 0.8
        ]
        
        improvements = [
            activity_type
            for activity_type, scores in scores_by_type.items()
            if sum(scores) / len(scores) < 0.6
        ]
        
        return LearningMetrics(
            total_time_spent=total_time,
            activities_completed=completed,
            average_score=avg_score,
            favorite_activities=[f[0] for f in favorites],
            current_level=self._determine_level(avg_score),
            strengths=strengths,
            areas_for_improvement=improvements
        )
    
    async def _generate_recommendations(
        self,
        metrics: LearningMetrics,
        current_level: str,
        preferences: Dict[str, Any]
    ) -> ProgressRecommendation:
        """Generate personalized recommendations"""
        # Determine next difficulty level
        next_difficulty = self._get_next_difficulty(
            current_level,
            metrics.average_score
        )
        
        # Generate recommended activities based on metrics and preferences
        recommended = []
        
        # Add activities for improvement
        for area in metrics.areas_for_improvement:
            recommended.append(f"{area} at {current_level} level")
            
        # Add some activities from strengths to maintain confidence
        for strength in metrics.strengths[:2]:
            recommended.append(f"{strength} at {next_difficulty} level")
            
        # Add favorite activities at new difficulty
        for favorite in metrics.favorite_activities[:2]:
            if favorite not in recommended:
                recommended.append(f"{favorite} at {next_difficulty} level")
                
        # Generate personalized goals
        goals = [
            f"Complete 3 {area} activities" for area in metrics.areas_for_improvement
        ] + [
            f"Try {next_difficulty} level in {strength}" for strength in metrics.strengths[:2]
        ]
        
        # Create celebration message
        celebration = self._generate_celebration_message(metrics)
        
        return ProgressRecommendation(
            next_difficulty=next_difficulty,
            recommended_activities=recommended,
            personalized_goals=goals,
            celebration_message=celebration
        )
    
    def _determine_level(self, average_score: float) -> str:
        """Determine user's current level based on average score"""
        if average_score >= 0.8:
            return "advanced"
        elif average_score >= 0.6:
            return "intermediate"
        else:
            return "beginner"
    
    def _get_next_difficulty(self, current_level: str, average_score: float) -> str:
        """Determine next appropriate difficulty level"""
        levels = ["beginner", "intermediate", "advanced"]
        current_idx = levels.index(current_level)
        
        if average_score >= 0.8 and current_idx < len(levels) - 1:
            return levels[current_idx + 1]
        elif average_score < 0.6 and current_idx > 0:
            return levels[current_idx - 1]
        else:
            return current_level
    
    def _generate_celebration_message(self, metrics: LearningMetrics) -> str:
        """Generate a personalized celebration message"""
        if metrics.average_score >= 0.8:
            return "Amazing job! You're making incredible progress!"
        elif metrics.average_score >= 0.6:
            return "Great work! Keep practicing and having fun!"
        else:
            return "You're doing great! Every activity helps you learn more!" 