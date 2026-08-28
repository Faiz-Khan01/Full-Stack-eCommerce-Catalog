import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import Swal from "sweetalert2";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Customer Profile Modal
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchData = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      else setRefreshing(true);
      setError("");

      const [usersRes, ordersRes] = await Promise.allSettled([
        api.get("/admin/users"),
        api.get("/admin/orders"),
      ]);

      let userList = [];
      let orderList = [];

      if (usersRes.status === "fulfilled") {
        const d = usersRes.value.data?.data || usersRes.value.data;
        if (Array.isArray(d)) userList = d;
      }
      if (ordersRes.status === "fulfilled") {
        const d = ordersRes.value.data?.data || ordersRes.value.data;
        if (Array.isArray(d)) orderList = d;
      }

      // If /admin/users is empty or not configured, construct customer list from orders
      if (userList.length === 0 && orderList.length > 0) {
        const map = new Map();
        orderList.forEach((o) => {
          const email = o.userEmail || o.email;
          if (email && !map.has(email)) {
            map.set(email, {
              id: o.userId || Math.floor(Math.random() * 1000),
              name: o.fullName || email.split("@")[0],
              email: email,
              mobile: o.mobile || o.phone || "N/A",
              address: o.address || "N/A",
              createdAt: o.orderDate || o.createdAt,
            });
          }
        });
        userList = Array.from(map.values());
      }

      setCustomers(userList);
      setOrders(orderList);
    } catch (err) {
      console.error("Customers loading error:", err);
      setError(err.response?.data?.message || err.message || "Failed to load customers.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData(true);
  }, []);

  // Compute metrics per customer (order count, total spend, recent order)
  const customerMetrics = useMemo(() => {
    const map = {};
    orders.forEach((o) => {
      const email = (o.userEmail || o.email || "").toLowerCase();
      if (!email) return;
      if (!map[email]) {
        map[email] = {
          orderCount: 0,
          totalSpent: 0,
          orders: [],
          lastOrderDate: o.orderDate,
        };
      }
      map[email].orderCount += 1;
      map[email].totalSpent += Number(o.totalAmount || 0);
      map[email].orders.push(o);
    });
    return map;
  }, [orders]);

  // Overall stats
  const stats = useMemo(() => {
    let totalSpentAll = 0;
    let repeatCustomers = 0;

    customers.forEach((c) => {
      const metrics = customerMetrics[c.email?.toLowerCase()] || { orderCount: 0, totalSpent: 0 };
      totalSpentAll += metrics.totalSpent;
      if (metrics.orderCount > 1) repeatCustomers++;
    });

    return {
      total: customers.length,
      repeat: repeatCustomers,
      revenue: totalSpentAll,
      avgSpend: customers.length > 0 ? totalSpentAll / customers.length : 0,
    };
  }, [customers, customerMetrics]);

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    const q = search.toLowerCase();
    return customers.filter((c) => {
      return (
        !search ||
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.mobile && c.mobile.includes(q))
      );
    });
  }, [customers, search]);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ color: "#10b981", width: "3rem", height: "3rem" }}></div>
          <p className="text-muted fw-semibold">Loading Customer Directory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-customers-page p-4" style={{ background: "#f8fafc", minHeight: "100vh" }}>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold m-0 text-slate-900" style={{ fontSize: "22px" }}>
            👤 Customer Directory
          </h2>
          <p className="text-muted small m-0">
            View registered shoppers, lifetime spending, order histories, and contact info.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-dark rounded-pill px-4 fw-semibold d-flex align-items-center gap-2"
          onClick={() => fetchData(false)}
          disabled={refreshing}
        >
          <span>{refreshing ? "🔄" : "⟳"}</span> {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && <div className="alert alert-danger rounded-3 mb-4">{error}</div>}

      {/* KPI Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div className="p-3 bg-white border rounded-4 shadow-sm">
            <span className="text-muted small fw-bold text-uppercase">Total Customers</span>
            <h3 className="fw-bold text-slate-900 m-0 mt-1">{stats.total}</h3>
            <span className="text-muted small">Registered store buyers</span>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="p-3 bg-white border rounded-4 shadow-sm" style={{ borderLeft: "4px solid #10b981" }}>
            <span className="text-success small fw-bold text-uppercase">Total Customer Spend</span>
            <h3 className="fw-bold text-success m-0 mt-1">₹{stats.revenue.toLocaleString("en-IN")}</h3>
            <span className="text-muted small">Lifetime gross customer revenue</span>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="p-3 bg-white border rounded-4 shadow-sm" style={{ borderLeft: "4px solid #6366f1" }}>
            <span className="text-indigo small fw-bold text-uppercase" style={{ color: "#6366f1" }}>Repeat Buyers</span>
            <h3 className="fw-bold m-0 mt-1" style={{ color: "#6366f1" }}>{stats.repeat}</h3>
            <span className="text-muted small">Customers with &gt; 1 order</span>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="p-3 bg-white border rounded-4 shadow-sm" style={{ borderLeft: "4px solid #f59e0b" }}>
            <span className="text-warning small fw-bold text-uppercase">Avg Spend / User</span>
            <h3 className="fw-bold text-warning m-0 mt-1">₹{Math.round(stats.avgSpend).toLocaleString("en-IN")}</h3>
            <span className="text-muted small">Average customer lifetime value</span>
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
                placeholder="Search customers by name, email, phone..."
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
            Showing <b>{filteredCustomers.length}</b> of <b>{customers.length}</b> customers
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white border rounded-4 shadow-sm overflow-hidden mb-4">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: "50px" }}>AVATAR</th>
                <th>CUSTOMER NAME</th>
                <th>CONTACT EMAIL</th>
                <th>PHONE</th>
                <th className="text-center">TOTAL ORDERS</th>
                <th>LIFETIME SPEND</th>
                <th>STATUS</th>
                <th className="text-end px-4">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-5 text-muted">
                    No customers found matching your search.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => {
                  const emailKey = customer.email?.toLowerCase();
                  const metrics = customerMetrics[emailKey] || { orderCount: 0, totalSpent: 0, orders: [] };

                  return (
                    <tr key={customer.id || customer.email}>
                      <td>
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "800",
                            fontSize: "14px",
                          }}
                        >
                          {(customer.name || customer.email || "U")[0].toUpperCase()}
                        </div>
                      </td>

                      <td>
                        <div className="fw-semibold text-slate-900">{customer.name || "Valued Customer"}</div>
                        <div className="small text-muted">ID: #{customer.id || "N/A"}</div>
                      </td>

                      <td>
                        <a href={`mailto:${customer.email}`} className="text-decoration-none text-slate-700 small">
                          {customer.email}
                        </a>
                      </td>

                      <td>
                        <span className="small text-muted">{customer.mobile || "N/A"}</span>
                      </td>

                      <td className="text-center">
                        <span className="badge bg-light text-dark border px-3 py-1 rounded-pill fw-bold">
                          {metrics.orderCount} {metrics.orderCount === 1 ? "Order" : "Orders"}
                        </span>
                      </td>

                      <td>
                        <span className="fw-bold text-slate-900">
                          ₹{metrics.totalSpent.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                      </td>

                      <td>
                        <span className="badge bg-success-subtle text-success border border-success rounded-pill px-3 py-1">
                          ● Active
                        </span>
                      </td>

                      <td className="text-end px-4">
                        <button
                          type="button"
                          className="btn btn-sm btn-dark rounded-pill px-3 fw-semibold"
                          style={{ background: "#0f172a" }}
                          onClick={() => setSelectedCustomer({ ...customer, metrics })}
                        >
                          Profile 👤
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

      {/* CUSTOMER PROFILE MODAL */}
      {selectedCustomer && (
        <div
          className="modal-backdrop-custom"
          onClick={() => setSelectedCustomer(null)}
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
            style={{ width: "100%", maxWidth: "680px", maxHeight: "90vh", overflowY: "auto" }}
          >
            <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
              <div className="d-flex align-items-center gap-3">
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "800",
                    fontSize: "18px",
                  }}
                >
                  {(selectedCustomer.name || selectedCustomer.email || "U")[0].toUpperCase()}
                </div>
                <div>
                  <h5 className="fw-bold m-0 text-slate-900">{selectedCustomer.name || "Customer"}</h5>
                  <span className="small text-muted">{selectedCustomer.email}</span>
                </div>
              </div>
              <button type="button" className="btn-close" onClick={() => setSelectedCustomer(null)}></button>
            </div>

            {/* Profile Info Cards */}
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <div className="p-3 bg-light border rounded-3">
                  <span className="text-muted small fw-bold text-uppercase">📞 Contact Info</span>
                  <div className="small text-slate-800 mt-2"><b>Mobile:</b> {selectedCustomer.mobile || "N/A"}</div>
                  <div className="small text-slate-800"><b>Email:</b> {selectedCustomer.email}</div>
                  <div className="small text-slate-800 text-truncate"><b>Default Address:</b> {selectedCustomer.address || "N/A"}</div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="p-3 bg-light border rounded-3">
                  <span className="text-muted small fw-bold text-uppercase">💳 Lifetime Value</span>
                  <div className="small text-slate-800 mt-2">
                    <b>Total Orders Placed:</b> {selectedCustomer.metrics?.orderCount || 0}
                  </div>
                  <div className="small text-slate-900 fw-bold">
                    <b>Total Spend:</b> ₹{Number(selectedCustomer.metrics?.totalSpent || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </div>
                  <div className="small text-success fw-semibold"><b>Customer Standing:</b> Verified Active Buyer</div>
                </div>
              </div>
            </div>

            {/* Order History */}
            <div>
              <h6 className="fw-bold text-slate-900 mb-2">📜 Past Orders ({selectedCustomer.metrics?.orders?.length || 0})</h6>
              {!selectedCustomer.metrics?.orders || selectedCustomer.metrics.orders.length === 0 ? (
                <p className="text-muted small">No order records found for this user.</p>
              ) : (
                <div className="table-responsive border rounded-3 overflow-hidden">
                  <table className="table table-sm align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>ORDER #</th>
                        <th>DATE</th>
                        <th>AMOUNT</th>
                        <th>STATUS</th>
                        <th>PAYMENT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCustomer.metrics.orders.map((o) => (
                        <tr key={o.id}>
                          <td className="fw-bold font-monospace small">{o.orderNumber || `#${o.id}`}</td>
                          <td className="small text-muted">{o.orderDate ? new Date(o.orderDate).toLocaleDateString("en-IN") : "N/A"}</td>
                          <td className="small fw-bold">₹{Number(o.totalAmount || 0).toFixed(2)}</td>
                          <td>
                            <span className="badge bg-secondary rounded-pill">{o.orderStatus || "PLACED"}</span>
                          </td>
                          <td className="small">{o.paymentMethod || "COD"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="d-flex justify-content-end mt-4 pt-3 border-top">
              <button
                type="button"
                className="btn btn-dark rounded-pill px-4"
                style={{ background: "#0f172a" }}
                onClick={() => setSelectedCustomer(null)}
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
