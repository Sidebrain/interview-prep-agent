from typing import Optional
import uuid
from app.buildspace import Action, FieldAction, Timeline


class Agent:
    def __init__(self, origin_timeline: Optional[Timeline]) -> None:
        self.id = f"agent-{uuid.uuid4()}"
        self.origin_timeline = self.initalize_participation_on_origin_timeline(
            origin_timeline
        )  # a origin timeline of None means the agent is the god agent
        self.timeline = Timeline(self)

    def initalize_participation_on_origin_timeline(self, origin_timeline: Timeline):
        if origin_timeline:
            origin_timeline.add_player(self)
        return origin_timeline

    def generate_action(self):
        # uses internal configuration to generate an output action
        action = Action(
            agent_id=self.id,
            field_submission=FieldAction(
                text="This is a test action",
                audio=None,
                image=None,
                video=None,
            ),
        )
        return action

    def receive_notification(self, action):
        # receives notification from the timeline
        print(f"---------- Agent {self.id} received notification for action {action}")

    def submit_to_private_timeline(self, action: Action):
        self.timeline.register_action(action)

    def submit_to_origin_timeline(self, action: Action):
        self.origin_timeline.register_action(action)

    def __call__(self):
        self.submit_to_private_timeline(self.generate_action())
        [self.origin_timeline.register_action(act) for act in self.timeline.timeline]
