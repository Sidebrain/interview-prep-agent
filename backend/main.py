from fastapi import FastAPI
from pydantic import BaseModel
from app.interview_agent import interview_agent
from fastapi.middleware.cors import CORSMiddleware

from app.router.agent import router as agent_router
from app.router.agent_memory import router as agenta_memory_router
from app.router.actions import router as utils_router

from app.router.agentv2 import router as agent_router_v2

app = FastAPI()
app.include_router(agent_router)
app.include_router(agenta_memory_router)
app.include_router(utils_router)
app.include_router(agent_router_v2)


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}
