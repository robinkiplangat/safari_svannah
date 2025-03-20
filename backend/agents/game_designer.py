from typing import Dict, Any, List
from pydantic import BaseModel
from .base_agent import BaseCrewAgent
from ..config.agent_config import AGENT_CONFIGS, PUZZLE_TYPES

class PuzzleElement(BaseModel):
    element_type: str
    content: Any
    correct_answer: Any
    hints: List[str]

class GameContent(BaseModel):
    puzzle_type: str
    difficulty: str
    title: str
    description: str
    elements: List[PuzzleElement]
    instructions: str
    reward_message: str
    learning_outcome: str

class GameDesignerAgent(BaseCrewAgent):
    def __init__(self):
        super().__init__(AGENT_CONFIGS["game_designer"])
        
    async def process(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate an educational game based on the input data
        
        Args:
            data: Dictionary containing:
                - puzzle_type: Type of puzzle (shape_matching, counting, etc.)
                - difficulty: Difficulty level (easy, medium, hard)
                - animal_theme: Animal theme for the puzzle
                - lesson_theme: Educational theme/lesson
        
        Returns:
            Dictionary containing the generated game content
        """
        if data['puzzle_type'] not in PUZZLE_TYPES:
            raise ValueError(f"Invalid puzzle type. Must be one of {list(PUZZLE_TYPES.keys())}")
        
        if data['difficulty'] not in PUZZLE_TYPES[data['puzzle_type']]:
            raise ValueError(f"Invalid difficulty for {data['puzzle_type']}")
        
        # Generate game content based on type
        game = await self._generate_game(data)
        
        return game.dict()
    
    async def _generate_game(self, data: Dict[str, Any]) -> GameContent:
        """Generate specific game content based on type"""
        generator_map = {
            "shape_matching": self._generate_shape_matching,
            "counting": self._generate_counting_game,
            "animal_sounds": self._generate_animal_sounds,
            "memory": self._generate_memory_game
        }
        
        generator = generator_map.get(data['puzzle_type'])
        if not generator:
            raise ValueError(f"No generator for puzzle type: {data['puzzle_type']}")
            
        return await generator(data)
    
    async def _generate_shape_matching(self, data: Dict[str, Any]) -> GameContent:
        """Generate a shape matching game"""
        difficulty_map = {
            "easy": 3,
            "medium": 5,
            "hard": 7
        }
        num_shapes = difficulty_map[data['difficulty']]
        
        elements = []
        for i in range(num_shapes):
            elements.append(PuzzleElement(
                element_type="shape",
                content=f"Shape {i + 1}",
                correct_answer=f"Match {i + 1}",
                hints=[f"Look for similar colors", f"Count the sides"]
            ))
            
        return GameContent(
            puzzle_type="shape_matching",
            difficulty=data['difficulty'],
            title=f"{data['animal_theme']}'s Shape Adventure",
            description="Match the shapes to their correct pairs",
            elements=elements,
            instructions="Drag each shape to its matching pair",
            reward_message="Great job matching the shapes!",
            learning_outcome="Shape recognition and spatial awareness"
        )
    
    async def _generate_counting_game(self, data: Dict[str, Any]) -> GameContent:
        """Generate a counting game"""
        difficulty_map = {
            "easy": (1, 5),
            "medium": (5, 10),
            "hard": (10, 20)
        }
        range_start, range_end = difficulty_map[data['difficulty']]
        
        elements = []
        for i in range(3):  # Generate 3 counting challenges
            elements.append(PuzzleElement(
                element_type="counting",
                content=f"{i + range_start} objects",
                correct_answer=i + range_start,
                hints=["Count one by one", "Point to each object"]
            ))
            
        return GameContent(
            puzzle_type="counting",
            difficulty=data['difficulty'],
            title=f"Count with {data['animal_theme']}",
            description=f"Help {data['animal_theme']} count objects",
            elements=elements,
            instructions="Count the objects and select the correct number",
            reward_message="Excellent counting!",
            learning_outcome="Number recognition and counting skills"
        )
    
    async def _generate_animal_sounds(self, data: Dict[str, Any]) -> GameContent:
        """Generate an animal sounds matching game"""
        elements = []
        num_sounds = {"easy": 3, "medium": 5, "hard": 7}[data['difficulty']]
        
        for i in range(num_sounds):
            elements.append(PuzzleElement(
                element_type="sound",
                content=f"Animal sound {i + 1}",
                correct_answer=f"Animal {i + 1}",
                hints=["Listen carefully", "Think about the animal's size"]
            ))
            
        return GameContent(
            puzzle_type="animal_sounds",
            difficulty=data['difficulty'],
            title="Safari Sounds",
            description="Match the sounds to the correct animals",
            elements=elements,
            instructions="Listen to the sound and select the correct animal",
            reward_message="You're great at identifying animal sounds!",
            learning_outcome="Audio recognition and animal knowledge"
        )
    
    async def _generate_memory_game(self, data: Dict[str, Any]) -> GameContent:
        """Generate a memory matching game"""
        difficulty_map = {
            "easy": 4,  # 2x2 grid
            "medium": 8,  # 2x4 grid
            "hard": 12   # 3x4 grid
        }
        num_pairs = difficulty_map[data['difficulty']]
        
        elements = []
        for i in range(num_pairs):
            elements.append(PuzzleElement(
                element_type="memory_card",
                content=f"Card {i + 1}",
                correct_answer=f"Card {i + 1}",
                hints=["Remember the position", "Look for matching patterns"]
            ))
            
        return GameContent(
            puzzle_type="memory",
            difficulty=data['difficulty'],
            title=f"{data['animal_theme']}'s Memory Challenge",
            description="Find matching pairs of cards",
            elements=elements,
            instructions="Click on cards to reveal them and find matching pairs",
            reward_message="Your memory is amazing!",
            learning_outcome="Memory skills and concentration"
        ) 