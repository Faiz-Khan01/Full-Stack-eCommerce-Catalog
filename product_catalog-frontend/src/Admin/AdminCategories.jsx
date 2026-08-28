import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import Swal from "sweetalert2";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });

  const fetchData = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      else setRefreshing(true);
      setError("");

      const [catRes, prodRes] = await Promise.allSettled([
        api.get("/categories"),
        api.get("/admin/products"),
      ]);

      if (catRes.status === "fulfilled") {
        const d = catRes.value.data?.data || catRes.value.data;
        setCategories(Array.isArray(d) ? d : []);
      }
      if (prodRes.status === "fulfilled") {
        const d = prodRes.value.data?.data || prodRes.value.data;
        setProducts(Array.isArray(d) ? d : []);
      }
    } catch (err) {
      console.error("Categories fetch error:", err);
      setError(err.response?.data?.message || err.message || "Failed to load categories.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData(true);
  }, []);

  // Map product counts per category
  const categoryProductCounts = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      const catId = p.category?.id || p.categoryId;
      if (catId) {
        counts[catId] = (counts[catId] || 0) + 1;
      }
    });
    return counts;
  }, [products]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "", imageUrl: "" });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || "",
      description: category.description || "",
      imageUrl: category.imageUrl || "",
    });
    setIsModalOpen(true);
  };

  // Save Category (Create or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      Swal.fire({ icon: "warning", title: "Validation Error", text: "Category name is required." });
      return;
    }

    try {
      setSubmitting(true);
      if (editingCategory) {
        // Edit category
        await api.put(`/admin/categories/${editingCategory.id}`, formData);
        Swal.fire({
          icon: "success",
          title: "Category Updated!",
          text: `"${formData.name}" has been updated.`,
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        // Create category
        await api.post("/admin/categories", formData);
        Swal.fire({
          icon: "success",
          title: "Category Created!",
          text: `"${formData.name}" has been added.`,
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
      }

      setIsModalOpen(false);
      await fetchData(false);
    } catch (err) {
      console.error("Save category error:", err);
      Swal.fire({
        icon: "error",
        title: "Operation Failed",
        text: err.response?.data?.message || err.message || "Could not save category.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Category
  const handleDelete = async (category) => {
    const count = categoryProductCounts[category.id] || 0;
    const confirm = await Swal.fire({
      title: `Delete "${category.name}"?`,
      html: `
        <p class="text-muted small">
          ${count > 0 ? `⚠️ This category contains <b>${count} products</b>.` : "Are you sure you want to delete this category?"}
        </p>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/admin/categories/${category.id}`);
      Swal.fire({
        icon: "success",
        title: "Category Deleted",
        text: `"${category.name}" has been removed.`,
        toast: true,
        position: "top-end",
        timer: 2000,
        showConfirmButton: false,
      });
      await fetchData(false);
    } catch (err) {
      console.error("Delete category error:", err);
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: err.response?.data?.message || err.message || "Could not delete category.",
      });
    }
  };

  // Filtered categories
  const filteredCategories = useMemo(() => {
    const q = search.toLowerCase();
    return categories.filter(
      (c) =>
        !search ||
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q))
    );
  }, [categories, search]);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ color: "#10b981", width: "3rem", height: "3rem" }}></div>
          <p className="text-muted fw-semibold">Loading Categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-categories-page p-4" style={{ background: "#f8fafc", minHeight: "100vh" }}>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold m-0 text-slate-900" style={{ fontSize: "22px" }}>
            🗂️ Category Management
          </h2>
          <p className="text-muted small m-0">
            Organize products into intuitive categories for seamless store browsing.
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-dark rounded-pill px-4 fw-semibold d-flex align-items-center gap-2"
            onClick={() => fetchData(false)}
            disabled={refreshing}
          >
            <span>{refreshing ? "🔄" : "⟳"}</span> {refreshing ? "Refreshing..." : "Refresh"}
          </button>

          <button
            type="button"
            className="btn btn-dark rounded-pill px-4 fw-semibold d-flex align-items-center gap-2"
            onClick={handleOpenCreate}
            style={{ background: "#0f172a" }}
          >
            <span>➕</span> Add New Category
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger rounded-3 mb-4">{error}</div>}

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-4">
          <div className="p-3 bg-white border rounded-4 shadow-sm">
            <span className="text-muted small fw-bold text-uppercase">Total Categories</span>
            <h3 className="fw-bold text-slate-900 m-0 mt-1">{categories.length}</h3>
            <span className="text-muted small">Active department categories</span>
          </div>
        </div>

        <div className="col-6 col-lg-4">
          <div className="p-3 bg-white border rounded-4 shadow-sm" style={{ borderLeft: "4px solid #10b981" }}>
            <span className="text-success small fw-bold text-uppercase">Categorized Products</span>
            <h3 className="fw-bold text-success m-0 mt-1">{products.length}</h3>
            <span className="text-muted small">Items mapped across departments</span>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="p-3 bg-white border rounded-4 shadow-sm" style={{ borderLeft: "4px solid #6366f1" }}>
            <span className="text-indigo small fw-bold text-uppercase" style={{ color: "#6366f1" }}>Average Catalog Depth</span>
            <h3 className="fw-bold m-0 mt-1" style={{ color: "#6366f1" }}>
              {categories.length > 0 ? (products.length / categories.length).toFixed(1) : 0} items / cat
            </h3>
            <span className="text-muted small">Even catalog distribution</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3 bg-white border rounded-4 shadow-sm mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0">🔍</span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search categories by name or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className="btn btn-outline-secondary" type="button" onClick={() => setSearch("")}>
                  ✕
                </button>
              )}
            </div>
          </div>
          <div className="col-12 col-md-6 text-md-end text-muted small">
            Showing <b>{filteredCategories.length}</b> of <b>{categories.length}</b> categories
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="row g-3">
        {filteredCategories.length === 0 ? (
          <div className="col-12">
            <div className="p-5 text-center bg-white border rounded-4 shadow-sm text-muted">
              <div style={{ fontSize: "36px" }}>📭</div>
              <h6 className="fw-bold mt-2">No categories found</h6>
              <p className="small mb-3">Try adjusting your search query or add a new category.</p>
              <button className="btn btn-sm btn-dark rounded-pill px-4" onClick={handleOpenCreate}>
                ➕ Create Category
              </button>
            </div>
          </div>
        ) : (
          filteredCategories.map((category) => {
            const count = categoryProductCounts[category.id] || 0;
            return (
              <div key={category.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                <div className="card h-100 border rounded-4 shadow-sm overflow-hidden bg-white hover-shadow transition">
                  <div
                    style={{
                      height: "120px",
                      background: category.imageUrl
                        ? `url(${category.imageUrl}) center/cover no-repeat`
                        : "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: "rgba(15, 23, 42, 0.75)",
                        backdropFilter: "blur(6px)",
                        color: "#fff",
                        padding: "3px 10px",
                        borderRadius: "20px",
                        fontSize: "11px",
                        fontWeight: "700",
                      }}
                    >
                      {count} {count === 1 ? "Product" : "Products"}
                    </div>
                  </div>

                  <div className="card-body p-3 d-flex flex-column justify-content-between">
                    <div>
                      <h6 className="fw-bold text-slate-900 mb-1">{category.name}</h6>
                      <p className="text-muted small mb-3" style={{ minHeight: "36px", fontSize: "12px" }}>
                        {category.description || "No description provided."}
                      </p>
                    </div>

                    <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-dark rounded-pill px-3 fw-semibold"
                        onClick={() => handleOpenEdit(category)}
                      >
                        ✏️ Edit
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-semibold"
                        onClick={() => handleDelete(category)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div
          className="modal-backdrop-custom"
          onClick={() => setIsModalOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1060,
            padding: "20px",
          }}
        >
          <div
            className="modal-card-custom bg-white border rounded-4 p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", maxWidth: "520px" }}
          >
            <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
              <h5 className="fw-bold m-0 text-slate-900">
                {editingCategory ? "✏️ Edit Category" : "➕ Add New Category"}
              </h5>
              <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-slate-700">Category Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Smart Watches"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-slate-700">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Brief description of products in this category..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-slate-700">Cover Image URL (Optional)</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
                {formData.imageUrl && (
                  <div className="mt-2 text-center">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      style={{ maxHeight: "100px", borderRadius: "8px", objectFit: "cover" }}
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  </div>
                )}
              </div>

              <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill px-4"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-dark rounded-pill px-5 fw-semibold"
                  style={{ background: "#0f172a" }}
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
