import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://full-stack-ecommerce-catalog-13.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (res.ok) {
        // 1. Store Security Token
        localStorage.setItem("token", data.token);

        // 2. Store User Profile
        const userObj = { 
          role: data.role || "USER",
          name: data.name || "User",
          email: data.email 
        }; 
        localStorage.setItem("user", JSON.stringify(userObj));
        
        // 3. Role-based Redirect
        if (userObj.role.toLowerCase() === "admin") {
          navigate("/admin");
        } else {
          navigate("/profile");
        }
      } else {
        // This now correctly accesses the JSON 'message' from Java
        alert(data.message || "Invalid email or password");
      }
    } catch (err) {
      console.error("Login Connection Error:", err);
      alert("Cannot connect to server. Please ensure Spring Boot is running on port 8080.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4 card p-4 shadow border-0">
          <h3 className="text-center mb-4 fw-bold text-primary">Login</h3>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label small fw-bold">Email Address</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="email@example.com" 
                onChange={(e) => setCredentials({...credentials, email: e.target.value})} 
                required 
              />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-bold">Password</label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="Enter password" 
                onChange={(e) => setCredentials({...credentials, password: e.target.value})} 
                required 
              />
            </div>
            <button className="btn btn-primary w-100 fw-bold py-2 mt-2">Login</button>
          </form>
          <div className="text-center mt-4">
            <span className="text-muted">New here? </span>
            <Link to="/signup" className="text-decoration-none fw-bold">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
