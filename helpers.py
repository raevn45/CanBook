from datetime import datetime


def today():
    return datetime.now().date()


def format_currency(value):
    return f"{float(value):.2f}"