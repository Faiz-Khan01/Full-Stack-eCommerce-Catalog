import { useState } from "react";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    // Current admin login logic
    if (password === "admin123") {
      localStorage.setItem(
        "user",
        JSON.stringify({
          role: "admin",
          email: "admin@techstore.com",
        })
      );

      window.location.href = "/admin";
    } else {
      setError("Invalid admin password. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center p-3"
      style={{
        background:
          "linear-gradient(135deg, #eef2ff 0%, #f8fafc 45%, #f5f3ff 100%)",
      }}
    >
      <div
        className="position-absolute top-0 start-0 w-100"
        style={{
          height: "5px",
          background:
            "linear-gradient(90deg, #4f46e5, #7c3aed, #9333ea)",
        }}
      />

      <div className="container">
        <div className="row justify-content-center">

          <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">

            {/* Login Card */}
            <div
              className="card border-0 shadow-lg rounded-4 overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.96)",
                backdropFilter: "blur(10px)",
              }}
            >

              <div className="card-body p-4 p-md-5">

                {/* Logo */}
                <div className="text-center mb-4">

                  <div
                    className="mx-auto mb-3 rounded-4 d-flex align-items-center justify-content-center"
                    style={{
                      width: "72px",
                      height: "72px",
                      background:
                        "linear-gradient(135deg, #4f46e5, #7c3aed)",
                      color: "white",
                      fontSize: "32px",
                      boxShadow:
                        "0 12px 25px rgba(79,70,229,0.25)",
                    }}
                  >
                    🔐
                  </div>

                  <h3 className="fw-bold mb-1">
                    Admin Access
                  </h3>

                  <p className="text-muted mb-0">
                    Sign in to manage your store
                  </p>

                </div>

                {/* Admin Badge */}
                <div className="text-center mb-4">

                  <span
                    className="badge rounded-pill px-3 py-2"
                    style={{
                      background: "#eef2ff",
                      color: "#4f46e5",
                    }}
                  >
                    🛡️ Administrator
                  </span>

                </div>

                {/* Error */}
                {error && (
                  <div
                    className="alert border-0 rounded-3 d-flex align-items-center mb-4"
                    style={{
                      background: "#fef2f2",
                      color: "#dc2626",
                    }}
                  >
                    <span className="me-2">
                      ⚠️
                    </span>

                    <small className="fw-semibold">
                      {error}
                    </small>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleLogin}>

                  <div className="mb-3">

                    <label className="form-label fw-semibold">
                      Admin Password
                    </label>

                    <div className="input-group input-group-lg">

                      <span
                        className="input-group-text border-end-0"
                        style={{
                          background: "#f8fafc",
                        }}
                      >
                        🔑
                      </span>

                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        className="form-control border-start-0 border-end-0"
                        style={{
                          background: "#f8fafc",
                          boxShadow: "none",
                        }}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError("");
                        }}
                        required
                      />

                      <button
                        type="button"
                        className="input-group-text border-start-0"
                        style={{
                          background: "#f8fafc",
                        }}
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>

                    </div>

                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    className="btn w-100 btn-lg rounded-3 fw-semibold"
                    disabled={loading}
                    style={{
                      background:
                        "linear-gradient(135deg, #4f46e5, #7c3aed)",
                      color: "white",
                      border: "none",
                      boxShadow:
                        "0 8px 20px rgba(79,70,229,0.25)",
                    }}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Login to Dashboard →
                      </>
                    )}
                  </button>

                </form>

                {/* Divider */}
                <div className="d-flex align-items-center my-4">

                  <div
                    className="flex-grow-1"
                    style={{
                      height: "1px",
                      background: "#e5e7eb",
                    }}
                  />

                  <span className="px-3 text-muted small">
                    Secure Admin Area
                  </span>

                  <div
                    className="flex-grow-1"
                    style={{
                      height: "1px",
                      background: "#e5e7eb",
                    }}
                  />

                </div>

                {/* Security Info */}
                <div
                  className="rounded-3 p-3"
                  style={{
                    background: "#f8fafc",
                  }}
                >

                  <div className="d-flex align-items-start">

                    <span className="me-2">
                      🔒
                    </span>

                    <div>

                      <div className="fw-semibold small">
                        Administrator Only
                      </div>

                      <small className="text-muted">
                        This area is restricted to store administrators.
                      </small>

                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* Footer */}
            <div className="text-center mt-4">

              <small className="text-muted">
                © 2026 TechStore Admin Panel
              </small>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminLogin;