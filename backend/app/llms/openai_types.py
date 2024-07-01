from datetime import datetime, timezone
from pydantic import BaseModel, Field, field_serializer
from typing import List, Literal, Optional, Union

from typing import TYPE_CHECKING

from app.buildspace import RequestMessage


class OpenAIChatRequest(BaseModel):
    model: str = Field("gpt-3.5-turbo")
    messages: list[RequestMessage]
    frequency_penalty: float = Field(0.00, ge=-2.00, le=2.00)
    logit_bias: Optional[dict] = Field(None)
    logprobs: Optional[bool] = Field(False)
    top_logprobs: Optional[int] = Field(None, ge=0, le=20)
    # TODO change this to 32k?
    max_tokens: Optional[int] = Field(None, ge=1, le=4096)
    n: Optional[int] = Field(1, ge=1, le=2)
    presence_penalty: float = Field(0.00, ge=-2.00, le=2.00)
    response_format: dict = Field({"type": "text"})
    seed: Optional[int] = Field(None)
    stop: Optional[list[str]] = Field(None)
    stream: Optional[bool] = Field(False)
    # stream_options: Optional[dict] = Field(None)
    temperature: float = Field(0.5, ge=0.00, le=2.00)
    top_p: float = Field(1.00, ge=0.00, le=1.00)


class Logprobs(BaseModel):
    content: Optional[List[str]] = Field(None)


class ToolCall(BaseModel):
    tool_name: str
    parameters: dict


class Message(BaseModel):
    content: Optional[Union[str, None]] = Field(None)
    tool_calls: Optional[List[ToolCall]] = Field(None)
    role: str
    logprobs: Optional[Logprobs] = Field(None)


class Choice(BaseModel):
    index: int
    message: Message
    logprobs: Optional[Logprobs] = Field(None)
    finish_reason: str


class Usage(BaseModel):
    completion_tokens: int
    prompt_tokens: int
    total_tokens: int


class OpenAIChatCompletionResponse(BaseModel):
    id: str
    object: str = Field("chat.completion")
    created: int
    model: str
    choices: List[Choice]
    # service_tier: Optional[str] = Field(None)
    usage: Usage
    system_fingerprint: Optional[str]

    # @field_serializer("created", mode="plain", return_type=datetime, when_used="always")
    # def serialize_created(created: int):
    #     return datetime.fromtimestamp(created, tz=timezone.utc)
