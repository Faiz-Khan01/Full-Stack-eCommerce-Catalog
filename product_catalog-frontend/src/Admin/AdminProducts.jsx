import { useEffect, useState } from "react";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    price: "",
    description: "",
    imageUrl: "",
    category: { id: "" },
  });

  const fetchProducts = () => {
    fetch("https://full-stack-ecommerce-catalog-13.onrender.com/api/admin/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(err => console.error("Error fetching products:", err));
  };

  const fetchCategories = () => {
    fetch("https://full-stack-ecommerce-catalog-13.onrender.com/api/admin/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(err => console.error("Error fetching categories:", err));
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const saveProduct = () => {
    // Validation
    if (!form.name || !form.price || !form.category.id) {
      alert("Please fill in Name, Price, and Category");
      return;
    }

    const url = form.id
      ? `https://full-stack-ecommerce-catalog-13.onrender.com/api/admin/products/${form.id}`
      : "https://full-stack-ecommerce-catalog-13.onrender.com/api/admin/products";
    const method = form.id ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (res.ok) {
          alert(form.id ? "Product Updated!" : "Product Added!");
          setForm({ id: null, name: "", price: "", description: "", imageUrl: "", category: { id: "" } });
          fetchProducts();
        } else {
          alert("Server error. Check if Category ID exists.");
        }
      })
      .catch(err => alert("Failed to connect to server"));
  };

  const editProduct = (product) => {
    setForm({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      imageUrl: product.imageUrl,
      category: { id: product.category.id },
    });
    // Scroll to top to see the form
    window.scrollTo(0, 0);
  };

  const deleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      fetch(`https://full-stack-ecommerce-catalog-13.onrender.com/api/admin/products/${id}`, { method: "DELETE" })
        .then(() => fetchProducts())
        .catch(err => alert("Error deleting product"));
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🛠️ Product Management</h2>
        <span className="badge bg-secondary">{products.length} Items in Inventory</span>
      </div>

      {/* Form Section */}
      <div className="card shadow-sm p-4 mb-5 bg-light border-0">
        <h5 className={form.id ? "text-primary" : "text-success"}>
          {form.id ? "✏️ Edit Product" : "➕ Add New Product"}
        </h5>
        <div className="row">
          <div className="col-md-6 mb-2">
            <input className="form-control" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="col-md-3 mb-2">
            <input type="number" className="form-control" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </div>
          <div className="col-md-3 mb-2">
            <select className="form-select" value={form.category.id} onChange={(e) => setForm({ ...form, category: { id: e.target.value } })}>
              <option value="">Select Category</option>
              {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
          <div className="col-md-12 mb-2">
            <textarea className="form-control" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="col-md-9 mb-2">
            <input className="form-control" placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          </div>
          <div className="col-md-3 mb-2">
            <button className={`btn w-100 ${form.id ? "btn-primary" : "btn-success"}`} onClick={saveProduct}>
              {form.id ? "Update Changes" : "Save Product"}
            </button>
          </div>
        </div>
        {form.imageUrl && (
            <div className="mt-2 text-center">
                <p className="text-muted small">Preview:</p>
                <img src={form.imageUrl} alt="preview" style={{height: '80px', borderRadius: '5px'}} />
            </div>
        )}
      </div>

      {/* Table Section */}
      <div className="table-responsive shadow-sm">
        <table className="table table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id}>
                <td><img src={prod.imageUrl} alt={prod.name} style={{width: '50px', height: '50px', objectFit: 'cover'}} /></td>
                <td className="fw-bold">{prod.name}</td>
                <td className="text-success fw-bold">${prod.price.toFixed(2)}</td>
                <td><span className="badge bg-info text-dark">{prod.category.name}</span></td>
                <td className="text-center">
                  <button className="btn btn-outline-primary btn-sm me-2" onClick={() => editProduct(prod)}>Edit</button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => deleteProduct(prod.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
