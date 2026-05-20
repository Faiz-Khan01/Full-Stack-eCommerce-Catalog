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
  });

  // Fetch fresh user data from server on component load (Good Practice)
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
          setFormData({ name: data.name, email: data.email });
          // Sync localStorage if server has updated info
          localStorage.setItem("user", JSON.stringify({ ...storedUser, name: data.name, email: data.email }));
        }
      })
      .catch((err) => console.error("Error syncing profile with server:", err));
  }, [token, storedUser.email]);

  // Save Profile to Database and Local Storage
  const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      Swal.fire("Warning", "Fields cannot be empty", "warning");
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
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setIsEditing(false);

      Swal.fire({
        icon: "success",
        title: "Profile Sync Successful",
        text: "Your records are updated permanently in the cloud DB.",
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
        <div className="col-md-6">
          <div className="card shadow border-0">
            <div className="card-header bg-primary text-white text-center">
              <h4>My Profile</h4>
            </div>

            <div className="card-body p-4 text-center">
              {/* Avatar */}
              <div
                className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{
                  width: "80px",
                  height: "80px",
                  fontSize: "28px",
                }}
              >
                {formData.name?.charAt(0).toUpperCase() || "U"}
              </div>

              {/* Name */}
              <div className="mb-3 text-start">
                <label className="form-label fw-bold">Name</label>

                {isEditing ? (
                  <input
                    className="form-control"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p className="border-bottom pb-2 text-dark">{formData.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="mb-3 text-start">
                <label className="form-label fw-bold">Email</label>

                {isEditing ? (
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p className="border-bottom pb-2 text-dark">{formData.email}</p>
                )}
              </div>

              {/* Role */}
              <div className="mb-4 text-start">
                <label className="form-label fw-bold">Role</label>
                <p>
                  <span className="badge bg-secondary p-2">
                    {storedUser.role || "USER"}
                  </span>
                </p>
              </div>

              {/* Buttons */}
              {isEditing ? (
                <>
                  <button
                    className="btn btn-success w-100 mb-2"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? "Saving Changes..." : "Save Changes"}
                  </button>

                  <button
                    className="btn btn-outline-secondary w-100"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: storedUser.name || "",
                        email: storedUser.email || "",
                      });
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-primary w-100"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;