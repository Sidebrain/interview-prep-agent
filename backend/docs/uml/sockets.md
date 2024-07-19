# How socket communication between client and server would work

```python

class GenericSocketMessage(BaseModel):
    _type: "TimelineEvent"
    payload: Payload

class Payload:
    timeline: str "god_timeline"
    action: Action



```


```mermaid
graph TD
    A[Client] -->|1. Emit event| B(WebSocket Connection)
    B -->|2. Receive event| C[Server]
    C -->|3. Parse JSON| D{Valid JSON?}
    D -->|Yes| E[Create Pydantic Model]
    D -->|No| F[Handle Invalid JSON]
    E --> G{Valid Model?}
    G -->|Yes| H[Process Message]
    G -->|No| I[Handle Invalid Model]
    H --> J{Broadcast?}
    J -->|Yes| K[Emit to Other Clients]
    J -->|No| L[End]
    K --> M[Other Clients]
    F --> L
    I --> L
```