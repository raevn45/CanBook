import os

from dotenv import load_dotenv

load_dotenv()

mysql_config = {
    "host": os.getenv("mysql_host"),
    "user": os.getenv("mysql_user"),
    "password": os.getenv("mysql_password"),
    "database": os.getenv("mysql_database")
}

secret_key = os.getenv("secret_key")