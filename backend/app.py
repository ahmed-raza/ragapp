from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import routes
from database import Base, engine

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
