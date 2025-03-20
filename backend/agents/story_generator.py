from typing import Dict, Any, List
from pydantic import BaseModel
from .base_agent import BaseCrewAgent
from ..config.agent_config import AGENT_CONFIGS

class StoryScene(BaseModel):
    scene_number: int
    description: str
    dialogue: str
    moral_lesson: str
    visual_elements: List[str]

class StoryContent(BaseModel):
    title: str
    animal_character: str
    lesson_theme: str
    age_group: str
    scenes: List[StoryScene]
    moral_summary: str
    parent_tips: List[str]

class StoryGeneratorAgent(BaseCrewAgent):
    def __init__(self):
        super().__init__(AGENT_CONFIGS["story_generator"])
        
    async def process(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate an educational story based on the input data
        
        Args:
            data: Dictionary containing:
                - animal_name: Name of the main animal character
                - lesson_theme: Main lesson/moral of the story
                - age_group: Target age group (e.g., "2-4 years")
        
        Returns:
            Dictionary containing the generated story content
        """
        # Create story outline
        story = await self._generate_story_outline(data)
        
        # Generate detailed scenes
        story.scenes = await self._generate_scenes(story)
        
        # Add parent tips
        story.parent_tips = await self._generate_parent_tips(story)
        
        return story.dict()
    
    async def _generate_story_outline(self, data: Dict[str, Any]) -> StoryContent:
        """Generate the basic story structure"""
        return StoryContent(
            title=f"{data['animal_name']}'s Adventure",
            animal_character=data['animal_name'],
            lesson_theme=data['lesson_theme'],
            age_group=data['age_group'],
            scenes=[],
            moral_summary=f"Learn about {data['lesson_theme']} with {data['animal_name']}",
            parent_tips=[]
        )
    
    async def _generate_scenes(self, story: StoryContent) -> List[StoryScene]:
        """Generate detailed scenes for the story"""
        scenes = []
        # Generate 5 scenes for the story
        for i in range(5):
            scene = StoryScene(
                scene_number=i + 1,
                description=f"Scene {i + 1} description",
                dialogue=f"Scene {i + 1} dialogue",
                moral_lesson=story.lesson_theme,
                visual_elements=[
                    f"{story.animal_character} in action",
                    "Background elements",
                    "Supporting characters"
                ]
            )
            scenes.append(scene)
        return scenes
    
    async def _generate_parent_tips(self, story: StoryContent) -> List[str]:
        """Generate tips for parents to enhance the learning experience"""
        return [
            f"Ask your child how they would help {story.animal_character}",
            f"Discuss the importance of {story.lesson_theme}",
            "Practice the lesson in daily activities"
        ] 