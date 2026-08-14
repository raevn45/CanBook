from flask import (
    Blueprint,
    request,
    jsonify,
    session
)

from models.menu_model import get_item

from models.order_model import (
    create_order,
    add_order_item,
    get_user_orders,
    get_order,
    get_order_items
)

from utils.auth_utils import login_required

orders = Blueprint("orders", __name__)


@orders.get("/")
@login_required
def user_orders():

    result = get_user_orders(
        session["user_id"]
    )

    return jsonify({
        "orders": result
    })


@orders.get("/<int:order_id>")
@login_required
def order_details(order_id):

    order = get_order(order_id)

    if not order:
        return jsonify({
            "error": "order not found"
        }), 404

    if (
        session["role"] != "canteen"
        and order["user_id"] != session["user_id"]
    ):
        return jsonify({
            "error": "access denied"
        }), 403

    items = get_order_items(order_id)

    order["items"] = items

    return jsonify(order)


@orders.post("/")
@login_required
def create_new_order():

    data = request.get_json()

    cart = data.get("items", [])
    pickup_slot = data.get("pickup_slot", "")

    if not cart:
        return jsonify({
            "error": "cart is empty"
        }), 400

    if not pickup_slot:
        return jsonify({
            "error": "pickup slot is required"
        }), 400

    total = 0
    validated_items = []

    for cart_item in cart:

        item = get_item(
            cart_item["item_id"]
        )

        if not item:
            return jsonify({
                "error": "menu item not found"
            }), 404

        quantity = int(
            cart_item["quantity"]
        )

        if quantity <= 0:
            continue

        total += float(item["price"]) * quantity

        validated_items.append({
            "item_id": item["item_id"],
            "quantity": quantity,
            "price": float(item["price"])
        })

    if not validated_items:
        return jsonify({
            "error": "invalid cart"
        }), 400

    order_id = create_order(
        session["user_id"],
        pickup_slot,
        total
    )

    for item in validated_items:

        add_order_item(
            order_id,
            item["item_id"],
            item["quantity"],
            item["price"]
        )

    return jsonify({
        "message": "order created",
        "order_id": order_id,
        "total": total
    }), 201