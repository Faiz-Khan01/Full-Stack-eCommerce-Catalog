import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import api from "../services/api";
import ThreeDProductViewer from "../components/ThreeDProductViewer";

// ─────────────────────────────────────────────────────────
// Real Currency & Date Helpers
// ─────────────────────────────────────────────────────────
const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const fmtCur = (n) => `₹${fmt(n)}`;

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "—";

const STATUS_COLOR_MAP = {
  PLACED:    "#f59e0b",
  PENDING:   "#f59e0b",
  PROCESSING:"#e07a42",
  SHIPPED:   "#38bdf8",
  DELIVERED: "#10b981",
  COMPLETED: "#10b981",
  PAID:      "#10b981",
  CANCELLED: "#ef4444",
  REFUND_INITIATED:"#a855f7",
};

const StatusPill = ({ status }) => {
  const s = (status || "PLACED").toUpperCase();
  const color = STATUS_COLOR_MAP[s] || "#94a3b8";
  return (
    <span
      style={{
        background: `${color}18`,
        color,
        border: `1px solid ${color}40`,
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 10,
        fontWeight: 700,
        display: "inline-block",
        letterSpacing: "0.4px",
      }}
    >
      {s}
    </span>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#181920",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        borderRadius: 10,
        padding: "8px 12px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
      }}
    >
      <div style={{ color: "#9ca3af", fontSize: 10, marginBottom: 2 }}>{label}</div>
      <div style={{ color: "#e07a42", fontWeight: 700, fontSize: 13 }}>
        {payload[0]?.name === "orders" || payload[0]?.name === "count"
          ? `${payload[0]?.value} Orders`
          : `₹${fmt(payload[0]?.value)}`}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedDay, setSelectedDay] = useState("Fri");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const fetchData = async (initial = false) => {
    try {
      if (initial) setLoading(true); else setRefreshing(true);
      setError("");

      const [oRes, pRes, cRes, uRes] = await Promise.allSettled([
        api.get("/admin/orders"),
        api.get("/admin/products"),
        api.get("/categories"),
        api.get("/admin/users"),
      ]);

      const normalize = (res) => {
        if (res.status !== "fulfilled") return [];
        const d = res.value?.data?.data || res.value?.data;
        return Array.isArray(d) ? d : [];
      };

      setOrders(normalize(oRes));
      setProducts(normalize(pRes));
      setCategories(normalize(cRes));
      setUsers(normalize(uRes));
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.response?.data?.message || err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData(true);
  }, []);

  // 1. Real KPI Core
  const kpi = useMemo(() => {
    const rawRevenue = orders.reduce((s, o) => s + Number(o.totalAmount || 0), 0);
    const totalOrders = orders.length;
    const avgOrderVal = totalOrders > 0 ? Math.round(rawRevenue / totalOrders) : 0;

    const uniqueCustomerEmails = new Set(orders.map((o) => o.userEmail || o.email).filter(Boolean));
    const totalCustomers = Math.max(users.length, uniqueCustomerEmails.size, totalOrders > 0 ? 1 : 0);

    return {
      totalRevenue: rawRevenue,
      totalOrders,
      avgOrderVal,
      totalCustomers,
      totalProducts: products.length,
      inStockProducts: products.filter((p) => Number(p.stock || 0) > 0).length,
    };
  }, [orders, users, products]);

  // 2. Real Daily Breakdown (Sat - Fri)
  const { daySalesMap, dayOrdersCount, totalWeekSales } = useMemo(() => {
    const map = { Sat: 0, Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0 };
    const counts = { Sat: 0, Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0 };
    let weekTotal = 0;

    orders.forEach((o) => {
      const dt = o.orderDate || o.createdAt;
      const amt = Number(o.totalAmount || 0);
      weekTotal += amt;
      if (dt) {
        const dName = new Date(dt).toLocaleDateString("en-US", { weekday: "short" });
        if (map[dName] !== undefined) {
          map[dName] += amt;
          counts[dName] += 1;
        }
      }
    });

    return { daySalesMap: map, dayOrdersCount: counts, totalWeekSales: weekTotal };
  }, [orders]);

  // 3. Real Weekly Orders Chart
  const visitorData = useMemo(() => {
    return ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => ({
      day,
      orders: dayOrdersCount[day] || 0,
      sales: daySalesMap[day] || 0,
    }));
  }, [dayOrdersCount, daySalesMap]);

  // 4. Real Monthly Trend
  const growthData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const result = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mName = months[d.getMonth()];
      const mOrders = orders.filter((o) => {
        const od = o.orderDate || o.createdAt;
        if (!od) return false;
        const dObj = new Date(od);
        return dObj.getMonth() === d.getMonth() && dObj.getFullYear() === d.getFullYear();
      });
      result.push({
        month: mName,
        count: mOrders.length,
        revenue: mOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0),
      });
    }
    return result;
  }, [orders]);

  // 5. Real Monthly Target Progress
  const targetKpi = useMemo(() => {
    const now = new Date();
    const currentMonthOrders = orders.filter((o) => {
      const od = o.orderDate || o.createdAt;
      if (!od) return false;
      const d = new Date(od);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const monthRevenue = currentMonthOrders.reduce((s, o) => s + Number(o.totalAmount || 0), 0);
    const target = Math.max(50000, Math.ceil((monthRevenue + 10000) / 25000) * 25000);
    const pct = target > 0 ? Math.min(Math.round((monthRevenue / target) * 100), 100) : 0;
    const ringDashoffset = 251.2 - (pct / 100) * 251.2;
    return { monthRevenue, target, pct, ringDashoffset };
  }, [orders]);

  // 6. Real Fulfillment / Success Rate
  const fulfillmentKpi = useMemo(() => {
    if (orders.length === 0) return { rate: 100, fulfilledCount: 0, ringDashoffset: 0 };
    const fulfilled = orders.filter((o) => {
      const s = (o.orderStatus || "").toUpperCase();
      return ["DELIVERED", "COMPLETED", "PAID", "PROCESSING", "SHIPPED"].includes(s);
    }).length;
    const rate = Math.round((fulfilled / orders.length) * 100);
    const ringDashoffset = 251.2 - (rate / 100) * 251.2;
    return { rate, fulfilledCount: fulfilled, ringDashoffset };
  }, [orders]);

  // Sorted & Filtered Orders
  const sortedOrders = useMemo(() => {
    return [...orders].sort(
      (a, b) => new Date(b.orderDate || b.createdAt || 0) - new Date(a.orderDate || a.createdAt || 0)
    );
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return sortedOrders;
    return sortedOrders.filter(
      (o) =>
        String(o.id).includes(q) ||
        (o.orderNumber && o.orderNumber.toLowerCase().includes(q)) ||
        (o.fullName && o.fullName.toLowerCase().includes(q)) ||
        (o.userEmail && o.userEmail.toLowerCase().includes(q))
    );
  }, [search, sortedOrders]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  if (loading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "65vh" }}
      >
        <div className="text-center">
          <div
            className="spinner-border mb-3"
            style={{ width: "3rem", height: "3rem", color: "#e07a42" }}
          />
          <div style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "14px", fontWeight: 600 }}>
            Syncing Real Store Metrics...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ color: "#ffffff", maxWidth: "1500px", margin: "0 auto" }}>
      {/* ── Top Header ─────────────────────────────────────────── */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: 800,
              letterSpacing: "-0.5px",
              margin: 0,
              color: "#ffffff",
            }}
          >
            Overview
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "rgba(255, 255, 255, 0.5)",
              margin: "4px 0 0 0",
            }}
          >
            Monitor real-time sales revenue, inventory volume, and live customer orders.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2.5">
          <button
            className="btn"
            style={{
              background: "#16171e",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "30px",
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: 600,
              padding: "7px 16px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>📅</span>
            <span>All Time Live</span>
            <span style={{ fontSize: "10px", opacity: 0.6 }}>⌄</span>
          </button>

          <button
            className="btn"
            style={{
              background: "linear-gradient(135deg, #e07a42 0%, #c45e2a 100%)",
              border: "none",
              borderRadius: "30px",
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: 700,
              padding: "7px 18px",
              boxShadow: "0 4px 14px rgba(224, 122, 66, 0.35)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            onClick={() => fetchData(false)}
            disabled={refreshing}
          >
            <span style={{ display: "inline-block", transform: refreshing ? "rotate(180deg)" : "none", transition: "0.4s" }}>
              ⟳
            </span>
            <span>{refreshing ? "Syncing..." : "Sync Live Data"}</span>
          </button>
        </div>
      </div>

      {error && (
        <div
          className="alert mb-4"
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.25)",
            color: "#f87171",
            borderRadius: "14px",
            fontSize: "13px",
          }}
        >
          {error}
        </div>
      )}

      {/* ── First Row: Overview Cards & 3D Floating Asset ───────── */}
      <div className="row g-4 mb-4">
        {/* Card 1: Total Real Revenue + Floating 3D Model */}
        <div className="col-12 col-xl-5">
          <div
            style={{
              background: "#14151b",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "20px",
              padding: "24px",
              position: "relative",
              height: "100%",
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ zIndex: 2 }}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "rgba(255, 255, 255, 0.5)",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  marginBottom: "8px",
                }}
              >
                Total Revenue
              </div>

              <div
                style={{
                  fontSize: "36px",
                  fontWeight: 900,
                  letterSpacing: "-1px",
                  color: "#ffffff",
                  lineHeight: 1,
                  marginBottom: "12px",
                }}
              >
                {fmtCur(kpi.totalRevenue)}
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "rgba(16, 185, 129, 0.12)",
                  border: "1px solid rgba(16, 185, 129, 0.25)",
                  color: "#10b981",
                  borderRadius: "20px",
                  padding: "3px 10px",
                  fontSize: "11px",
                  fontWeight: 700,
                  marginBottom: "18px",
                }}
              >
                <span>↗</span>
                <span>Real-Time Database Calculation</span>
              </div>

              <div className="d-flex align-items-center gap-4 pt-2">
                <div>
                  <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.4)" }}>
                    Total Orders
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}>
                    {kpi.totalOrders.toLocaleString("en-IN")}
                  </div>
                </div>
                <div style={{ width: "1px", height: "24px", background: "rgba(255,255,255,0.1)" }} />
                <div>
                  <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.4)" }}>
                    Avg Order Value
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}>
                    {fmtCur(kpi.avgOrderVal)}
                  </div>
                </div>
              </div>
            </div>

            {/* 3D Rotating Model */}
            <div
              style={{
                position: "relative",
                zIndex: 1,
                marginRight: "-10px",
              }}
            >
              <ThreeDProductViewer modelType="hat" size={150} autoRotate={true} />
            </div>
          </div>
        </div>

        {/* Card 2: Real Customer Base */}
        <div className="col-12 col-md-6 col-xl-3.5" style={{ flex: "1 1 280px" }}>
          <div
            style={{
              background: "#14151b",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "20px",
              padding: "24px",
              height: "100%",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "rgba(255, 255, 255, 0.5)",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                  }}
                >
                  Customer Base
                </span>
                <span style={{ fontSize: "14px", opacity: 0.5 }}>👥</span>
              </div>

              <div style={{ fontSize: "32px", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.5px" }}>
                {kpi.totalCustomers.toLocaleString("en-IN")}
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  color: "#10b981",
                  fontSize: "11px",
                  fontWeight: 700,
                  marginTop: "4px",
                }}
              >
                <span>Unique purchasers & users</span>
              </div>
            </div>

            <div style={{ height: "70px", marginTop: "14px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e07a42" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#e07a42" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#e07a42"
                    strokeWidth={2.5}
                    fill="url(#growthGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Card 3: Real Catalog Products */}
        <div className="col-12 col-md-6 col-xl-3.5" style={{ flex: "1 1 280px" }}>
          <div
            style={{
              background: "#14151b",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "20px",
              padding: "24px",
              height: "100%",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "rgba(255, 255, 255, 0.5)",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                  }}
                >
                  Live Catalog Depth
                </span>
                <span style={{ fontSize: "14px", opacity: 0.5 }}>📦</span>
              </div>

              <div style={{ fontSize: "32px", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.5px" }}>
                {kpi.totalProducts.toLocaleString("en-IN")}
              </div>

              <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)", marginTop: "4px" }}>
                <span style={{ color: "#10b981", fontWeight: 700 }}>{kpi.inStockProducts} In Stock</span> • {categories.length} Categories
              </div>
            </div>

            <div style={{ height: "70px", marginTop: "14px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={visitorData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="orders" fill="#e07a42" radius={[4, 4, 0, 0]} opacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* ── Second Row: Interactive Real Sales Scrubber + Goals ── */}
      <div className="row g-4 mb-4">
        {/* Real Sales with Day Scrubber / Slider */}
        <div className="col-12 col-lg-5">
          <div
            style={{
              background: "#14151b",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "20px",
              padding: "24px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "rgba(255, 255, 255, 0.5)",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  marginBottom: "8px",
                }}
              >
                Daily Sales Revenue ({selectedDay})
              </div>

              <div
                style={{
                  fontSize: "36px",
                  fontWeight: 900,
                  letterSpacing: "-1px",
                  color: "#ffffff",
                  marginBottom: "4px",
                }}
              >
                {fmtCur(daySalesMap[selectedDay] || 0)}
              </div>

              <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.5)", marginBottom: "16px" }}>
                {dayOrdersCount[selectedDay] || 0} orders recorded on this weekday
              </div>
            </div>

            {/* Interactive Day Scrubber */}
            <div>
              {/* Slider Track */}
              <div
                style={{
                  height: "8px",
                  background: "#242630",
                  borderRadius: "10px",
                  position: "relative",
                  marginBottom: "14px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width:
                      selectedDay === "Sat"
                        ? "14%"
                        : selectedDay === "Sun"
                        ? "28%"
                        : selectedDay === "Mon"
                        ? "42%"
                        : selectedDay === "Tue"
                        ? "57%"
                        : selectedDay === "Wed"
                        ? "71%"
                        : selectedDay === "Thu"
                        ? "85%"
                        : "100%",
                    background: "linear-gradient(90deg, #e07a42, #f59e0b)",
                    borderRadius: "10px",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>

              {/* Day Pills */}
              <div className="d-flex justify-content-between align-items-center">
                {["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => {
                  const isSel = selectedDay === day;
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      style={{
                        background: isSel ? "#e07a42" : "transparent",
                        color: isSel ? "#ffffff" : "rgba(255, 255, 255, 0.5)",
                        border: "none",
                        borderRadius: "12px",
                        padding: "4px 8px",
                        fontSize: "11px",
                        fontWeight: isSel ? 700 : 500,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Real Monthly Goal Progress */}
        <div className="col-12 col-sm-6 col-lg-3.5" style={{ flex: "1 1 260px" }}>
          <div
            style={{
              background: "#14151b",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "20px",
              padding: "24px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "rgba(255, 255, 255, 0.5)",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  marginBottom: "6px",
                }}
              >
                Revenue Target
              </div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
                Monthly Goal
              </div>
              <div style={{ fontSize: "24px", fontWeight: 900, color: "#ffffff" }}>
                {fmtCur(targetKpi.monthRevenue)}
              </div>
              <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.4)" }}>
                of {fmtCur(targetKpi.target)} milestone
              </div>
            </div>

            {/* Circular Ring SVG */}
            <div style={{ position: "relative", width: "90px", height: "90px" }}>
              <svg width="90" height="90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#242630"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#e07a42"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={targetKpi.ringDashoffset}
                  strokeLinecap="round"
                  fill="none"
                  transform="rotate(-90 50 50)"
                  style={{ transition: "stroke-dashoffset 0.6s ease" }}
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  fontWeight: 900,
                  color: "#fff",
                }}
              >
                {targetKpi.pct}%
              </div>
            </div>
          </div>
        </div>

        {/* Real Order Fulfillment Rate */}
        <div className="col-12 col-sm-6 col-lg-3.5" style={{ flex: "1 1 260px" }}>
          <div
            style={{
              background: "#14151b",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "20px",
              padding: "24px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "rgba(255, 255, 255, 0.5)",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  marginBottom: "6px",
                }}
              >
                Order Processing
              </div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
                Fulfillment Rate
              </div>
              <div style={{ fontSize: "24px", fontWeight: 900, color: "#ffffff" }}>
                {fulfillmentKpi.rate}%
              </div>
              <div style={{ fontSize: "11px", color: "#10b981", fontWeight: 600 }}>
                {fulfillmentKpi.fulfilledCount} of {kpi.totalOrders} fulfilled
              </div>
            </div>

            {/* Circular Ring SVG */}
            <div style={{ position: "relative", width: "90px", height: "90px" }}>
              <svg width="90" height="90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#242630"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={fulfillmentKpi.ringDashoffset}
                  strokeLinecap="round"
                  fill="none"
                  transform="rotate(-90 50 50)"
                  style={{ transition: "stroke-dashoffset 0.6s ease" }}
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  fontWeight: 900,
                  color: "#fff",
                }}
              >
                {fulfillmentKpi.rate}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Third Row: Real Recent Orders & Studio Highlights ────── */}
      <div className="row g-4 mb-4">
        {/* Recent Orders Table */}
        <div className="col-12 col-xl-8">
          <div
            style={{
              background: "#14151b",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "20px",
              padding: "24px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
              <div>
                <div style={{ fontSize: "11px", color: "#e07a42", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>
                  LATEST TRANSACTIONS
                </div>
                <h5 style={{ fontWeight: 800, margin: 0, color: "#fff" }}>
                  Recent Orders ({filteredOrders.length})
                </h5>
              </div>

              <div className="d-flex align-items-center gap-2">
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    background: "#1c1d24",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "20px",
                    padding: "6px 14px",
                    fontSize: "12px",
                    color: "#fff",
                    outline: "none",
                    width: "160px",
                  }}
                />
                <Link
                  to="/admin/orders"
                  className="btn"
                  style={{
                    background: "rgba(255, 255, 255, 0.06)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "20px",
                    color: "#fff",
                    fontSize: "11px",
                    fontWeight: 600,
                    padding: "6px 14px",
                  }}
                >
                  View All ➔
                </Link>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table align-middle mb-0" style={{ color: "#fff" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
                    <th style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", padding: "10px" }}>Order</th>
                    <th style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", padding: "10px" }}>Customer</th>
                    <th style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", padding: "10px" }}>Date</th>
                    <th style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", padding: "10px" }}>Total</th>
                    <th style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", padding: "10px" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4" style={{ color: "rgba(255,255,255,0.5)" }}>
                        No orders recorded yet.
                      </td>
                    </tr>
                  ) : (
                    paginatedOrders.map((o) => (
                      <tr key={o.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                        <td style={{ padding: "12px 10px", fontSize: "12px", fontWeight: 700, fontFamily: "monospace", color: "#e07a42" }}>
                          {o.orderNumber || `#${o.id}`}
                        </td>
                        <td style={{ padding: "12px 10px" }}>
                          <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>
                            {o.fullName || "Store Customer"}
                          </div>
                          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
                            {o.userEmail || o.email || "—"}
                          </div>
                        </td>
                        <td style={{ padding: "12px 10px", fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
                          {fmtDate(o.orderDate || o.createdAt)}
                        </td>
                        <td style={{ padding: "12px 10px", fontSize: "13px", fontWeight: 700, color: "#10b981" }}>
                          {fmtCur(o.totalAmount || 0)}
                        </td>
                        <td style={{ padding: "12px 10px" }}>
                          <StatusPill status={o.orderStatus || "PLACED"} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
                  Page {currentPage} of {totalPages}
                </span>
                <div className="btn-group btn-group-sm">
                  <button
                    className="btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    style={{ background: "#1c1d24", color: "#fff", fontSize: "11px", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    ← Prev
                  </button>
                  <button
                    className="btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    style={{ background: "#1c1d24", color: "#fff", fontSize: "11px", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Active Campaign & AI Quick Actions */}
        <div className="col-12 col-xl-4">
          <div
            style={{
              background: "#14151b",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "20px",
              padding: "24px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "rgba(255, 255, 255, 0.5)",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  marginBottom: "6px",
                }}
              >
                CURRENT STORE SYSTEM
              </div>
              <h5 style={{ fontWeight: 800, color: "#fff", marginBottom: "14px" }}>Active Campaign</h5>

              <div
                style={{
                  background: "linear-gradient(135deg, rgba(224, 122, 66, 0.15) 0%, rgba(196, 94, 42, 0.05) 100%)",
                  border: "1px solid rgba(224, 122, 66, 0.3)",
                  borderRadius: "14px",
                  padding: "16px",
                  marginBottom: "20px",
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>
                    Atelier Editorial 2026
                  </span>
                  <span style={{ background: "#10b981", color: "#fff", fontSize: "9px", fontWeight: 800, padding: "2px 8px", borderRadius: "10px" }}>
                    LIVE
                  </span>
                </div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
                  Real-time storefront connected with Aiven MySQL, live Razorpay checkout, and Virtual Fitting Room.
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>
                AI Studio Shortcuts
              </div>
              <div className="d-flex flex-column gap-2">
                <Link
                  to="/admin/ai-assistant"
                  className="d-flex align-items-center justify-content-between text-decoration-none p-2.5 rounded-3"
                  style={{
                    background: "#1c1d24",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span style={{ color: "#e07a42" }}>✨</span>
                    <span>Launch AI Store Assistant</span>
                  </div>
                  <span>➔</span>
                </Link>

                <Link
                  to="/admin/products"
                  className="d-flex align-items-center justify-content-between text-decoration-none p-2.5 rounded-3"
                  style={{
                    background: "#1c1d24",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span>🎬</span>
                    <span>AI Model Photo & Motion Studio</span>
                  </div>
                  <span>➔</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
