import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import Swal from "sweetalert2";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [stockFilter, setStockFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("none");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "10",
    categoryId: "",
    imageUrl: "",
  });

  const fetchData = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      else setRefreshing(true);
      setError("");

      const [prodRes, catRes] = await Promise.allSettled([
        api.get("/admin/products"),
        api.get("/categories"),
      ]);

      if (prodRes.status === "fulfilled") {
        const d = prodRes.value.data?.data || prodRes.value.data;
        setProducts(Array.isArray(d) ? d : []);
      }
      if (catRes.status === "fulfilled") {
        const d = catRes.value.data?.data || catRes.value.data;
        setCategories(Array.isArray(d) ? d : []);
      }
    } catch (err) {
      console.error("Products loading error:", err);
      setError(err.response?.data?.message || err.message || "Failed to load products.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData(true);
  }, []);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "20",
      categoryId: categories[0]?.id ? String(categories[0].id) : "",
      imageUrl: "",
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || product.productName || "",
      description: product.description || "",
      price: String(product.price || 0),
      stock: String(product.stockQuantity ?? product.stock ?? product.quantity ?? 0),
      categoryId: String(product.category?.id || product.categoryId || ""),
      imageUrl: product.imageUrl || "",
    });
    setIsModalOpen(true);
  };

  // Save Product (Create or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      Swal.fire({ icon: "warning", title: "Missing Name", text: "Product name is required." });
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      Swal.fire({ icon: "warning", title: "Invalid Price", text: "Please enter a valid price." });
      return;
    }

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      stock: Number(formData.stock || 0),
      imageUrl: formData.imageUrl.trim(),
      categoryId: formData.categoryId ? Number(formData.categoryId) : null,
      category: formData.categoryId ? { id: Number(formData.categoryId) } : null,
    };

    try {
      setSubmitting(true);
      if (editingProduct) {
        // Edit product
        await api.put(`/admin/products/${editingProduct.id}`, payload);
        Swal.fire({
          icon: "success",
          title: "Product Updated!",
          text: `"${payload.name}" updated successfully.`,
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        // Create product
        await api.post("/admin/products", payload);
        Swal.fire({
          icon: "success",
          title: "Product Added!",
          text: `"${payload.name}" added to catalog.`,
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
      }

      setIsModalOpen(false);
      await fetchData(false);
    } catch (err) {
      console.error("Save product error:", err);
      Swal.fire({
        icon: "error",
        title: "Operation Failed",
        text: err.response?.data?.message || err.message || "Failed to save product.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Product
  const handleDelete = async (product) => {
    const confirm = await Swal.fire({
      title: `Delete "${product.name || product.productName}"?`,
      text: "This product will be permanently removed from your catalog.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete Product",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/admin/products/${product.id}`);
      Swal.fire({
        icon: "success",
        title: "Product Deleted",
        text: "Item removed from catalog.",
        toast: true,
        position: "top-end",
        timer: 2000,
        showConfirmButton: false,
      });
      await fetchData(false);
    } catch (err) {
      console.error("Delete product error:", err);
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: err.response?.data?.message || err.message || "Could not delete product.",
      });
    }
  };

  // Quick Stock Update (+1 / -1 / prompt)
  const handleQuickStock = async (product, change) => {
    const currentStock = Number(product.stockQuantity ?? product.stock ?? product.quantity ?? 0);
    const newStock = Math.max(0, currentStock + change);

    try {
      await api.put(`/admin/inventory/${product.id}?stock=${newStock}`);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? { ...p, stockQuantity: newStock, stock: newStock, quantity: newStock }
            : p
        )
      );
    } catch (err) {
      console.error("Quick stock update failed:", err);
    }
  };

  // Stats
  const stats = useMemo(() => {
    let totalValuation = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    products.forEach((p) => {
      const price = Number(p.price || 0);
      const stock = Number(p.stockQuantity ?? p.stock ?? p.quantity ?? 0);
      totalValuation += price * stock;
      if (stock === 0) outOfStockCount++;
      else if (stock <= 5) lowStockCount++;
    });

    return {
      total: products.length,
      valuation: totalValuation,
      lowStock: lowStockCount,
      outOfStock: outOfStockCount,
    };
  }, [products]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.productName && p.productName.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q));

      const pCatId = p.category?.id || p.categoryId;
      const matchCategory =
        selectedCategory === "ALL" || String(pCatId) === String(selectedCategory);

      const stock = Number(p.stockQuantity ?? p.stock ?? p.quantity ?? 0);
      let matchStock = true;
      if (stockFilter === "OUT") matchStock = stock === 0;
      else if (stockFilter === "LOW") matchStock = stock > 0 && stock <= 5;
      else if (stockFilter === "IN") matchStock = stock > 5;

      return matchSearch && matchCategory && matchStock;
    });

    if (sortOrder === "price-low") {
      list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sortOrder === "price-high") {
      list.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else if (sortOrder === "stock-low") {
      list.sort((a, b) => Number(a.stock || 0) - Number(b.stock || 0));
    } else if (sortOrder === "stock-high") {
      list.sort((a, b) => Number(b.stock || 0) - Number(a.stock || 0));
    }

    return list;
  }, [products, search, selectedCategory, stockFilter, sortOrder]);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ color: "#10b981", width: "3rem", height: "3rem" }}></div>
          <p className="text-muted fw-semibold">Loading Products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-products-page p-4" style={{ background: "#f8fafc", minHeight: "100vh" }}>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold m-0 text-slate-900" style={{ fontSize: "22px" }}>
            🏷️ Product Catalog Management
          </h2>
          <p className="text-muted small m-0">
            Create, update pricing, restock quantities, and manage store merchandise.
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
            <span>➕</span> Add New Product
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger rounded-3 mb-4">{error}</div>}

      {/* KPI Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div className="p-3 bg-white border rounded-4 shadow-sm">
            <span className="text-muted small fw-bold text-uppercase">Total SKUs</span>
            <h3 className="fw-bold text-slate-900 m-0 mt-1">{stats.total}</h3>
            <span className="text-muted small">{categories.length} Active Categories</span>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="p-3 bg-white border rounded-4 shadow-sm" style={{ borderLeft: "4px solid #10b981" }}>
            <span className="text-success small fw-bold text-uppercase">Total Inventory Value</span>
            <h3 className="fw-bold text-success m-0 mt-1">₹{stats.valuation.toLocaleString("en-IN")}</h3>
            <span className="text-muted small">Warehouse asset valuation</span>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="p-3 bg-white border rounded-4 shadow-sm" style={{ borderLeft: "4px solid #f59e0b" }}>
            <span className="text-warning small fw-bold text-uppercase">Low Stock Alert</span>
            <h3 className="fw-bold text-warning m-0 mt-1">{stats.lowStock}</h3>
            <span className="text-muted small">≤ 5 units remaining</span>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="p-3 bg-white border rounded-4 shadow-sm" style={{ borderLeft: "4px solid #ef4444" }}>
            <span className="text-danger small fw-bold text-uppercase">Out of Stock</span>
            <h3 className="fw-bold text-danger m-0 mt-1">{stats.outOfStock}</h3>
            <span className="text-muted small">Immediate restock required</span>
          </div>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="p-3 bg-white border rounded-4 shadow-sm mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0">🔍</span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search products by title, description..."
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

          <div className="col-6 col-md-3">
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-6 col-md-2">
            <select className="form-select" value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
              <option value="ALL">All Stock</option>
              <option value="IN">In Stock (&gt;5)</option>
              <option value="LOW">Low Stock (≤5)</option>
              <option value="OUT">Out of Stock (0)</option>
            </select>
          </div>

          <div className="col-12 col-md-3">
            <select className="form-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="none">Sort: Default</option>
              <option value="price-low">Price: Low to High ↑</option>
              <option value="price-high">Price: High to Low ↓</option>
              <option value="stock-low">Stock: Low to High ↑</option>
              <option value="stock-high">Stock: High to Low ↓</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border rounded-4 shadow-sm overflow-hidden mb-4">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: "60px" }}>IMAGE</th>
                <th>PRODUCT DETAILS</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th className="text-center">STOCK LEVEL</th>
                <th>STATUS</th>
                <th className="text-end px-4">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-5 text-muted">
                    No products found matching your search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const stock = Number(product.stockQuantity ?? product.stock ?? product.quantity ?? 0);
                  const isOut = stock === 0;
                  const isLow = stock > 0 && stock <= 5;

                  return (
                    <tr key={product.id}>
                      <td>
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "10px", border: "1px solid #e2e8f0" }}
                            onError={(e) => (e.target.style.display = "none")}
                          />
                        ) : (
                          <div
                            style={{
                              width: "48px",
                              height: "48px",
                              background: "#f1f5f9",
                              borderRadius: "10px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "20px",
                            }}
                          >
                            📦
                          </div>
                        )}
                      </td>

                      <td>
                        <div className="fw-semibold text-slate-900" style={{ fontSize: "14px" }}>
                          {product.name || product.productName}
                        </div>
                        <div className="small text-muted text-truncate" style={{ maxWidth: "260px" }}>
                          {product.description || "No description."}
                        </div>
                      </td>

                      <td>
                        <span className="badge bg-light text-dark border">
                          {product.category?.name || "General"}
                        </span>
                      </td>

                      <td>
                        <span className="fw-bold text-slate-900" style={{ fontSize: "14px" }}>
                          ₹{Number(product.price || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                      </td>

                      <td className="text-center">
                        <div className="d-inline-flex align-items-center gap-1 bg-light border rounded-pill px-2 py-1">
                          <button
                            type="button"
                            className="btn btn-sm btn-link text-dark p-0 text-decoration-none fw-bold"
                            style={{ width: "20px", height: "20px", lineHeight: "1" }}
                            onClick={() => handleQuickStock(product, -1)}
                            disabled={stock <= 0}
                          >
                            -
                          </button>
                          <span className="fw-bold px-2" style={{ fontSize: "13px", minWidth: "30px" }}>
                            {stock}
                          </span>
                          <button
                            type="button"
                            className="btn btn-sm btn-link text-dark p-0 text-decoration-none fw-bold"
                            style={{ width: "20px", height: "20px", lineHeight: "1" }}
                            onClick={() => handleQuickStock(product, 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td>
                        {isOut ? (
                          <span className="badge bg-danger-subtle text-danger border border-danger rounded-pill px-3 py-1">
                            ● Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="badge bg-warning-subtle text-warning border border-warning rounded-pill px-3 py-1">
                            ● Low Stock
                          </span>
                        ) : (
                          <span className="badge bg-success-subtle text-success border border-success rounded-pill px-3 py-1">
                            ● In Stock
                          </span>
                        )}
                      </td>

                      <td className="text-end px-4">
                        <div className="d-inline-flex gap-1">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-dark rounded-pill px-3 fw-semibold"
                            onClick={() => handleOpenEdit(product)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-semibold"
                            onClick={() => handleDelete(product)}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
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
            overflowY: "auto",
          }}
        >
          <div
            className="modal-card-custom bg-white border rounded-4 p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", maxWidth: "620px", maxHeight: "90vh", overflowY: "auto" }}
          >
            <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
              <h5 className="fw-bold m-0 text-slate-900">
                {editingProduct ? "✏️ Edit Product" : "➕ Add New Product"}
              </h5>
              <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-8">
                  <label className="form-label small fw-bold text-slate-700">Product Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Wireless Noise-Cancelling Headphones"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-bold text-slate-700">Category *</label>
                  <select
                    className="form-select"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-slate-700">Selling Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-control"
                    placeholder="e.g. 1999"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-slate-700">Initial Stock (Units) *</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    placeholder="e.g. 50"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-bold text-slate-700">Product Image URL</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                  {formData.imageUrl && (
                    <div className="mt-2 text-center p-2 bg-light border rounded-3">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        style={{ maxHeight: "120px", objectFit: "contain", borderRadius: "6px" }}
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    </div>
                  )}
                </div>

                <div className="col-12">
                  <label className="form-label small fw-bold text-slate-700">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Detailed specifications, features, warranty..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  ></textarea>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-3 border-top mt-4">
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
                  {submitting ? "Saving..." : editingProduct ? "Update Product" : "Publish Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
