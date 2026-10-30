import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import Swal from "sweetalert2";
import { useTheme } from "../App";

// Curated high-fashion & luxury presets for instant cover image selection
const PRESET_COVERS = [
  {
    name: "Luxury Apparel",
    url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
    hint: "Suits, Coats, Haute Couture",
  },
  {
    name: "Footwear & Shoes",
    url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
    hint: "Sneakers, Boots, Loafers",
  },
  {
    name: "Fragrances & Scent",
    url: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&q=80",
    hint: "Perfumes, Eau de Parfum",
  },
  {
    name: "Watches & Horology",
    url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
    hint: "Chronographs, Timepieces",
  },
  {
    name: "Leather Bags & Acc.",
    url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    hint: "Handbags, Wallets, Belts",
  },
  {
    name: "Premium Electronics",
    url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    hint: "Headphones, Audio, Gadgets",
  },
];

const AdminCategories = () => {
  const themeContext = useTheme();
  const darkMode = themeContext?.darkMode ?? false;

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Filters & Controls
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL"); // "ALL" | "POPULATED" | "EMPTY"
  const [sortBy, setSortBy] = useState("NAME_ASC"); // "NAME_ASC" | "NAME_DESC" | "COUNT_DESC" | "COUNT_ASC"
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"

  // Modal State (Create / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });

  // Category Inspector Drawer (View Products inside category)
  const [inspectCategory, setInspectCategory] = useState(null);

  // Dynamic Theme Colors
  const colors = useMemo(() => {
    return darkMode
      ? {
          bg: "#0c0d12",
          cardBg: "#14161f",
          cardBorder: "rgba(255, 255, 255, 0.08)",
          textPrimary: "#f8fafc",
          textSecondary: "#94a3b8",
          inputBg: "#1a1d28",
          inputBorder: "rgba(255, 255, 255, 0.12)",
          hoverBg: "rgba(255, 255, 255, 0.04)",
          accent: "#38bdf8",
          accentGlow: "rgba(56, 189, 248, 0.15)",
        }
      : {
          bg: "#f8fafc",
          cardBg: "#ffffff",
          cardBorder: "#e2e8f0",
          textPrimary: "#0f172a",
          textSecondary: "#64748b",
          inputBg: "#f1f5f9",
          inputBorder: "#cbd5e1",
          hoverBg: "#f1f5f9",
          accent: "#2563eb",
          accentGlow: "rgba(37, 99, 235, 0.1)",
        };
  }, [darkMode]);

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

  // Map product counts and list per category
  const { categoryProductCounts, categoryProductsMap } = useMemo(() => {
    const counts = {};
    const map = {};
    products.forEach((p) => {
      const catId = p.category?.id || p.categoryId;
      if (catId) {
        counts[catId] = (counts[catId] || 0) + 1;
        if (!map[catId]) map[catId] = [];
        map[catId].push(p);
      }
    });
    return { categoryProductCounts: counts, categoryProductsMap: map };
  }, [products]);

  // Executive KPI Metrics
  const stats = useMemo(() => {
    const totalCats = categories.length;
    const totalProds = products.length;
    const avgPerCat = totalCats > 0 ? (totalProds / totalCats).toFixed(1) : 0;

    let maxCat = null;
    let maxCount = -1;
    categories.forEach((c) => {
      const count = categoryProductCounts[c.id] || 0;
      if (count > maxCount) {
        maxCount = count;
        maxCat = c;
      }
    });

    const populatedCats = categories.filter((c) => (categoryProductCounts[c.id] || 0) > 0).length;

    return {
      totalCats,
      totalProds,
      avgPerCat,
      maxCatName: maxCat?.name || "N/A",
      maxCatCount: maxCount > 0 ? maxCount : 0,
      coveragePercent: totalCats > 0 ? Math.round((populatedCats / totalCats) * 100) : 0,
    };
  }, [categories, products, categoryProductCounts]);

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
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Category name is required.",
        background: darkMode ? "#1a1d28" : "#fff",
        color: darkMode ? "#fff" : "#0f172a",
      });
      return;
    }

    try {
      setSubmitting(true);
      if (editingCategory) {
        await api.put(`/admin/categories/${editingCategory.id}`, formData);
        Swal.fire({
          icon: "success",
          title: "Category Updated!",
          text: `"${formData.name}" was modified successfully.`,
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await api.post("/admin/categories", formData);
        Swal.fire({
          icon: "success",
          title: "Category Created!",
          text: `"${formData.name}" added to departments.`,
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
        background: darkMode ? "#1a1d28" : "#fff",
        color: darkMode ? "#fff" : "#0f172a",
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
        <div style="font-size: 14px; text-align: left; padding: 6px 0;">
          ${
            count > 0
              ? `<div style="background: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; padding: 10px; border-radius: 6px; margin-bottom: 12px; color: #ef4444; font-weight: 600;">
                  ⚠️ Caution: This category currently holds <b>${count} products</b>.
                </div>`
              : ""
          }
          <p style="margin: 0; color: #94a3b8;">
            Are you sure you want to permanently delete this category? Products assigned to it may become unassigned.
          </p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      background: darkMode ? "#1a1d28" : "#fff",
      color: darkMode ? "#fff" : "#0f172a",
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
        background: darkMode ? "#1a1d28" : "#fff",
        color: darkMode ? "#fff" : "#0f172a",
      });
    }
  };

  // Filtered & Sorted Categories
  const filteredCategories = useMemo(() => {
    const q = search.toLowerCase().trim();

    return categories
      .filter((c) => {
        // Search filter
        const matchSearch =
          !q ||
          (c.name && c.name.toLowerCase().includes(q)) ||
          (c.description && c.description.toLowerCase().includes(q));

        if (!matchSearch) return false;

        // Type filter
        const count = categoryProductCounts[c.id] || 0;
        if (filterType === "POPULATED") return count > 0;
        if (filterType === "EMPTY") return count === 0;

        return true;
      })
      .sort((a, b) => {
        const countA = categoryProductCounts[a.id] || 0;
        const countB = categoryProductCounts[b.id] || 0;

        if (sortBy === "NAME_ASC") return (a.name || "").localeCompare(b.name || "");
        if (sortBy === "NAME_DESC") return (b.name || "").localeCompare(a.name || "");
        if (sortBy === "COUNT_DESC") return countB - countA;
        if (sortBy === "COUNT_ASC") return countA - countB;
        return 0;
      });
  }, [categories, search, filterType, sortBy, categoryProductCounts]);

  if (loading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "70vh", background: colors.bg, color: colors.textPrimary }}
      >
        <div className="text-center">
          <div
            className="spinner-border mb-3"
            style={{ color: "#38bdf8", width: "3.2rem", height: "3.2rem" }}
            role="status"
          ></div>
          <h5 className="fw-bold tracking-wide">Synthesizing Categories...</h5>
          <p className="small" style={{ color: colors.textSecondary }}>
            Loading catalog taxonomy & product mappings
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="admin-categories-page p-3 p-md-4"
      style={{
        background: colors.bg,
        minHeight: "100vh",
        color: colors.textPrimary,
        transition: "background 0.3s ease",
      }}
    >
      {/* ──────────────────────────────────────────────────────────
          1. HEADER & ACTION BAR
          ────────────────────────────────────────────────────────── */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span
              style={{
                background: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
                color: "#fff",
                padding: "6px 10px",
                borderRadius: "10px",
                fontSize: "16px",
                boxShadow: "0 4px 12px rgba(14, 165, 233, 0.3)",
              }}
            >
              🗂️
            </span>
            <h2 className="fw-bold m-0" style={{ fontSize: "24px", letterSpacing: "-0.5px" }}>
              Category Taxonomy & Hierarchy
            </h2>
          </div>
          <p className="m-0 small" style={{ color: colors.textSecondary }}>
            Architect and curate departments, manage category cover imagery, and track product density.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          {/* View Mode Toggle */}
          <div
            className="d-inline-flex p-1 rounded-pill"
            style={{ background: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}
          >
            <button
              type="button"
              className="btn btn-sm rounded-pill px-3 fw-semibold border-0"
              style={{
                background: viewMode === "grid" ? (darkMode ? "#1e293b" : "#e2e8f0") : "transparent",
                color: viewMode === "grid" ? colors.textPrimary : colors.textSecondary,
                fontSize: "12px",
              }}
              onClick={() => setViewMode("grid")}
              title="Grid View"
            >
              ⊞ Grid
            </button>
            <button
              type="button"
              className="btn btn-sm rounded-pill px-3 fw-semibold border-0"
              style={{
                background: viewMode === "table" ? (darkMode ? "#1e293b" : "#e2e8f0") : "transparent",
                color: viewMode === "table" ? colors.textPrimary : colors.textSecondary,
                fontSize: "12px",
              }}
              onClick={() => setViewMode("table")}
              title="Table View"
            >
              ☰ Table
            </button>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            className="btn btn-sm rounded-pill px-3 fw-semibold d-flex align-items-center gap-2"
            style={{
              background: colors.cardBg,
              color: colors.textPrimary,
              border: `1px solid ${colors.cardBorder}`,
            }}
            onClick={() => fetchData(false)}
            disabled={refreshing}
          >
            <span style={{ display: "inline-block", transform: refreshing ? "rotate(180deg)" : "none", transition: "0.4s" }}>
              ⟳
            </span>
            <span>{refreshing ? "Refreshing..." : "Sync"}</span>
          </button>

          {/* Create Category CTA */}
          <button
            type="button"
            className="btn btn-sm rounded-pill px-4 fw-bold d-flex align-items-center gap-2 shadow-sm text-white"
            style={{
              background: "linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)",
              border: "none",
              paddingTop: "9px",
              paddingBottom: "9px",
            }}
            onClick={handleOpenCreate}
          >
            <span>➕</span> Add New Category
          </button>
        </div>
      </div>

      {error && (
        <div
          className="alert mb-4 rounded-4 d-flex align-items-center justify-content-between"
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#ef4444",
          }}
        >
          <span>⚠️ {error}</span>
          <button className="btn btn-sm btn-outline-danger rounded-pill" onClick={() => fetchData(false)}>
            Retry
          </button>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          2. EXECUTIVE KPI CARDS
          ────────────────────────────────────────────────────────── */}
      <div className="row g-3 mb-4">
        {/* Total Categories */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div
            className="p-3 rounded-4 h-100"
            style={{
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-15px",
                right: "-15px",
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "rgba(14, 165, 233, 0.08)",
                pointerEvents: "none",
              }}
            ></div>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="small fw-bold text-uppercase" style={{ color: colors.textSecondary, letterSpacing: "0.5px", fontSize: "11px" }}>
                Total Departments
              </span>
              <span className="badge rounded-pill" style={{ background: "rgba(14, 165, 233, 0.15)", color: "#0ea5e9" }}>
                Active
              </span>
            </div>
            <h3 className="fw-bold m-0" style={{ fontSize: "28px", color: colors.textPrimary }}>
              {stats.totalCats}
            </h3>
            <span className="small" style={{ color: colors.textSecondary, fontSize: "12px" }}>
              Structured store classifications
            </span>
          </div>
        </div>

        {/* Assigned Products */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div
            className="p-3 rounded-4 h-100"
            style={{
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="small fw-bold text-uppercase" style={{ color: colors.textSecondary, letterSpacing: "0.5px", fontSize: "11px" }}>
                Cataloged Products
              </span>
              <span className="badge rounded-pill" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
                Live
              </span>
            </div>
            <h3 className="fw-bold m-0" style={{ fontSize: "28px", color: "#10b981" }}>
              {stats.totalProds}
            </h3>
            <span className="small" style={{ color: colors.textSecondary, fontSize: "12px" }}>
              Mapped across {stats.totalCats} categories
            </span>
          </div>
        </div>

        {/* Category Density */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div
            className="p-3 rounded-4 h-100"
            style={{
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="small fw-bold text-uppercase" style={{ color: colors.textSecondary, letterSpacing: "0.5px", fontSize: "11px" }}>
                Average Density
              </span>
              <span className="badge rounded-pill" style={{ background: "rgba(99, 102, 241, 0.15)", color: "#6366f1" }}>
                Balance
              </span>
            </div>
            <h3 className="fw-bold m-0" style={{ fontSize: "28px", color: "#6366f1" }}>
              {stats.avgPerCat} <span style={{ fontSize: "14px", fontWeight: "normal", color: colors.textSecondary }}>items/cat</span>
            </h3>
            <span className="small" style={{ color: colors.textSecondary, fontSize: "12px" }}>
              Depth index per department
            </span>
          </div>
        </div>

        {/* Top Department Spotlight */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div
            className="p-3 rounded-4 h-100"
            style={{
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="small fw-bold text-uppercase" style={{ color: colors.textSecondary, letterSpacing: "0.5px", fontSize: "11px" }}>
                Leading Category
              </span>
              <span className="badge rounded-pill" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" }}>
                Top Vol
              </span>
            </div>
            <h4 className="fw-bold m-0 text-truncate" style={{ fontSize: "20px", color: "#f59e0b" }} title={stats.maxCatName}>
              {stats.maxCatName}
            </h4>
            <span className="small" style={{ color: colors.textSecondary, fontSize: "12px" }}>
              Holds {stats.maxCatCount} inventory units
            </span>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          3. TOOLBAR: SEARCH, FILTERS & SORTING
          ────────────────────────────────────────────────────────── */}
      <div
        className="p-3 rounded-4 mb-4"
        style={{
          background: colors.cardBg,
          border: `1px solid ${colors.cardBorder}`,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
        }}
      >
        <div className="row g-3 align-items-center">
          {/* Search Input */}
          <div className="col-12 col-md-5">
            <div
              className="d-flex align-items-center px-3 rounded-pill"
              style={{
                background: colors.inputBg,
                border: `1px solid ${colors.inputBorder}`,
              }}
            >
              <span style={{ color: colors.textSecondary }}>🔍</span>
              <input
                type="text"
                className="form-control border-0 bg-transparent px-2 shadow-none"
                placeholder="Search categories by name or description..."
                style={{ color: colors.textPrimary, fontSize: "14px" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  className="btn btn-sm border-0 p-0 text-muted"
                  onClick={() => setSearch("")}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Quick Filter Chips */}
          <div className="col-12 col-md-4">
            <div className="d-flex gap-1 flex-wrap">
              {[
                { label: "All", value: "ALL" },
                { label: "With Products", value: "POPULATED" },
                { label: "Empty (0)", value: "EMPTY" },
              ].map((f) => {
                const isActive = filterType === f.value;
                return (
                  <button
                    key={f.value}
                    type="button"
                    className="btn btn-sm rounded-pill px-3 fw-semibold border-0"
                    style={{
                      background: isActive ? colors.accent : colors.inputBg,
                      color: isActive ? "#ffffff" : colors.textSecondary,
                      fontSize: "12px",
                      transition: "0.2s",
                    }}
                    onClick={() => setFilterType(f.value)}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort By Dropdown */}
          <div className="col-12 col-md-3 text-md-end">
            <select
              className="form-select form-select-sm rounded-pill d-inline-block shadow-none"
              style={{
                width: "auto",
                background: colors.inputBg,
                color: colors.textPrimary,
                border: `1px solid ${colors.inputBorder}`,
                fontSize: "13px",
                fontWeight: "600",
              }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="NAME_ASC">Name (A → Z)</option>
              <option value="NAME_DESC">Name (Z → A)</option>
              <option value="COUNT_DESC">Products (Most First)</option>
              <option value="COUNT_ASC">Products (Least First)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          4. CONTENT: GRID OR TABLE VIEW
          ────────────────────────────────────────────────────────── */}
      {filteredCategories.length === 0 ? (
        <div
          className="p-5 text-center rounded-4 mb-4"
          style={{
            background: colors.cardBg,
            border: `1px dashed ${colors.cardBorder}`,
            color: colors.textSecondary,
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
          <h5 className="fw-bold" style={{ color: colors.textPrimary }}>
            No Matching Categories Found
          </h5>
          <p className="small mb-3">
            {search
              ? `No department names match "${search}". Try resetting the search.`
              : "Start by creating your store's first product category."}
          </p>
          <button
            type="button"
            className="btn btn-sm rounded-pill px-4 fw-bold text-white"
            style={{ background: "linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)" }}
            onClick={handleOpenCreate}
          >
            ➕ Create Category
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* ──── GRID VIEW ──── */
        <div className="row g-3">
          {filteredCategories.map((category) => {
            const count = categoryProductCounts[category.id] || 0;
            const catProducts = categoryProductsMap[category.id] || [];
            const slug = (category.name || "")
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "");

            return (
              <div key={category.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                <div
                  className="card h-100 rounded-4 overflow-hidden"
                  style={{
                    background: colors.cardBg,
                    border: `1px solid ${colors.cardBorder}`,
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 12px 28px rgba(0, 0, 0, 0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.04)";
                  }}
                >
                  {/* Category Cover Banner */}
                  <div
                    style={{
                      height: "140px",
                      background: category.imageUrl
                        ? `url(${category.imageUrl}) center/cover no-repeat`
                        : "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(15,23,42,0.85) 100%)",
                      }}
                    ></div>

                    {/* Department Tag */}
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        background: "rgba(15, 23, 42, 0.75)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        color: "#fff",
                        padding: "3px 10px",
                        borderRadius: "20px",
                        fontSize: "11px",
                        fontWeight: "700",
                        letterSpacing: "0.5px",
                      }}
                    >
                      DEPT #{category.id}
                    </div>

                    {/* Product Count Pill */}
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: count > 0 ? "rgba(16, 185, 129, 0.9)" : "rgba(100, 116, 139, 0.85)",
                        backdropFilter: "blur(8px)",
                        color: "#fff",
                        padding: "3px 10px",
                        borderRadius: "20px",
                        fontSize: "11px",
                        fontWeight: "700",
                      }}
                    >
                      {count} {count === 1 ? "Item" : "Items"}
                    </div>

                    {/* Category Title on Banner bottom */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        left: "14px",
                        right: "14px",
                      }}
                    >
                      <h5
                        className="fw-bold m-0 text-white text-truncate"
                        style={{ fontSize: "17px", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
                        title={category.name}
                      >
                        {category.name}
                      </h5>
                      <span
                        style={{
                          fontSize: "11px",
                          color: "rgba(255, 255, 255, 0.75)",
                          fontFamily: "monospace",
                        }}
                      >
                        /{slug}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="card-body p-3 d-flex flex-column justify-content-between">
                    <div>
                      {/* Description */}
                      <p
                        className="small mb-3"
                        style={{
                          color: colors.textSecondary,
                          fontSize: "12px",
                          lineHeight: "1.45",
                          minHeight: "36px",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                        title={category.description || "No description provided."}
                      >
                        {category.description || "No description provided for this department."}
                      </p>

                      {/* Product Preview Thumbnails (Up to 4) */}
                      <div className="mb-3">
                        <div className="d-flex align-items-center justify-content-between mb-1">
                          <span
                            className="text-uppercase fw-bold"
                            style={{ fontSize: "10px", color: colors.textSecondary, letterSpacing: "0.5px" }}
                          >
                            Catalog Preview
                          </span>
                          {count > 0 && (
                            <button
                              type="button"
                              className="btn btn-link p-0 text-decoration-none border-0"
                              style={{ fontSize: "11px", color: colors.accent, fontWeight: "600" }}
                              onClick={() => setInspectCategory(category)}
                            >
                              View All ({count}) →
                            </button>
                          )}
                        </div>

                        {catProducts.length > 0 ? (
                          <div className="d-flex align-items-center gap-1">
                            {catProducts.slice(0, 4).map((p) => (
                              <div
                                key={p.id}
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "8px",
                                  background: colors.inputBg,
                                  border: `1px solid ${colors.cardBorder}`,
                                  overflow: "hidden",
                                  flexShrink: 0,
                                }}
                                title={`${p.name} (₹${p.price || 0})`}
                              >
                                {p.imageUrl ? (
                                  <img
                                    src={p.imageUrl}
                                    alt={p.name}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <div
                                    className="d-flex align-items-center justify-content-center h-100"
                                    style={{ fontSize: "11px", color: colors.textSecondary }}
                                  >
                                    📦
                                  </div>
                                )}
                              </div>
                            ))}
                            {catProducts.length > 4 && (
                              <div
                                className="d-flex align-items-center justify-content-center rounded-2"
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  background: colors.inputBg,
                                  color: colors.textSecondary,
                                  fontSize: "11px",
                                  fontWeight: "700",
                                }}
                              >
                                +{catProducts.length - 4}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div
                            className="p-2 rounded-2 text-center"
                            style={{ background: colors.inputBg, fontSize: "11px", color: colors.textSecondary }}
                          >
                            No products mapped yet
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div
                      className="d-flex justify-content-between align-items-center pt-2 border-top"
                      style={{ borderColor: colors.cardBorder }}
                    >
                      <button
                        type="button"
                        className="btn btn-sm rounded-pill px-3 fw-semibold d-flex align-items-center gap-1"
                        style={{
                          background: colors.inputBg,
                          color: colors.textPrimary,
                          fontSize: "12px",
                          border: `1px solid ${colors.cardBorder}`,
                        }}
                        onClick={() => setInspectCategory(category)}
                      >
                        <span>👁️</span> Products
                      </button>

                      <div className="d-flex gap-1">
                        <button
                          type="button"
                          className="btn btn-sm rounded-pill px-2 fw-semibold"
                          style={{
                            background: "transparent",
                            color: colors.textPrimary,
                            border: `1px solid ${colors.cardBorder}`,
                            fontSize: "12px",
                          }}
                          onClick={() => handleOpenEdit(category)}
                          title="Edit Category"
                        >
                          ✏️ Edit
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm rounded-pill px-2 fw-semibold"
                          style={{
                            background: "rgba(239, 68, 68, 0.1)",
                            color: "#ef4444",
                            border: "1px solid rgba(239, 68, 68, 0.2)",
                            fontSize: "12px",
                          }}
                          onClick={() => handleDelete(category)}
                          title="Delete Category"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ──── TABLE VIEW ──── */
        <div
          className="rounded-4 overflow-hidden mb-4"
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
          }}
        >
          <div className="table-responsive">
            <table className="table align-middle m-0" style={{ color: colors.textPrimary }}>
              <thead>
                <tr
                  style={{
                    background: darkMode ? "#1a1d28" : "#f1f5f9",
                    borderBottom: `2px solid ${colors.cardBorder}`,
                    color: colors.textSecondary,
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  <th className="py-3 px-4">Department & Cover</th>
                  <th className="py-3">Slug</th>
                  <th className="py-3">Description</th>
                  <th className="py-3 text-center">Products</th>
                  <th className="py-3 text-center">Density</th>
                  <th className="py-3 px-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => {
                  const count = categoryProductCounts[category.id] || 0;
                  const slug = (category.name || "")
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, "");
                  const percentOfTotal = stats.totalProds > 0 ? Math.round((count / stats.totalProds) * 100) : 0;

                  return (
                    <tr
                      key={category.id}
                      style={{
                        borderBottom: `1px solid ${colors.cardBorder}`,
                        transition: "background 0.15s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = colors.hoverBg)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      {/* Department & Image */}
                      <td className="py-3 px-4">
                        <div className="d-flex align-items-center gap-3">
                          <div
                            style={{
                              width: "48px",
                              height: "48px",
                              borderRadius: "10px",
                              background: category.imageUrl
                                ? `url(${category.imageUrl}) center/cover no-repeat`
                                : "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
                              border: `1px solid ${colors.cardBorder}`,
                              flexShrink: 0,
                            }}
                          ></div>
                          <div>
                            <span className="fw-bold d-block text-truncate" style={{ fontSize: "14px", maxWidth: "200px" }}>
                              {category.name}
                            </span>
                            <span style={{ fontSize: "11px", color: colors.textSecondary }}>
                              ID #{category.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Slug */}
                      <td className="py-3">
                        <code
                          style={{
                            background: colors.inputBg,
                            color: colors.accent,
                            padding: "2px 8px",
                            borderRadius: "6px",
                            fontSize: "12px",
                          }}
                        >
                          /{slug}
                        </code>
                      </td>

                      {/* Description */}
                      <td className="py-3">
                        <span
                          className="small d-block text-truncate"
                          style={{ color: colors.textSecondary, maxWidth: "300px" }}
                          title={category.description}
                        >
                          {category.description || "—"}
                        </span>
                      </td>

                      {/* Products Count */}
                      <td className="py-3 text-center">
                        <span
                          className="badge rounded-pill px-3 py-1"
                          style={{
                            background: count > 0 ? "rgba(16, 185, 129, 0.15)" : "rgba(100, 116, 139, 0.15)",
                            color: count > 0 ? "#10b981" : colors.textSecondary,
                            fontWeight: "700",
                            fontSize: "12px",
                          }}
                        >
                          {count} items
                        </span>
                      </td>

                      {/* Density Progress Bar */}
                      <td className="py-3 text-center" style={{ minWidth: "140px" }}>
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          <div
                            className="progress flex-grow-1"
                            style={{ height: "6px", background: colors.inputBg, borderRadius: "10px" }}
                          >
                            <div
                              className="progress-bar rounded-pill"
                              style={{
                                width: `${Math.min(percentOfTotal * 2, 100)}%`,
                                background: count > 0 ? "linear-gradient(90deg, #0ea5e9, #6366f1)" : "#94a3b8",
                              }}
                            ></div>
                          </div>
                          <span style={{ fontSize: "11px", color: colors.textSecondary, minWidth: "30px" }}>
                            {percentOfTotal}%
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-end">
                        <div className="d-inline-flex gap-1">
                          <button
                            type="button"
                            className="btn btn-sm rounded-pill px-2 fw-semibold"
                            style={{
                              background: colors.inputBg,
                              color: colors.textPrimary,
                              border: `1px solid ${colors.cardBorder}`,
                              fontSize: "12px",
                            }}
                            onClick={() => setInspectCategory(category)}
                            title="Inspect Products"
                          >
                            👁️
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm rounded-pill px-2 fw-semibold"
                            style={{
                              background: colors.inputBg,
                              color: colors.textPrimary,
                              border: `1px solid ${colors.cardBorder}`,
                              fontSize: "12px",
                            }}
                            onClick={() => handleOpenEdit(category)}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm rounded-pill px-2 fw-semibold"
                            style={{
                              background: "rgba(239, 68, 68, 0.1)",
                              color: "#ef4444",
                              border: "1px solid rgba(239, 68, 68, 0.2)",
                              fontSize: "12px",
                            }}
                            onClick={() => handleDelete(category)}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          5. ADD / EDIT CATEGORY MODAL (LUXURY ATELIER SUITE)
          ────────────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div
          className="modal-backdrop-custom"
          onClick={() => setIsModalOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 15, 29, 0.75)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1060,
            padding: "20px",
          }}
        >
          <div
            className="modal-card-custom rounded-4 p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "600px",
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              color: colors.textPrimary,
              maxHeight: "92vh",
              overflowY: "auto",
            }}
          >
            {/* Modal Header */}
            <div
              className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom"
              style={{ borderColor: colors.cardBorder }}
            >
              <div>
                <h5 className="fw-bold m-0" style={{ fontSize: "18px" }}>
                  {editingCategory ? "✏️ Edit Category Department" : "➕ Create New Category"}
                </h5>
                <span className="small" style={{ color: colors.textSecondary }}>
                  {editingCategory
                    ? `Modify metadata for ${editingCategory.name}`
                    : "Add a department to your storefront navigation"}
                </span>
              </div>
              <button
                type="button"
                className="btn-close shadow-none"
                style={{ filter: darkMode ? "invert(1)" : "none" }}
                onClick={() => setIsModalOpen(false)}
              ></button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Category Name */}
              <div className="mb-3">
                <label className="form-label small fw-bold" style={{ color: colors.textSecondary }}>
                  CATEGORY NAME <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control rounded-3 shadow-none"
                  placeholder="e.g. Luxury Footwear, Haute Horology..."
                  style={{
                    background: colors.inputBg,
                    color: colors.textPrimary,
                    border: `1px solid ${colors.inputBorder}`,
                  }}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                {formData.name && (
                  <span className="d-block mt-1 font-monospace" style={{ fontSize: "11px", color: colors.accent }}>
                    Slug Preview: /category/
                    {formData.name
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-|-$/g, "")}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="form-label small fw-bold" style={{ color: colors.textSecondary }}>
                  EDITORIAL DESCRIPTION
                </label>
                <textarea
                  className="form-control rounded-3 shadow-none"
                  rows="3"
                  placeholder="Brief narrative highlighting the collections, crafts, and styles under this department..."
                  style={{
                    background: colors.inputBg,
                    color: colors.textPrimary,
                    border: `1px solid ${colors.inputBorder}`,
                    fontSize: "13px",
                  }}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              {/* Cover Image URL */}
              <div className="mb-3">
                <label className="form-label small fw-bold" style={{ color: colors.textSecondary }}>
                  COVER BANNER IMAGE URL
                </label>
                <div className="input-group">
                  <input
                    type="url"
                    className="form-control rounded-start-3 shadow-none"
                    placeholder="https://images.unsplash.com/..."
                    style={{
                      background: colors.inputBg,
                      color: colors.textPrimary,
                      border: `1px solid ${colors.inputBorder}`,
                      fontSize: "13px",
                    }}
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                  {formData.imageUrl && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setFormData({ ...formData, imageUrl: "" })}
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Live Preview Card */}
                {formData.imageUrl && (
                  <div className="mt-2 p-2 rounded-3" style={{ background: colors.inputBg }}>
                    <div
                      style={{
                        height: "100px",
                        borderRadius: "8px",
                        background: `url(${formData.imageUrl}) center/cover no-repeat`,
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          bottom: "6px",
                          left: "10px",
                          color: "#fff",
                          fontWeight: "700",
                          fontSize: "13px",
                          textShadow: "0 2px 4px rgba(0,0,0,0.7)",
                        }}
                      >
                        {formData.name || "Category Preview"}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Instant Curated Image Presets Wall */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span
                    className="small fw-bold text-uppercase"
                    style={{ fontSize: "11px", color: colors.textSecondary, letterSpacing: "0.5px" }}
                  >
                    ✨ Curated Luxury Cover Presets
                  </span>
                  <span className="small text-muted" style={{ fontSize: "11px" }}>
                    Click to apply
                  </span>
                </div>
                <div className="row g-2">
                  {PRESET_COVERS.map((preset, idx) => (
                    <div key={idx} className="col-6 col-md-4">
                      <div
                        role="button"
                        className="p-2 rounded-3 text-start"
                        style={{
                          background: formData.imageUrl === preset.url ? colors.accentGlow : colors.inputBg,
                          border: `1px solid ${formData.imageUrl === preset.url ? colors.accent : colors.inputBorder}`,
                          cursor: "pointer",
                          transition: "0.15s ease",
                        }}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            imageUrl: preset.url,
                            name: formData.name ? formData.name : preset.name,
                          });
                        }}
                      >
                        <div
                          style={{
                            height: "40px",
                            borderRadius: "6px",
                            background: `url(${preset.url}) center/cover no-repeat`,
                            marginBottom: "4px",
                          }}
                        ></div>
                        <span className="d-block fw-bold text-truncate" style={{ fontSize: "11px" }}>
                          {preset.name}
                        </span>
                        <span className="d-block text-truncate" style={{ fontSize: "10px", color: colors.textSecondary }}>
                          {preset.hint}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Buttons Footer */}
              <div
                className="d-flex justify-content-end gap-2 pt-3 border-top"
                style={{ borderColor: colors.cardBorder }}
              >
                <button
                  type="button"
                  className="btn btn-sm rounded-pill px-4 fw-semibold"
                  style={{
                    background: colors.inputBg,
                    color: colors.textPrimary,
                    border: `1px solid ${colors.cardBorder}`,
                  }}
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-sm rounded-pill px-5 fw-bold text-white shadow-sm"
                  style={{
                    background: "linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)",
                    border: "none",
                  }}
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : editingCategory ? "Update Department" : "Publish Department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          6. CATEGORY INSPECTOR MODAL (VIEW PRODUCTS IN CATEGORY)
          ────────────────────────────────────────────────────────── */}
      {inspectCategory && (
        <div
          className="modal-backdrop-custom"
          onClick={() => setInspectCategory(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 15, 29, 0.75)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1060,
            padding: "20px",
          }}
        >
          <div
            className="modal-card-custom rounded-4 p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "680px",
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              color: colors.textPrimary,
              maxHeight: "85vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Inspector Header */}
            <div
              className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3"
              style={{ borderColor: colors.cardBorder }}
            >
              <div>
                <div className="d-flex align-items-center gap-2">
                  <span className="badge rounded-pill" style={{ background: "rgba(14, 165, 233, 0.2)", color: "#0ea5e9" }}>
                    DEPT #{inspectCategory.id}
                  </span>
                  <h5 className="fw-bold m-0" style={{ fontSize: "18px" }}>
                    {inspectCategory.name}
                  </h5>
                </div>
                <span className="small" style={{ color: colors.textSecondary }}>
                  {categoryProductCounts[inspectCategory.id] || 0} Products currently assigned to this department
                </span>
              </div>
              <button
                type="button"
                className="btn-close shadow-none"
                style={{ filter: darkMode ? "invert(1)" : "none" }}
                onClick={() => setInspectCategory(null)}
              ></button>
            </div>

            {/* Products List Body */}
            <div className="flex-grow-1 overflow-auto pe-1">
              {(categoryProductsMap[inspectCategory.id] || []).length === 0 ? (
                <div className="p-4 text-center text-muted">
                  <div style={{ fontSize: "36px", marginBottom: "8px" }}>📦</div>
                  <h6 className="fw-bold">No Products in this Category</h6>
                  <p className="small">Assign products to this category from the Products management console.</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {(categoryProductsMap[inspectCategory.id] || []).map((p) => (
                    <div
                      key={p.id}
                      className="p-2 rounded-3 d-flex align-items-center justify-content-between"
                      style={{
                        background: colors.inputBg,
                        border: `1px solid ${colors.cardBorder}`,
                      }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div
                          style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "8px",
                            background: p.imageUrl ? `url(${p.imageUrl}) center/cover no-repeat` : "#334155",
                            border: `1px solid ${colors.cardBorder}`,
                            flexShrink: 0,
                          }}
                        ></div>
                        <div>
                          <span className="fw-bold d-block text-truncate" style={{ fontSize: "14px", maxWidth: "300px" }}>
                            {p.name}
                          </span>
                          <span style={{ fontSize: "11px", color: colors.textSecondary }}>
                            SKU: {p.sku || `PROD-${p.id}`}
                          </span>
                        </div>
                      </div>

                      <div className="text-end">
                        <span className="fw-bold d-block" style={{ color: "#10b981", fontSize: "14px" }}>
                          ₹{Number(p.price || 0).toLocaleString("en-IN")}
                        </span>
                        <span
                          className="badge rounded-pill"
                          style={{
                            background: (p.stock || 0) > 0 ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                            color: (p.stock || 0) > 0 ? "#10b981" : "#ef4444",
                            fontSize: "10px",
                          }}
                        >
                          Stock: {p.stock ?? 0}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Inspector Footer */}
            <div
              className="d-flex justify-content-between align-items-center pt-3 border-top mt-3"
              style={{ borderColor: colors.cardBorder }}
            >
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                onClick={() => {
                  setInspectCategory(null);
                  handleOpenEdit(inspectCategory);
                }}
              >
                ✏️ Edit This Category
              </button>
              <button
                type="button"
                className="btn btn-sm btn-dark rounded-pill px-4"
                style={{ background: "#0f172a" }}
                onClick={() => setInspectCategory(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
