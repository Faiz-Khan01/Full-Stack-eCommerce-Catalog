import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import api from "../services/api";
import Swal from "sweetalert2";

const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch low stock / inventory products
  const fetchInventory = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      else setRefreshing(true);
      setError("");

      const [lowRes, allRes] = await Promise.allSettled([
        api.get("/admin/inventory/low-stock"),
        api.get("/admin/products"),
      ]);

      let list = [];
      if (allRes.status === "fulfilled") {
        const d = allRes.value.data?.data || allRes.value.data;
        if (Array.isArray(d)) list = d;
      }
      if (list.length === 0 && lowRes.status === "fulfilled") {
        const d = lowRes.value.data?.data || lowRes.value.data;
        if (Array.isArray(d)) list = d;
      }

      setProducts(list);
    } catch (err) {
      console.error("Inventory error:", err);
      setError(err.response?.data?.message || err.message || "Failed to load inventory.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInventory(true);
  }, []);

  // Handle Real Restock with SweetAlert2
  const handleRestock = async (product) => {
    const currentStock = Number(product.stockQuantity ?? product.stock ?? product.quantity ?? 0);

    const { value: formValues } = await Swal.fire({
      title: `Restock ${product.name}`,
      html: `
        <div style="text-align: left; font-size: 14px;">
          <p class="mb-2 text-muted">Current Stock: <b>${currentStock} units</b></p>
          <label class="form-label fw-bold small text-secondary">Units to Add:</label>
          <input id="swal-restock-add" type="number" min="1" class="form-control mb-3" placeholder="e.g. 20" value="10" />
          
          <label class="form-label fw-bold small text-secondary">Or Set New Total Stock:</label>
          <input id="swal-restock-total" type="number" min="0" class="form-control" placeholder="New total stock" value="${currentStock + 10}" />
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "⚡ Update Stock",
      confirmButtonColor: "#10b981",
      cancelButtonText: "Cancel",
      didOpen: () => {
        const addInput = document.getElementById("swal-restock-add");
        const totalInput = document.getElementById("swal-restock-total");
        if (addInput && totalInput) {
          addInput.addEventListener("input", () => {
            const addVal = Number(addInput.value) || 0;
            totalInput.value = currentStock + addVal;
          });
          totalInput.addEventListener("input", () => {
            const totalVal = Number(totalInput.value) || 0;
            addInput.value = Math.max(0, totalVal - currentStock);
          });
        }
      },
      preConfirm: () => {
        const totalInput = document.getElementById("swal-restock-total");
        const totalVal = Number(totalInput?.value);
        if (isNaN(totalVal) || totalVal < 0) {
          Swal.showValidationMessage("Please enter a valid stock number (0 or greater).");
          return false;
        }
        return totalVal;
      },
    });

    if (formValues === undefined) return;

    const newStock = formValues;

    try {
      setUpdatingId(product.id);
      await api.put(`/admin/inventory/${product.id}?stock=${newStock}`);

      Swal.fire({
        icon: "success",
        title: "Restocked Successfully!",
        text: `${product.name} stock has been updated to ${newStock} units.`,
        toast: true,
        position: "top-end",
        timer: 2500,
        showConfirmButton: false,
      });

      // Update local state immediately
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? { ...p, stockQuantity: newStock, stock: newStock, quantity: newStock }
            : p
        )
      );
    } catch (err) {
      console.error("Restock failed:", err);
      Swal.fire({
        icon: "error",
        title: "Restock Failed",
        text: err.response?.data?.message || err.message || "Could not update stock level.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  // Inventory stats
  const stats = useMemo(() => {
    let totalStock = 0;
    let outOfStock = 0;
    let lowStock = 0;
    let inStock = 0;

    products.forEach((p) => {
      const stock = Number(p.stockQuantity ?? p.stock ?? p.quantity ?? 0);
      const threshold = Number(p.lowStockThreshold ?? 5);
      totalStock += stock;
      if (stock === 0) outOfStock++;
      else if (stock <= threshold) lowStock++;
      else inStock++;
    });

    return { totalStock, outOfStock, lowStock, inStock, count: products.length };
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.productName && p.productName.toLowerCase().includes(q)) ||
        (p.category?.name && p.category.name.toLowerCase().includes(q));

      const stock = Number(p.stockQuantity ?? p.stock ?? p.quantity ?? 0);
      const threshold = Number(p.lowStockThreshold ?? 5);

      let matchStatus = true;
      if (statusFilter === "OUT_OF_STOCK") matchStatus = stock === 0;
      else if (statusFilter === "LOW_STOCK") matchStatus = stock > 0 && stock <= threshold;
      else if (statusFilter === "IN_STOCK") matchStatus = stock > threshold;

      return matchSearch && matchStatus;
    });
  }, [products, search, statusFilter]);

  // Chart data
  const chartData = useMemo(() => {
    return products
      .slice(0, 8)
      .map((p) => ({
        name: (p.name || p.productName || "Item").substring(0, 14),
        stock: Number(p.stockQuantity ?? p.stock ?? p.quantity ?? 0),
        threshold: Number(p.lowStockThreshold ?? 5),
      }));
  }, [products]);

  const pieData = useMemo(() => {
    return [
      { name: "In Stock", value: stats.inStock, color: "#10b981" },
      { name: "Low Stock", value: stats.lowStock, color: "#f59e0b" },
      { name: "Out of Stock", value: stats.outOfStock, color: "#ef4444" },
    ].filter((item) => item.value > 0);
  }, [stats]);

  if (loading) {
    return (
      <div className="admin-inventory-page d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ color: "#10b981", width: "3rem", height: "3rem" }}></div>
          <p className="text-muted fw-semibold">Loading Inventory Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-inventory-page p-4" style={{ background: "#f8fafc", minHeight: "100vh" }}>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold m-0 text-slate-900" style={{ fontSize: "22px" }}>
            📊 Inventory & Stock Management
          </h2>
          <p className="text-muted small m-0">
            Monitor real-time stock levels, resolve shortages, and restock products instantly.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-dark rounded-pill px-4 fw-semibold d-flex align-items-center gap-2"
          onClick={() => fetchInventory(false)}
          disabled={refreshing}
        >
          <span>{refreshing ? "🔄" : "⟳"}</span> {refreshing ? "Refreshing..." : "Refresh Inventory"}
        </button>
      </div>

      {error && <div className="alert alert-danger rounded-3 mb-4">{error}</div>}

      {/* KPI Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div className="p-3 bg-white border rounded-4 shadow-sm">
            <span className="text-muted small fw-bold text-uppercase">Total SKUs</span>
            <h3 className="fw-bold text-slate-900 m-0 mt-1">{stats.count}</h3>
            <span className="text-muted small">{stats.totalStock} total units in warehouse</span>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="p-3 bg-white border rounded-4 shadow-sm" style={{ borderLeft: "4px solid #10b981" }}>
            <span className="text-success small fw-bold text-uppercase">In Stock (Healthy)</span>
            <h3 className="fw-bold text-success m-0 mt-1">{stats.inStock}</h3>
            <span className="text-muted small">Above safety threshold</span>
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

      {/* Charts Section */}
      <div className="row g-3 mb-4">
        <div className="col-lg-8">
          <div className="p-3 bg-white border rounded-4 shadow-sm h-100">
            <h6 className="fw-bold text-slate-800 mb-3">📈 Stock Levels by Product</h6>
            <div style={{ height: "220px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                  <Tooltip />
                  <Bar dataKey="stock" fill="#10b981" radius={[4, 4, 0, 0]} name="Stock Units" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="p-3 bg-white border rounded-4 shadow-sm h-100">
            <h6 className="fw-bold text-slate-800 mb-3">🥧 Stock Distribution</h6>
            <div style={{ height: "220px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-3 bg-white border rounded-4 shadow-sm mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0">🔍</span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search products by name or category..."
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
            <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="ALL">All Stock Levels</option>
              <option value="LOW_STOCK">⚠️ Low Stock (≤ 5)</option>
              <option value="OUT_OF_STOCK">❌ Out of Stock (0)</option>
              <option value="IN_STOCK">✅ Healthy Stock (&gt; 5)</option>
            </select>
          </div>

          <div className="col-6 col-md-3 text-end text-muted small">
            Showing <b>{filteredProducts.length}</b> of <b>{products.length}</b> products
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border rounded-4 shadow-sm overflow-hidden">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: "60px" }}>IMAGE</th>
                <th>PRODUCT NAME</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th className="text-center">STOCK LEVEL</th>
                <th>STATUS</th>
                <th className="text-end px-4">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-5 text-muted">
                    No products matched your search or filter.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const stock = Number(product.stockQuantity ?? product.stock ?? product.quantity ?? 0);
                  const threshold = Number(product.lowStockThreshold ?? 5);
                  const isOut = stock === 0;
                  const isLow = stock > 0 && stock <= threshold;
                  const isUpdating = updatingId === product.id;

                  return (
                    <tr key={product.id}>
                      <td>
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            style={{ width: "42px", height: "42px", objectFit: "cover", borderRadius: "8px" }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "42px",
                              height: "42px",
                              background: "#f1f5f9",
                              borderRadius: "8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            📦
                          </div>
                        )}
                      </td>

                      <td>
                        <div className="fw-semibold text-slate-900">{product.name || product.productName}</div>
                        <div className="small text-muted">ID: #{product.id}</div>
                      </td>

                      <td>
                        <span className="badge bg-light text-dark border">
                          {product.category?.name || "General"}
                        </span>
                      </td>

                      <td>
                        <span className="fw-bold text-slate-900">
                          ₹{Number(product.price || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                      </td>

                      <td className="text-center">
                        <span
                          className={`fw-bold px-3 py-1 rounded-pill ${
                            isOut
                              ? "bg-danger text-white"
                              : isLow
                              ? "bg-warning text-dark"
                              : "bg-success-subtle text-success border border-success"
                          }`}
                          style={{ fontSize: "13px" }}
                        >
                          {stock} units
                        </span>
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
                        <button
                          type="button"
                          className="btn btn-sm btn-dark rounded-pill px-3 fw-semibold d-inline-flex align-items-center gap-1"
                          onClick={() => handleRestock(product)}
                          disabled={isUpdating}
                        >
                          <span>{isUpdating ? "⏳" : "⚡"}</span>
                          {isUpdating ? "Updating..." : "Restock"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminInventory;
