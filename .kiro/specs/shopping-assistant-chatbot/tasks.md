# Implementation Plan: Shopping Assistant Chatbot

## Overview

Build an AI-powered shopping assistant chatbot as a standalone Python service using the Strands Agents SDK with Amazon Bedrock Nova Pro, plus a floating chat widget in the React frontend. The implementation proceeds bottom-up: Python service scaffolding → session management → agent tools → agent configuration → HTTP endpoints → frontend widget → integration wiring.

## Tasks

- [x] 1. Set up Python chatbot service scaffolding
  - [x] 1.1 Create `chatbot/` directory with `requirements.txt` listing `flask`, `flask-cors`, `strands-agents`, `strands-agents[bedrock]`, `requests`, `hypothesis`, and `pytest`
    - Create `chatbot/requirements.txt` with all dependencies
    - _Requirements: 1.1, 1.7_
  - [x] 1.2 Create `chatbot/sessions.py` with in-memory session store
    - Implement `sessions` dict, `get_or_create_session(session_id)` returning `(session_id, history)`, and `append_to_session(session_id, role, content)`
    - Generate UUID for new sessions; return new session if `session_id` is `None` or not found
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  - [ ]* 1.3 Write property tests for session management
    - **Property 4: New session creation on missing session_id**
    - **Validates: Requirements 3.2, 3.5**
  - [ ]* 1.4 Write property test for session history round-trip
    - **Property 3: Session history round-trip**
    - **Validates: Requirements 3.1, 3.4**

- [x] 2. Implement agent tools
  - [x] 2.1 Create `chatbot/tools.py` with product and cart tool functions
    - Implement `get_products()` calling `GET http://localhost:4000/api/products`
    - Implement `get_product_details(product_id)` calling `GET http://localhost:4000/api/products/{id}`
    - Implement `get_cart()` calling `GET http://localhost:4000/api/cart`
    - Implement `add_to_cart(product_id, quantity)` calling `POST http://localhost:4000/api/cart`
    - Implement `update_cart_item(cart_item_id, quantity)` calling `PUT http://localhost:4000/api/cart/{id}`
    - Implement `remove_from_cart(cart_item_id)` calling `DELETE http://localhost:4000/api/cart/{id}`
    - Each tool decorated with `@tool` from Strands SDK, uses `requests`, and wraps calls in try/except returning error strings on failure
    - _Requirements: 4.1, 4.2, 4.5, 5.1, 5.2, 5.3, 5.4, 5.6_
  - [ ]* 2.2 Write property test for tool error handling
    - **Property 6: Tool error handling on backend failure**
    - **Validates: Requirements 4.5, 5.6**
  - [ ]* 2.3 Write property test for product details tool
    - **Property 5: Product details tool returns product with reviews**
    - **Validates: Requirements 4.2**
  - [ ]* 2.4 Write property test for cart operation tools
    - **Property 7: Cart operation tools call correct endpoints**
    - **Validates: Requirements 5.2, 5.3, 5.4**

- [x] 3. Implement agent configuration
  - [x] 3.1 Create `chatbot/agent.py` with Strands Agent setup
    - Create `strands.Agent` with `BedrockModel` using `us.amazon.nova-pro-v1:0`
    - Define system prompt establishing the agent as a shopping assistant for the Emoji Shop
    - Register all tool functions from `tools.py`
    - Expose `get_agent_response(message, history)` that invokes the agent with conversation context and returns response text
    - _Requirements: 1.2, 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 4. Implement HTTP server and endpoints
  - [x] 4.1 Create `chatbot/app.py` with Flask server, CORS, health check, and chat endpoint
    - Configure Flask app with `flask-cors` allowing origin `http://localhost:3000`
    - Implement `GET /health` returning `{"status": "ok"}` with HTTP 200
    - Implement `POST /chat` accepting `{message, session_id?}`, validating input, calling agent, returning `{response, session_id}`
    - Return HTTP 400 for missing/empty message, HTTP 500 for agent errors
    - Read port from `CHATBOT_PORT` env var (default 8000)
    - Check AWS credentials at startup (`AWS_ACCESS_KEY_ID` or `AWS_BEARER_TOKEN_BEDROCK`); exit with error if missing
    - _Requirements: 1.1, 1.3, 1.4, 1.5, 1.6, 2.1, 2.2, 2.3, 2.4, 2.5, 8.1, 8.2_
  - [ ]* 4.2 Write property test for chat endpoint response shape
    - **Property 1: Chat endpoint returns well-formed responses**
    - **Validates: Requirements 2.1, 2.2**
  - [ ]* 4.3 Write property test for empty/missing message rejection
    - **Property 2: Empty or missing messages are rejected**
    - **Validates: Requirements 2.3**

- [x] 5. Checkpoint - Verify Python service
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement frontend chat widget
  - [x] 6.1 Create `client/src/components/ChatWidget.js` React component
    - Render floating chat button (fixed position, bottom-right)
    - Toggle popup chat panel on button click
    - Maintain `messages` array and `sessionId` in component state
    - Provide text input and send button
    - Send POST to `http://localhost:8000/chat` with `{message, session_id}` on submit
    - Display scrollable message history with user/assistant styling
    - Show loading indicator while waiting for response
    - Display user-friendly error message if service is unreachable or returns error
    - Persist `session_id` from first response for all subsequent requests
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9_
  - [x] 6.2 Add chat widget styles to `client/src/App.css`
    - Style floating button, popup panel, message bubbles, input area, loading indicator
    - _Requirements: 7.1, 7.2, 7.4_
  - [ ]* 6.3 Write property test for chat panel toggle
    - **Property 8: Chat panel toggle**
    - **Validates: Requirements 7.2, 7.3**
  - [ ]* 6.4 Write property test for session ID persistence
    - **Property 9: Message submission persists session ID**
    - **Validates: Requirements 7.6, 7.9**

- [x] 7. Wire everything together
  - [x] 7.1 Import and render `<ChatWidget />` in `client/src/App.js`
    - Add import and place component alongside existing routes
    - _Requirements: 7.1_
  - [x] 7.2 Update root `package.json` to include chatbot service in dev script
    - Add `chatbot` script that activates venv and runs `python chatbot/app.py`
    - Update `dev` script in root `package.json` to run server, client, and chatbot concurrently
    - _Requirements: 1.1, 1.7_

- [x] 8. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Python virtual environment setup is handled as part of the dev script wiring (task 7.2)
- No changes to the existing Express.js backend or database schema are required
