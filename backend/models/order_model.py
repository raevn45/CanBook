from database import fetch_all, fetch_one, execute_query, get_connection


def create_order(user_id, pickup_slot, total_amount):
    return execute_query("""
    INSERT INTO orders (user_id, pickup_slot, total_amount, order_date)
    VALUES (%s, %s, %s, CURDATE())
    """, (user_id, pickup_slot, total_amount))


def add_order_item(order_id, item_id, quantity, price):
    execute_query("""
    INSERT INTO order_items (order_id, item_id, quantity, price_at_order)
    VALUES (%s, %s, %s, %s)
    """, (order_id, item_id, quantity, price))


def get_user_orders(user_id):
    return fetch_all("""
    SELECT o.order_id, o.pickup_slot, o.total_amount, o.status, o.order_date, o.created_at
    FROM orders o
    WHERE o.user_id = %s
    ORDER BY o.order_id DESC
    """, (user_id,))


def get_order(order_id):
    return fetch_one("""
    SELECT o.*, u.name, u.email
    FROM orders o
    JOIN users u ON o.user_id = u.user_id
    WHERE o.order_id = %s
    """, (order_id,))


def get_order_items(order_id):
    return fetch_all("""
    SELECT oi.quantity, oi.price_at_order, m.item_name
    FROM order_items oi
    JOIN menu m ON oi.item_id = m.item_id
    WHERE oi.order_id = %s
    """, (order_id,))


def delete_order(order_id):
    """Delete an order and its line items atomically."""
    connection = get_connection()
    cursor = connection.cursor()
    try:
        cursor.execute("DELETE FROM order_items WHERE order_id = %s", (order_id,))
        cursor.execute("DELETE FROM orders WHERE order_id = %s", (order_id,))
        deleted = cursor.rowcount
        connection.commit()
        return deleted > 0
    except Exception:
        connection.rollback()
        raise
    finally:
        cursor.close()
        connection.close()
