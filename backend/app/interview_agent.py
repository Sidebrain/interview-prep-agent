from app.agent import Agent
from app.memory import ContextualMemory, DynamicMemory
from app.tools import InterviewRater


interview_agent = Agent(
    dynamic_memory=DynamicMemory(),
    contextual_memory=ContextualMemory(),
    tools=[InterviewRater()],
    load_dummy_data=True,
)
