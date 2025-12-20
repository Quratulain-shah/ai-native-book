"""RAG Agent Integration - Register search tools with the main agent."""
from ..services.agent import groq_agent
from .search import search_textbook, search_textbook_schema


def initialize_rag_agent():
    """Initialize the RAG agent with search tools."""
    # Register the search_textbook tool with the agent
    groq_agent.register_tool(
        name=search_textbook_schema["name"],
        description=search_textbook_schema["description"],
        parameters=search_textbook_schema["parameters"],
        func=search_textbook
    )


# Initialize the RAG tools when this module is imported
initialize_rag_agent()