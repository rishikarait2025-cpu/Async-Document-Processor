from sqlalchemy import Column, Integer, String, Text
from app.core.database import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    file_type = Column(String, nullable=True)
    file_size = Column(Integer, nullable=True)
    status = Column(String, default="queued")
    path = Column(String, nullable=True)

    extracted_text = Column(Text, nullable=True)