import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

// FIX: Corrected production fallback URL (Removed -13)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://full-stack-ecommerce-catalog.onrender.com/api";

const Signup = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      Swal.fire({
        icon: "success",
        title: "Account Created",
        text: "Please login to continue",
      });

      navigate("/login");
    } catch (error) {
      console.error("Signup Error:", error);

      Swal.fire({
        icon: "error",
        title: "Signup Failed",
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
                  Create Account
                </h2>

                <p className="text-muted">
                  Join TechStore today
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter your name"
                    required
                    value={user.name}
                    onChange={handleChange}
                  />
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter email"
                    required
                    value={user.email}
                    onChange={handleChange}
                  />
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Create password"
                    required
                    value={user.password}
                    onChange={handleChange}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn btn-warning w-100 fw-bold py-2"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Sign Up"}
                </button>
              </form>

              {/* Login Link */}
              <div className="text-center mt-4">
                <span className="text-muted">
                  Already have an account?
                </span>

                <Link
                  to="/login"
                  className="ms-2 text-decoration-none fw-bold"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;