from langchain.schema import HumanMessage
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from routes import routes
from database import Base, engine
from core.security import get_user_from_token
from database import SessionLocal
from agent.graph import app as rag_app
import asyncio, uuid

app = FastAPI()

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
            cid = str(uuid.uuid4())
            config = {
                "configurable": {
                    "thread_id": thread_id,
                    "checkpoint_ns": "default",
                    "checkpoint_id": cid,
                }
            }
            response = await rag_app.ainvoke({"messages": [human_message]}, config=config)
            print(response)

            # for word in words:
            #     await websocket.send_text(word)
            #     await asyncio.sleep(0.08)
    except WebSocketDisconnect as e:
        print(f"Client disconnected {e}")
    except Exception as e:
        print(f"WebSocket error: {e}")
        await websocket.close()
