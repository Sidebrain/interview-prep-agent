from openai import OpenAI

from app.memory import Memory
from app.tools import Tool


class Agent:
    def __init__(
        self,
        dynamic_memory: Memory,
        contextual_memory: Memory,
        tools: list[Tool],
        load_dummy_data: bool = False,
    ):
        self.openai = OpenAI()
        self._personality = None
        self._purpose = None
        self._mood = None
        self.dynamic_memory = dynamic_memory
        self.contextual_memory = contextual_memory
        self.tools = tools
        self.load_dummy_data(dummy_data=load_dummy_data)

    def return_snapshot(self):
        return {
            "purpose": self.purpose,
            "personality": self.personality,
            "mood": self.mood,
            "long_short_memory": self.long_short_memory,
            "contextual_memory": self.contextual_memory,
            "tools": self.tools,
        }

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
