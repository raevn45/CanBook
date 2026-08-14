from functools import wraps

from flask import session, jsonify


def login_required(function):
    @wraps(function)
    def wrapper(*args, **kwargs):

        if "user_id" not in session:
            return jsonify({
                "error": "authentication required"
            }), 401

        return function(*args, **kwargs)

    return wrapper


def role_required(role):
    def decorator(function):

        @wraps(function)
        def wrapper(*args, **kwargs):

            if "user_id" not in session:
                return jsonify({
                    "error": "authentication required"
                }), 401

            if session.get("role") != role:
                return jsonify({
                    "error": "access denied"
                }), 403

            return function(*args, **kwargs)

        return wrapper

    return decorator