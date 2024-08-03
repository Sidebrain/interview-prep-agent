import io
from typing import Annotated, Any
from fastapi import APIRouter, File, Form, Request, UploadFile

from app.llms.openai_llm import transcribe_audio_to_text

router = APIRouter(prefix="/v3/demo")


@router.post("/transcribe")
async def transcribe(audio_body: UploadFile = File(...)) -> dict:
    try:
        audio_stream = await audio_body.read()
        print(f"Received file size: {len(audio_stream)} bytes")
        return await transcribe_audio_to_text(io.BytesIO(audio_stream))
    except Exception as e:
        print(f"Error: {e}")
        return {"text": "failed"}
