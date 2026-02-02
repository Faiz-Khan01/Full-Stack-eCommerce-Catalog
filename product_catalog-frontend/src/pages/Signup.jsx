import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8082/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (res.ok) {
        alert("Registration successful! Please login.");
        navigate("/login");
      } else {
        alert("Registration failed. Email might already exist.");
      }
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4 card p-4 shadow border-0">
          <h3 className="text-center mb-4">Create Account</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input 
                className="form-control" 
                placeholder="Full Name" 
                onChange={(e) => setUser({...user, name: e.target.value})} 
                required 
              />
            </div>
            <div className="mb-3">
              <input 
                className="form-control" 
                type="email" 
                placeholder="Email" 
                onChange={(e) => setUser({...user, email: e.target.value})} 
                required 
              />
            </div>
            <div className="mb-3">
              <input 
                className="form-control" 
                type="password" 
                placeholder="Password" 
                onChange={(e) => setUser({...user, password: e.target.value})} 
                required 
              />
            </div>
            <button className="btn btn-warning w-100 fw-bold">Sign Up</button>
          </form>
          <p className="text-center mt-3">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>  
      </div>
    </div>
  );
};

export default Signup;