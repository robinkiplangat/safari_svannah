from typing import Dict, List
from pydantic import BaseModel

class AgentConfig(BaseModel):
    role: str
    goal: str
    backstory: str
    verbose: bool = True
    allow_delegation: bool = False

# Agent configurations
AGENT_CONFIGS: Dict[str, AgentConfig] = {
    "image_recognition": AgentConfig(
        role="Image Recognition Specialist",
        goal="Process and analyze animal images for educational content",
        backstory="Expert in computer vision and animal recognition with focus on African wildlife"
    ),
    "story_generator": AgentConfig(
        role="Educational Story Creator",
        goal="Create engaging, age-appropriate stories for toddlers",
        backstory="Experienced children's author specializing in educational content"
    ),
    "game_designer": AgentConfig(
        role="Educational Game Designer",
        goal="Design interactive puzzles and games for toddlers",
        backstory="Expert in early childhood education and game development"
    ),
    "progress_tracker": AgentConfig(
        role="Learning Progress Analyst",
        goal="Track and analyze learning progress to adapt content difficulty",
        backstory="Educational psychologist specializing in early childhood development"
    ),
    "translation": AgentConfig(
        role="Content Translator",
        goal="Provide accurate translations while maintaining educational value",
        backstory="Multilingual education specialist with focus on early learning"
    )
}

# Available languages
SUPPORTED_LANGUAGES = ["en", "sw", "fr"]

# Puzzle types and difficulties
PUZZLE_TYPES = {
    "shape_matching": ["easy", "medium", "hard"],
    "counting": ["easy", "medium", "hard"],
    "animal_sounds": ["easy", "medium", "hard"],
    "memory": ["easy", "medium", "hard"]
}

# Analytics events to track
ANALYTICS_EVENTS = [
    "lesson_started",
    "lesson_completed",
    "puzzle_attempted",
    "puzzle_completed",
    "story_viewed",
    "animal_selected",
    "time_spent"
] 