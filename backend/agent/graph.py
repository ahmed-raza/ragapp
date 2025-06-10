from langgraph.graph import StateGraph, START, END
from .state import AgentState
from .nodes import process_message_node

def should_continue(state: AgentState) -> str:
    """
    Conditional edge to determine if the graph should continue or end.
    """
    print("---EXECUTING SHOULD_CONTINUE METHOD---")
    latest_message = state["messages"][-1] if state["messages"] else None
    # if getattr(latest_message, "continue", None):
    #     print("---CONTINUING PROCESSING---")
    #     return "continue"
    # else:
    #     print("---ENDING PROCESSING---")
    return "end"

workflow = StateGraph(AgentState)

workflow.add_node("process_message", process_message_node)

workflow.add_edge(START, "process_message")
workflow.add_conditional_edges(
    "process_message",
    should_continue,
    {
        "continue": "process_message",
        "end": END
    }
)

app = workflow.compile()
