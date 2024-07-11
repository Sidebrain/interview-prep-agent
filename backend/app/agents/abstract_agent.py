import asyncio
from datetime import datetime
from typing import Literal, Optional
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
    """
    Represents an agent that participates in a timeline-based conversation.

    Attributes:
        id (str): The unique identifier of the agent.
        origin_timeline (Optional[Timeline]): The origin timeline of the agent. If None, the agent is the god agent.
        purpose_file_path (Optional[str]): The file path to the purpose system prompt file.
        intelligence (Intelligence): The intelligence level of the agent.
        max_iterations (int): The maximum number of iterations the agent can participate in the timeline.
        model (OpenAI): The OpenAI model used by the agent.

    Methods:
        __init__(self, origin_timeline, purpose_file_path, intelligence, max_iterations):
            Initializes a new instance of the Agent class.
        __call__(self):
            Calls the agent, submitting the generated action to the private timeline and registering actions to the origin timeline.
        initalize_participation_on_origin_timeline(self, origin_timeline):
            Initializes the agent's participation on the origin timeline.
        construct_purpose_system_prompt(self):
            Constructs the purpose system prompt dictionary from the purpose file.
        generate_action(self, message_list):
            Generates an action using the internal configuration and the given message list.
        receive_notification(self):
            Receives a notification from the timeline and proceeds if approved by the god agent.
        submit_to_private_timeline(self, action):
            Submits the action to the private timeline.
        submit_to_origin_timeline(self, action):
            Submits the action to the origin timeline.
        reflect_timestream_objects(self, action_list):
            Reflects the timestream objects and constructs a message list.
        pull_origin_timeline(self):
            Pulls the agent's origin timeline.
        send_update_notification_to_the_timeline(self, action):
            Sends an update notification to the origin timeline.
        is_request_approved_by_god(self):
            Checks if the request is approved by the god agent.
    """

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
        """
        Calls the agent, submitting the generated action to the private timeline and registering actions to the origin timeline.
        """
        self.submit_to_private_timeline(await self.generate_action())
        [self.origin_timeline.register_action(act) for act in self.timeline.timestream]

    def initalize_participation_on_origin_timeline(self, origin_timeline: Timeline):
        """
        Initializes the agent's participation on the origin timeline.

        Args:
            origin_timeline (Timeline): The origin timeline.

        Returns:
            Timeline: The updated origin timeline.
        """
        if origin_timeline:
            origin_timeline.add_player(self)
        return origin_timeline

    def construct_purpose_system_prompt(self) -> dict[str, str]:
        """
        Constructs the purpose system prompt dictionary from the purpose file.

        Returns:
            dict[str, str]: The purpose system prompt dictionary.
        """
        with open(self.purpose_file_path, "r") as f:
            return {
                "role": "system",
                "content": f.read(),
            }

    async def generate_action(self, message_list: list[Action]):
        """
        Generates an action using the internal configuration and the given message list.

        Args:
            message_list (list[Action]): The list of previous global actions.

        Returns:
            Action: The generated action.
        """
        req = await self.model.build_request(messages=message_list)
        res = await self.model.get_completion_response(req)
        print("response from llm", res)
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
        """
        Receives a notification from the timeline and proceeds if approved by the god agent.
        """
        while self.is_request_approved_by_god():
            updated_timeline = await self.pull_origin_timeline()
            logger.debug(
                f"Pulling timeline, got {len(updated_timeline.timestream)} actions"
            )
            message_list = await self.reflect_timestream_objects(
                updated_timeline.timestream
            )
            message_list = [self.construct_purpose_system_prompt()] + message_list
            logger.debug(
                f"Constructed message list being sent to AI, length: {len(message_list)}"
            )
            generated_action = await self.generate_action(message_list)
            logger.debug(
                f"Agent {self.id}\naction: {generated_action.field_submission.text}"
            )
            await self.submit_to_origin_timeline(generated_action)
            await self.send_update_notification_to_the_timeline(generated_action)

    async def submit_to_private_timeline(self, action: Action):
        """
        Submits the action to the private timeline.

        Args:
            action (Action): The action to be submitted.
        """
        await self.timeline.register_action(action)

    async def submit_to_origin_timeline(self, action: Action):
        """
        Submits the action to the origin timeline.

        Args:
            action (Action): The action to be submitted.
        """
        logger.debug(f"New action submitted to origin timeline")
        await self.origin_timeline.register_action(action)

    async def reflect_timestream_objects(
        self, action_list: list[Action]
    ) -> list[Action]:
        """
        Reflects the timestream objects and constructs a message list.

        Args:
            action_list (list[Action]): The list of actions.

        Returns:
            list[Action]: The reflected message list.
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
        """
        Pulls the agent's origin timeline.

        Returns:
            Timeline: The agent's origin timeline.
        """
        return self.origin_timeline

    async def send_update_notification_to_the_timeline(self, action: Action):
        """
        Sends an update notification to the origin timeline.

        Args:
            action (Action): The action to be notified.
        """
        logger.debug(f"Notification to update all observers sent to origin timeline")
        await self.origin_timeline.notify_observers_of_action(action)

    def is_request_approved_by_god(self):
        """
        Checks if the request is approved by the god agent.

        Returns:
            bool: True if the request is approved, False otherwise.
        """
        if len(self.origin_timeline.timestream) > self.max_iterations:
            logger.debug(f"God agent has reached max iterations limit. Request denied.")
            return False
        logger.debug(f"Request approved by god agent")
        return True
