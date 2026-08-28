// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import Swal from "sweetalert2";

// // FIX: Corrected production fallback URL (Removed -13)
// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL ||
//   "https://full-stack-ecommerce-catalog.onrender.com/api";

// const Signup = () => {
//   const navigate = useNavigate();

//   const [user, setUser] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);

//   // Handle Input Change
//   const handleChange = (e) => {
//     setUser({
//       ...user,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // Handle Signup
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       setLoading(true);

//       const res = await fetch(`${API_BASE_URL}/auth/register`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(user),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Registration failed");
//       }

//       Swal.fire({
//         icon: "success",
//         title: "Account Created",
//         text: "Please login to continue",
//       });

//       navigate("/login");
//     } catch (error) {
//       console.error("Signup Error:", error);

//       Swal.fire({
//         icon: "error",
//         title: "Signup Failed",
//         text: error.message,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container py-5">
//       <div className="row justify-content-center">
//         <div className="col-md-5 col-lg-4">
//           <div className="card shadow border-0">
//             <div className="card-body p-4">
//               {/* Heading */}
//               <div className="text-center mb-4">
//                 <h2 className="fw-bold text-primary">
//                   Create Account
//                 </h2>

//                 <p className="text-muted">
//                   Join TechStore today
//                 </p>
//               </div>

//               {/* Form */}
//               <form onSubmit={handleSubmit}>
//                 {/* Name */}
//                 <div className="mb-3">
//                   <label className="form-label fw-semibold">
//                     Full Name
//                   </label>

//                   <input
//                     type="text"
//                     name="name"
//                     className="form-control"
//                     placeholder="Enter your name"
//                     required
//                     value={user.name}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 {/* Email */}
//                 <div className="mb-3">
//                   <label className="form-label fw-semibold">
//                     Email Address
//                   </label>

//                   <input
//                     type="email"
//                     name="email"
//                     className="form-control"
//                     placeholder="Enter email"
//                     required
//                     value={user.email}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 {/* Password */}
//                 <div className="mb-4">
//                   <label className="form-label fw-semibold">
//                     Password
//                   </label>

//                   <input
//                     type="password"
//                     name="password"
//                     className="form-control"
//                     placeholder="Create password"
//                     required
//                     value={user.password}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 {/* Submit */}
//                 <button
//                   type="submit"
//                   className="btn btn-warning w-100 fw-bold py-2"
//                   disabled={loading}
//                 >
//                   {loading ? "Creating Account..." : "Sign Up"}
//                 </button>
//               </form>

//               {/* Login Link */}
//               <div className="text-center mt-4">
//                 <span className="text-muted">
//                   Already have an account?
//                 </span>

//                 <Link
//                   to="/login"
//                   className="ms-2 text-decoration-none fw-bold"
//                 >
//                   Login
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;




























import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

// Production API fallback
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
  const [showPassword, setShowPassword] = useState(false);

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

      await Swal.fire({
        icon: "success",
        title: "Account Created",
        text: "Please login to continue",
        confirmButtonColor: "#4f46e5",
      });

      navigate("/login");
    } catch (error) {
      console.error("Signup Error:", error);

      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: error.message,
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">

      {/* Background Decoration */}
      <div className="background-shape shape-one"></div>
      <div className="background-shape shape-two"></div>
      <div className="background-grid"></div>

      <div className="container">
        <div className="row min-vh-100 align-items-center justify-content-center py-5">

          <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">

            {/* Signup Card */}
            <div className="signup-card">

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

                <h2 className="signup-title">
                  Create your account ✨
                </h2>

                <p className="signup-description">
                  Join TechStore today
                </p>

              </div>

              {/* Signup Form */}
              <form onSubmit={handleSubmit}>

                {/* Name */}
                <div className="input-group-modern mb-3">

                  <label htmlFor="name">
                    Full Name
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
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21a8 8 0 0116 0" />
                    </svg>

                    <input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      required
                      autoComplete="name"
                      value={user.name}
                      onChange={handleChange}
                    />

                  </div>

                </div>

                {/* Email */}
                <div className="input-group-modern mb-3">

                  <label htmlFor="email">
                    Email Address
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
                      name="email"
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                      value={user.email}
                      onChange={handleChange}
                    />

                  </div>

                </div>

                {/* Password */}
                <div className="input-group-modern mb-4">

                  <div className="password-label-row">

                    <label htmlFor="password">
                      Password
                    </label>

                    <span className="password-hint">
                      Secure password
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
                      name="password"
                      placeholder="Create password"
                      required
                      autoComplete="new-password"
                      value={user.password}
                      onChange={handleChange}
                    />

                    {/* Show Password */}
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

                {/* Submit */}
                <button
                  type="submit"
                  className="signup-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account

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
                <span>SECURE ACCOUNT</span>
              </div>

              {/* Login Link */}
              <div className="login-section">

                <span>
                  Already have an account?
                </span>

                <Link to="/login">
                  Login
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

        .signup-page {
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

        /* =========================
           Background
        ========================= */

        .background-shape {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(2px);
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

        .background-grid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.25;

          background-image:
            linear-gradient(
              rgba(99, 102, 241, 0.035) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(99, 102, 241, 0.035) 1px,
              transparent 1px
            );

          background-size: 45px 45px;
        }

        /* =========================
           Card
        ========================= */

        .signup-card {
          position: relative;
          z-index: 2;

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

        /* =========================
           Brand
        ========================= */

        .brand-icon {
          width: 52px;
          height: 52px;

          margin: 0 auto 12px;

          display: flex;
          align-items: center;
          justify-content: center;

          color: white;

          background:
            linear-gradient(
              135deg,
              #4f46e5,
              #7c3aed
            );

          border-radius: 15px;

          box-shadow:
            0 10px 25px rgba(79, 70, 229, 0.25);
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

        /* =========================
           Heading
        ========================= */

        .signup-title {
          margin: 0;

          color: #111827;

          font-size: 24px;
          font-weight: 750;

          letter-spacing: -0.5px;
        }

        .signup-description {
          color: #64748b;

          font-size: 14px;

          margin: 6px 0 0;
        }

        /* =========================
           Inputs
        ========================= */

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

        /* =========================
           Password
        ========================= */

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

        /* =========================
           Signup Button
        ========================= */

        .signup-button {
          width: 100%;
          height: 50px;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 10px;

          border: 0;

          border-radius: 12px;

          background:
            linear-gradient(
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

        .signup-button:hover:not(:disabled) {
          transform: translateY(-1px);

          box-shadow:
            0 14px 28px rgba(79, 70, 229, 0.32);
        }

        .signup-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .signup-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* =========================
           Spinner
        ========================= */

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

        /* =========================
           Divider
        ========================= */

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

        /* =========================
           Login
        ========================= */

        .login-section {
          display: flex;

          align-items: center;

          justify-content: center;

          gap: 5px;

          font-size: 12px;

          color: #64748b;
        }

        .login-section a {
          color: #4f46e5;

          font-weight: 700;

          text-decoration: none;

          transition: color 0.2s ease;
        }

        .login-section a:hover {
          color: #3730a3;

          text-decoration: underline;
        }

        /* =========================
           Security
        ========================= */

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

        /* =========================
           Mobile
        ========================= */

        @media (max-width: 576px) {

          .signup-card {
            padding: 30px 22px;
            border-radius: 20px;
          }

          .signup-title {
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

export default Signup;