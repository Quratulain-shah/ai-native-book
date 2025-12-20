from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
import traceback

from .config import settings
from .api.routes import chat
from .rag.api import include_rag_router
from .rag.agent_integration import initialize_rag_agent


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle application startup and shutdown."""
    # Startup
    logging.basicConfig(
        level=logging.INFO if not settings.api_debug else logging.DEBUG,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    logger = logging.getLogger(__name__)
    logger.info("Starting FastAPI application with Groq integration...")

    # Validate configuration
    from .services.agent import groq_agent
    if not groq_agent.validate_config():
        logger.error("Configuration validation failed - shutting down")
        raise RuntimeError("Invalid configuration - check environment variables")

    # Initialize RAG agent with search tools
    try:
        initialize_rag_agent()
        logger.info("RAG agent initialized with search tools")
    except Exception as e:
        logger.error(f"Failed to initialize RAG agent: {str(e)}")
        raise

    yield

    # Shutdown
    logger.info("Shutting down FastAPI application...")


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title="FastAPI Groq Chat API",
        description="A chat API powered by Groq's model through OpenAI SDK",
        version="0.1.0",
        lifespan=lifespan,
        debug=settings.api_debug
    )

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[origin.strip() for origin in settings.allowed_origins.split(",")] if settings.allowed_origins != "*" else ["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Custom exception handlers
    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException):
        logging.error(f"HTTPException: {exc.status_code} - {exc.detail}")
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": exc.detail,
                "error_code": f"HTTP_{exc.status_code}",
                "timestamp": __import__('datetime').datetime.utcnow().isoformat()
            }
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        logging.error(f"Unhandled exception: {str(exc)}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={
                "error": "An internal server error occurred",
                "error_code": "INTERNAL_ERROR",
                "timestamp": __import__('datetime').datetime.utcnow().isoformat(),
                "detail": str(exc) if settings.api_debug else None
            }
        )

    # Include routes
    app.include_router(chat.router, prefix="/api/v1", tags=["chat"])

    # Include RAG routes
    include_rag_router(app)

    return app


# Create the main application instance
app = create_app()


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "model": settings.groq_model}


# For running with uvicorn directly
def main():
    import uvicorn
    uvicorn.run(
        "backend.src.main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.api_debug,
        log_level="info" if not settings.api_debug else "debug"
    )


if __name__ == "__main__":
    main()