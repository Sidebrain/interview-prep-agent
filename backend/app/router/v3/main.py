from enum import Enum
from fastapi import APIRouter, WebSocket
from fastapi.websockets import WebSocketDisconnect

import logging

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


class WebSocketActionMessages(Enum):
    """
    Enum to define the messages that can be sent to the websocket
    """

    PING = "ping"
    PONG = "pong"
    NEXT = "next"
    RESET = "reset"


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    Simple websocket that pongs a ping
    """
    await websocket.accept()
    timeline = await initialize_environment(websocket)
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
                    timeline = await initialize_environment(websocket)
                case _:
                    print("Unknown message")
    except WebSocketDisconnect:
        print("Websocket disconnected")
    except Exception as e:
        print(f"Websocket error: {e}")
    finally:
        # dont need to do anything here, since FastAPI will close the connection
        pass


async def initialize_environment(websocket: WebSocket):
    god = Agent(origin_timeline=None, purpose_file_path=None)
    canon_timeline = god.timeline
    canon_timeline.websocket = websocket
    interviewer = Agent(
        origin_timeline=canon_timeline,
        purpose_file_path="docs/agent_config/interviewer.md",
        max_iterations=5,
    )
    candidate = Agent(
        origin_timeline=canon_timeline,
        purpose_file_path="docs/agent_config/candidate.md",
        max_iterations=5,
    )
    print("initialized environment")
    await interviewer.receive_notification()
    return canon_timeline
