from enum import Enum
import io
from pathlib import Path
import traceback
from typing import Mapping
from fastapi import (
    APIRouter,
    File,
    UploadFile,
    WebSocket,
    WebSocketDisconnect,
)
from pydantic import BaseModel

from app.agents.abstract_agent import Agent
from app.llms.openai_llm import transcribe_audio_to_text

router = APIRouter(prefix="/v3/demo")

ITERATION_DEPTH = 10


# session dict to make the websocket multiplayer
class UserSession(BaseModel): ...


session: Mapping[str, UserSession] = {}


class WebSocketActionMessages(Enum):
    """
    Enum to define the messages that can be sent to the websocket
    """

    PING = "ping"
    PONG = "pong"
    NEXT = "next"
    RESET = "reset"
    CONFIG_CHANGE = "config_change"


class InterviewConfigPage1(BaseModel):
    """
    Represents the first page of the interview configuration
    """

    company: str
    role: str
    team: str


@router.post("/transcribe")
async def transcribe(audio_body: UploadFile = File(...)) -> dict:
    try:
        audio_stream = await audio_body.read()
        print(f"Received file size: {len(audio_stream)} bytes")
        return await transcribe_audio_to_text(io.BytesIO(audio_stream))
    except Exception as e:
        print(f"Error: {e}")
        return {"text": "failed"}


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    Simple websocket that pongs a ping
    """
    await websocket.accept()
    # on connection, create a new user session with default values
    # the user_id is the first message received from the client
    user_id = await websocket.receive_text()
    print(f"User id: {user_id}")
    session[user_id] = UserSession()

    # initialize the environment using the user's session
    god = await initialize_environment(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            try:
                parsed = InterviewConfigPage1.model_validate_json(data)
                print("page 1 config succesfully parsed")
                await god.generate_knowledge(user_input=parsed)
            except ValueError:
                continue

            match data:
                case WebSocketActionMessages.PING.value:
                    await websocket.send_text(WebSocketActionMessages.PONG.value)
                case WebSocketActionMessages.NEXT.value:
                    print("received next signal. Notifying observers")
                    await timeline.notify_observers_of_action()
                case WebSocketActionMessages.RESET.value:
                    print("received reset signal. Resetting environment")
                    timeline = await initialize_environment(websocket, user_id)
                case _:
                    print("unknown internal classification")

    except WebSocketDisconnect:
        try:
            del session[user_id]
        except KeyError:
            raise ValueError(f"User with id {user_id} not found in session")
    except Exception as e:
        print(f"Websocket error: {e} {traceback.format_exc()}")
    finally:
        # dont need to do anything here, since FastAPI will close the connection
        pass


async def initialize_environment(websocket: WebSocket) -> Agent:
    purpose_file_path = Path("app/agents/configs/demo.yaml")
    print(f"initializing environment to {purpose_file_path}")

    god = Agent(
        origin_timeline=None,
        purpose_file_path=purpose_file_path,
        role="god",
        websocket=websocket,
    )
    # interviewer = Agent(
    #     role="interviewer",
    #     origin_timeline=god.timeline,
    #     websocket=websocket,
    #     purpose_file_path=purpose_file_path,
    #     max_iterations=ITERATION_DEPTH,
    #     critique_enabled=True,
    # )
    # candidate = Agent(
    #     role="candidate",
    #     origin_timeline=god.timeline,
    #     purpose_file_path=purpose_file_path,
    #     max_iterations=ITERATION_DEPTH,
    # )
    print("initialized environment")
    # await interviewer.receive_notification()
    return god
