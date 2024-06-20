import uuid
from openai import OpenAI

from app.memory import ContextualMemory, DynamicMemory
from app.tools import Tool

import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
fh = logging.FileHandler("logs/agent.log")
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s \n %(message)s")
fh.setFormatter(formatter)
logger.addHandler(fh)


class Agent:
    def __init__(
        self,
        dynamic_memory: DynamicMemory,
        contextual_memory: ContextualMemory,
        tools: list[Tool],
        load_dummy_data: bool = False,
    ):
        self.id = None
        self.register_conscience()  # logs a uuid for conversation logging
        self.openai = OpenAI()
        self._personality = None
        self._purpose = None
        self._mood = None
        self.dynamic_memory = dynamic_memory
        self.contextual_memory = contextual_memory
        self.tools = tools
        self.load_dummy_data(dummy_data=load_dummy_data)

    def register_conscience(self):
        self.id = uuid.uuid4()
        logger.info(f"Agent {self.id} is now online")

    def ask_ai(self):
        # combine the short term memory into a single message
        human_message = {
            "role": "human",
            "message": "Human: " + "\n".join(self.dynamic_memory.memory["short"]),
        }
        # transition the short term memory to long term
        self.dynamic_memory.transition_to_long_term()
        # pass the message to the openai api
        # return the response
        pass

    def refresh_memory(self):
        # probably want to log this
        self.register_conscience()
        self.dynamic_memory.refresh_memory()
        self.contextual_memory.refresh_memory()

    def load_dummy_data(self, dummy_data: bool):
        self.dynamic_memory.load_dummy_data(dummy_data)
        self.contextual_memory.load_dummy_data(dummy_data)

    @property
    def purpose(self):
        return {"purpose": self._purpose}

    @purpose.setter
    def purpose(self, value: str):
        print("setting purpose")
        self._purpose = value

    @property
    def personality(self):
        return {"personality": self._personality}

    @personality.setter
    def personality(self, value: str):
        self._personality = value

    @property
    def mood(self):
        return {"mood": self._mood}

    @mood.setter
    def mood(self, value: str):
        self._mood = value
from app.agent import Agent
from app.memory import ContextualMemory, DynamicMemory
from app.tools import InterviewRater


interview_agent = Agent(
    dynamic_memory=DynamicMemory(),
    contextual_memory=ContextualMemory(),
    tools=[InterviewRater()],
    load_dummy_data=False,
)
from abc import ABC, abstractmethod
from typing import Literal


class Memory(ABC):
    @abstractmethod
    def __init__(self):
        self._memory = {"field1": [], "field2": []}
        pass

    @property
    def memory(self):
        return self._memory

    @memory.setter
    def memory(self, value):
        self._memory = value

    def load_dummy_data(self, dummy_data=False):
        if not dummy_data:
            return
        for k, v in self._memory.items():
            v.extend([f"{k}_term: {i}" for i in range(5)])

    def refresh_memory(self):
        self._memory = {k: [] for k, v in self.memory.items()}

    def add_to_memory(
        self,
        value: str,
        field: str,
    ):
        if field not in self.memory.keys():
            raise ValueError(f"Invalid type field combo: {type}: {field}")
        self._memory[field].append(value)


class DynamicMemory(Memory):
    def __init__(self):
        self._memory = {
            "short": [],
            "long": [],
        }

    def transition_to_long_term(self):
        self._memory["long"].append(" - ".join(self._memory["short"]))
        self._memory["short"] = []


class ContextualMemory(Memory):
    def __init__(self):
        self._memory = {
            "rate_card": [],
            "company_info": [],
            "user_info": [],
        }
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


class DynamicMemoryOutput(BaseModel):
    short: list[str]
    long: list[str]


MemoryInput = Union[ContextualMemoryinput, DynamicMemoryinput]


@router.get("/dynamic")
def get_agent_memory() -> DynamicMemoryOutput:
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

from abc import ABC, abstractmethod


class Tool(ABC):
    def __init__(self):
        pass

    @abstractmethod
    def use(self):
        pass


class InterviewRater(Tool):
    def __init__(self):
        pass

    def use(self):
        return "InterviewRater is being used"