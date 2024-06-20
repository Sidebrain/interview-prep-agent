```mermaid

classDiagram
direction RL

    class Agent {
        +self: str
        +id: str
        +working_memory_store: MemoryStore 
        +short_term_store: MemoryStore
        +long_term_store: MemoryStore
        %% this will help composing the system message purpose, mood etc
        +identity_store: MemoryStore
        +purpose: str
        +personality: str
        +mood: str
        +__init__()
        +register_conscience()
        +ask_ai()
        +refresh_memory()
        +load_dummy_data(dummy_data)
    }

    class MemoryChunk {
        +source: str
        +payload: str
        +embedding: list~int~
        +created: datetime
        +edited: datetime
        +to_dict()
        +to_string()
        +to_embedding()

    }

    class MemoryStore {
        +name: str
        %% can also be a queue
        +store: list~MemoryChunk~
        +register_memory_chunk()
        +to_jsonlist()

    }

    class MemoryRepo {
        +name: str
        +repo: list~MemoryStore~
    }

    class TextChunk {
        +payload: text
        +source: str
    }

    class ImageChunk {
        +payload: img
        +source: str
    }

    class VideoChunk {
        +payload: video
        +source: str
    }

    class VoiceChunk {
        +payload: audio
        +source: str
    }


    MemoryStore --* MemoryChunk : composition
    MemoryRepo --* MemoryStore : composition
    TextChunk --|> MemoryChunk : inheritance
    VoiceChunk --|> MemoryChunk : inheritance
    ImageChunk --|> MemoryChunk : inheritance
    VideoChunk --|> MemoryChunk : inheritance
    Agent --* MemoryStore : composition short_term
    Agent --* MemoryStore : composition long_term
    Agent --* MemoryStore : composition working_mem_store
    Agent --* MemoryStore : composition identity_store

```

