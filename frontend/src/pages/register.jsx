import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const user = {
      name: form.name.trim(),
      email: form.email.trim(),
    };

    localStorage.setItem("canbook_user", JSON.stringify(user));

    navigate("/order");
  };

  return (
    <main className="auth-page">
      <div className="auth-background auth-background-one" />
      <div className="auth-background auth-background-two" />

      <nav className="auth-nav">
        <Link to="/" className="auth-logo">
          CAN<span>BOOK</span>
        </Link>

        <Link to="/" className="auth-back">
          Back home
        </Link>
      </nav>

      <section className="register-layout">
        <div className="register-intro">
          <p className="eyebrow">GIIS CANTEEN / CANBOOK</p>

          <h1>
            Your lunch
            <br />
            starts <span>here.</span>
          </h1>

          <p className="register-description">
            Create your CanBook account once. Then browse the canteen menu,
            build your order, and pick it up when it's ready.
          </p>

          <div className="register-perks">
            <div>
              <span>
                <Check size={15} />
              </span>
              <p>See the current canteen menu</p>
            </div>

            <div>
              <span>
                <Check size={15} />
              </span>
              <p>Order before you reach the canteen</p>
            </div>

            <div>
              <span>
                <Check size={15} />
              </span>
              <p>Spend less time waiting in line</p>
            </div>
          </div>
        </div>

        <div className="auth-card register-card">
          <div className="auth-card-heading">
            <p className="eyebrow">GET STARTED</p>
            <h2>Create your account.</h2>
            <p>It only takes a minute.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <label>
              Full name
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                autoComplete="name"
                required
              />
            </label>

            <label>
              Email address
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label>
              Password
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                required
              />
            </label>

            <label>
              Confirm password
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Enter your password again"
                autoComplete="new-password"
                required
              />
            </label>

            {error && <p className="form-error">{error}</p>}

            <button type="submit" className="btn-primary auth-submit">
              Continue to menu
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">Log in</Link>
          </p>
        </div>
      </section>
    </main>
  );
}