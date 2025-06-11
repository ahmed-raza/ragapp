from langchain_openai import OpenAIEmbeddings
from langgraph.store.postgres import PostgresStore
from langgraph.store.memory import InMemoryStore
from psycopg_pool import ConnectionPool
from config import SQLALCHEMY_DATABASE_URL, SSL_MODE
from dotenv import load_dotenv
import os

load_dotenv()

connection_kwargs = {
    "autocommit": True,
    "prepare_threshold": 0,
    "sslmode": SSL_MODE
}

embeddings = OpenAIEmbeddings(model="text-embedding-3-small", openai_api_key=os.getenv("OPENAI_API_KEY"))

index = {
    "dims": 1536,
    "embed": embeddings,
    "fields": ["text"],
}

pool = ConnectionPool(conninfo=SQLALCHEMY_DATABASE_URL, kwargs=connection_kwargs, min_size=1, max_size=5)

def get_connection():
    """
    Get a connection from the connection pool.
    """
    return pool.getconn()

try:
    with get_connection() as conn:
        store = PostgresStore(
            conn,
            index=index
        )
        store.setup()
        print(f"✅ PostgreSQL Store initialized successfully! {store}")
except Exception as e:
    print(f"Failed to initialize a store: {e}")
    print("Falling back to InMemoryStore")
    store = InMemoryStore(index=index)
