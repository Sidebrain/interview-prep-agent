from typing import List
from fastapi import APIRouter, WebSocket
from fastapi.websockets import WebSocketDisconnect

from app.agents.abstract_agent import Agent
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


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    Simple websocket that pongs a ping
    """
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            print(f"received data: {data}")
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        print("Websocket disconnected")
    except Exception as e:
        print(f"Websocket error: {e}")
    finally:
        # dont need to do anything here, since FastAPI will close the connection
        pass
