from typing import Literal, Union
from dataclasses import dataclass

Provider = Literal["claude", "cohere", "meta", "openai"]

ProviderModels = {
    "claude": [""],
    "cohere": [""],
    "meta": [""],
    "openai": ["gpt-3.5-turbo", "gpt-4"],
}


@dataclass
class IntelligenceBase:
    mode: Literal["human", "ai"]
    model: str


@dataclass
class AI(IntelligenceBase):
    mode: Literal["ai"]
    provider: Provider

    def __post_init__(self):
        if self.model not in ProviderModels[self.provider]:
            raise ValueError(
                f"Invalid model '{self.model}' for provider '{self.provider}'"
            )


@dataclass
class Human(IntelligenceBase):
    mode: Literal["human"]
    model: str = "human-input"


Intelligence = Union[AI, Human]


class IntelligenceWorker:
    def __init__(self, intelligence: Intelligence):
        self.intelligence = intelligence
