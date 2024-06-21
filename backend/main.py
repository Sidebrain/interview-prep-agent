from fastapi import FastAPI
from pydantic import BaseModel
from app.interview_agent import interview_agent
from fastapi.middleware.cors import CORSMiddleware

from app.router.agent import router as agent_router
from app.router.agent_memory import router as agenta_memory_router
from app.router.actions import router as utils_router

from app.router.v2.agent_action_router import router as agent_action_router_v2
from app.router.v2.agent_memory_router import router as agent_memory_router_v2


app = FastAPI()
app.include_router(agent_router)
app.include_router(agenta_memory_router)
app.include_router(utils_router)
app.include_router(agent_action_router_v2)
app.include_router(agent_memory_router_v2)


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


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", port=8000, reload=True, log_level="info")
