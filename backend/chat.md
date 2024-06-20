
class MemoryChunk(ABC):
        id: uuid.UUID
        content: str
        role: str
        created_at: datetime
        edited_at: datetime

class MemoryStore:
        id: uuid.UUID
        name: str
        memory_chunks: list[MemoryChunk]
        created_at: datetime
        edited_at: datetime

class MemoryRepo:
        id: uuid.UUID
        name: str
        memory_stores: list[MemoryStore]
        created_at: datetime
        edited_at: datetime

Take the above python pydantic classes and convert into typescript types