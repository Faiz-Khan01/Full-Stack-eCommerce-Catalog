import React, { useState } from "react";

const Profile = () => {
  // 1. Get initial user data from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  
  // 2. States for editing
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: storedUser.name || "",
    email: storedUser.email || ""
  });

  // Handle Save
  const handleSave = () => {
    const updatedUser = { ...storedUser, ...formData };
    
    // Save to localStorage so Navbar and Profile stay updated
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    setIsEditing(false);
    alert("Profile updated successfully!");
    // Optional: window.location.reload(); // To sync with Navbar instantly
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow border-0">
            <div className="card-header bg-primary text-white text-center py-3">
              <h4 className="mb-0">👤 {isEditing ? "Edit Profile" : "My Profile"}</h4>
            </div>
            <div className="card-body p-4">
              
              <div className="mb-4 text-center">
                <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center shadow-sm" 
                     style={{ width: "80px", height: "80px", fontSize: "2rem" }}>
                  {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
                </div>
              </div>

              {/* Name Field */}
              <div className="row mb-3 border-bottom pb-2">
                <div className="col-sm-4 text-muted fw-bold text-uppercase small">Name</div>
                <div className="col-sm-8">
                  {isEditing ? (
                    <input 
                      type="text" 
                      className="form-control form-control-sm"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  ) : (
                    <span className="fw-semibold">{formData.name || "N/A"}</span>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="row mb-3 border-bottom pb-2">
                <div className="col-sm-4 text-muted fw-bold text-uppercase small">Email</div>
                <div className="col-sm-8">
                  {isEditing ? (
                    <input 
                      type="email" 
                      className="form-control form-control-sm"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  ) : (
                    <span>{formData.email || "N/A"}</span>
                  )}
                </div>
              </div>

              {/* Account Type (ReadOnly) */}
              <div className="row mb-3 border-bottom pb-2">
                <div className="col-sm-4 text-muted fw-bold text-uppercase small">Account Type</div>
                <div className="col-sm-8">
                  <span className={`badge ${storedUser.role === 'admin' ? 'bg-danger' : 'bg-success'}`}>
                    {storedUser.role?.toUpperCase() || "USER"}
                  </span>
                </div>
              </div>
              
              {/* Button Logic */}
              <div className="mt-4 d-grid gap-2">
                {isEditing ? (
                  <>
                    <button className="btn btn-success" onClick={handleSave}>Save Changes</button>
                    <button className="btn btn-outline-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                  </>
                ) : (
                  <button className="btn btn-outline-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;