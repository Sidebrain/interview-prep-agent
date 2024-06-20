from typing import Literal, Union
from fastapi import APIRouter
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from app.interview_agent import interview_agent
from app.router.agent_memory import MemoryInput


router = APIRouter(prefix="/agent/actions")


@router.post("/refresh")
async def refresh_agent() -> dict:
    interview_agent.refresh_memory()
    return {"message": "Success"}


@router.post("/ask-ai")
async def ask_ai() -> dict:
    """
    Things to improve:
    - Empty string submit transitons into long term memory
    - on refresh, the browser values reset to the default tht I was using

    """

    interview_agent.ask_ai()
    return {"message": "Success"}
