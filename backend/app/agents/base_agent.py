import uuid
from openai import OpenAI

from app.memory.abstractions import MemoryChunk, MemoryStore

import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
fh = logging.FileHandler("logs/agent.log")
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s \n %(message)s")
fh.setFormatter(formatter)
logger.addHandler(fh)


class Agent:
    def __init__(self, name) -> None:
        self.name = name
        self.id = uuid.uuid4()
        self.working_memstore = MemoryStore(name="working", store=[])
        self.shortterm_memstore = MemoryStore(name="shortterm", store=[])
        self.longterm_memstore = MemoryStore(name="longterm", store=[])
        # TODO you have to construct this at the start either by asking the user or getting ai to make it for you
        self.identity_memstore = MemoryStore(name="identity", store=[])
        self.openai = OpenAI()
        self.construct_identity_prompt()

    def refresh_memory(self):
        logger.debug(f"Agent {self.id} is refreshing memory")

        self.working_memstore.store.clear()
        self.shortterm_memstore.store.clear()
        self.longterm_memstore.store.clear()
        self.identity_memstore.store.clear()

        logger.debug(f"Agent {self.id} has refreshed memory")

    def transition_to_longterm(self):
        logger.debug(f"Agent {self.id} is transitioning short term to long term memory")
        self.longterm_memstore.store.extend(self.shortterm_memstore.store)
        self.shortterm_memstore.store.clear()
        logger.debug(f"Agent {self.id} has transitioned short term to long term memory")

    def compress_shortterm_into_single_message(self):
        compressed_message = "\n".join(self.shortterm_memstore.store)
        self.shortterm_memstore.store.clear()
        self.shortterm_memstore.add_string_to_memory(
            content=compressed_message, source="human"
        )

    def construct_identity_prompt(self):
        # TODO you have to construct this at the start either by asking the user or getting ai to make it for you
        if not self.identity_memstore.store:
            purpose = """
            # Your purpose
            - You are an interview agent, specializing in product management recruiting. 
            - You are currently recruiting for a Junior Product Manager role at Amazon.
            """
            personality = """
            # Your personality
            - You work for Amazon and are aware of the company's leadership principles.
            - You are aware of the STAR method and are able to ask questions to get the best responses from candidates.
            - You are able to ask follow-up questions to get more information from candidates.
            - You want to catch candidates who are lying or exaggerating their experience.
            - You are especially wary of candidates who are not able to provide specific examples of their work.
            """
            mood = """
            # Your mood
            - You are empathetic, friendly, and helpful.
            """
            self.identity_memstore.add_string_to_memory(purpose, source="system")
            self.identity_memstore.add_string_to_memory(personality, source="system")
            self.identity_memstore.add_string_to_memory(mood, source="system")

    def act(self):
        # compress the short-term message and transition short term to long term memory
        self.compress_shortterm_into_single_message()
        self.transition_to_longterm()
        # send long term memory to ai
        # get response from ai
        # TODO have to supplement with system prompt
        response = self.openai.chat.completions(
            model="gpt-3.5-turbo",
            # identity prompt + long term memory
            messages=self.identity_memstore.to_jsonlist
            + self.longterm_memstore.to_jsonlist(),
            temperature=0.5,
        )
        completion = response["choices"][0]["message"]
        mem_chunk = MemoryChunk.load_from_json_string(completion)
        self.longterm_memstore.add_chunk_to_memory(mem_chunk)
