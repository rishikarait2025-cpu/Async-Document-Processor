import os
from fastapi.encoders import jsonable_encoder
from fastapi import APIRouter, UploadFile, File
from app.core.database import SessionLocal
from app.models.document import Document
from app.workers.tasks import process_document

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/documents/upload")
async def upload_document(file: UploadFile = File(...)):
    db = SessionLocal()

    content = await file.read()

    file_path = f"{UPLOAD_DIR}/{file.filename}"

    with open(file_path, "wb") as f:
        f.write(content)

    document = Document(
        filename=file.filename,
        file_type=file.content_type,
        file_size=len(content),
        status="queued",
        path=file_path
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    process_document.delay(document.id)

    response = {
        "id": document.id,
        "filename": document.filename,
        "status": document.status,
        "file_type": document.file_type,
        "file_size": document.file_size
    }

    db.close()

    return response


@router.get("/documents")
def get_documents():
    db = SessionLocal()

    documents = db.query(Document).all()

    result = []

    for doc in documents:
        result.append({
            "id": doc.id,
            "filename": doc.filename,
            "status": doc.status,
            "file_type": doc.file_type,
            "file_size": doc.file_size,
            "extracted_text": doc.extracted_text
        })

    db.close()

    return jsonable_encoder(result)
