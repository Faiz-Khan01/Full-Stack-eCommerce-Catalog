import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";

// Production API fallback
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://full-stack-ecommerce-catalog.onrender.com/api";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // =====================================================
  // Handle Email / Password Login
  // =====================================================
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email.trim().toLowerCase(),
          password: credentials.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // =================================================
      // Validate JWT
      // =================================================
      if (!data.token) {
        throw new Error("Login succeeded but no authentication token was returned.");
      }

      // =================================================
      // Validate User ID
      // =================================================
      if (data.id === null || data.id === undefined) {
        console.error("Login response does not contain user ID:", data);

        throw new Error(
          "Login succeeded but the server did not return a user ID."
        );
      }

      const userData = {
        id: Number(data.id),
        userId: Number(data.id),
        name: data.name || "User",
        email: data.email || credentials.email.trim().toLowerCase(),
        role: data.role || "USER",
      };

      // Use AuthContext login
      login(userData, data.token);

      // =================================================
      // Success Alert
      // =================================================
      await Swal.fire({
        icon: "success",
        title: "Welcome back!",
        text: "You have successfully logged in.",
        toast: true,
        position: "top-end",
        timer: 1500,
        showConfirmButton: false,
      });

      // =================================================
      // Redirect Based on Role
      // =================================================
      if (userData.role?.toLowerCase() === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login Error:", error);

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message || "Invalid email or password",
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // Google OAuth2 Login
  // =====================================================
  const handleGoogleLogin = () => {
    const baseAuthUrl = import.meta.env.VITE_API_BASE_URL
      ? "http://localhost:8082"
      : "https://full-stack-ecommerce-catalog.onrender.com";

    window.location.href = `${baseAuthUrl}/oauth2/authorization/google`;
  };

  return (
    <div className="login-page">

      {/* Background Decoration */}
      <div className="background-shape shape-one"></div>
      <div className="background-shape shape-two"></div>

      <div className="container">
        <div className="row min-vh-100 align-items-center justify-content-center py-5">

          <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">

            {/* Login Card */}
            <div className="login-card">

              {/* Logo / Brand */}
              <div className="text-center mb-4">

                <div className="brand-icon">
                  <svg
                    viewBox="0 0 24 24"
                    width="25"
                    height="25"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" />
                    <path d="M3 6h18" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                </div>

                <h1 className="brand-title">
                  Tech<span>Store</span>
                </h1>

                <p className="brand-subtitle">
                  Your favorite products, all in one place.
                </p>
              </div>

              {/* Heading */}
              <div className="mb-4">
                <h2 className="login-title">
                  Welcome back 👋
                </h2>

                <p className="login-description">
                  Sign in to continue to your account
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin}>

                {/* Email */}
                <div className="input-group-modern mb-3">

                  <label htmlFor="email">
                    Email address
                  </label>

                  <div className="input-wrapper">

                    <svg
                      className="input-icon"
                      viewBox="0 0 24 24"
                      width="19"
                      height="19"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="2"
                      />
                      <path d="m3 7 9 6 9-6" />
                    </svg>

                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                      value={credentials.email}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          email: e.target.value,
                        })
                      }
                    />

                  </div>
                </div>

                {/* Password */}
                <div className="input-group-modern mb-3">

                  <div className="password-label-row">

                    <label htmlFor="password">
                      Password
                    </label>

                    <span className="password-hint">
                      Secure login
                    </span>

                  </div>

                  <div className="input-wrapper">

                    <svg
                      className="input-icon"
                      viewBox="0 0 24 24"
                      width="19"
                      height="19"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect
                        x="3"
                        y="11"
                        width="18"
                        height="10"
                        rx="2"
                      />

                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                      value={credentials.password}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          password: e.target.value,
                        })
                      }
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <svg
                          viewBox="0 0 24 24"
                          width="19"
                          height="19"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M3 3l18 18" />
                          <path d="M10.6 10.6a2 2 0 102.8 2.8" />
                          <path d="M9.9 4.2A10.7 10.7 0 0112 4c7 0 10 8 10 8a16.8 16.8 0 01-3 4.2" />
                          <path d="M6.6 6.6C3.8 8.6 2 12 2 12s3 8 10 8a10.7 10.7 0 004.1-.8" />
                        </svg>
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          width="19"
                          height="19"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M2 12s3-8 10-8 10 8 10 8-3 8-10 8S2 12 2 12z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>

                  </div>
                </div>

                {/* Remember / Forgot */}
                <div className="login-options mb-4">

                  <label className="remember-me">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>

                  <button
                    type="button"
                    className="forgot-password"
                    onClick={() =>
                      Swal.fire({
                        icon: "info",
                        title: "Forgot password?",
                        text: "Please contact support to reset your password.",
                        confirmButtonColor: "#4f46e5",
                      })
                    }
                  >
                    Forgot password?
                  </button>

                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="login-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in

                      <svg
                        viewBox="0 0 24 24"
                        width="19"
                        height="19"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 12h14" />
                        <path d="m13 6 6 6-6 6" />
                      </svg>
                    </>
                  )}
                </button>

              </form>

              {/* Divider */}
              <div className="divider">
                <span>OR CONTINUE WITH</span>
              </div>

              {/* Google */}
              <button
                type="button"
                className="google-button"
                onClick={handleGoogleLogin}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.09-1.92 3.28-4.74 3.28-8.09z"
                  />

                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.15v2.86A11 11 0 0012 23z"
                  />

                  <path
                    fill="#FBBC05"
                    d="M5.84 14.1A6.6 6.6 0 015.5 12c0-.73.13-1.43.34-2.1V7.04H2.15A11 11 0 001 12c0 1.79.43 3.48 1.15 4.96l3.69-2.86z"
                  />

                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.07.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 002.15 7.04l3.69 2.86C6.71 7.31 9.14 5.38 12 5.38z"
                  />
                </svg>

                Continue with Google
              </button>

              {/* Signup */}
              <div className="signup-section">
                <span>
                  Don't have an account?
                </span>

                <Link to="/signup">
                  Create an account
                </Link>
              </div>

              {/* Admin */}
              <div className="admin-section">
                <Link to="/admin-login">
                  🔐 Admin Login
                </Link>
              </div>

              {/* Security */}
              <div className="security-note">
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>

                Your information is securely protected
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Modern UI Styles */}
      <style>{`

        .login-page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 10% 20%,
              rgba(99, 102, 241, 0.12),
              transparent 35%
            ),
            radial-gradient(
              circle at 90% 80%,
              rgba(168, 85, 247, 0.12),
              transparent 35%
            ),
            #f8fafc;
        }

        .background-shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(2px);
          pointer-events: none;
        }

        .shape-one {
          width: 420px;
          height: 420px;
          background: rgba(79, 70, 229, 0.08);
          top: -220px;
          left: -180px;
        }

        .shape-two {
          width: 380px;
          height: 380px;
          background: rgba(124, 58, 237, 0.08);
          right: -180px;
          bottom: -180px;
        }

        .login-card {
          position: relative;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 24px;
          padding: 36px 34px;
          box-shadow:
            0 25px 70px rgba(15, 23, 42, 0.10),
            0 8px 25px rgba(15, 23, 42, 0.05);
          backdrop-filter: blur(16px);
          animation: cardEnter 0.5s ease-out;
        }

        @keyframes cardEnter {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .brand-icon {
          width: 52px;
          height: 52px;
          margin: 0 auto 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          background: linear-gradient(
            135deg,
            #4f46e5,
            #7c3aed
          );
          border-radius: 15px;
          box-shadow: 0 10px 25px rgba(79, 70, 229, 0.25);
        }

        .brand-title {
          margin: 0;
          font-size: 25px;
          font-weight: 800;
          letter-spacing: -0.7px;
          color: #111827;
        }

        .brand-title span {
          color: #4f46e5;
        }

        .brand-subtitle {
          margin: 5px 0 0;
          color: #94a3b8;
          font-size: 12px;
        }

        .login-title {
          margin: 0;
          color: #111827;
          font-size: 24px;
          font-weight: 750;
          letter-spacing: -0.5px;
        }

        .login-description {
          color: #64748b;
          font-size: 14px;
          margin: 6px 0 0;
        }

        .input-group-modern label {
          display: block;
          margin-bottom: 7px;
          color: #334155;
          font-size: 13px;
          font-weight: 650;
        }

        .password-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .password-hint {
          color: #94a3b8;
          font-size: 11px;
          font-weight: 500;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-wrapper input {
          width: 100%;
          height: 50px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #f8fafc;
          padding: 0 45px;
          color: #1e293b;
          font-size: 14px;
          outline: none;
          transition: all 0.2s ease;
        }

        .input-wrapper input::placeholder {
          color: #a8b2c1;
        }

        .input-wrapper input:hover {
          border-color: #cbd5e1;
          background: #fff;
        }

        .input-wrapper input:focus {
          border-color: #6366f1;
          background: #fff;
          box-shadow:
            0 0 0 4px rgba(99, 102, 241, 0.10);
        }

        .input-icon {
          position: absolute;
          left: 16px;
          color: #94a3b8;
          z-index: 2;
          pointer-events: none;
        }

        .password-toggle {
          position: absolute;
          right: 8px;
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: #94a3b8;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .password-toggle:hover {
          background: #eef2ff;
          color: #4f46e5;
        }

        .login-options {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .remember-me {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #64748b;
          font-size: 12px;
          cursor: pointer;
        }

        .remember-me input {
          width: 15px;
          height: 15px;
          accent-color: #4f46e5;
          cursor: pointer;
        }

        .forgot-password {
          border: 0;
          background: transparent;
          color: #4f46e5;
          font-size: 12px;
          font-weight: 600;
          padding: 0;
          cursor: pointer;
        }

        .forgot-password:hover {
          color: #3730a3;
          text-decoration: underline;
        }

        .login-button {
          width: 100%;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: 0;
          border-radius: 12px;
          background: linear-gradient(
            135deg,
            #4f46e5,
            #7c3aed
          );
          color: white;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          box-shadow:
            0 10px 22px rgba(79, 70, 229, 0.25);
          transition: all 0.2s ease;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow:
            0 14px 28px rgba(79, 70, 229, 0.32);
        }

        .login-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 17px;
          height: 17px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
          color: #a1aabd;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.8px;
        }

        .divider::before,
        .divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: #e8edf3;
        }

        .google-button {
          width: 100%;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: white;
          color: #334155;
          font-size: 13px;
          font-weight: 650;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .google-button:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
          transform: translateY(-1px);
          box-shadow: 0 5px 15px rgba(15, 23, 42, 0.06);
        }

        .signup-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          margin-top: 24px;
          font-size: 12px;
          color: #64748b;
        }

        .signup-section a {
          color: #4f46e5;
          font-weight: 700;
          text-decoration: none;
        }

        .signup-section a:hover {
          color: #3730a3;
          text-decoration: underline;
        }

        .admin-section {
          text-align: center;
          margin-top: 14px;
        }

        .admin-section a {
          color: #dc2626;
          font-size: 11px;
          font-weight: 600;
          text-decoration: none;
          opacity: 0.85;
        }

        .admin-section a:hover {
          opacity: 1;
          text-decoration: underline;
        }

        .security-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          margin-top: 22px;
          padding-top: 17px;
          border-top: 1px solid #f1f5f9;
          color: #94a3b8;
          font-size: 10px;
        }

        .security-note svg {
          color: #22c55e;
        }

        @media (max-width: 576px) {

          .login-card {
            padding: 30px 22px;
            border-radius: 20px;
          }

          .login-title {
            font-size: 22px;
          }

          .brand-title {
            font-size: 23px;
          }

        }

      `}</style>
    </div>
  );
};

export default Login;