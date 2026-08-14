from flask import Blueprint, request, jsonify, session

from werkzeug.security import generate_password_hash, check_password_hash

from models.user_model import find_user_by_email, find_user_by_id, create_user
from utils.validators import valid_email, valid_password

auth = Blueprint("auth", __name__)


@auth.post("/register")
def register():
    data = request.get_json() or {}
    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not name or not email or not password:
        return jsonify({"error": "all fields are required"}), 400
    if not valid_email(email):
        return jsonify({"error": "invalid email"}), 400
    if not valid_password(password):
        return jsonify({"error": "password must be at least 6 characters"}), 400
    if find_user_by_email(email):
        return jsonify({"error": "email already registered"}), 409

    user_id = create_user(name, email, generate_password_hash(password))
    return jsonify({"message": "account created", "user_id": user_id}), 201


@auth.post("/login")
def login():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    user = find_user_by_email(email)

    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify({"error": "invalid email or password"}), 401

    session.clear()
    session.permanent = True
    session["user_id"] = user["user_id"]
    session["name"] = user["name"]
    session["email"] = user["email"]
    session["role"] = user["role"]

    return jsonify({
        "message": "login successful",
        "user": {
            "user_id": user["user_id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    })


@auth.post("/logout")
def logout():
    session.clear()
    return jsonify({"message": "logged out"})


@auth.get("/me")
def me():
    if "user_id" not in session:
        return jsonify({"authenticated": False})

    user = find_user_by_id(session["user_id"])
    if not user:
        session.clear()
        return jsonify({"authenticated": False})

    return jsonify({"authenticated": True, "user": user})
