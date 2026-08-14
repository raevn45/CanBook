import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    if (
      email.trim().toLowerCase() === "canteen@canbook.com" &&
      password === "giiscanteen"
    ) {
      localStorage.setItem(
        "canbook_user",
        JSON.stringify({
          email: email.trim().toLowerCase(),
          role: "canteen",
          loggedIn: true,
        })
      );

      navigate("/canteen/dashboard");
      return;
    }

    localStorage.setItem(
      "canbook_user",
      JSON.stringify({
        email: email.trim().toLowerCase(),
        role: "student",
        loggedIn: true,
      })
    );

    navigate("/student");
  };

  return (
    <main className="auth-page">
      <div className="auth-decoration auth-decoration-one" />
      <div className="auth-decoration auth-decoration-two" />

      <section className="auth-card">
        <div className="auth-card-top">
          <Link to="/" className="auth-logo">
            CANBOOK<span>.</span>
          </Link>

          <p className="eyebrow">CANBOOK / LOGIN</p>
        </div>

        <div className="auth-heading">
          <h1>
            Welcome
            <br />
            <span>back.</span>
          </h1>

          <p>
            Log in to order from the canteen and keep track of your orders.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            <span>Email</span>

            <div className="input-wrap">
              <Mail size={18} />

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
          </label>

          <label>
            <span>Password</span>

            <div className="input-wrap">
              <Lock size={18} />

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn-primary auth-submit">
            Log in
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-footer">
          <span>New to CanBook?</span>

          <Link to="/register">Create an account</Link>
        </div>
      </section>
    </main>
  );
}