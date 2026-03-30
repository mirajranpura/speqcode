"""Flask HTTP server for the Shopping Assistant Chatbot."""

import os
import sys

from flask import Flask, jsonify, request
from flask_cors import CORS

from agent import get_agent_response
from sessions import append_to_session, get_or_create_session

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])


@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok"}), 200


@app.route("/chat", methods=["POST"])
def chat():
    """Chat endpoint that processes user messages through the Strands Agent."""
    # Parse JSON body
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({"error": "Invalid JSON in request body"}), 400

    message = data.get("message")
    session_id = data.get("session_id")

    # Validate message
    if not message or not isinstance(message, str) or not message.strip():
        return jsonify({"error": "message field is required and must be non-empty"}), 400

    # Get or create session
    session_id, history = get_or_create_session(session_id)

    # Call agent
    try:
        response = get_agent_response(message, history)
    except Exception:
        return jsonify({"error": "Failed to process message"}), 500

    # Append to session history
    append_to_session(session_id, "user", message)
    append_to_session(session_id, "assistant", response)

    return jsonify({"response": response, "session_id": session_id}), 200


if __name__ == "__main__":
    # Check AWS credentials at startup
    has_iam = os.environ.get("AWS_ACCESS_KEY_ID")
    has_bearer = os.environ.get("AWS_BEARER_TOKEN_BEDROCK")

    if not has_iam and not has_bearer:
        print(
            "Error: AWS credentials not found. Set AWS_ACCESS_KEY_ID (with AWS_SECRET_ACCESS_KEY) "
            "or AWS_BEARER_TOKEN_BEDROCK environment variable.",
            file=sys.stderr,
        )
        sys.exit(1)

    port = int(os.environ.get("CHATBOT_PORT", 8000))
    app.run(host="0.0.0.0", port=port)
