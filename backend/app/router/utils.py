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
