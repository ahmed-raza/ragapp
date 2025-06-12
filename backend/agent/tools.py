from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langgraph.prebuilt import InjectedState
from typing import Annotated
from .vector_search import VectorSearch
from config import UPLOAD_DIR
from .state import AgentState

def get_llm(temperature: float = 0.5):
    """Helper function to get the appropriate LLM based on environment settings"""

    return ChatOpenAI(
            model="gpt-4.1-2025-04-14",
            temperature=temperature,
            streaming=True,
        )

@tool
def use_document_search_tool(query: str, state: Annotated[AgentState, InjectedState]):
    """
    Tool to search user-uploaded documents.
    This tool takes the query parameter,
    and performs a search using the VectorSearch.
    """
    user_id = state["user_id"]
    docs_dir = f"{UPLOAD_DIR}/{user_id}"

    print(f"---SEARCHING DOCUMENTS IN {docs_dir} FOR USER {user_id} WITH QUERY: {query}---")

    tool = VectorSearch(docs_dir=docs_dir, db_dir=f"./chroma_db/{user_id}")
    results = tool.search(query)

    if not results:
        print(f"---NO RELEVANT DOCUMENTS FOUND FOR USER {user_id}---")
        return "No relevant documents found for the query."

    # Format results as a plain string
    formatted = "\n\n".join([f"Document {i+1}:\n{doc}" for i, doc in enumerate(results)])

    print(f"---FOUND RESULTS FOR USER {user_id}")

    return formatted

tools = [
    use_document_search_tool,
]
