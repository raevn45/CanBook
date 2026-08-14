import mysql.connector

from werkzeug.security import generate_password_hash

from config import mysql_config


def create_database():
    connection_config = mysql_config.copy()

    database_name = connection_config.pop("database")

    connection = mysql.connector.connect(
        **connection_config
    )

    cursor = connection.cursor()

    cursor.execute(
        f"CREATE DATABASE IF NOT EXISTS {database_name}"
    )

    cursor.close()
    connection.close()

    print("Database created.")


def create_tables():
    connection = mysql.connector.connect(
        **mysql_config
    )

    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            user_id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role ENUM('student', 'canteen')
                DEFAULT 'student',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS menu (
            item_id INT AUTO_INCREMENT PRIMARY KEY,
            item_name VARCHAR(100) NOT NULL,
            description VARCHAR(255),
            category VARCHAR(50) NOT NULL,
            price DECIMAL(8,2) NOT NULL,
            available BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            order_id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            pickup_slot VARCHAR(50) NOT NULL,
            total_amount DECIMAL(10,2) NOT NULL,
            status ENUM(
                'Pending',
                'Preparing',
                'Ready',
                'Collected',
                'Cancelled'
            ) DEFAULT 'Pending',
            order_date DATE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (user_id)
            REFERENCES users(user_id)
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS order_items (
            order_item_id INT AUTO_INCREMENT PRIMARY KEY,
            order_id INT NOT NULL,
            item_id INT NOT NULL,
            quantity INT NOT NULL,
            price_at_order DECIMAL(8,2) NOT NULL,

            FOREIGN KEY (order_id)
            REFERENCES orders(order_id)
            ON DELETE CASCADE,

            FOREIGN KEY (item_id)
            REFERENCES menu(item_id)
        )
    """)

    connection.commit()

    cursor.close()
    connection.close()

    print("Tables created.")


def create_canteen_account():
    connection = mysql.connector.connect(
        **mysql_config
    )

    cursor = connection.cursor()

    email = "canteen@canbook.local"

    cursor.execute(
        "SELECT user_id FROM users WHERE email = %s",
        (email,)
    )

    if cursor.fetchone():
        print("Canteen account already exists.")

    else:
        password_hash = generate_password_hash(
            "canteen123"
        )

        cursor.execute("""
            INSERT INTO users
            (name, email, password_hash, role)
            VALUES (%s, %s, %s, %s)
        """, (
            "Canbook Canteen",
            email,
            password_hash,
            "canteen"
        ))

        connection.commit()

        print("Canteen account created.")
        print("Email: canteen@canbook.local")
        print("Password: canteen123")

    cursor.close()
    connection.close()


def insert_sample_menu():
    connection = mysql.connector.connect(
        **mysql_config
    )

    cursor = connection.cursor()

    cursor.execute("SELECT COUNT(*) FROM menu")

    count = cursor.fetchone()[0]

    if count == 0:

        items = [
            (
                "chicken sandwich",
                "grilled chicken with fresh vegetables",
                "sandwiches",
                8.00
            ),
            (
                "veg sandwich",
                "fresh vegetable sandwich",
                "sandwiches",
                7.00
            ),
            (
                "cheese pizza",
                "classic cheese pizza slice",
                "meals",
                12.00
            ),
            (
                "french fries",
                "crispy golden fries",
                "sides",
                6.00
            ),
            (
                "fresh juice",
                "seasonal fruit juice",
                "drinks",
                5.00
            ),
            (
                "chocolate cookie",
                "soft chocolate chip cookie",
                "snacks",
                3.00
            )
        ]

        cursor.executemany("""
            INSERT INTO menu
            (item_name, description, category, price)
            VALUES (%s, %s, %s, %s)
        """, items)

        connection.commit()

        print("Sample menu inserted.")

    else:
        print("Menu already contains items.")

    cursor.close()
    connection.close()


if __name__ == "__main__":
    create_database()
    create_tables()
    create_canteen_account()
    insert_sample_menu()

    print("\ncanbook database setup complete.")