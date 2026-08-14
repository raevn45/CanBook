import os

from flask import Flask
from flask_cors import CORS

from config import secret_key
from routes.auth_routes import auth
from routes.menu_routes import menu
from routes.order_routes import orders
from routes.canteen_routes import canteen

app = Flask(__name__)
app.secret_key = secret_key or "canbook-dev-secret"

is_production = os.getenv("APP_ENV", "development").lower() == "production"
allowed_origins = [
    origin.strip().rstrip("/")
    for origin in os.getenv(
        "FRONTEND_ORIGIN",
        "http://localhost:5173,https://canbook.vercel.app"
    ).split(",")
    if origin.strip()
]

app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "None" if is_production else "Lax"
app.config["SESSION_COOKIE_SECURE"] = is_production
app.config["SESSION_COOKIE_PATH"] = "/"

CORS(app, supports_credentials=True, origins=allowed_origins)

app.register_blueprint(auth, url_prefix="/api/auth")
app.register_blueprint(menu, url_prefix="/api/menu")
app.register_blueprint(orders, url_prefix="/api/orders")
app.register_blueprint(canteen, url_prefix="/api/canteen")

# Compatibility prefix for an older deployed frontend that omitted /api.
app.register_blueprint(canteen, url_prefix="/canteen", name="canteen_legacy")


@app.get("/api/health")
def health():
    return {"status": "ok", "application": "canbook"}


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=not is_production, port=int(os.getenv("PORT", "5000")))
