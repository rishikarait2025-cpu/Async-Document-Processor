Project Description
The Async Document Processor is a backend system built using FastAPI, Celery, Redis, and PostgreSQL that enables asynchronous processing of image-based documents. Users can upload documents, which are then processed in the background using OCR (Tesseract) to extract text. The system provides real-time processing updates, stores results in a database, and supports exporting data in JSON and CSV formats.

This project demonstrates an event-driven, scalable architecture commonly used in real-world document processing and AI-based pipelines.

Features
Upload image documents via API
Asynchronous processing using Celery
OCR-based text extraction using Tesseract
Real-time progress updates using Redis Pub/Sub
PostgreSQL database for storing document metadata
Export processed data in JSON and CSV format
Finalize processed documents

Architecture Overview
Client (API/Swagger UI) ↓ FastAPI Backend ↓ PostgreSQL (Stores document metadata) ↓ Redis (Message broker + Pub/Sub) ↓ Celery Worker (Background processing) ↓ Tesseract OCR (Text extraction engine)

Tech Stack
FastAPI (Backend framework)
PostgreSQL (Database)
Redis (Broker + real-time updates)
Celery (Asynchronous task queue)
Python Pillow (Image handling)
Tesseract OCR (Text extraction)

Setup Instructions
1. Clone Repository
git clone https://github.com/rishikarait2025-cpu/async-document-processor.git
cd async-document-processor
