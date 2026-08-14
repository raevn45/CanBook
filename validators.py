import re


def valid_email(email):
    pattern = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"

    return re.match(pattern, email) is not None


def valid_password(password):
    return len(password) >= 6