from fastapi import APIRouter
from pydantic import BaseModel
from app.interview_agent import interview_agent


router = APIRouter(
    prefix="/agent",
)


class AgentTextInput(BaseModel):
    text: str


@router.post("/purpose")
def set_agent_purpose(input: AgentTextInput) -> dict:
    interview_agent.purpose = input.text
    return interview_agent.purpose


@router.get("/purpose")
async def get_agent_purpose() -> dict:
    # return {"purpose": interview_agent.purpose}
    return interview_agent.purpose


@router.post("/personality", response_model=dict)
def set_agent_personality(input: AgentTextInput) -> dict:
    interview_agent.personality = input.text
    return interview_agent.personality


@router.get("/personality")
async def get_agent_personality() -> dict:
    return interview_agent.personality


@router.post("/mood")
def set_agent_mood(input: AgentTextInput) -> dict:
    interview_agent.mood = input.text
    return interview_agent.mood


@router.get("/mood")
async def get_agent_mood() -> dict:
    return interview_agent.mood
