import logging
import uuid
from typing import Literal, Optional

from fastapi import WebSocket
import yaml

from app.buildspace import Action, FieldAction, Timeline
from app.llms.openai_llm import OpenAI
from app.llms.types import Intelligence
from app.types.type_repo import PossibleAgentRoleType

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
fh = logging.FileHandler(f"logs/{__name__}.log")
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s \n %(message)s")
fh.setFormatter(formatter)
logger.addHandler(fh)


class Agent:
    def __init__(
        self,
        role: PossibleAgentRoleType,
        origin_timeline: Optional[Timeline],
        purpose_file_path: Optional[str],
        websocket: Optional[WebSocket] = None,
        intelligence: Intelligence = None,
        max_iterations: int = 10,
        critique_enabled: bool = False,
    ) -> None:
        self.id = f"agent-{uuid.uuid4()}"
        self.role = role
        self.origin_timeline = self.initalize_participation_on_origin_timeline(
            origin_timeline
        )  # a origin timeline of None means the agent is the god agent
        self.timeline = Timeline(self, websocket=websocket)
        self.intelligence = intelligence
        self.max_iterations = max_iterations
        self.purpose_file_path = purpose_file_path
        self.critique_enabled = critique_enabled
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

    def construct_purpose_system_prompt(
        self, prompt_key: str = "system_prompt"
    ) -> dict[str, str]:
        """
        Constructs the purpose system prompt dictionary from the config yaml file.

        Returns:
            dict[str, str]: The purpose system prompt dictionary.
        """
        with open("config/agents_config.yaml", "r") as f:
            config = yaml.safe_load(f)
            return {
                "role": "system",
                "content": config[self.role][prompt_key],
            }

    async def generate_action(
        self, timestream_message_list: list[Action], prompt_key: str = "system_prompt"
    ) -> Action:
        # steps -> construct system prompt -> generate action
        message_list = [
            self.construct_purpose_system_prompt(prompt_key)
        ] + timestream_message_list

        logger.debug(
            f"Constructed message list being sent to AI, length: {len(message_list)}"
        )

        req = await self.model.build_request(messages=message_list)
        res = await self.model.get_completion_response(req)
        action = Action(
            agent=self,
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
        if not self.is_request_approved_by_god():
            return
        updated_timeline = await self.pull_origin_timeline()
        logger.debug(
            f"Pulling timeline, got {len(updated_timeline.timestream)} actions"
        )
        timestream_message_list = await self.reflect_timestream_objects(
            updated_timeline.timestream
        )
        generated_action = await self.generate_action(
            timestream_message_list=timestream_message_list, prompt_key="system_prompt"
        )
        if self.critique_enabled and len(timestream_message_list) > 1:
            generated_critique = await self.generate_action(
                timestream_message_list=timestream_message_list,
                prompt_key="critique_prompt",
            )
            await self.submit_to_private_timeline(generated_critique)
            logger.debug(f"Generated critique action")
        await self.origin_timeline.register_action(
            generated_action, notify_observers=False
        )
        print("Action generated, supposed to stop here")
        # await self.send_update_notification_to_the_timeline(generated_action)

    async def submit_to_private_timeline(self, action: Action):
        """
        Submits the action to the private timeline.

        Args:
            action (Action): The action to be submitted.
        """
        await self.timeline.register_action(action)

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
            if action.agent.id == self.id:
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
