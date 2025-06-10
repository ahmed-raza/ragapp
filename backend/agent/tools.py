from langchain_community.chat_models import ChatOpenAI

def get_llm(temperature: float = 0.5):
    """Helper function to get the appropriate LLM based on environment settings"""

    return ChatOpenAI(
            model="gpt-4.1-2025-04-14",
            temperature=temperature,
            streaming=True,
        )
