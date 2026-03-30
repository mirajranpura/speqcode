"""Strands Agent configuration for the Shopping Assistant Chatbot."""

from strands import Agent
from strands.models import BedrockModel

from tools import (
    get_products,
    get_product_details,
    get_cart,
    add_to_cart,
    update_cart_item,
    remove_from_cart,
)

SYSTEM_PROMPT = """You are a friendly and helpful shopping assistant for the Emoji Shop, an online store that sells fun emoji-themed products.

Your job is to help customers browse products, get product details and reviews, and manage their shopping cart through natural conversation.

Guidelines:
- Always use your tools to look up product information and cart contents. Never fabricate or guess product names, prices, or availability.
- When showing product information, format it clearly with the product name, emoji, price, and description.
- When presenting multiple products, use a concise list format so customers can scan options quickly.
- If a customer asks something unrelated to shopping (e.g., weather, trivia, personal advice), politely let them know you're here to help with shopping and redirect the conversation.
- After cart operations (add, update, remove), confirm what you did and summarize the current cart state.
- Be conversational, concise, and helpful. Keep responses focused and easy to read.
"""

TOOLS = [
    get_products,
    get_product_details,
    get_cart,
    add_to_cart,
    update_cart_item,
    remove_from_cart,
]


def get_agent_response(message, history):
    """Invoke the Strands Agent with a message and conversation history.

    Args:
        message: The user's message string.
        history: A list of dicts from sessions.py, e.g.
                 [{"role": "user", "content": "Hello"}, {"role": "assistant", "content": "Hi!"}]

    Returns:
        The agent's response as a string.
    """
    # Convert session history to Strands message format
    strands_messages = []
    for msg in history:
        strands_messages.append({
            "role": msg["role"],
            "content": [{"text": msg["content"]}],
        })

    bedrock_model = BedrockModel(model_id="us.amazon.nova-pro-v1:0")

    agent = Agent(
        model=bedrock_model,
        system_prompt=SYSTEM_PROMPT,
        tools=TOOLS,
        messages=strands_messages,
    )

    result = agent(message)
    return str(result)
