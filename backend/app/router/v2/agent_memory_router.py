from datetime import datetime
import uuid
from fastapi import APIRouter
from pydantic import BaseModel
from app.interview_agent import interview_agent_v2
from app.memory import abstractions

MemStoreType = abstractions.MemoryStore.PydanticModel
MemChunkType = abstractions.MemoryChunk.PydanticModel

router = APIRouter(
    prefix="/v2/agent/memory",
)


@router.get("/all-memory", response_model=list[MemStoreType])
def get_agent_memory():
    working_mem = interview_agent_v2.working_memstore.get_pydantic_representation()
    short_term_mem = interview_agent_v2.shortterm_memstore.get_pydantic_representation()
    long_term_mem = interview_agent_v2.longterm_memstore.get_pydantic_representation()
    identity_mem = interview_agent_v2.identity_memstore.get_pydantic_representation()
    return [identity_mem, short_term_mem, long_term_mem, working_mem]


@router.get("/identity-memory", response_model=MemStoreType)
def get_agent_identity_memory():
    return interview_agent_v2.identity_memstore.get_pydantic_representation()


@router.get("/task-memory", response_model=list[MemStoreType])
def get_agent_task_memory():
    """
    task memory consists of the following:
    - working memory
    - short term memory
    - long term memory
    """
    working_mem = interview_agent_v2.working_memstore.get_pydantic_representation()
    short_term_mem = interview_agent_v2.shortterm_memstore.get_pydantic_representation()
    long_term_mem = interview_agent_v2.longterm_memstore.get_pydantic_representation()
    return [short_term_mem, long_term_mem, working_mem]


@router.get("/long-term-memory", response_model=MemStoreType)
def get_agent_long_term_memory():
    return interview_agent_v2.longterm_memstore.get_pydantic_representation()


@router.get("/short-term-memory", response_model=MemStoreType)
def get_agent_short_term_memory():
    return interview_agent_v2.shortterm_memstore.get_pydantic_representation()


@router.get("/working-memory", response_model=MemStoreType)
def get_agent_working_memory():
    return interview_agent_v2.working_memstore.get_pydantic_representation()


class MemoryChunkInput(BaseModel):
    content: str
    tag: str | None = None
    role: abstractions.PossibleSources = "user"


@router.post("/short-term-memory")
def add_to_short_term_memory(
    input: MemoryChunkInput,
) -> None:
    return interview_agent_v2.shortterm_memstore.add_string_to_memory(
        content=input.content, tag=input.tag, role=input.role
    )
