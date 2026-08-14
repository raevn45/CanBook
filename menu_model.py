from database import fetch_all, fetch_one, execute_query


def get_available_items():
    return fetch_all("""
        SELECT *
        FROM menu
        WHERE available = TRUE
        ORDER BY category, item_name
    """)


def get_all_items():
    return fetch_all("""
        SELECT *
        FROM menu
        ORDER BY category, item_name
    """)


def get_item(item_id):
    return fetch_one(
        """
        SELECT *
        FROM menu
        WHERE item_id = %s
        """,
        (item_id,)
    )


def add_item(name, description, category, price):
    return execute_query(
        """
        INSERT INTO menu
        (item_name, description, category, price)
        VALUES (%s, %s, %s, %s)
        """,
        (name, description, category, price)
    )


def update_item_availability(item_id, available):
    execute_query(
        """
        UPDATE menu
        SET available = %s
        WHERE item_id = %s
        """,
        (available, item_id)
    )