from datetime import datetime
import io
import time
from app.llms.openai_llm import transcribe_audio_to_text
import asyncio
from openai import AsyncClient


async def main():
    t = time.perf_counter()
    with open("media/recording.m4a", "rb") as f:
        time_to_open = time.perf_counter() - t
        print(f"{time_to_open=}")
        x = f.read()
        time_to_read = (t - time.perf_counter()) - time_to_open
        print(f"{time_to_read=}")
        file_stream = io.BytesIO(x)
        time_to_bytes = (t - time.perf_counter()) - time_to_read - time_to_open
        print(f"{time_to_bytes=}")
        print(f"ratio of time to read to time to bytes : {time_to_read / time_to_open}")
        res = await transcribe_audio_to_text(file_stream)
        time_to_transcribe = (
            (time.perf_counter() - t) - time_to_bytes - time_to_read - time_to_open
        )
        print(f"Time to transcribe: {time.perf_counter() - t}")
        print(res)


if __name__ == "__main__":
    asyncio.run(main())
