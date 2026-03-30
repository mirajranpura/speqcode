# Requirements Document

## Introduction

The Shopping Assistant Chatbot is an AI-powered conversational service for the Emoji Shop e-commerce application. Built as an independent Python service using the Strands Agents SDK with Amazon Bedrock Nova Pro as the underlying LLM, the chatbot helps customers browse products, get recommendations, read reviews, and manage their shopping cart through natural language conversation. The service exposes an HTTP API consumed by a popup chatbot UI on the frontend, and integrates with the existing Express.js backend API (port 4000) to perform shop operations.

## Glossary

- **Chatbot_Service**: The independent Python HTTP service built with Strands Agents SDK that processes user messages and returns AI-generated responses.
- **Strands_Agent**: The AI agent instance created using the Strands Agents SDK, configured with Bedrock Nova Pro as the model provider and equipped with tools for shop operations.
- **Backend_API**: The existing Express.js server running on port 4000 that provides REST endpoints for products, cart, and reviews.
- **Frontend_Chat_UI**: The popup chatbot widget embedded in the React frontend that sends user messages to the Chatbot_Service and displays responses.
- **Tool**: A callable function registered with the Strands_Agent that performs a specific shop operation (e.g., searching products, adding to cart) by calling the Backend_API.
- **Conversation_Session**: A stateful exchange between a user and the Strands_Agent, maintaining message history for context-aware responses.
- **Chat_Endpoint**: The HTTP POST endpoint exposed by the Chatbot_Service that accepts user messages and returns agent responses.

## Requirements

### Requirement 1: Chatbot Service Initialization

**User Story:** As a developer, I want the chatbot service to start as an independent Python HTTP server, so that it runs separately from the existing Express.js backend and can be developed and deployed independently.

#### Acceptance Criteria

1. THE Chatbot_Service SHALL start an HTTP server on a configurable port (default 8000).
2. THE Chatbot_Service SHALL initialize the Strands_Agent with Amazon Bedrock Nova Pro as the model provider.
3. WHEN the environment variable `AWS_ACCESS_KEY_ID` is set, THE Chatbot_Service SHALL use `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and optionally `AWS_SESSION_TOKEN` to authenticate with Amazon Bedrock.
4. WHEN the environment variable `AWS_BEARER_TOKEN_BEDROCK` is set, THE Chatbot_Service SHALL use the bearer token to authenticate with Amazon Bedrock.
5. IF neither AWS credential environment variables nor `AWS_BEARER_TOKEN_BEDROCK` is set, THEN THE Chatbot_Service SHALL exit with a descriptive error message indicating missing credentials.
6. THE Chatbot_Service SHALL enable CORS to allow requests from the Frontend_Chat_UI origin (http://localhost:3000).
7. THE Chatbot_Service SHALL use a Python virtual environment for dependency isolation.

### Requirement 2: Chat Endpoint

**User Story:** As a frontend developer, I want a simple HTTP endpoint to send user messages and receive chatbot responses, so that the popup chat UI can communicate with the agent.

#### Acceptance Criteria

1. THE Chat_Endpoint SHALL accept HTTP POST requests with a JSON body containing a `message` field (string) and an optional `session_id` field (string).
2. WHEN a valid message is received, THE Chat_Endpoint SHALL forward the message to the Strands_Agent and return the agent response as JSON with a `response` field (string) and a `session_id` field (string).
3. IF the `message` field is missing or empty, THEN THE Chat_Endpoint SHALL return HTTP 400 with a descriptive error message.
4. IF the Strands_Agent encounters an error during processing, THEN THE Chat_Endpoint SHALL return HTTP 500 with a descriptive error message.
5. THE Chat_Endpoint SHALL respond within 30 seconds for standard queries.

### Requirement 3: Conversation Session Management

**User Story:** As a shopper, I want the chatbot to remember what I said earlier in our conversation, so that I can have a natural multi-turn dialogue without repeating context.

#### Acceptance Criteria

1. WHEN a request includes a `session_id`, THE Chatbot_Service SHALL retrieve the corresponding Conversation_Session message history and provide it as context to the Strands_Agent.
2. WHEN a request does not include a `session_id`, THE Chatbot_Service SHALL create a new Conversation_Session and return the generated `session_id` in the response.
3. THE Chatbot_Service SHALL store Conversation_Session history in memory.
4. WHILE a Conversation_Session is active, THE Chatbot_Service SHALL append each user message and agent response to the session history.
5. IF a request references a `session_id` that does not exist, THEN THE Chatbot_Service SHALL create a new Conversation_Session and return the new `session_id`.

### Requirement 4: Product Search and Browse Tool

**User Story:** As a shopper, I want to ask the chatbot about available products, so that I can discover items without manually browsing the catalog.

#### Acceptance Criteria

1. THE Strands_Agent SHALL have a registered Tool that retrieves the full product list from the Backend_API `GET /api/products` endpoint.
2. THE Strands_Agent SHALL have a registered Tool that retrieves a single product with reviews from the Backend_API `GET /api/products/:id` endpoint.
3. WHEN a user asks about products by name, category, or description, THE Strands_Agent SHALL use the product list Tool and filter results to provide relevant matches.
4. WHEN a user asks for product details or reviews, THE Strands_Agent SHALL use the single product Tool to retrieve complete product information including reviews.
5. IF the Backend_API returns an error or is unreachable, THEN THE Strands_Agent SHALL inform the user that product information is temporarily unavailable.

### Requirement 5: Cart Management Tools

**User Story:** As a shopper, I want to manage my shopping cart through the chatbot, so that I can add items, check my cart, update quantities, and remove items conversationally.

#### Acceptance Criteria

1. THE Strands_Agent SHALL have a registered Tool that retrieves the current cart contents from the Backend_API `GET /api/cart` endpoint.
2. THE Strands_Agent SHALL have a registered Tool that adds a product to the cart via the Backend_API `POST /api/cart` endpoint, accepting a product ID and optional quantity.
3. THE Strands_Agent SHALL have a registered Tool that updates a cart item quantity via the Backend_API `PUT /api/cart/:id` endpoint.
4. THE Strands_Agent SHALL have a registered Tool that removes a cart item via the Backend_API `DELETE /api/cart/:id` endpoint.
5. WHEN a user requests a cart operation, THE Strands_Agent SHALL confirm the action taken and provide a summary of the updated cart state.
6. IF a cart operation fails due to a Backend_API error, THEN THE Strands_Agent SHALL inform the user of the failure with a descriptive message.

### Requirement 6: Agent System Prompt and Behavior

**User Story:** As a shopper, I want the chatbot to behave as a helpful and knowledgeable shopping assistant, so that I receive friendly, relevant, and accurate responses about the Emoji Shop.

#### Acceptance Criteria

1. THE Strands_Agent SHALL be configured with a system prompt that defines the agent as a shopping assistant for the Emoji Shop.
2. THE Strands_Agent SHALL use the registered Tools to answer product and cart questions rather than fabricating product information.
3. WHEN a user asks a question unrelated to shopping, THE Strands_Agent SHALL politely redirect the conversation to shopping-related topics.
4. THE Strands_Agent SHALL format product information in a readable way, including the product name, emoji, price, and description.
5. WHEN presenting multiple products, THE Strands_Agent SHALL present results as a concise list.

### Requirement 7: Frontend Chat UI

**User Story:** As a shopper, I want a chat popup in the Emoji Shop interface, so that I can access the shopping assistant from any page without leaving my current view.

#### Acceptance Criteria

1. THE Frontend_Chat_UI SHALL render a floating chat button on every page of the Emoji Shop.
2. WHEN the user clicks the chat button, THE Frontend_Chat_UI SHALL open a popup chat panel.
3. WHEN the user clicks the chat button while the panel is open, THE Frontend_Chat_UI SHALL close the popup chat panel.
4. THE Frontend_Chat_UI SHALL display a scrollable message history showing user messages and agent responses.
5. THE Frontend_Chat_UI SHALL provide a text input field and a send button for composing messages.
6. WHEN the user submits a message, THE Frontend_Chat_UI SHALL send the message and session ID to the Chat_Endpoint via HTTP POST and display the agent response.
7. WHILE the Chatbot_Service is processing a request, THE Frontend_Chat_UI SHALL display a loading indicator.
8. IF the Chatbot_Service returns an error or is unreachable, THEN THE Frontend_Chat_UI SHALL display a user-friendly error message in the chat panel.
9. THE Frontend_Chat_UI SHALL persist the session ID in component state for the duration of the browser session.

### Requirement 8: Health Check Endpoint

**User Story:** As a developer, I want a health check endpoint on the chatbot service, so that I can verify the service is running and ready to accept requests.

#### Acceptance Criteria

1. THE Chatbot_Service SHALL expose a `GET /health` endpoint.
2. WHEN the `GET /health` endpoint is called, THE Chatbot_Service SHALL return HTTP 200 with a JSON body containing `{"status": "ok"}`.
