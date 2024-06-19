import datetime
import uuid
from openai import OpenAI

from app.memory import Memory
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
        dynamic_memory: Memory,
        contextual_memory: Memory,
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
