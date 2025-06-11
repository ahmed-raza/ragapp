from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages
from typing import TypedDict, Annotated, List, Sequence
import operator

class AgentState(TypedDict):
    """
    Represents the state of our agent.

    Attributes:
        messages: A list of messages exchanged in the conversation.
    """
    messages: Annotated[Sequence[BaseMessage], add_messages]
    thread_id: str
