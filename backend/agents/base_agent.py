from typing import Dict, Any, Optional
from crewai import Agent
from ..config.agent_config import AgentConfig

class BaseCrewAgent:
    def __init__(
        self,
        agent_config: AgentConfig,
        tools: Optional[list] = None,
        llm_model: str = "gpt-3.5-turbo"
    ):
        self.config = agent_config
        self.agent = self._create_agent(tools, llm_model)

    def _create_agent(self, tools: Optional[list], llm_model: str) -> Agent:
        """Create a CrewAI agent with the specified configuration"""
        return Agent(
            role=self.config.role,
            goal=self.config.goal,
            backstory=self.config.backstory,
            verbose=self.config.verbose,
            allow_delegation=self.config.allow_delegation,
            tools=tools or [],
            llm_model=llm_model
        )

    def get_agent(self) -> Agent:
        """Return the CrewAI agent instance"""
        return self.agent

    async def process(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process the input data and return results.
        To be implemented by specific agents.
        """
        raise NotImplementedError("Subclasses must implement process method") 