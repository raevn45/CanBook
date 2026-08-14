import mysql.connector

from config import mysql_config


def get_connection():
    return mysql.connector.connect(**mysql_config)


def fetch_all(query, params=None):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(query, params or ())
        return cursor.fetchall()

    finally:
        cursor.close()
        connection.close()


def fetch_one(query, params=None):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(query, params or ())
        return cursor.fetchone()

    finally:
        cursor.close()
        connection.close()


def execute_query(query, params=None):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(query, params or ())
        connection.commit()

        return cursor.lastrowid

    finally:
        cursor.close()
        connection.close()