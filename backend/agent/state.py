from langchain_core.messages import BaseMessage
from typing import TypedDict, Annotated, List
import operator

class AgentState(TypedDict):
    """
    Represents the state of our agent.

    Attributes:
        messages: A list of messages exchanged in the conversation.
    """
    messages: Annotated[List[BaseMessage], operator.add]
