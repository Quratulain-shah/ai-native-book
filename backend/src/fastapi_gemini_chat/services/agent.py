import asyncio
import json
import logging
from typing import Optional, Dict, Any, List
from openai import OpenAI
from pydantic import BaseModel
import httpx
from ..config import settings


logger = logging.getLogger(__name__)


def function_tool(func):
    """Decorator to mark a function as a tool for the AI agent."""
    func.is_tool = True
    return func


class GroqAgent:
    """
    Agent that uses OpenAI SDK to connect to Groq's API with tool support.

    This class configures the OpenAI client to work with Groq's API
    using the OpenAI-compatible endpoint and supports function calling.
    """

    def __init__(self):
        """Initialize the Groq agent with proper configuration."""
        self.model = settings.groq_model
        self.client = OpenAI(
            base_url=settings.groq_base_url,
            api_key=settings.groq_api_key,
            # Configure HTTP client with reasonable timeouts
            http_client=httpx.Client(
                timeout=httpx.Timeout(30.0, connect=5.0),
                follow_redirects=True,
            )
        )
        # Initialize tools registry
        self.tools = {}
        self.tool_functions = {}

    def register_tool(self, name: str, description: str, parameters: Dict[str, Any], func):
        """
        Register a function as a tool for the agent.

        Args:
            name: Name of the tool
            description: Description of what the tool does
            parameters: JSON schema for the tool's parameters
            func: The function to call
        """
        self.tools[name] = {
            "type": "function",
            "function": {
                "name": name,
                "description": description,
                "parameters": parameters
            }
        }
        self.tool_functions[name] = func

    async def generate_response(
        self,
        message: str,
        conversation_id: Optional[str] = None,
        user_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Generate a response from the model, with support for function calling.

        Args:
            message: The user's input message
            conversation_id: Optional conversation identifier for context
            user_id: Optional user identifier
            metadata: Optional additional data

        Returns:
            Dictionary containing the response and metadata
        """
        try:
            # Prepare the messages array for the chat completion
            messages = [{"role": "user", "content": message}]

            # Add system message if needed for context
            if metadata and metadata.get("system_prompt"):
                messages.insert(0, {"role": "system", "content": metadata["system_prompt"]})

            # Prepare tools if available
            tools = list(self.tools.values()) if self.tools else None
            tool_choice = "auto" if tools else None

            # Make the API call asynchronously
            response = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: self.client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    temperature=0.7,
                    max_tokens=1000,
                    top_p=0.9,
                    tools=tools,
                    tool_choice=tool_choice
                )
            )

            # Check if the model wants to call a function
            response_message = response.choices[0].message

            # If there are tool calls, execute them
            if response_message.tool_calls:
                # Add the assistant's message to the conversation
                messages.append(response_message)

                # Execute each tool call
                for tool_call in response_message.tool_calls:
                    function_name = tool_call.function.name
                    function_to_call = self.tool_functions.get(function_name)

                    if function_to_call:
                        try:
                            # Parse the function arguments
                            function_args = json.loads(tool_call.function.arguments)

                            # Execute the function asynchronously
                            if asyncio.iscoroutinefunction(function_to_call):
                                function_response = await function_to_call(**function_args)
                            else:
                                function_response = await asyncio.get_event_loop().run_in_executor(
                                    None,
                                    lambda: function_to_call(**function_args)
                                )

                            # Add function response to messages
                            messages.append({
                                "tool_call_id": tool_call.id,
                                "role": "tool",
                                "name": function_name,
                                "content": str(function_response),
                            })
                        except Exception as e:
                            logger.error(f"Error calling tool {function_name}: {str(e)}")
                            messages.append({
                                "tool_call_id": tool_call.id,
                                "role": "tool",
                                "name": function_name,
                                "content": f"Error: {str(e)}",
                            })

                # Get the final response after tool calls
                final_response = await asyncio.get_event_loop().run_in_executor(
                    None,
                    lambda: self.client.chat.completions.create(
                        model=self.model,
                        messages=messages,
                        temperature=0.7,
                        max_tokens=1000,
                        top_p=0.9
                    )
                )
                ai_response = final_response.choices[0].message.content
            else:
                # No tool calls, return the original response
                ai_response = response_message.content

            tokens_used = response.usage.total_tokens if response.usage else None

            return {
                "response": ai_response,
                "conversation_id": conversation_id or f"conv_{hash(message) % 10000}",
                "model_used": self.model,
                "tokens_used": tokens_used,
                "finish_reason": response.choices[0].finish_reason
            }

        except Exception as e:
            logger.error(f"Groq API error: {str(e)}", exc_info=True)
            raise RuntimeError(f"Failed to get response from Groq: {str(e)}")

    def validate_config(self) -> bool:
        """
        Validate that the agent is properly configured.

        Returns:
            True if configuration is valid, False otherwise
        """
        try:
            if not settings.groq_api_key:
                logger.error("GROQ_API_KEY is not configured")
                return False

            if not self.model:
                logger.error("GROQ_MODEL is not configured")
                return False

            return True
        except Exception as e:
            logger.error(f"Configuration validation failed: {str(e)}")
            return False


# Singleton instance
groq_agent = GroqAgent()