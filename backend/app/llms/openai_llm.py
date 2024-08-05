import io
from fastapi.responses import FileResponse
from httpx import AsyncClient

from app.buildspace import RequestMessage
from app.llms.openai_types import OpenAIChatCompletionResponse, OpenAIChatRequest
from app.llms.types import AI

import os
from dotenv import load_dotenv

load_dotenv()

import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
fh = logging.FileHandler(f"logs/{__name__}.log")
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s \n %(message)s")
fh.setFormatter(formatter)
logger.addHandler(fh)


OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_API_URL = os.getenv("OPENAI_API_URL")


class OpenAI:
    def __init__(self):
        self.client = AsyncClient(base_url=OPENAI_API_URL)
        self.intelligence = AI(
            mode="ai",
            model="gpt-4o-mini",
            provider="openai",
        )

    async def get_completion_response(
        self, request: OpenAIChatRequest
    ) -> OpenAIChatCompletionResponse:
        async with AsyncClient(base_url=OPENAI_API_URL) as client:
            response = await client.post(
                "/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENAI_API_KEY}",
                    "Content-Type": "application/json",
                },
                data=request.model_dump_json(),
                timeout=100,
            )
            response_data = response.json()
            # logger.debug(f"Response from OpenAI: {response_data}")
            return OpenAIChatCompletionResponse.model_validate(response_data)

    async def build_request(
        self, messages: list[RequestMessage], **kwargs
    ) -> OpenAIChatRequest:
        return OpenAIChatRequest(messages=messages, **kwargs)


async def transcribe_audio_to_text(audio: io.BytesIO) -> str:
    async with AsyncClient(base_url=OPENAI_API_URL) as client:
        response = await client.post(
            url="/audio/transcriptions",
            headers={
                "Authorization": f"Bearer {OPENAI_API_KEY}",
            },
            files={
                "file": (
                    "random.webm",  # this is needed, the name does not seem to matter
                    audio,
                ),
                "model": (None, "whisper-1"),
            },
        )
        return response.json()
