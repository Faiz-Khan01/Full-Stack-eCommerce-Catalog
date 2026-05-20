import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

// FIX: Corrected production fallback URL (Removed -13)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://full-stack-ecommerce-catalog.onrender.com/api";

const Login = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save Token
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Save User
      const userData = {
        name: data.name || "User",
        email: data.email,
        role: data.role || "USER",
      };

      localStorage.setItem("user", JSON.stringify(userData));

      // Success Alert
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        toast: true,
        position: "top-end",
        timer: 1500,
        showConfirmButton: false,
      });

      // Redirect
      if (userData.role.toLowerCase() === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }

      // Refresh navbar state
      window.location.reload();
    } catch (error) {
      console.error("Login Error:", error);

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5 col-lg-4">
          <div className="card shadow border-0">
            <div className="card-body p-4">
              {/* Heading */}
              <div className="text-center mb-4">
                <h2 className="fw-bold text-primary">
                  Welcome Back
                </h2>
                <p className="text-muted">
                  Login to your account
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin}>
                {/* Email */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Email Address
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    required
                    value={credentials.email}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        email: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Password
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    required
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        password: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn btn-primary w-100 fw-bold py-2"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              {/* Signup */}
              <div className="text-center mt-4">
                <span className="text-muted">
                  Don&apos;t have an account?
                </span>

                <Link
                  to="/signup"
                  className="ms-2 text-decoration-none fw-bold"
                >
                  Sign Up
                </Link>
              </div>

              {/* Admin Login */}
              <div className="text-center mt-3">
                <Link
                  to="/admin-login"
                  className="small text-danger text-decoration-none"
                >
                  Admin Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;