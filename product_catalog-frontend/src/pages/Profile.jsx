import { useState, useEffect } from "react";
import Swal from "sweetalert2";

// Production Endpoint Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://full-stack-ecommerce-catalog.onrender.com/api";

const Profile = () => {
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const token = localStorage.getItem("token");

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: storedUser.name || "",
    email: storedUser.email || "",
    phone: storedUser.phone || storedUser.mobile || "",
    address: storedUser.address || "",
    role: storedUser.role || "USER",
  });

  // Fetch fresh user data from server on component load
  useEffect(() => {
    if (!token || !storedUser.email) return;

    fetch(`${API_BASE_URL}/users/profile?email=${storedUser.email}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          const freshData = {
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || data.mobile || "",
            address: data.address || "",
            role: data.role || "USER",
          };
          setFormData(freshData);
          // Sync localStorage if server has updated info
          localStorage.setItem("user", JSON.stringify({ ...storedUser, ...freshData }));
        }
      })
      .catch((err) => console.error("Error syncing profile with server:", err));
  }, [token, storedUser.email]);

  // Save Profile to Database and Local Storage
  const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      Swal.fire("Warning", "Name and Email fields cannot be empty", "warning");
      return;
    }

    try {
      setLoading(true);

      // HIT API: Save data to Spring Boot Database permanently
      const res = await fetch(`${API_BASE_URL}/users/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Secure Spring Security mapping
        },
        body: JSON.stringify({
          oldEmail: storedUser.email, // keeping track of previous identity
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile on the server");
      }

      const data = await res.json();

      // Update both Local Storage and state after successful API sync
      const updatedUser = {
        ...storedUser,
        name: data.name || formData.name,
        email: data.email || formData.email,
        phone: data.phone || formData.phone,
        address: data.address || formData.address,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setIsEditing(false);

      Swal.fire({
        icon: "success",
        title: "Profile Sync Successful",
        text: "Your complete details are updated permanently in the database.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Profile Save Error:", error);
      Swal.fire({
        icon: "error",
        title: "Sync Failed",
        text: error.message || "Something went wrong while connecting to database",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow border-0 rounded-4 overflow-hidden">
            <div className="card-header bg-primary text-white text-center py-4">
              <h4 className="mb-0 fw-bold">Customer Profile</h4>
            </div>

            <div className="card-body p-5">
              {/* Avatar & Greeting */}
              <div className="text-center mb-4">
                <div
                  className="rounded-circle bg-light text-primary fw-bold d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm border"
                  style={{
                    width: "90px",
                    height: "90px",
                    fontSize: "36px",
                  }}
                >
                  {formData.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <h3 className="fw-bold text-dark">{formData.name || "Customer"}</h3>
                <p className="text-muted mb-0">{formData.email}</p>
              </div>

              <hr className="my-4 text-muted opacity-25" />

              <div className="row g-4">
                {/* Full Name */}
                <div className="col-md-6">
                  <label className="form-label fw-bold text-secondary small text-uppercase">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  ) : (
                    <p className="fs-6 text-dark border-bottom pb-2 mb-0">{formData.name || "Not provided"}</p>
                  )}
                </div>

                {/* Email Address */}
                <div className="col-md-6">
                  <label className="form-label fw-bold text-secondary small text-uppercase">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  ) : (
                    <p className="fs-6 text-dark border-bottom pb-2 mb-0">{formData.email || "Not provided"}</p>
                  )}
                </div>

                {/* Mobile / Phone Number */}
                <div className="col-md-6">
                  <label className="form-label fw-bold text-secondary small text-uppercase">Mobile Number</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. +91 9876543210"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  ) : (
                    <p className="fs-6 text-dark border-bottom pb-2 mb-0">{formData.phone || "Not provided"}</p>
                  )}
                </div>

                {/* Account Role */}
                <div className="col-md-6">
                  <label className="form-label fw-bold text-secondary small text-uppercase">Account Role</label>
                  <div>
                    <span className="badge bg-secondary p-2 px-3 fw-semibold">
                      {formData.role}
                    </span>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="col-12">
                  <label className="form-label fw-bold text-secondary small text-uppercase">Shipping Address</label>
                  {isEditing ? (
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Enter your complete delivery address (Street, City, State, Pincode)"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  ) : (
                    <p className="fs-6 text-dark border-bottom pb-2 mb-0" style={{ whiteSpace: "pre-wrap" }}>
                      {formData.address || "No shipping address saved yet."}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5">
                {isEditing ? (
                  <div className="d-flex gap-3">
                    <button
                      className="btn btn-success flex-grow-1 py-2 fw-bold"
                      onClick={handleSave}
                      disabled={loading}
                    >
                      {loading ? "Saving Changes..." : "Save Changes"}
                    </button>
                    <button
                      className="btn btn-outline-secondary px-4 py-2"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: storedUser.name || "",
                          email: storedUser.email || "",
                          phone: storedUser.phone || storedUser.mobile || "",
                          address: storedUser.address || "",
                          role: storedUser.role || "USER",
                        });
                      }}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn btn-primary w-100 py-2 fw-bold"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile Details ✏️
                  </button>
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