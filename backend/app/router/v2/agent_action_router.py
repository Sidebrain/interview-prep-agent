from fastapi import APIRouter
from pydantic import BaseModel
from app.interview_agent import interview_agent_v2


router = APIRouter(
    prefix="/v2/agent/actions",
)

@router.post("/refresh")
def refresh_agent() -> dict:
    interview_agent_v2.refresh_memory()
    return {"message": "Success"}
