from fastapi import FastAPI
from app.core.database import Base, engine
from app.models.document import Document
from app.api.documents import router as document_router
import json
from fastapi.responses import StreamingResponse
from app.core.redis_client import redis_client
from fastapi.middleware.cors import CORSMiddleware
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(document_router)

@app.get("/")
def root():
    return {"message": "backend is running"}

@app.get("/progress")
def stream_progress():
    pubsub = redis_client.pubsub()
    pubsub.subscribe("document_progress")

    def event_stream():
        for message in pubsub.listen():
            if message["type"] == "message":
                yield f"data: {message['data']}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream"
    )