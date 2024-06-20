from app.agent import Agent
from app.memory_old import ContextualMemory, DynamicMemory
from app.tools import InterviewRater
from app.agents.base_agent import Agent as BaseAgent


interview_agent = Agent(
    dynamic_memory=DynamicMemory(),
    contextual_memory=ContextualMemory(),
    tools=[InterviewRater()],
    load_dummy_data=False,
)

interview_agent_v2 = BaseAgent(
    name="interview_agent",
)
