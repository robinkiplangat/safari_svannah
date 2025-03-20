from typing import Dict, Type
from .base_agent import BaseCrewAgent
from .story_generator import StoryGeneratorAgent
from .game_designer import GameDesignerAgent
from .progress_tracker import ProgressTrackerAgent
from .translation_agent import TranslationAgent

class AgentFactory:
    """Factory class for creating and managing agents"""
    
    _agents: Dict[str, Type[BaseCrewAgent]] = {
        "story": StoryGeneratorAgent,
        "game": GameDesignerAgent,
        "progress": ProgressTrackerAgent,
        "translation": TranslationAgent
    }
    
    @classmethod
    def create_agent(cls, agent_type: str) -> BaseCrewAgent:
        """Create an agent instance of the specified type"""
        if agent_type not in cls._agents:
            raise ValueError(f"Unknown agent type: {agent_type}")
            
        agent_class = cls._agents[agent_type]
        return agent_class()
    
    @classmethod
    def create_crew(cls, required_agents: list[str]) -> Dict[str, BaseCrewAgent]:
        """Create multiple agents for a specific task"""
        crew = {}
        for agent_type in required_agents:
            crew[agent_type] = cls.create_agent(agent_type)
        return crew 