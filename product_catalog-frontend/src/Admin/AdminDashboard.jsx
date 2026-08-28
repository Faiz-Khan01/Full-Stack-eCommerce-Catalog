import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import api from "../services/api";

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────
const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const fmtRs = (n) => `₹${fmt(n)}`;

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const STATUS_COLOR_MAP = {
  PLACED:    "#f59e0b",
  PENDING:   "#f59e0b",
  PROCESSING:"#6366f1",
  SHIPPED:   "#06b6d4",
  DELIVERED: "#10b981",
  COMPLETED: "#10b981",
  CANCELLED: "#f43f5e",
  REFUND_INITIATED:"#8b5cf6",
};

const PIE_COLORS = ["#f59e0b","#6366f1","#06b6d4","#10b981","#f43f5e","#8b5cf6"];

const StatusPill = ({ status }) => {
  const s = (status || "PLACED").toUpperCase();
  const color = STATUS_COLOR_MAP[s] || "#94a3b8";
  return (
    <span style={{
      background: `${color}18`, color, border: `1px solid ${color}40`,
      padding: "2px 9px", borderRadius: 20, fontSize: 10, fontWeight: 700, display: "inline-block",
    }}>{s}</span>
  );
};

// ─────────────────────────────────────────────────────────
// Revenue area chart custom tooltip
// ─────────────────────────────────────────────────────────
const RevenueTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 10, padding: "10px 14px" }}>
      <div style={{ color: "#94a3b8", fontSize: 11, marginBottom: 4 }}>{label}</div>
      <div style={{ color: "#10b981", fontWeight: 700, fontSize: 14 }}>₹{fmt(payload[0]?.value)}</div>
      <div style={{ color: "#64748b", fontSize: 11 }}>{payload[1]?.value || 0} orders</div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [orders, setOrders]       = useState([]);
  const [products, setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]         = useState("");
  const [search, setSearch]       = useState("");

  // ── Fetch data ──────────────────────────────────────────
  const fetchData = async (initial = false) => {
    try {
      if (initial) setLoading(true); else setRefreshing(true);
      setError("");
      const [oRes, pRes, cRes] = await Promise.all([
        api.get("/admin/orders"),
        api.get("/admin/products"),
        api.get("/categories"),
      ]);
      const normalize = (res) => {
        const d = res.data?.data || res.data;
        return Array.isArray(d) ? d : [];
      };
      setOrders(normalize(oRes));
      setProducts(normalize(pRes));
      setCategories(normalize(cRes));
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false); setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(true); }, []);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const id = setInterval(() => fetchData(false), 60000);
    return () => clearInterval(id);
  }, []);

  // Refresh on tab focus
  useEffect(() => {
    const handler = () => { if (document.visibilityState === "visible") fetchData(false); };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  // ── KPI metrics ──────────────────────────────────────────
  const kpi = useMemo(() => {
    const totalRevenue = orders.reduce((s, o) => s + Number(o.totalAmount || 0), 0);
    const totalOrders  = orders.length;
    const delivered    = orders.filter(o => ["DELIVERED","COMPLETED"].includes((o.orderStatus||"").toUpperCase())).length;
    const pending      = orders.filter(o => ["PLACED","PENDING","PROCESSING"].includes((o.orderStatus||"").toUpperCase())).length;
    const cancelled    = orders.filter(o => (o.orderStatus||"").toUpperCase() === "CANCELLED").length;
    const shipped      = orders.filter(o => (o.orderStatus||"").toUpperCase() === "SHIPPED").length;
    const avgOrderVal  = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const lowStock     = products.filter(p => Number(p.stock || p.quantity || 0) < 5).length;
    const outOfStock   = products.filter(p => Number(p.stock || p.quantity || 0) === 0).length;
    const totalProducts = products.length;
    const totalCategories = categories.length;
    return { totalRevenue, totalOrders, delivered, pending, cancelled, shipped, avgOrderVal, lowStock, outOfStock, totalProducts, totalCategories };
  }, [orders, products, categories]);

  // ── Revenue trend (last 7 months) ───────────────────────
  const revenueChartData = useMemo(() => {
    const months = {};
    orders.forEach(o => {
      const d = new Date(o.orderDate || o.createdAt || Date.now());
      const key = d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
      if (!months[key]) months[key] = { month: key, revenue: 0, orders: 0 };
      months[key].revenue += Number(o.totalAmount || 0);
      months[key].orders  += 1;
    });
    return Object.values(months).slice(-7);
  }, [orders]);

  // ── Order status pie data ─────────────────────────────────
  const pieData = useMemo(() => {
    const map = {};
    orders.forEach(o => {
      const s = (o.orderStatus || "PLACED").toUpperCase();
      map[s] = (map[s] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [orders]);

  // ── Top 5 products by stock ───────────────────────────────
  const topProducts = useMemo(() =>
    [...products]
      .sort((a, b) => Number(b.stock || b.quantity || 0) - Number(a.stock || a.quantity || 0))
      .slice(0, 5)
  , [products]);

  // ── Low stock products ────────────────────────────────────
  const lowStockProducts = useMemo(() =>
    products
      .filter(p => Number(p.stock || p.quantity || 0) < 5)
      .sort((a, b) => Number(a.stock || a.quantity || 0) - Number(b.stock || b.quantity || 0))
      .slice(0, 6)
  , [products]);

  // ── Recent 8 orders ───────────────────────────────────────
  const recentOrders = useMemo(() =>
    [...orders]
      .sort((a, b) => new Date(b.orderDate || b.createdAt || 0) - new Date(a.orderDate || a.createdAt || 0))
      .slice(0, 8)
  , [orders]);

  // ── Search filtered orders ────────────────────────────────
  const filteredOrders = useMemo(() => {
    const q = search.toLowerCase();
    return !search ? recentOrders : orders.filter(o =>
      String(o.id).includes(q) ||
      o.orderNumber?.toLowerCase().includes(q) ||
      o.fullName?.toLowerCase().includes(q) ||
      o.userEmail?.toLowerCase().includes(q)
    ).slice(0, 10);
  }, [search, orders, recentOrders]);

  // ─────────────────────────────────────────────────────────
  // LOADING
  // ─────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <div className="text-center">
        <div className="spinner-border" style={{ color: "#6366f1", width: 44, height: 44 }} />
        <p style={{ color: "#64748b", fontWeight: 600, marginTop: 14 }}>Loading Dashboard...</p>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────
  return (
    <div className="adash">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold m-0" style={{ color: "#0f172a", fontSize: 22 }}>
            📊 Admin Dashboard
          </h2>
          <p className="small m-0" style={{ color: "#64748b" }}>
            Real-time overview · auto-refreshes every 60s
          </p>
        </div>
        <button
          className="btn btn-outline-dark rounded-pill px-4 fw-semibold"
          onClick={() => fetchData(false)} disabled={refreshing}
        >
          {refreshing ? "🔄 Refreshing..." : "⟳ Refresh"}
        </button>
      </div>

      {error && <div className="alert alert-danger rounded-3 mb-4">{error}</div>}

      {/* ── KPI Cards ──────────────────────────────────────── */}
      <div className="row g-3 mb-4">
        {[
          { label: "Total Revenue",   value: fmtRs(kpi.totalRevenue),     sub: `Avg ${fmtRs(Math.round(kpi.avgOrderVal))}/order`, icon: "💰", color: "#10b981", bg: "#f0fdf4" },
          { label: "Total Orders",    value: kpi.totalOrders,              sub: `${kpi.delivered} delivered`,                      icon: "📦", color: "#6366f1", bg: "#f5f3ff" },
          { label: "Pending / Active",value: kpi.pending,                  sub: `${kpi.shipped} in-transit`,                       icon: "⏳", color: "#f59e0b", bg: "#fffbeb" },
          { label: "Delivered",       value: kpi.delivered,                sub: `${kpi.cancelled} cancelled`,                      icon: "✅", color: "#059669", bg: "#ecfdf5" },
          { label: "Total Products",  value: kpi.totalProducts,            sub: `${kpi.totalCategories} categories`,               icon: "🏷️", color: "#0891b2", bg: "#ecfeff" },
          { label: "Low Stock",       value: kpi.lowStock,                 sub: `${kpi.outOfStock} out of stock`,                  icon: "⚠️", color: "#e11d48", bg: "#fff1f2" },
        ].map(card => (
          <div className="col-12 col-sm-6 col-lg-4 col-xl-2" key={card.label}>
            <div className="adash-kpi-card" style={{ borderTop: `3px solid ${card.color}` }}>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="adash-kpi-icon" style={{ background: card.bg, color: card.color }}>
                  {card.icon}
                </div>
              </div>
              <div className="adash-kpi-val" style={{ color: card.color }}>{card.value}</div>
              <div className="adash-kpi-label">{card.label}</div>
              <div className="adash-kpi-sub">{card.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts Row ─────────────────────────────────────── */}
      <div className="row g-3 mb-4">

        {/* Revenue Area Chart */}
        <div className="col-lg-8">
          <div className="adash-card h-100">
            <div className="adash-card-header">
              <h6 className="fw-bold m-0">📈 Revenue Trend</h6>
              <span style={{ fontSize: 11, color: "#94a3b8" }}>Last {revenueChartData.length} months</span>
            </div>
            <div style={{ height: 240 }}>
              {revenueChartData.length === 0 ? (
                <div className="d-flex align-items-center justify-content-center h-100" style={{ color: "#94a3b8" }}>
                  No revenue data yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                    <Tooltip content={<RevenueTooltip />} />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#revGrad)" />
                    <Bar dataKey="orders" fill="#6366f1" radius={[4,4,0,0]} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Order Status Pie */}
        <div className="col-lg-4">
          <div className="adash-card h-100">
            <div className="adash-card-header">
              <h6 className="fw-bold m-0">🥧 Order Status</h6>
            </div>
            <div style={{ height: 240 }}>
              {pieData.length === 0 ? (
                <div className="d-flex align-items-center justify-content-center h-100" style={{ color: "#94a3b8" }}>
                  No orders yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                      {pieData.map((entry, idx) => (
                        <Cell key={idx} fill={STATUS_COLOR_MAP[entry.name] || PIE_COLORS[idx % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value, name]} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Orders + Low Stock ─────────────────────────────── */}
      <div className="row g-3 mb-4">

        {/* Recent Orders */}
        <div className="col-lg-8">
          <div className="adash-card">
            <div className="adash-card-header">
              <h6 className="fw-bold m-0">📋 Recent Orders</h6>
              <div className="d-flex align-items-center gap-2">
                <input
                  className="form-control form-control-sm"
                  style={{ width: 200, fontSize: 12 }}
                  placeholder="Search orders..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <Link to="/admin/orders" className="btn btn-sm btn-outline-dark rounded-pill" style={{ fontSize: 11, whiteSpace: "nowrap" }}>
                  View All →
                </Link>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table adash-table align-middle mb-0">
                <thead>
                  <tr>
                    <th>ORDER #</th>
                    <th>CUSTOMER</th>
                    <th>DATE</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                    <th>COURIER</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-4" style={{ color: "#94a3b8" }}>No orders found.</td></tr>
                  ) : filteredOrders.map(o => (
                    <tr key={o.id}>
                      <td>
                        <span className="font-monospace fw-bold" style={{ fontSize: 11, color: "#0f172a" }}>
                          {o.orderNumber || `#${o.id}`}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#0f172a" }}>{o.fullName || "Customer"}</div>
                        <div style={{ fontSize: 10, color: "#94a3b8" }}>{o.userEmail}</div>
                      </td>
                      <td style={{ fontSize: 11, color: "#64748b" }}>{fmtDate(o.orderDate || o.createdAt)}</td>
                      <td style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>₹{fmt(o.totalAmount)}</td>
                      <td><StatusPill status={o.orderStatus} /></td>
                      <td style={{ fontSize: 11, color: "#475569" }}>
                        {o.courierName
                          ? <span className="badge bg-light border text-dark" style={{ fontSize: 9 }}>{o.courierName}</span>
                          : <span style={{ color: "#94a3b8" }}>—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="col-lg-4">
          <div className="adash-card h-100">
            <div className="adash-card-header">
              <h6 className="fw-bold m-0">
                ⚠️ Low Stock
                {kpi.lowStock > 0 && <span className="badge ms-2" style={{ background: "#fef2f2", color: "#e11d48", fontSize: 10 }}>{kpi.lowStock}</span>}
              </h6>
              <Link to="/admin/inventory" className="btn btn-sm btn-outline-danger rounded-pill" style={{ fontSize: 11 }}>Manage →</Link>
            </div>
            {lowStockProducts.length === 0 ? (
              <div className="d-flex flex-column align-items-center justify-content-center py-5" style={{ color: "#94a3b8" }}>
                <div style={{ fontSize: 36 }}>✅</div>
                <p className="mt-2 mb-0 small">All products well-stocked!</p>
              </div>
            ) : (
              <div className="adash-stock-list">
                {lowStockProducts.map(p => {
                  const stock = Number(p.stock || p.quantity || 0);
                  const isOut = stock === 0;
                  return (
                    <div key={p.id} className="adash-stock-item">
                      <div className="d-flex align-items-center gap-2 flex-grow-1 overflow-hidden">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 8, border: "1px solid #e2e8f0", flexShrink: 0 }} />
                        ) : (
                          <div style={{ width: 36, height: 36, background: "#f1f5f9", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>📦</div>
                        )}
                        <div className="overflow-hidden">
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name || p.productName}</div>
                          <div style={{ fontSize: 10, color: "#94a3b8" }}>{p.category?.name || "—"}</div>
                        </div>
                      </div>
                      <div style={{ flexShrink: 0 }}>
                        <span style={{
                          background: isOut ? "#fef2f2" : "#fffbeb",
                          color: isOut ? "#e11d48" : "#d97706",
                          border: `1px solid ${isOut ? "#fecdd3" : "#fde68a"}`,
                          padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                        }}>
                          {isOut ? "OUT" : `${stock} left`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom Row ─────────────────────────────────────── */}
      <div className="row g-3">

        {/* Top Products by Stock */}
        <div className="col-lg-6">
          <div className="adash-card">
            <div className="adash-card-header">
              <h6 className="fw-bold m-0">🏷️ Top Products</h6>
              <Link to="/admin/products" className="btn btn-sm btn-outline-dark rounded-pill" style={{ fontSize: 11 }}>Manage →</Link>
            </div>
            {topProducts.length === 0 ? (
              <div className="text-center py-4" style={{ color: "#94a3b8" }}>No products yet.</div>
            ) : (
              <div style={{ height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProducts.map(p => ({ name: (p.name||"Product").substring(0,12), stock: Number(p.stock||p.quantity||0), price: Number(p.price||0) }))} layout="vertical" margin={{ top:0, right:20, left:10, bottom:0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "#475569" }} axisLine={false} tickLine={false} width={80} />
                    <Tooltip formatter={(v, n) => [v, n === "stock" ? "Stock" : "Price"]} />
                    <Bar dataKey="stock" fill="#6366f1" radius={[0,4,4,0]} maxBarSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-lg-6">
          <div className="adash-card">
            <div className="adash-card-header">
              <h6 className="fw-bold m-0">⚡ Quick Actions</h6>
            </div>
            <div className="row g-2">
              {[
                { to: "/admin/orders",     icon: "📦", label: "Manage Orders",    sub: `${kpi.pending} pending`,              color: "#6366f1", bg: "#f5f3ff" },
                { to: "/admin/products",   icon: "🏷️", label: "Manage Products",  sub: `${kpi.totalProducts} products`,       color: "#0891b2", bg: "#ecfeff" },
                { to: "/admin/inventory",  icon: "📊", label: "View Inventory",   sub: `${kpi.lowStock} low stock`,           color: "#d97706", bg: "#fffbeb" },
                { to: "/admin/customers",  icon: "👤", label: "View Customers",   sub: "All registered users",                color: "#059669", bg: "#ecfdf5" },
                { to: "/admin/categories", icon: "🗂️", label: "Categories",       sub: `${kpi.totalCategories} active`,       color: "#7c3aed", bg: "#faf5ff" },
                { to: "/admin/settings",   icon: "⚙️", label: "Settings",         sub: "Store configuration",                 color: "#475569", bg: "#f8fafc" },
              ].map(action => (
                <div className="col-6" key={action.to}>
                  <Link to={action.to} className="adash-quick-action" style={{ borderLeft: `3px solid ${action.color}` }}>
                    <div className="adash-qa-icon" style={{ background: action.bg, color: action.color }}>{action.icon}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{action.label}</div>
                      <div style={{ fontSize: 10, color: "#94a3b8" }}>{action.sub}</div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ── Styles ─────────────────────────────────────────── */}
      <style>{`
        .adash { padding: 28px; background: #f8fafc; min-height: 100vh; }

        .adash-card {
          background: #fff; border: 1px solid #e2e8f0;
          border-radius: 16px; padding: 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,.04);
        }
        .adash-card-header {
          display: flex; justify-content: space-between;
          align-items: center; margin-bottom: 16px;
        }

        /* KPI */
        .adash-kpi-card {
          background: #fff; border: 1px solid #e2e8f0;
          border-radius: 14px; padding: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,.03);
        }
        .adash-kpi-icon {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
        }
        .adash-kpi-val  { font-size: 22px; font-weight: 800; line-height: 1.2; margin-top: 8px; }
        .adash-kpi-label{ font-size: 11px; font-weight: 700; color: #64748b; margin-top: 2px; }
        .adash-kpi-sub  { font-size: 10px; color: #94a3b8; margin-top: 2px; }

        /* Table */
        .adash-table th {
          font-size: 10px; font-weight: 700; color: #475569;
          letter-spacing: .5px; padding: 10px 12px;
          background: #f8fafc; border-bottom: 1px solid #e2e8f0;
        }
        .adash-table td { padding: 10px 12px; font-size: 12px; border-color: #f1f5f9; }
        .adash-table tbody tr:hover { background: #fafbfc; }

        /* Low stock list */
        .adash-stock-list { display: flex; flex-direction: column; gap: 8px; }
        .adash-stock-item {
          display: flex; align-items: center; justify-content: space-between;
          gap: 8px; padding: 8px 0; border-bottom: 1px solid #f1f5f9;
        }
        .adash-stock-item:last-child { border-bottom: none; }

        /* Quick actions */
        .adash-quick-action {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 14px; border-radius: 12px;
          background: #f8fafc; border: 1px solid #e2e8f0;
          text-decoration: none; transition: all .15s;
        }
        .adash-quick-action:hover { background: #f1f5f9; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,.06); }
        .adash-qa-icon {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 17px; flex-shrink: 0;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
