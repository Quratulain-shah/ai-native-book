import os
import uuid

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.src.schemas import ContentChunk
from backend.src.database import SessionLocal, engine as db_engine # Assuming engine is exported from database.py
from qdrant_client import QdrantClient, models
from openai import OpenAI

# --- Configuration ---
# Load from environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
QDRANT_HOST = os.getenv("QDRANT_HOST", "localhost")
QDRANT_PORT = int(os.getenv("QDRANT_PORT", 6333))
QDRANT_COLLECTION_NAME = "book_content_chunks"

# OpenAI client initialization - keep using OpenAI for embeddings as requested
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROK_API_KEY = os.getenv("GROK_API_KEY")
GROQ_BASE_URL = os.getenv("GROQ_BASE_URL", "https://api.groq.com/openai/v1")
GROK_BASE_URL = os.getenv("GROK_BASE_URL", "https://api.groq.com/openai/v1")

# For embeddings, continue using OpenAI
client_openai = OpenAI(api_key=OPENAI_API_KEY)

# Qdrant client initialization
client_qdrant = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT, api_key=QDRANT_API_KEY)

# Ensure Qdrant collection exists
def ensure_qdrant_collection():
    try:
        client_qdrant.get_collection(collection_name=QDRANT_COLLECTION_NAME)
        print(f"Collection '{QDRANT_COLLECTION_NAME}' already exists.")
    except Exception as e:
        print(f"Collection '{QDRANT_COLLECTION_NAME}' not found, creating...")
        client_qdrant.create_collection(
            collection_name=QDRANT_COLLECTION_NAME,
            vectors_config=models.VectorParams(size=1536, distance=models.Distance.COSINE) # OpenAI embeddings are typically 1536 dimensions
        )
        print(f"Collection '{QDRANT_COLLECTION_NAME}' created.")

# Function to generate embeddings
def get_embedding(text):
    try:
        response = client_openai.embeddings.create(input=text, model="text-embedding-ada-002")
        return response.data[0].embedding
    except Exception as e:
        print(f"Error generating embedding: {e}")
        return None

# Function to parse and chunk Docusaurus content
def parse_and_chunk_content(docusaurus_dir):
    # Placeholder: In a real scenario, this would involve walking the Docusaurus build output directory,
    # parsing HTML files (e.g., using BeautifulSoup), extracting text content, and chunking it.
    # For this example, we'll simulate some content.
    print(f"Parsing content from {docusaurus_dir}...")
    # Simulate content chunks
    simulated_chunks = [
        {"content": "ROS 2 is a middleware for robot control. It uses nodes, topics, and services.", "source_location": "Module 1, ROS 2"},
        {"content": "Gazebo provides physics simulation, gravity, and collision detection.", "source_location": "Module 2, Gazebo"},
        {"content": "NVIDIA Isaac Sim offers photorealistic simulation and synthetic data generation.", "source_location": "Module 3, NVIDIA Isaac Sim"}
    ]
    return simulated_chunks

# Function to ingest data into DB and Qdrant
def ingest_data(docusaurus_dir):
    ensure_qdrant_collection()
    chunks = parse_and_chunk_content(docusaurus_dir)
    db = SessionLocal()

    try:
        for chunk_data in chunks:
            text_content = chunk_data["content"]
            source_location = chunk_data["source_location"]

            # Generate embedding
            embedding = get_embedding(text_content)
            if not embedding:
                continue

            # Save to Postgres
            new_chunk = ContentChunk(
                content=text_content,
                source_location=source_location,
                # qdrant_vector_id will be set after upserting to Qdrant
            )
            db.add(new_chunk)
            db.flush() # Flush to get the new_chunk.id

            # Save to Qdrant
            chunk_id = str(new_chunk.id) # Use the DB-generated UUID as Qdrant ID
            points = [
                models.PointStruct(
                    id=chunk_id,
                    vector=embedding,
                    payload={
                        "content": text_content,
                        "source_location": source_location,
                        "db_id": str(new_chunk.id) # Store DB ID for easy retrieval
                    }
                )
            ]
            client_qdrant.upsert(collection_name=QDRANT_COLLECTION_NAME, wait=True, points=points)

            # Update the DB with the Qdrant vector ID
            new_chunk.qdrant_vector_id = uuid.UUID(chunk_id)
            db.commit()
            print(f"Ingested chunk with ID: {chunk_id}")

    except Exception as e:
        db.rollback()
        print(f"Error during ingestion: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    # This is a placeholder for the actual Docusaurus build output directory.
    # In a real setup, you would need to know where Docusaurus outputs its static content.
    # For now, we'll use a dummy path.
    DOCUSAURUS_BUILD_DIR = "./path/to/docusaurus/build"
    if not os.path.exists(DOCUSAURUS_BUILD_DIR):
        print(f"Warning: Docusaurus build directory not found at {DOCUSAURUS_BUILD_DIR}. Using simulated content.")

    ingest_data(DOCUSAURUS_BUILD_DIR)
