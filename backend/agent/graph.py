from langgraph.graph import StateGraph, START, END
from langgraph.prebuilt import ToolNode
from langchain_core.messages import ToolMessage
from .state import AgentState
from .nodes import process_message_node
from .tools import tools

def should_continue(state: AgentState) -> str:
    """
    Determines whether to continue processing, call a tool, or end.
    """
    print("---EXECUTING SHOULD_CONTINUE METHOD---")
    last_message = state["messages"][-1] if state["messages"] else None

    if last_message and getattr(last_message, "tool_calls", None):
        print("---TOOL CALL DETECTED---")
        return "call_tools"

    print("---NO TOOL CALL, ENDING---")
    return "end"

tool_node = ToolNode(tools)

graph = StateGraph(state_schema=AgentState)

graph.add_node("process_message", process_message_node)
graph.add_node("tools", tool_node)

graph.add_edge(START, "process_message")

graph.add_conditional_edges(
    "process_message",
    should_continue,
    {
        "call_tools": "tools",
        "continue": "process_message",
        "end": END,
    },
)

graph.add_edge("tools", "process_message")
