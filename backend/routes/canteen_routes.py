from flask import Blueprint, jsonify, request
from database import fetch_all, fetch_one, execute_query
from models.menu_model import get_all_items, add_item, update_item_availability
from utils.auth_utils import role_required

canteen = Blueprint("canteen", __name__)


def _today_orders():
    return fetch_all("""
        SELECT
            o.order_id,
            o.user_id,
            u.name,
            u.email,
            o.pickup_slot,
            o.total_amount,
            o.status,
            o.order_date,
            o.created_at
        FROM orders o
        JOIN users u ON o.user_id = u.user_id
        WHERE o.order_date = CURDATE()
        ORDER BY o.order_id DESC
    """)


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

    return jsonify({
        "total_orders": int(total_orders or 0),
        "revenue": float(revenue or 0),
        "demand": demand,
        "orders": _today_orders(),
    })


@canteen.get("/orders")
@role_required("canteen")
def orders_queue():
    """Return today's kitchen queue for staff clients."""
    return jsonify({"orders": _today_orders()})


@canteen.get("/analytics")
@role_required("canteen")
def analytics():
    order_summary = fetch_one("""
        SELECT
            COUNT(*) AS total_orders,
            COUNT(DISTINCT user_id) AS total_students,
            COALESCE(SUM(total_amount), 0) AS total_revenue
        FROM orders
        WHERE status != 'Cancelled'
    """)

    item_summary = fetch_one("""
        SELECT COALESCE(SUM(oi.quantity), 0) AS total_items
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.order_id
        WHERE o.status != 'Cancelled'
    """)

    demand = fetch_all("""
        SELECT
            m.item_id,
            m.item_name,
            m.category,
            SUM(oi.quantity) AS quantity,
            COUNT(DISTINCT o.user_id) AS students
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.order_id
        JOIN menu m ON oi.item_id = m.item_id
        WHERE o.status != 'Cancelled'
        GROUP BY m.item_id, m.item_name, m.category
        ORDER BY quantity DESC, students DESC, m.item_name
    """)

    daily = fetch_all("""
        SELECT
            o.order_date,
            COUNT(DISTINCT o.order_id) AS orders,
            COUNT(DISTINCT o.user_id) AS students,
            COALESCE(SUM(o.total_amount), 0) AS revenue
        FROM orders o
        WHERE o.status != 'Cancelled'
        GROUP BY o.order_date
        ORDER BY o.order_date DESC
        LIMIT 30
    """)

    return jsonify({
        "summary": {
            "total_orders": int(order_summary["total_orders"] or 0),
            "total_students": int(order_summary["total_students"] or 0),
            "total_items": int(item_summary["total_items"] or 0),
            "total_revenue": float(order_summary["total_revenue"] or 0),
        },
        "demand": demand,
        "daily": daily,
    })


@canteen.patch("/orders/<int:order_id>")
@role_required("canteen")
def update_order(order_id):
    data = request.get_json() or {}
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
    data = request.get_json() or {}
    name = str(data.get("item_name", "")).strip()
    category = str(data.get("category", "")).strip()

    if not name or not category:
        return jsonify({"error": "item_name and category are required"}), 400

    try:
        price = float(data.get("price"))
    except (TypeError, ValueError):
        return jsonify({"error": "price must be a number"}), 400

    if price < 0:
        return jsonify({"error": "price must be non-negative"}), 400

    item_id = add_item(name, str(data.get("description", "")).strip(), category, price)
    return jsonify({"message": "item created", "item_id": item_id}), 201


@canteen.patch("/menu/<int:item_id>")
@role_required("canteen")
def toggle_menu_item(item_id):
    data = request.get_json() or {}
    if "available" not in data or not isinstance(data["available"], bool):
        return jsonify({"error": "available must be a boolean"}), 400

    update_item_availability(item_id, data["available"])
    return jsonify({"message": "menu item updated"})
