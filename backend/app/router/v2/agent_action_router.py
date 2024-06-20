from fastapi import APIRouter
from pydantic import BaseModel
from app.interview_agent import interview_agent_v2


router = APIRouter(
    prefix="/v2/agent",
)


class AgentTextInput(BaseModel):
    text: str


@router.post("/purpose")
def set_agent_purpose(input: AgentTextInput) -> dict:
    purpose_mem_chunk = interview_agent_v2.purpose_mem_chunk
    purpose_mem_chunk.update_content(input.text)
    return {"purpose": interview_agent_v2.purpose_mem_chunk.content}


@router.get("/purpose")
async def get_agent_purpose() -> dict:
    return {"purpose": interview_agent_v2.purpose_mem_chunk.content}


@router.post("/personality", response_model=dict)
def set_agent_personality(input: AgentTextInput) -> dict:
    personality_mem_chunk = interview_agent_v2.personality_mem_chunk
    personality_mem_chunk.update_content(input.text)
    return {"personality": interview_agent_v2.personality_mem_chunk.content}


@router.get("/personality")
async def get_agent_personality() -> dict:
    return {"personality": interview_agent_v2.personality_mem_chunk.content}


@router.post("/mood")
def set_agent_mood(input: AgentTextInput) -> dict:
    mood_mem_chunk = interview_agent_v2.mood_mem_chunk
    mood_mem_chunk.update_content(input.text)
    return {"mood": interview_agent_v2.mood_mem_chunk.content}


@router.get("/mood")
async def get_agent_mood() -> dict:
    return {"mood": interview_agent_v2.mood_mem_chunk.content}
