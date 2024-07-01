from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Literal, Optional, Self, TYPE_CHECKING

from pydantic import BaseModel, model_validator
import logging

if TYPE_CHECKING:
    from app.agents.abstract_agent import Agent


logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
fh = logging.FileHandler(f"logs/{__name__}.log")
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s \n %(message)s")
fh.setFormatter(formatter)
logger.addHandler(fh)


class FieldAction(BaseModel):
    """
    The action to be performed on a field.
    The field submission can be any of the types: text, audio, image, video
    Atleast one field must be provided.
    The custom validator on the model is used to do a liveness check and raise an error if no field is provided
    """

    text: Optional[str] = None
    audio: Optional[bytes] = None
    image: Optional[bytes] = None
    video: Optional[bytes] = None

    @model_validator(mode="after")
    def validate_fields(
        self,
    ) -> Self:
        if not any(self.model_dump().values()):
            raise ValueError("At least one field must be provided")
        return self


@dataclass
class Action:
    """
    Represents an action performed by the agent
    For the MVP, there is no distinction between action and event.
    The single action class will encompass both.
    """

    agent_id: str
    field_submission: FieldAction
    timestamp: datetime = datetime.now(tz=timezone.utc)


@dataclass
class RequestMessage:
    role: Literal["user", "assistant", "system"]
    content: str


class Timeline:
    """
    The timeline is a queue of actions
    It has a list of observers

    Thoughts to ponder:
    - Is a private timeline equivalent to episodic memory?

    Future functionality:
    - timeline will be a collection of events. God converts an action to an event
    - I am yet unclear on the distinction between action and event
    """

    def __init__(self, owner: "Agent"):
        self.owner = owner
        self.timeline: list[Action] = []
        self.players: list["Agent"] = []

    def add_player(self, player: "Agent"):
        self.players.append(player)
        logging.debug(f"added player {player.id} to timeline")
        logging.debug(f"timeline players: {[agent.id for agent in self.players]}")

    def register_action(self, action: Action, notify_observers: bool = True):
        """Performs the following functions:
        - checks if action is valid
        - if valid, appends the action to the timeline
        - notifies observers of the action update to the timeline

        Args:
            action (Action): the Action that needs to be added to the timeline
            notify_observers (bool): should the registered action notify the other observers?
        """
        logging.debug(f"submitting action: {action} to timeline")
        validated_action = self.validate_action(action)
        logging.debug(f"action validated")
        logging.debug(f"timeline pre action addition")
        logging.debug(self.timeline)
        self.timeline.append(validated_action)
        logging.debug(f"added event to timeline")
        logging.debug(f"timeline post action addition")
        logging.debug(self.timeline)
        if notify_observers:
            self.notify_observers_of_action(action)

    def validate_action(self, action: Action):
        """
        Validate the action before registering it
        - Check if the agent is a participant
        - Check if the action is valid
        """
        if (
            action.agent_id not in [agent.id for agent in self.players]
            and action.agent_id != self.owner.id
        ):
            logging.debug(f"action agent id: {action.agent_id}")
            logging.debug(f"players: {self.players}")
            logging.debug(f"timeline players: {[agent.id for agent in self.players]}")
            raise ValueError("Agent is not a participant")

        if not action.field_submission:
            raise ValueError("Action has no field submission")

        return action

    def notify_observers_of_action(self, action: Action):
        """
        Notify observers of the timeline
        Notify only those who did not initiate the action
        """
        players_to_notify = [
            agent for agent in self.players if agent.id != action.agent_id
        ]
        # TODO make this async
        [player.receive_notification(action) for player in players_to_notify]
