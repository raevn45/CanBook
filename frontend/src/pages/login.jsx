import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [portal, setPortal] = useState("student"); // "student" | "canteen" — visual only
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(email, password);
      navigate(data.user.role === "canteen" ? "/canteen" : "/student");
    } catch (err) {
      setError(err.message || "login failed. check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className={`auth-card ${portal === "canteen" ? "role-canteen" : ""}`}>
        <div className="portal-toggle" role="tablist" aria-label="login portal">
          <button
            type="button"
            role="tab"
            aria-selected={portal === "student"}
            className={portal === "student" ? "active" : ""}
            onClick={() => setPortal("student")}
          >
            student
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={portal === "canteen"}
            className={portal === "canteen" ? "active" : ""}
            onClick={() => setPortal("canteen")}
          >
            canteen staff
          </button>
        </div>

        <div className="pixel-label">
          {portal === "canteen" ? "staff auth terminal" : "auth terminal"}
        </div>
        <h1>welcome back.</h1>
        <p>
          {portal === "canteen"
            ? "sign in to manage orders and menu."
            : "sign in to your canbook account."}
        </p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            email
            <input
              type="email"
              placeholder="you@school.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            password
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button className="pixel-button" disabled={loading}>
            {loading ? "verifying..." : "login →"}
          </button>
        </form>

        {portal === "student" ? (
          <p className="auth-footer">
            new here? <Link to="/register">create an account</Link>
          </p>
        ) : (
          <p className="auth-footer">
            staff accounts are created by an admin — contact your canteen manager if you don't have one.
          </p>
        )}
      </div>
    </div>
  );
}
