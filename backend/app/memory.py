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
        self._memory = {k:v.clear() for k,v in self.memory.items()}

    def add_to_memory(
        self,
        value: str,
        field: str,
    ):
        if field not in self.memory.keys():
            raise ValueError(f"Invalid field: {field}")
        self._memory[field].append(value)


class DynamicMemory(Memory):
    def __init__(self):
        self._memory = {
            "short": [],
            "long": [],
        }


class ContextualMemory(Memory):
    def __init__(self):
        self._memory = {
            "rate_card": [],
            "company_info": [],
            "user_info": [],
        }
