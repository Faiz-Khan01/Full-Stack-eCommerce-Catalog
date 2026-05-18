import { useState } from "react";

const AdminLogin = () => {
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Logic: If password matches, save admin role and force reload
    if (password === "admin123") {
      localStorage.setItem("user", JSON.stringify({ role: "admin", email: "admin@techstore.com" }));
      window.location.href = "/admin"; // Forces Navbar to refresh state
    } else {
      alert("Invalid Admin Password");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4 card p-4 shadow border-0 bg-light text-dark">
          <h3 className="text-center mb-4 text-primary">Admin Access</h3>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              className="form-control mb-3" 
              placeholder="Enter Admin Password" 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
            <button type="submit" className="btn btn-primary w-100">Login as Admin</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
