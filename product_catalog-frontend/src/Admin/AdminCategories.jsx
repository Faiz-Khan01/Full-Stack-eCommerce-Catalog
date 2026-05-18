import { useEffect, useState } from "react";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);

  // Fetch categories
  const fetchCategories = () => {
    fetch("https://full-stack-ecommerce-catalog-13.onrender.com/api/admin/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = () => {
    fetch("https://full-stack-ecommerce-catalog-13.onrender.com/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }).then(() => {
      setName("");
      fetchCategories();
    });
  };

  const updateCategory = (id) => {
    fetch(`https://full-stack-ecommerce-catalog-13.onrender.com/api/admin/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }).then(() => {
      setName("");
      setEditing(null);
      fetchCategories();
    });
  };

  const deleteCategory = (id) => {
    fetch(`https://full-stack-ecommerce-catalog-13.onrender.com/api/admin/categories/${id}`, {
      method: "DELETE",
    }).then(fetchCategories);
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

