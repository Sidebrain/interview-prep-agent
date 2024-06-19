from typing import Literal, Union
from fastapi import APIRouter
from pydantic import BaseModel
from app.interview_agent import interview_agent


router = APIRouter(prefix="/agent/actions")


class BaseMemoryinput(BaseModel):
    value: str


@router.post("/refresh")
def refresh_agent() -> dict:
    interview_agent.refresh_memory()
    return {"message": "Success"}
