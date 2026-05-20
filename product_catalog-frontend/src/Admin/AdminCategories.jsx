import { useEffect, useState } from "react";

// FIX 1: Corrected default fallback URL (Removed -13)
const API_BASE_URL = 
  import.meta.env.VITE_API_BASE_URL || 
  'https://full-stack-ecommerce-catalog.onrender.com/api';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);

  // Helper function to get token and set request headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token"); // Assumes token is saved here on login
    return {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    };
  };

  // Fetch categories
  const fetchCategories = () => {
    // FIX 2: Added Auth Headers to prevent 403 Forbidden
    fetch(`${API_BASE_URL}/admin/categories`, { headers: getAuthHeaders() })
      .then((res) => {
        if (res.status === 403) throw new Error("403 Forbidden - Check Admin Token");
        return res.json();
      })
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = () => {
    if (!name.trim()) {
      alert("Category name cannot be empty");
      return;
    }

    // FIX 2: Added Auth Headers
    fetch(`${API_BASE_URL}/admin/categories`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ name }),
    }).then((res) => {
      if (res.ok) {
        setName("");
        fetchCategories();
      } else {
        alert("Failed to add category. Check permissions.");
      }
    }).catch(err => console.error(err));
  };

  const updateCategory = (id) => {
    if (!name.trim()) {
      alert("Category name cannot be empty");
      return;
    }

    // FIX 2: Added Auth Headers
    fetch(`${API_BASE_URL}/admin/categories/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ name }),
    }).then((res) => {
      if (res.ok) {
        setName("");
        setEditing(null);
        fetchCategories();
      } else {
        alert("Failed to update category.");
      }
    }).catch(err => console.error(err));
  };

  const deleteCategory = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      // FIX 2: Added Auth Headers
      fetch(`${API_BASE_URL}/admin/categories/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      }).then((res) => {
        if (res.ok) {
          fetchCategories();
        } else {
          alert("Failed to delete category.");
        }
      }).catch(err => console.error(err));
    }
  };

  return (
    <div className="container mt-4">
      <h2>Manage Categories</h2>

      <div className="mb-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category Name"
          className="form-control"
        />
        {editing ? (
          <button className="btn btn-primary mt-2" onClick={() => updateCategory(editing)}>
            Update
          </button>
        ) : (
          <button className="btn btn-success mt-2" onClick={addCategory}>
            Add
          </button>
        )}
      </div>

      <ul className="list-group">
        {categories.map((cat) => (
          <li key={cat.id} className="list-group-item d-flex justify-content-between align-items-center">
            {cat.name}
            <div>
              <button
                className="btn btn-sm btn-info me-2"
                onClick={() => {
                  setName(cat.name);
                  setEditing(cat.id);
                }}
              >
                Edit
              </button>
              <button className="btn btn-sm btn-danger" onClick={() => deleteCategory(cat.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminCategories;