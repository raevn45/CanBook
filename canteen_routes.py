from flask import Blueprint, jsonify, request
from database import fetch_all, fetch_one, execute_query
from models.menu_model import get_all_items, add_item, update_item_availability
from utils.auth_utils import role_required

canteen = Blueprint("canteen", __name__)

@canteen.get("/dashboard")
@role_required("canteen")
def dashboard():
    total_orders = fetch_one("""
    SELECT COUNT(*) AS total FROM orders
    WHERE order_date = CURDATE() AND status != 'Cancelled'
    """)["total"]

    revenue = fetch_one("""
    SELECT COALESCE(SUM(total_amount), 0) AS revenue FROM orders
    WHERE order_date = CURDATE() AND status != 'Cancelled'
    """)["revenue"]

    demand = fetch_all("""
    SELECT m.item_name, SUM(oi.quantity) AS quantity
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.order_id
    JOIN menu m ON oi.item_id = m.item_id
    WHERE o.order_date = CURDATE() AND o.status != 'Cancelled'
    GROUP BY m.item_id, m.item_name
    ORDER BY quantity DESC
    """)

    recent_orders = fetch_all("""
    SELECT o.order_id, u.name, o.pickup_slot, o.total_amount, o.status
    FROM orders o
    JOIN users u ON o.user_id = u.user_id
    WHERE o.order_date = CURDATE()
    ORDER BY o.order_id DESC
    """)

    return jsonify({
        "total_orders": total_orders,
        "revenue": float(revenue),
        "demand": demand,
        "orders": recent_orders
    })

@canteen.patch("/orders/<int:order_id>")
@role_required("canteen")
def update_order(order_id):
    data = request.get_json()
    status = data.get("status")
    allowed = ["Pending", "Preparing", "Ready", "Collected", "Cancelled"]
    if status not in allowed:
        return jsonify({"error": "invalid status"}), 400
    execute_query("UPDATE orders SET status = %s WHERE order_id = %s", (status, order_id))
    return jsonify({"message": "order updated"})

@canteen.get("/menu")
@role_required("canteen")
def menu_management():
    return jsonify({"items": get_all_items()})

@canteen.post("/menu")
@role_required("canteen")
def create_menu_item():
    data = request.get_json()
    item_id = add_item(
        data["item_name"],
        data.get("description", ""),
        data["category"],
        float(data["price"])
    )
    return jsonify({"message": "item created", "item_id": item_id}), 201

@canteen.patch("/menu/<int:item_id>")
@role_required("canteen")
def toggle_menu_item(item_id):
    data = request.get_json()
    update_item_availability(item_id, data["available"])
    return jsonify({"message": "menu item updated"})