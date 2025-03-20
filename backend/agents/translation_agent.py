from typing import Dict, Any, List, Optional
from pydantic import BaseModel
from .base_agent import BaseCrewAgent
from ..config.agent_config import AGENT_CONFIGS, SUPPORTED_LANGUAGES

class TranslationRequest(BaseModel):
    text: str
    source_language: str = "en"
    target_language: str
    context: str
    content_type: str  # story, game, ui, etc.

class TranslatedContent(BaseModel):
    original_text: str
    translated_text: str
    language: str
    content_type: str
    cultural_notes: List[str]
    pronunciation_guide: Optional[str] = None

class TranslationAgent(BaseCrewAgent):
    def __init__(self):
        super().__init__(AGENT_CONFIGS["translation"])
        
    async def process(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Translate content while maintaining educational value and cultural context
        
        Args:
            data: Dictionary containing:
                - text: Text to translate
                - source_language: Source language code
                - target_language: Target language code
                - context: Context of the content
                - content_type: Type of content being translated
        
        Returns:
            Dictionary containing translated content and additional information
        """
        # Validate languages
        if data['target_language'] not in SUPPORTED_LANGUAGES:
            raise ValueError(f"Unsupported target language. Must be one of {SUPPORTED_LANGUAGES}")
            
        # Create translation request
        request = TranslationRequest(**data)
        
        # Process translation
        translation = await self._translate_content(request)
        
        return translation.dict()
    
    async def _translate_content(self, request: TranslationRequest) -> TranslatedContent:
        """Translate content based on type and context"""
        translation_methods = {
            "story": self._translate_story,
            "game": self._translate_game,
            "ui": self._translate_ui
        }
        
        translator = translation_methods.get(request.content_type, self._translate_general)
        return await translator(request)
    
    async def _translate_story(self, request: TranslationRequest) -> TranslatedContent:
        """Translate story content with appropriate style and cultural context"""
        # Here you would integrate with actual translation service
        # For now, we'll simulate the translation
        translated = f"Translated story: {request.text}"
        
        cultural_notes = [
            "Adapted animal names for local context",
            "Modified metaphors for cultural relevance",
            "Adjusted moral lessons to align with local values"
        ]
        
        return TranslatedContent(
            original_text=request.text,
            translated_text=translated,
            language=request.target_language,
            content_type="story",
            cultural_notes=cultural_notes,
            pronunciation_guide="Guide for key terms and names"
        )
    
    async def _translate_game(self, request: TranslationRequest) -> TranslatedContent:
        """Translate game content with focus on instructions and feedback"""
        translated = f"Translated game: {request.text}"
        
        cultural_notes = [
            "Adapted game mechanics for local context",
            "Modified difficulty descriptions",
            "Localized achievement messages"
        ]
        
        return TranslatedContent(
            original_text=request.text,
            translated_text=translated,
            language=request.target_language,
            content_type="game",
            cultural_notes=cultural_notes
        )
    
    async def _translate_ui(self, request: TranslationRequest) -> TranslatedContent:
        """Translate UI elements with consistency and clarity"""
        translated = f"Translated UI: {request.text}"
        
        cultural_notes = [
            "Maintained consistent UI terminology",
            "Adapted button labels for space constraints",
            "Localized date and time formats"
        ]
        
        return TranslatedContent(
            original_text=request.text,
            translated_text=translated,
            language=request.target_language,
            content_type="ui",
            cultural_notes=cultural_notes
        )
    
    async def _translate_general(self, request: TranslationRequest) -> TranslatedContent:
        """General purpose translation for miscellaneous content"""
        translated = f"Translated: {request.text}"
        
        return TranslatedContent(
            original_text=request.text,
            translated_text=translated,
            language=request.target_language,
            content_type=request.content_type,
            cultural_notes=["General translation with context preservation"]
        ) 