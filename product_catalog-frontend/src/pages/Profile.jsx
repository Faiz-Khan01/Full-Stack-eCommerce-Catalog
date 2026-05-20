import { useState } from "react";

const Profile = () => {
  const storedUser =
    JSON.parse(localStorage.getItem("user")) || {};

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: storedUser.name || "",
    email: storedUser.email || "",
  });

  // Save Profile
  const handleSave = () => {
    const updatedUser = {
      ...storedUser,
      ...formData,
    };

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    setIsEditing(false);
    alert("Profile updated successfully");
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
                {formData.name?.charAt(0).toUpperCase() ||
                  "U"}
              </div>

              {/* Name */}
              <div className="mb-3 text-start">
                <label className="form-label fw-bold">
                  Name
                </label>

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
                  <p>{formData.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="mb-3 text-start">
                <label className="form-label fw-bold">
                  Email
                </label>

                {isEditing ? (
                  <input
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
                  <p>{formData.email}</p>
                )}
              </div>

              {/* Role */}
              <div className="mb-3 text-start">
                <label className="form-label fw-bold">
                  Role
                </label>

                <p>
                  <span className="badge bg-secondary">
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
                  >
                    Save
                  </button>

                  <button
                    className="btn btn-outline-secondary w-100"
                    onClick={() => setIsEditing(false)}
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