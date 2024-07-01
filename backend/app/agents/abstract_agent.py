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
        intelligence: Intelligence = None,
    ) -> None:
        self.id = f"agent-{uuid.uuid4()}"
        self.origin_timeline = self.initalize_participation_on_origin_timeline(
            origin_timeline
        )  # a origin timeline of None means the agent is the god agent
        self.timeline = Timeline(self)
        self.intelligence = intelligence
        self.model = OpenAI()

    def initalize_participation_on_origin_timeline(self, origin_timeline: Timeline):
        if origin_timeline:
            origin_timeline.add_player(self)
        return origin_timeline

    async def generate_action(self):
        # uses internal configuration to generate an output action
        req = await self.model.build_request(
            messages=[{"role": "user", "content": "Hello"}]
        )
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

        # action = Action(
        #     agent_id=self.id,
        #     field_submission=FieldAction(
        #         text="This is a test action",
        #         audio=None,
        #         image=None,
        #         video=None,
        #     ),
        # )
        return action

    def receive_notification(self, action):
        # receives notification from the timeline
        print(f"---------- Agent {self.id} received notification for action {action}")

    def submit_to_private_timeline(self, action: Action):
        self.timeline.register_action(action)

    def submit_to_origin_timeline(self, action: Action):
        self.origin_timeline.register_action(action)

    async def __call__(self):
        self.submit_to_private_timeline(await self.generate_action())
        [self.origin_timeline.register_action(act) for act in self.timeline.timeline]
