from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from .state import AgentState
from .tools import get_llm, tools

def process_message_node(state: AgentState) -> AgentState:
    """
    Node to process an incoming message.
    This could involve calling an LLM, performing some logic, etc.
    """
    print("---EXECUTING PROCESS MESSAGE NODE---")

    system_prompt = """
        You are an AI assistant responsible for generating reports strictly based on user-uploaded documents. You must follow these rules:

        1. Never generate or assume any information that is not explicitly found in the documents.
        2. Always rely on the documents as the sole source of truth. Do not use prior knowledge or outside facts.
        3. If you need information to answer a question or generate part of a report, call the use_document_search_tool with a precise and well-formed query.
        4. Combine and summarize the results from the document search to construct your response. If the documents do not contain the needed information, clearly say so.
        5. Be precise, factual, and grounded in the retrieved data. Do not speculate or fill in gaps.

        You have access to the use_document_search_tool, which returns content from the user's private document set.
    """

    prompt_template = ChatPromptTemplate.from_messages(
        [
            ("system", system_prompt),
            MessagesPlaceholder(variable_name="messages"),
        ]
    )

    messages = state["messages"]
    latest_message = messages[-1] if messages else "No message"

    llm = get_llm(temperature=0.5)
    chain = prompt_template | llm.bind_tools(tools)
    user_id = state["user_id"]
    print(f"---STATE USER ID: {user_id}---")

    response = chain.invoke(messages)

    state["messages"] = state["messages"] + [response]

    return state
