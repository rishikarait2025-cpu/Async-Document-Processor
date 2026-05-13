import time
from app.core.redis_client import publish_progress
from app.core.database import SessionLocal
from app.models.document import Document
from app.workers.celery_app import celery_app
import pytesseract
from PIL import Image

def update_status(db, doc, status):
    doc.status = status
    db.commit()

    publish_progress(doc.id, status)


@celery_app.task
def process_document(document_id: int):
    db = SessionLocal()
    document = None

    try:
        document = db.query(Document).filter(
            Document.id == document_id).first()

        if not document:
            return

        update_status(db, document, "processing")
        time.sleep(2)

        update_status(db, document, "parsing_started")
        time.sleep(2)

        update_status(db, document, "parsing_completed")

        update_status(db, document, "extraction_started")

        # OCR extraction
        image_path = f"uploads/{document.filename}"

        image = Image.open(image_path)

        extracted_text = pytesseract.image_to_string(image)

        document.extracted_text = extracted_text

        db.commit()

        print(extracted_text)

        time.sleep(2)

        update_status(db, document, "extraction_completed")

        update_status(db, document, "completed")

    except Exception:
        if document:
            document.status = "failed"
            db.commit()
        raise

    finally:
        db.close()
