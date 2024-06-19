from typing import Literal, Union
from fastapi import APIRouter
from pydantic import BaseModel
from app.interview_agent import interview_agent


router = APIRouter(prefix="/agent/memory")


class BaseMemoryinput(BaseModel):
    value: str


class ContextualMemoryinput(BaseMemoryinput):
    memtype: Literal["contextual"]
    field: Literal["rate_card", "company_info", "user_info"]


class DynamicMemoryinput(BaseMemoryinput):
    memtype: Literal["dynamic"]
    field: Literal["short", "long"]


MemoryInput = Union[ContextualMemoryinput, DynamicMemoryinput]


@router.get("/dynamic")
def get_agent_memory() -> dict:
    return interview_agent.dynamic_memory.memory


@router.get("/contextual")
def get_agent_contextual_memory() -> dict:
    return interview_agent.contextual_memory.memory


@router.post("/augment")
def add_to_memory(mem: MemoryInput) -> dict:
    match mem.memtype:
        case "contextual":
            interview_agent.contextual_memory.add_to_memory(
                value=mem.value, field=mem.field
            )
            return interview_agent.contextual_memory.memory
        case "dynamic":
            interview_agent.dynamic_memory.add_to_memory(
                value=mem.value, field=mem.field
            )
            return interview_agent.dynamic_memory.memory
        case _:
            raise ValueError(
                "Invalid memory type: {mem.type}. Must be 'contextual' or 'dynamic'"
            )
