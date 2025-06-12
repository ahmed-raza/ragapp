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
        You are a document assistant. You must answer ONLY using information found in the user's documents.
        You are provided with a tool called `use_document_search_tool`. Always use this tool to search for relevant information in the documents — even if you believe you know the answer.
        Never guess or use prior knowledge. If you cannot find the answer in the documents via this tool, respond that the information is not available in the provided sources.

        Your job is to:
        - Search the documents using the tool
        - Wait for tool output
        - Generate a response only based on what the tool returns
        - When it comes to performing calculations, preparing reports or charts or tables basically for whatever reason you need data you must just rely on the documents sources.
        - You are free to create reports, summaries, tables, or insights etc. However, you must always use the `use_document_search_tool` to gather the necessary data from the user's documents.

        If a user asks a question like:
        "What test did I perform?"
        "Summarize the report."
        "Give me insights from my files."

        ALWAYS CALL THE TOOL TO RETRIEVE RELEVANT DATA. NEVER SKIP THE TOOL USAGE.
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

    response = chain.invoke({"messages": messages})

    state["messages"] = state["messages"] + [response]

    return state
