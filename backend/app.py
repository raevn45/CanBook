from flask import Flask
from flask_cors import CORS
from config import secret_key
from routes.auth_routes import auth
from routes.menu_routes import menu
from routes.order_routes import orders
from routes.canteen_routes import canteen

app = Flask(__name__)
app.secret_key = secret_key
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"

CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

app.register_blueprint(auth, url_prefix="/api/auth")
app.register_blueprint(menu, url_prefix="/api/menu")
app.register_blueprint(orders, url_prefix="/api/orders")
app.register_blueprint(canteen, url_prefix="/api/canteen")

@app.get("/api/health")
def health():
    return {"status": "ok", "application": "canbook"}

if __name__ == "__main__":
    app.run(debug=True, port=5000)