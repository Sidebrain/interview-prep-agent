from abc import ABC, abstractmethod
from datetime import datetime
import json
from typing import Literal

from pydantic import BaseModel

PossibleSources = Literal["user", "assistant", "system", "external"]
possible_sources = ["user", "assistant", "system", "external"]


class MemoryChunk(ABC):
    """MemoryChunk
    This is the lowest memory abstraction.
    It is set up as an abstract base class that further types will inherit from.
    Some types planned at the start are:
    - TextChunk
    - ImageChunk
    - AudioChunk
    - VideoChunk
    - FileChunk
    - CodeChunk
    - LinkChunk
    - LocationChunk
    - ContactChunk
    - EventChunk
    - NoteChunk

    """

    def __init__(self, content: str, source: PossibleSources, tag: str = None) -> None:
        self.content = content
        self.role = source
        self.created_at = datetime.now()
        self.edited_at = datetime.now()
        self.tag = tag
        pass

    def to_dict(self) -> dict:
        return {
            "content": self.content,
            "role": self.role,
        }

    def to_string(self) -> str:
        return f"<{self.role}> {self.content}"

    def to_embedding(self) -> list[float]:
        # TODO make this a required abstract method later
        return [0.0]
    
    def update_content(self, new_content: str) -> None:
        self.content = new_content
        self.edited_at = datetime.now()

    @classmethod
    def load_from_json_string(cls, json_string: str) -> "MemoryChunk":
        # ensure that the json_string is a valid json string
        try:
            parsed_string = json.loads(json_string)
            # and that it has the required keys
            if not all(k in parsed_string.keys() for k in ["content", "role"]):
                raise ValueError("Invalid JSON string keys")
            # check if there are outside keys
            if len(parsed_string.keys()) > 2:
                raise ValueError("Invalid JSON string keys")
        except json.JSONDecodeError:
            raise ValueError("Invalid JSON string")

        return cls(**parsed_string)


class MemoryStore:
    def __init__(self, name: str, store: list[MemoryChunk]) -> None:
        self.name = name
        self.store = store
        self.created_at = datetime.now()
        self.edited_at = datetime.now()

    def register_memory_chunk(self, chunk: MemoryChunk) -> None:
        self.store.append(chunk)

    def to_jsonlist(self) -> list[dict]:
        return [chunk.to_dict() for chunk in self.store]

    def add_string_to_memory(
        self, content: str, source: PossibleSources, tag: str = None
    ) -> None:
        if not content or not source or not source in possible_sources:
            raise ValueError("Invalid content or source")
        chunk = MemoryChunk(content=content, source=source, tag=tag)
        self.store.append(chunk)
        return self.store

    def add_chunk_to_memory(self, chunk: MemoryChunk) -> None:
        self.store.append(chunk)
        return self.store

    def get_chunk_by_tag(self, tag: str) -> MemoryChunk:
        for chunk in self.store:
            if chunk.tag == tag:
                return chunk
        return None


class MemoryRepo:
    def __init__(self, name: str, stores: list[MemoryStore]) -> None:
        self.name = name
        self.stores = stores
        self.created_at = datetime.now()
        self.edited_at = datetime.now()

    def register_memory_store(self, store: MemoryStore) -> None:
        self.stores.append(store)

    def to_jsonlist(self) -> list[dict]:
        return [store.to_jsonlist() for store in self.stores]

    def to_json_tree(self) -> dict:
        return {store.name: store.to_jsonlist() for store in self.stores}
