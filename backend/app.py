from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from routes import routes
from database import Base, engine
from core.security import get_user_from_token
from database import SessionLocal
import asyncio

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
        print(f"Authenticated WebSocket: {user.email}")
    except HTTPException:
        await websocket.close(code=1008)
        return

    try:
        while True:
            data = await websocket.receive_text()
            words = data.split()

            for word in words:
                await websocket.send_text(word)
                await asyncio.sleep(0.08)
    except WebSocketDisconnect as e:
        print(f"Client disconnected {e}")
    except Exception as e:
        print(f"WebSocket error: {e}")
        await websocket.close()
