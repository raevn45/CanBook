from database import fetch_one, execute_query


def find_user_by_email(email):
    return fetch_one(
        """
        SELECT *
        FROM users
        WHERE email = %s
        """,
        (email,)
    )


def find_user_by_id(user_id):
    return fetch_one(
        """
        SELECT user_id, name, email, role, created_at
        FROM users
        WHERE user_id = %s
        """,
        (user_id,)
    )


def create_user(name, email, password_hash):
    return execute_query(
        """
        INSERT INTO users
        (name, email, password_hash, role)
        VALUES (%s, %s, %s, 'student')
        """,
        (name, email, password_hash)
    )