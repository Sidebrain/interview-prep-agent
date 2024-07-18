import asyncio
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Literal, Optional, Self, TYPE_CHECKING

from fastapi import WebSocket
from pydantic import BaseModel, model_validator, ConfigDict, AliasGenerator
from pydantic.alias_generators import to_camel
import logging

from app.types.type_repo import PossibleAgentRoleType

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

    agent: "Agent"
    field_submission: FieldAction
    timestamp: datetime = datetime.now(tz=timezone.utc)


### Websocket types



class WebsocketMessage(BaseModel):
    """
    Represents a message sent over the websocket
    """

    timeline_owner: PossibleAgentRoleType
    role: PossibleAgentRoleType
    content: str

    model_config = ConfigDict(
        populate_by_name=True,
        alias_generator=to_camel
        )
    


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
        self.timestream: list[Action] = []
        self.players: list["Agent"] = []
        self._ws = None

    @property
    def websocket(self):
        return self._ws

    @websocket.setter
    def websocket(self, ws: WebSocket):
        self._ws = ws

    def add_player(self, player: "Agent"):
        self.players.append(player)
        logging.debug(f"added player {player.id} to timeline")
        logging.debug(f"timeline players: {[agent.id for agent in self.players]}")

    async def transform_and_send_action_via_websocket(self, action: Action):
        """
        Prepare and send the message over the websocket
        """
        # submitting the generated text to the websocket
        # print(f"action field submission text: {len(action.field_submission.text)}")
        print(f"SENDING via websocket")
        websocket_message = WebsocketMessage(
            timeline_owner=self.owner.role,
            role=action.agent.role,
            content=action.field_submission.text,
        )
        json_message = websocket_message.model_dump_json(by_alias=True)
        print(f"{"-"*20} json message being sent:\n {json_message}")
        # await self.websocket.send_text(json_message)
        await self.websocket.send_text(action.field_submission.text)
        print(f"SENT via websocket")

    async def register_action(self, action: Action, notify_observers: bool = False):
        """Performs the following functions:
        - checks if action is valid
        - if valid, appends the action to the timeline
        - notifies observers of the action update to the timeline

        Args:
            action (Action): the Action that needs to be added to the timeline
            notify_observers (bool): should the registered action notify the other observers?
        """
        validated_action = self.validate_action(action)
        logging.debug(f"action validated")
        self.timestream.append(validated_action)
        logging.debug(f"added event to timeline")
        await self.transform_and_send_action_via_websocket(validated_action)
        if notify_observers:
            logging.debug(f"notifying observers of action")
            await self.notify_observers_of_action()

    def validate_action(self, action: Action):
        """
        Validate the action before registering it
        - Check if the agent is a participant
        - Check if the action is valid
        """
        if (
            action.agent.id not in [agent.id for agent in self.players]
            and action.agent.id != self.owner.id
        ):
            logging.debug(f"action agent id: {action.agent.id}")
            logging.debug(f"players: {self.players}")
            logging.debug(f"timeline players: {[agent.id for agent in self.players]}")
            raise ValueError("Agent is not a participant")

        if not action.field_submission:
            raise ValueError("Action has no field submission")

        return action

    async def notify_observers_of_action(self):
        """
        Notify observers of the timeline
        Notify only those who did not initiate the action

        Initiator is the agent who initiated the last submission to the timeline
        If none, then raise error
        """
        if not self.timestream:
            raise ValueError("No action to notify observers of")
        action = self.timestream[-1]
        players_to_notify = [
            agent for agent in self.players if agent.id != action.agent.id
        ]
        # TODO make this async
        await asyncio.gather(
            *[player.receive_notification() for player in players_to_notify]
        )
