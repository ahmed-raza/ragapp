from .state import AgentState
from .tools import get_llm

def process_message_node(state: AgentState) -> AgentState:
    """
    Node to process an incoming message.
    This could involve calling an LLM, performing some logic, etc.
    """
    print("---EXECUTING PROCESS MESSAGE NODE---")
    messages = state["messages"]
    latest_message = messages[-1] if messages else "No message"

    llm = get_llm(temperature=0.5)

    response = llm.invoke(messages)

    state["messages"] = state["messages"] + [response]

    return state
