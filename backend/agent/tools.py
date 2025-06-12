from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from .vector_search import DocumentSearchTool
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
def use_document_search_tool(state: AgentState):
    """
    Tool to search user-uploaded documents.
    This tool takes the current state, extracts the query and user ID,
    and performs a search using the DocumentSearchTool.
    """
    query = state["input"]
    user_id = state["user_id"]
    docs_dir = f"{UPLOAD_DIR}/{user_id}"

    tool = DocumentSearchTool(docs_dir=docs_dir, db_dir=f"./chroma_db/{user_id}")
    results = tool.search(query)
    return {"search_results": results}

tools = [
    use_document_search_tool,
]
