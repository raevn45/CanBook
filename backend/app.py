import os
from datetime import timedelta

from flask import Flask
from flask_cors import CORS
from config import secret_key
from routes.auth_routes import auth
from routes.menu_routes import menu
from routes.order_routes import orders
from routes.canteen_routes import canteen

app = Flask(__name__)
app.secret_key = secret_key or "canbook-dev-secret"

is_production = (
    os.getenv("VERCEL") == "1"
    or os.getenv("APP_ENV", "").lower() == "production"
)

allowed_origins = [
    origin.strip().rstrip("/")
    for origin in os.getenv(
        "FRONTEND_ORIGIN",
        "http://localhost:5173,https://canbook.vercel.app"
    ).split(",")
    if origin.strip()
]

# Keep authenticated users signed in across refreshes and browser restarts.
# The session is still destroyed immediately when the user explicitly logs out.
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(days=30)
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "None" if is_production else "Lax"
app.config["SESSION_COOKIE_SECURE"] = is_production
app.config["SESSION_COOKIE_PATH"] = "/"
app.config["SESSION_COOKIE_NAME"] = "canbook_session"

app.url_map.strict_slashes = False
CORS(app, supports_credentials=True, origins=allowed_origins)

app.register_blueprint(auth, url_prefix="/api/auth")
app.register_blueprint(menu, url_prefix="/api/menu")
app.register_blueprint(orders, url_prefix="/api/orders")
app.register_blueprint(canteen, url_prefix="/api/canteen")

app.register_blueprint(auth, url_prefix="/auth", name="auth_legacy")
app.register_blueprint(menu, url_prefix="/menu", name="menu_legacy")
app.register_blueprint(orders, url_prefix="/orders", name="orders_legacy")
app.register_blueprint(canteen, url_prefix="/canteen", name="canteen_legacy")


@app.get("/api/health")
def health():
    return {"status": "ok", "application": "canbook"}


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        debug=not is_production,
        port=int(os.getenv("PORT", "5000")),
    )
