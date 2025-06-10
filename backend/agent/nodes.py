from .state import AgentState

def process_message_node(state: AgentState) -> AgentState:
    """
    Node to process an incoming message.
    This could involve calling an LLM, performing some logic, etc.
    """
    print("---EXECUTING PROCESS MESSAGE NODE---")
    messages = state["messages"]
    latest_message = messages[-1] if messages else "No message"

    # In a real scenario, you'd likely use an LLM here to process the message.
    # For demonstration, let's just append a processing confirmation.
    #processed_message = f"Processed: '{latest_message}'"
    new_messages = messages + [latest_message]

    return {"messages": new_messages}
