from langchain.schema import HumanMessage, AIMessage
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from routes import routes
from database import Base, engine
from core.security import get_user_from_token
from database import SessionLocal
from agent.graph import graph
from agent.memory import get_checkpointer, get_past_messages
from agent.store import store
import asyncio, uuid

@asynccontextmanager
async def lifespan(app: FastAPI):
    global rag_app
    global checkpointer
    checkpointer = await get_checkpointer()
    rag_app = graph.compile(checkpointer=checkpointer, store=store)
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

for route in routes:
    app.include_router(route)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    db = SessionLocal()
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=1008)
        return

    try:
        user = get_user_from_token(token, db)
        await websocket.accept()
        print(f"✅ Authenticated WebSocket: {user.email}")
    except HTTPException:
        await websocket.close(code=1008)
        return

    thread_id = "thread_" + str(user.id)
    print(f"🔗 WebSocket connected: {thread_id}")
    try:
        while True:
            data = await websocket.receive_text()
            human_message = HumanMessage(data)
            config = {
                "configurable": {
                    "thread_id": thread_id,
                }
            }
            past_messages = await get_past_messages(checkpointer, config)
            messages = past_messages + [human_message]
            cid = str(uuid.uuid4())
            config["configurable"]["checkpoint_ns"] = "default"
            config["configurable"]["checkpoint_id"] = cid
            ai_messages = []
            response = await rag_app.ainvoke({"messages": messages, "thread_id": thread_id}, config=config)

            for message in response.get("messages"):
                if isinstance(message, AIMessage) and message.response_metadata["finish_reason"] == "stop":
                    ai_messages.append(message)

            last_two_ai = ai_messages[-1:]
            word_lists = [msg.content.split() for msg in last_two_ai]
            all_words = [word for word_list in word_lists for word in word_list]

            for word in all_words:
                await websocket.send_text(word + " ")
                await asyncio.sleep(0.08)

            await websocket.send_text("[end]")
    except WebSocketDisconnect as e:
        print(f"Client disconnected {e}")
    except Exception as e:
        print(f"WebSocket error: {e}")
        await websocket.close()
