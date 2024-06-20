from abc import ABC, abstractmethod
from datetime import datetime
import json
from typing import Literal
import uuid

from pydantic import BaseModel, create_model

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

    def __init__(self, content: str, role: PossibleSources, tag: str = None) -> None:
        self.id = uuid.uuid4()
        self.content = content
        self.role = role
        self.created_at = datetime.now()
        self.edited_at = datetime.now()
        self.tag = tag
        pass

    class PydanticModel(BaseModel):
        # TODO need to automate this. Code duplication has fucked me up once already
        id: uuid.UUID
        content: str
        role: str
        created_at: datetime
        edited_at: datetime
        tag: str

    def get_pydantic_representation(self) -> PydanticModel:
        return self.PydanticModel(
            id=self.id,
            content=self.content,
            role=self.role,
            created_at=self.created_at,
            edited_at=self.edited_at,
            tag=self.tag,
        )

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
    def __init__(self, name: str, memory_chunks: list[MemoryChunk]) -> None:
        self.id = uuid.uuid4()
        self.name = name
        self.memory_chunks = memory_chunks
        self.created_at = datetime.now()
        self.edited_at = datetime.now()

    class PydanticModel(BaseModel):
        id: uuid.UUID
        name: str
        memory_chunks: list[MemoryChunk.PydanticModel]
        created_at: datetime
        edited_at: datetime

    def get_pydantic_representation(self) -> PydanticModel:
        return self.PydanticModel(
            id=self.id,
            name=self.name,
            memory_chunks=[
                chunk.get_pydantic_representation() for chunk in self.memory_chunks
            ],
            created_at=self.created_at,
            edited_at=self.edited_at,
        )

    def register_memory_chunk(self, chunk: MemoryChunk) -> None:
        self.memory_chunks.append(chunk)

    def to_jsonlist(self) -> list[dict]:
        return [chunk.to_dict() for chunk in self.memory_chunks]

    def get_content_of_all_chunks_and_label(
        self,
    ) -> tuple[list[tuple[uuid.UUID, str]], str]:
        return [(self.id, chunk.content) for chunk in self.memory_chunks], self.name

    def add_string_to_memory(
        self, content: str, role: PossibleSources, tag: str = None
    ) -> None:
        if not content or not role or not role in possible_sources:
            raise ValueError("Invalid content or source")
        chunk = MemoryChunk(content=content, role=role, tag=tag)
        self.memory_chunks.append(chunk)
        return self.memory_chunks

    def add_chunk_to_memory(self, chunk: MemoryChunk) -> None:
        self.memory_chunks.append(chunk)
        return self.memory_chunks

    def get_chunk_by_tag(self, tag: str) -> MemoryChunk:
        for chunk in self.memory_chunks:
            if chunk.tag == tag:
                return chunk
        return None


class MemoryRepo:
    def __init__(self, name: str, memory_stores: list[MemoryStore]) -> None:
        self.id = uuid.uuid4()
        self.name = name
        self.memory_stores = memory_stores
        self.created_at = datetime.now()
        self.edited_at = datetime.now()

    class PydanticModel(BaseModel):
        id: uuid.UUID
        name: str
        memory_stores: list[MemoryStore.PydanticModel]
        created_at: datetime
        edited_at: datetime

    def get_pydantic_representation(self) -> PydanticModel:
        return self.PydanticModel(
            id=self.id,
            name=self.name,
            memory_stores=[
                store.get_pydantic_representation() for store in self.memory_stores
            ],
            created_at=self.created_at,
            edited_at=self.edited_at,
        )

    def register_memory_store(self, store: MemoryStore) -> None:
        self.memory_stores.append(store)

    def to_jsonlist(self) -> list[dict]:
        return [store.to_jsonlist() for store in self.memory_stores]

    def to_json_tree(self) -> dict:
        return {store.name: store.to_jsonlist() for store in self.memory_stores}
