import asyncio
from typing import Optional
import uuid
from app.llms.openai_llm import OpenAI
from app.llms.types import Intelligence

from app.buildspace import Action, FieldAction, Timeline

import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
fh = logging.FileHandler(f"logs/{__name__}.log")
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s \n %(message)s")
fh.setFormatter(formatter)
logger.addHandler(fh)


class Agent:
    def __init__(
        self,
        origin_timeline: Optional[Timeline],
        purpose_file_path: Optional[str],
        intelligence: Intelligence = None,
        max_iterations: int = 10,
    ) -> None:
        self.id = f"agent-{uuid.uuid4()}"
        self.origin_timeline = self.initalize_participation_on_origin_timeline(
            origin_timeline
        )  # a origin timeline of None means the agent is the god agent
        self.timeline = Timeline(self)
        self.intelligence = intelligence
        self.max_iterations = max_iterations
        self.purpose_file_path = purpose_file_path
        self.model = OpenAI()

    async def __call__(self):
        self.submit_to_private_timeline(await self.generate_action())
        [self.origin_timeline.register_action(act) for act in self.timeline.timestream]

    def initalize_participation_on_origin_timeline(self, origin_timeline: Timeline):
        if origin_timeline:
            origin_timeline.add_player(self)
        return origin_timeline

    def construct_purpose_system_prompt(self) -> dict[str, str]:
        with open(self.purpose_file_path, "r") as f:
            return {
                "role": "system",
                "content": f.read(),
            }

    async def generate_action(self, message_list: list[Action]):
        # uses internal configuration to generate an output action
        req = await self.model.build_request(messages=message_list)
        res = await self.model.get_completion_response(req)
        action = Action(
            agent_id=self.id,
            field_submission=FieldAction(
                text=res.choices[0].message.content,
                audio=None,
                image=None,
                video=None,
            ),
        )
        return action

    async def receive_notification(self):
        # receives notification from the timeline
        # checks with the god agent if they can proceed
        while self.is_request_approved_by_god():
            # updates the agent's memory by pulling the timeline
            updated_timeline = await self.pull_origin_timeline()
            logger.debug(
                f"Pulling timeline, got {len(updated_timeline.timestream)} actions"
            )
            # reflects the action
            message_list = await self.reflect_timestream_objects(
                updated_timeline.timestream
            )
            message_list = [self.construct_purpose_system_prompt()] + message_list
            logger.debug(
                f"Constructed message list being sent to AI, length: {len(message_list)}"
            )
            # sends to the llm and gets response
            generated_action = await self.generate_action(message_list)
            logger.debug(
                f"Agent {self.id}\naction: {generated_action.field_submission.text}"
            )
            # submits to the timeline
            await self.submit_to_origin_timeline(generated_action)
            await self.send_update_notification_to_the_timeline(generated_action)

    async def submit_to_private_timeline(self, action: Action):
        await self.timeline.register_action(action)

    async def submit_to_origin_timeline(self, action: Action):
        logger.debug(f"New action submitted to origin timeline")
        await self.origin_timeline.register_action(action)

    async def reflect_timestream_objects(
        self, action_list: list[Action]
    ) -> list[Action]:
        """
        takes the timeline, and constructs a message list by first
        - if agent id is self, then role is `assistant` (since it is continuing the conversation, and generating the response. Hence the assistant role)
        - if agent id is not self, then role is `user`
        """
        message_list = []
        for action in action_list:
            if action.agent_id == self.id:
                message_list.append(
                    {"role": "assistant", "content": action.field_submission.text}
                )
            else:
                message_list.append(
                    {"role": "user", "content": action.field_submission.text}
                )
        return message_list

    async def pull_origin_timeline(self) -> Timeline:
        """Returns the timeline of the agent's origin.
        Usually used after a notification is received that the timeline has been updated.
        """
        return self.origin_timeline

    async def send_update_notification_to_the_timeline(self, action: Action):
        "the timeline will take care of updating the receiving agents"
        logger.debug(f"Notification to update all observers sent to origin timeline")
        await self.origin_timeline.notify_observers_of_action(action)

    def is_request_approved_by_god(self):
        "check if any breakout conditin is reached."
        if len(self.origin_timeline.timestream) > self.max_iterations:
            logger.debug(f"God agent has reached max iterations limit. Request denied.")
            return False
        logger.debug(f"Request approved by god agent")
        return True
