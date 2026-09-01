
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    // Frontend-only login
    navigate("/dashboard");
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <Link to="/" className="login-logo">
          <span>🚆</span>
          <strong>RailPravah</strong>
        </Link>

        <div className="login-header">
          <p className="section-tag">🚆 WELCOME BACK</p>

          <h1>
            Sign <span>In</span>
          </h1>

          <p>
            Login to access your RailPravah railway dashboard.
          </p>
        </div>

        <form onSubmit={handleLogin}>

          <div className="login-field">
            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>

            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="show-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {error && (
            <p className="login-error">
              ⚠️ {error}
            </p>
          )}

          <button
            type="submit"
            className="login-submit-btn"
          >
            Login to Dashboard →
          </button>

        </form>

        <div className="login-footer">
          <span>Don't have an account?</span>

          <button
            type="button"
            onClick={() => navigate("/")}
          >
            Get Started
          </button>
        </div>

      </div>

    </div>
  );
}

export default Login;
