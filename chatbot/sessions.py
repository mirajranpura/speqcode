"""In-memory session store for the Shopping Assistant Chatbot."""

import uuid

# Session store: {session_id: [{"role": "...", "content": "..."}, ...]}
sessions = {}


def get_or_create_session(session_id=None):
    """Retrieve an existing session or create a new one.

    Args:
        session_id: Optional session ID to look up. If None or not found,
                    a new session is created.

    Returns:
        A tuple of (session_id, history) where history is the list of
        message dicts for that session.
    """
    if session_id is not None and session_id in sessions:
        return session_id, sessions[session_id]

    new_id = str(uuid.uuid4())
    sessions[new_id] = []
    return new_id, sessions[new_id]


def append_to_session(session_id, role, content):
    """Append a message to an existing session's history.

    Args:
        session_id: The session ID to append to.
        role: The message role ('user' or 'assistant').
        content: The message content string.
    """
    if session_id in sessions:
        sessions[session_id].append({"role": role, "content": content})
