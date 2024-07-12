from enum import Enum
from fastapi import APIRouter, WebSocket
from fastapi.websockets import WebSocketDisconnect

import logging

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


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    Simple websocket that pongs a ping
    """
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            match data:
                case WebSocketActionMessages.PING.value:
                    await websocket.send_text(WebSocketActionMessages.PONG.value)
                case WebSocketActionMessages.NEXT.value:
                    await websocket.send_text("Next")
                case _:
                    print("Unknown message")
    except WebSocketDisconnect:
        print("Websocket disconnected")
    except Exception as e:
        print(f"Websocket error: {e}")
    finally:
        # dont need to do anything here, since FastAPI will close the connection
        pass
