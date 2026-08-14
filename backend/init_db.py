import mysql.connector

from werkzeug.security import generate_password_hash

from config import mysql_config


DEFAULT_MENU = [
    ("Chicken Manchurian + Fried Rice", "Indo-Chinese comfort food with fluffy fried rice.", "meals", 12.00),
    ("Veg Manchurian + Fried Rice", "Crispy veg Manchurian with fragrant fried rice.", "meals", 10.00),
    ("Puff", "Flaky, savoury canteen classic.", "snacks", 5.00),
    ("Chai Cake", "Soft tea-time cake for a tiny sweet break.", "desserts", 3.00),
    ("Chole Puri", "Spiced chickpeas with warm, fluffy puri.", "meals", 10.00),
    ("Boiled Egg", "Simple, protein-packed and ready to go.", "snacks", 2.00),
    ("Veg Sandwich", "Fresh vegetables layered into a school-day favourite.", "sandwiches", 7.00),
    ("Chicken Sandwich", "Tender chicken, crunchy vegetables and soft bread.", "sandwiches", 7.00),
    ("Aalo Paratha", "Golden stuffed paratha with a hearty potato filling.", "meals", 10.00),
]

LEGACY_MENU_NAMES = [
    "cheese pizza",
    "french fries",
    "fresh juice",
    "chocolate cookie",
]


def create_database():
    connection_config = mysql_config.copy()
    database_name = connection_config.pop("database")

    connection = mysql.connector.connect(**connection_config)
    cursor = connection.cursor()
    cursor.execute(f"CREATE DATABASE IF NOT EXISTS {database_name}")
    cursor.close()
    connection.close()
    print("Database created.")


def create_tables():
    connection = mysql.connector.connect(**mysql_config)
    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            user_id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role ENUM('student', 'canteen') DEFAULT 'student',
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
            status ENUM('Pending', 'Preparing', 'Ready', 'Collected', 'Cancelled') DEFAULT 'Pending',
            order_date DATE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS order_items (
            order_item_id INT AUTO_INCREMENT PRIMARY KEY,
            order_id INT NOT NULL,
            item_id INT NOT NULL,
            quantity INT NOT NULL,
            price_at_order DECIMAL(8,2) NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
            FOREIGN KEY (item_id) REFERENCES menu(item_id)
        )
    """)

    connection.commit()
    cursor.close()
    connection.close()
    print("Tables created.")


def create_canteen_account():
    connection = mysql.connector.connect(**mysql_config)
    cursor = connection.cursor()

    email = "canteen@canbook.com"
    cursor.execute("SELECT user_id FROM users WHERE email = %s", (email,))

    if cursor.fetchone():
        print("Canteen account already exists.")
    else:
        password_hash = generate_password_hash("canteen")
        cursor.execute("""
            INSERT INTO users (name, email, password_hash, role)
            VALUES (%s, %s, %s, %s)
        """, ("Canbook Canteen", email, password_hash, "canteen"))
        connection.commit()
        print("Canteen account created.")
        print("Email: canteen@canbook.com")
        print("Password: canteen")

    cursor.close()
    connection.close()


def seed_and_migrate_menu():
    connection = mysql.connector.connect(**mysql_config)
    cursor = connection.cursor()

    for legacy_name in LEGACY_MENU_NAMES:
        cursor.execute(
            "UPDATE menu SET available = FALSE WHERE LOWER(item_name) = %s",
            (legacy_name,)
        )

    added = 0
    updated = 0
    for name, description, category, price in DEFAULT_MENU:
        cursor.execute("SELECT item_id FROM menu WHERE LOWER(item_name) = LOWER(%s) LIMIT 1", (name,))
        existing = cursor.fetchone()
        if existing:
            cursor.execute("""
                UPDATE menu
                SET description = %s, category = %s, price = %s, available = TRUE
                WHERE item_id = %s
            """, (description, category, price, existing[0]))
            updated += 1
        else:
            cursor.execute("""
                INSERT INTO menu (item_name, description, category, price, available)
                VALUES (%s, %s, %s, %s, TRUE)
            """, (name, description, category, price))
            added += 1

    connection.commit()
    cursor.close()
    connection.close()
    print(f"CanBook menu checked. Added {added} and refreshed {updated} current item(s); legacy sample items were hidden without deleting history.")


if __name__ == "__main__":
    create_database()
    create_tables()
    create_canteen_account()
    seed_and_migrate_menu()
    print("\ncanbook database setup complete.")
