import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(form);
      navigate(location.state?.from?.pathname || "/");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to sign in");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <p className="eyebrow">MERN Stack Developer Intern Assessment</p>
        <h1>Sign in to User Management System</h1>
        <p className="muted">
          Use the seeded credentials after running the backend seed script. Admin, manager, and user
          flows are all supported.
        </p>

        <form className="stack" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input
              name="email"
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              required
              type="email"
              value={form.email}
            />
          </label>
          <label>
            <span>Password</span>
            <input
              name="password"
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              required
              type="password"
              value={form.password}
            />
          </label>
          {error && <p className="error-text">{error}</p>}
          <button className="primary-button" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="credential-card">
          <strong>Seeded accounts</strong>
          <p>admin@example.com / Admin@123</p>
          <p>manager@example.com / Manager@123</p>
          <p>user@example.com / User@123</p>
        </div>
      </div>
    </div>
  );
}
