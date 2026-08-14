from flask import Blueprint, jsonify
from models.menu_model import get_available_items

menu = Blueprint("menu", __name__)

@menu.get("/")
def get_menu():
    items = get_available_items()
    return jsonify({"items": items})