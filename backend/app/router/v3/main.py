from enum import Enum
from typing import Literal, Mapping
import uuid
from fastapi import APIRouter, WebSocket
from fastapi.websockets import WebSocketDisconnect

from pathlib import Path

import logging

from pydantic import BaseModel
import yaml

from app.agents.abstract_agent import Agent

# Set up logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

# Create file handler and set level to DEBUG
file_handler = logging.FileHandler("logs/app.log")
file_handler.setLevel(logging.DEBUG)

# Create formatter
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")

# Add formatter to file handler
file_handler.setFormatter(formatter)

# Add file handler to logger
logger.addHandler(file_handler)

router = APIRouter(
    prefix="/v3",
)

# GLOBAL CONSTANTS
ITERATION_DEPTH = 10

# default values
DEFAULT_PURPOSE_FILE_PATH = "config/agents_config.yaml"


# session dict to make the websocket multiplayer
class UserSession(BaseModel):
    agent_config_path: Path = Path(DEFAULT_PURPOSE_FILE_PATH)
    iteration_depth: int = ITERATION_DEPTH
    selected_agent_config: str = ""


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
    timeline = await initialize_environment(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
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
                    print("Unknown message")
    except WebSocketDisconnect:
        try:
            del session[user_id]
        except KeyError:
            raise ValueError(f"User with id {user_id} not found in session")
    except Exception as e:
        print(f"Websocket error: {e}")
    finally:
        # dont need to do anything here, since FastAPI will close the connection
        pass


@router.get("/agent-config")
async def get_current_agent_config(user_id: str) -> dict[str, str]:
    print("current config", session[user_id])
    return {"agent_config_path": session[user_id].agent_config_path.name}


@router.get("/agent-config-text")
async def get_agent_config_text(user_id: str, selected: bool = False):
    if selected:
        purpose_file_path = Path(session[user_id].selected_agent_config)
    else:
        purpose_file_path = Path(session[user_id].agent_config_path)
    with open(purpose_file_path, "r") as file:
        return yaml.safe_load(file)


@router.get("/available-configs")
async def config() -> list[Path]:
    return [
        child_path.name
        for child_path in Path("config").iterdir()
        if child_path.is_file()
    ]


class ConfigChangeRequest(BaseModel):
    user_id: str
    new_purpose_file_path: str


@router.post("/agent-config")
async def change_config(
    input: ConfigChangeRequest, selected: bool = False
) -> dict[str, str]:
    print(f"change request: ", input)
    if not input.new_purpose_file_path.startswith("config"):
        path = Path(f"config/{input.new_purpose_file_path}")
    if not path.exists():
        return {"message": "Config file not found"}
    if selected:
        session[input.user_id].selected_agent_config = path
    else:
        session[input.user_id].agent_config_path = path
    print("changed config", session)
    return {"message": "Config changed"}


async def initialize_environment(websocket: WebSocket, user_id: uuid.UUID):
    purpose_file_path = session[user_id].agent_config_path
    print(f"initializing environment to {purpose_file_path}")
    god = Agent(
        origin_timeline=None,
        purpose_file_path=purpose_file_path,
        role="god",
        websocket=websocket,
    )
    interviewer = Agent(
        role="interviewer",
        origin_timeline=god.timeline,
        websocket=websocket,
        purpose_file_path=purpose_file_path,
        max_iterations=ITERATION_DEPTH,
        critique_enabled=True,
    )
    candidate = Agent(
        role="candidate",
        origin_timeline=god.timeline,
        purpose_file_path=purpose_file_path,
        max_iterations=ITERATION_DEPTH,
    )
    print("initialized environment")
    await interviewer.receive_notification()
    return god.timeline
