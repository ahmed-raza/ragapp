from psycopg import AsyncConnection
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver
from langgraph.checkpoint.memory import InMemorySaver
from config import SQLALCHEMY_DATABASE_URL, SSL_MODE

async def table_exists(connection, table_name):
    """Check if a table exists in the database."""
    query = f"""
        SELECT EXISTS (
            SELECT FROM information_schema.tables
            WHERE table_name = '{table_name}'
        );
    """
    async with connection.cursor() as cur:
        await cur.execute(query)
        result = await cur.fetchone()
        return result[0]

async def get_checkpointer():
    """
    Initializes a checkpointer with AsyncPostgresSaver.
    Falls back to MemorySaver if the PostgreSQL connection fails.
    """
    try:
        connection_kwargs = {
            "autocommit": True,
            "prepare_threshold": 0,
            "sslmode": SSL_MODE,
        }

        connection = await AsyncConnection.connect(SQLALCHEMY_DATABASE_URL, **connection_kwargs)
        checkpointer = AsyncPostgresSaver(connection)
        if not await table_exists(connection, "checkpoint_writes"):
            print("🚀 Table `checkpoint_writes` does NOT exist. Running setup...")
            await checkpointer.setup()

        print(f"✅ PostgreSQL Checkpointer initialized successfully! {checkpointer}")
        return checkpointer

    except Exception as e:
        print(f"Unable to connect to PostgreSQL: {e}")
        print("Falling back to MemorySaver")
        return InMemorySaver()

async def get_past_messages(checkpointer, config):
    thread_id = config["configurable"]["thread_id"]
    print(f"[get_past_messages] Fetching past messages for thread: {thread_id}")
    print(f"[get_past_messages] Config: {config}")
    messages = []
    try:
        past_state_tuple = await checkpointer.aget_tuple({"configurable": {"thread_id": thread_id}})
        print(f"[get_past_messages] Retrieved past state tuple: {past_state_tuple}")
        if not past_state_tuple:
            return []

        past_state = past_state_tuple.checkpoint

        if not past_state or "channel_values" not in past_state or "messages" not in past_state["channel_values"]:
            return []

        past_messages = past_state["channel_values"]["messages"]

        if not past_messages:
             return []

        messages = past_messages
    except Exception as e:
        print(f"[get_past_messages] ERROR: {e}")
        messages = [] # Ensure empty list is returned on error

    return messages
