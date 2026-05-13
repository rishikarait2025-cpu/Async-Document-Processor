import json
import redis

redis_client = redis.Redis(
    host="localhost",
    port=6379,
    decode_responses=True
)


def publish_progress(document_id: int, status: str):
    event = {
        "document_id": document_id,
        "status": status
    }

    redis_client.publish("document_progress", json.dumps(event))