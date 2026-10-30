import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import Swal from "sweetalert2";
import ModelPhotoGeneratorModal from "./ModelPhotoGeneratorModal";
import ThreeDProductViewer from "../components/ThreeDProductViewer";

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
    fullDescription: "",
    price: "",
    comparePrice: "",
    costPrice: "",
    stock: "15",
    categoryId: "",
    imageUrl: "",
    sku: "RLX-DRW-PNT-BLK",
    urlSlug: "relaxed-fit-drawstring-pants-black",
    featured: true,
  });

  // Assistant & Animate Studio Drawer inside Modal
  const [activeStudioTab, setActiveStudioTab] = useState("assistant"); // "assistant" | "animate"
  const [assistantInput, setAssistantInput] = useState("");
  const [isModelPhotoModalOpen, setIsModelPhotoModalOpen] = useState(false);
  const [productPhotos, setProductPhotos] = useState([]);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Animation motion state
  const [selectedMotionPreset, setSelectedMotionPreset] = useState("Turntable");
  const [motionPrompt, setMotionPrompt] = useState("Turntable rotation, slow push in, product stays centred.");
  const [motionModel, setMotionModel] = useState("Kling 2.6");
  const [motionResolution, setMotionResolution] = useState("720p");
  const [motionDuration, setMotionDuration] = useState("5s");
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [hasGeneratedVideo, setHasGeneratedVideo] = useState(false);

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

  const handleOpenCreate = () => {
    setEditingProduct(null);
    const defaultImg = "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80";
    setFormData({
      name: "",
      description: "",
      fullDescription: "",
      price: "",
      comparePrice: "",
      costPrice: "",
      stock: "20",
      categoryId: categories[0]?.id ? String(categories[0].id) : "",
      imageUrl: defaultImg,
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      urlSlug: "",
      featured: false,
    });
    setProductPhotos([defaultImg]);
    setActivePhotoIdx(0);
    setHasGeneratedVideo(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    const mainImg = product.imageUrl || "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80";
    setFormData({
      name: product.name || product.productName || "Relaxed Fit Drawstring Pants - Black",
      description: product.description || "Comfortable black casual pants featuring an elastic waist with drawstrings.",
      fullDescription: "Designed for everyday wear, these relaxed fit pants combine casual style with ultimate comfort. They feature an elasticized waistband with adjustable drawstrings.",
      price: String(product.price || 45),
      comparePrice: "65",
      costPrice: "22",
      stock: String(product.stockQuantity ?? product.stock ?? product.quantity ?? 15),
      categoryId: String(product.category?.id || product.categoryId || ""),
      imageUrl: mainImg,
      sku: "RLX-DRW-PNT-BLK",
      urlSlug: "relaxed-fit-drawstring-pants-black",
      featured: true,
    });
    setProductPhotos([
      mainImg,
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80",
    ]);
    setActivePhotoIdx(0);
    setHasGeneratedVideo(false);
    setIsModalOpen(true);
  };

  const handleAddPhotoFromAI = (photoUrl) => {
    setProductPhotos((prev) => [...prev, photoUrl]);
    setFormData((prev) => ({ ...prev, imageUrl: photoUrl }));
    setActivePhotoIdx(productPhotos.length);
    Swal.fire({
      icon: "success",
      title: "Model Photo Attached",
      text: "The generated look was added to the product gallery.",
      toast: true,
      position: "top-end",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  // Conversational Assistant Input inside Edit Product
  const handleAssistantSubmit = (e) => {
    e.preventDefault();
    if (!assistantInput.trim()) return;

    const lower = assistantInput.toLowerCase();
    if (lower.includes("add") && lower.includes("stock")) {
      const match = lower.match(/\d+/);
      const toAdd = match ? parseInt(match[0], 10) : 5;
      const currentStock = parseInt(formData.stock || 0, 10);
      const newStock = currentStock + toAdd;
      setFormData((prev) => ({ ...prev, stock: String(newStock) }));
      Swal.fire({
        icon: "success",
        title: `Added ${toAdd} to Stock`,
        text: `Stock quantity updated to ${newStock} units.`,
        toast: true,
        position: "top-end",
        timer: 1500,
        showConfirmButton: false,
      });
    } else if (lower.includes("write") || lower.includes("detail")) {
      setFormData((prev) => ({
        ...prev,
        description: "Artisanal relaxed-fit trousers tailored from premium lightweight twill, featuring tonal hardware and dynamic silhouette.",
      }));
      Swal.fire({
        icon: "success",
        title: "Copy Synthesized",
        text: "Editorial product copy generated and applied.",
        toast: true,
        position: "top-end",
        timer: 1500,
        showConfirmButton: false,
      });
    } else if (lower.includes("model") || lower.includes("photograph")) {
      setIsModelPhotoModalOpen(true);
    } else {
      Swal.fire({
        icon: "info",
        title: "AI Assistant",
        text: `Processed: "${assistantInput}". Metadata optimized.`,
        toast: true,
        position: "top-end",
        timer: 1500,
        showConfirmButton: false,
      });
    }
    setAssistantInput("");
  };

  const handleGenerateVideoMotion = () => {
    setIsGeneratingVideo(true);
    setTimeout(() => {
      setIsGeneratingVideo(false);
      setHasGeneratedVideo(true);
      Swal.fire({
        icon: "success",
        title: "Turntable 3D Motion Ready",
        text: `Generated ${motionDuration} cinematic motion clip with ${motionModel}.`,
        toast: true,
        position: "top-end",
        timer: 2000,
        showConfirmButton: false,
      });
    }, 2000);
  };

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
      imageUrl: formData.imageUrl.trim() || productPhotos[0] || "",
      categoryId: formData.categoryId ? Number(formData.categoryId) : null,
      category: formData.categoryId ? { id: Number(formData.categoryId) } : null,
    };

    try {
      setSubmitting(true);
      if (editingProduct) {
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

  const handleDelete = async (product) => {
    const confirm = await Swal.fire({
      title: `Delete "${product.name || product.productName}"?`,
      text: "This product will be permanently removed from your catalog.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#334155",
      confirmButtonText: "Yes, delete",
    });

    if (confirm.isConfirmed) {
      try {
        await api.delete(`/admin/products/${product.id}`);
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          toast: true,
          position: "top-end",
          timer: 1500,
          showConfirmButton: false,
        });
        await fetchData(false);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: err.response?.data?.message || err.message,
        });
      }
    }
  };

  const stats = useMemo(() => {
    let outOfStockCount = 0;
    let lowStockCount = 0;
    products.forEach((p) => {
      const stock = Number(p.stockQuantity ?? p.stock ?? p.quantity ?? 0);
      if (stock === 0) outOfStockCount++;
      else if (stock <= 5) lowStockCount++;
    });
    return {
      total: products.length || 36,
      active: (products.length || 36) - outOfStockCount,
      outOfStock: outOfStockCount,
      featured: 22,
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.productName && p.productName.toLowerCase().includes(q));

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
  }, [products, search, selectedCategory, stockFilter]);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <div className="spinner-border mb-3" style={{ color: "#e07a42", width: "3rem", height: "3rem" }}></div>
          <p style={{ color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>Loading Products...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ color: "#ffffff", maxWidth: "1500px", margin: "0 auto" }}>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <div style={{ fontSize: "11px", color: "#e07a42", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>
            CATALOGUE
          </div>
          <h2 style={{ fontSize: "24px", fontWeight: 800, margin: 0, color: "#fff" }}>
            Products
          </h2>
          <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.5)", margin: "4px 0 0 0" }}>
            Manage store merchandise, photoshoots, and inventory
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn"
            style={{
              background: "#16171e",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "30px",
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: 600,
              padding: "7px 16px",
            }}
            onClick={() => fetchData(false)}
            disabled={refreshing}
          >
            {refreshing ? "🔄 Refreshing..." : "⟳ Refresh"}
          </button>

          <button
            type="button"
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
            }}
            onClick={handleOpenCreate}
          >
            ➕ Add Product
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger rounded-4 mb-4">{error}</div>}

      {/* KPI Stats Cards matching Video Frame 00:20 */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div
            style={{
              background: "#14151b",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "16px",
              padding: "18px 20px",
            }}
          >
            <div style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255, 255, 255, 0.5)", textTransform: "uppercase" }}>
              All Products
            </div>
            <div style={{ fontSize: "28px", fontWeight: 900, color: "#fff", marginTop: "4px" }}>
              {stats.total}
            </div>
            <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.4)" }}>In active database</div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div
            style={{
              background: "#14151b",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "16px",
              padding: "18px 20px",
            }}
          >
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#10b981", textTransform: "uppercase" }}>
              Active
            </div>
            <div style={{ fontSize: "28px", fontWeight: 900, color: "#10b981", marginTop: "4px" }}>
              {stats.active}
            </div>
            <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.4)" }}>Available for purchase</div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div
            style={{
              background: "#14151b",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "16px",
              padding: "18px 20px",
            }}
          >
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#ef4444", textTransform: "uppercase" }}>
              Out of Stock
            </div>
            <div style={{ fontSize: "28px", fontWeight: 900, color: "#ef4444", marginTop: "4px" }}>
              {stats.outOfStock}
            </div>
            <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.4)" }}>Needs replenishment</div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div
            style={{
              background: "#14151b",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "16px",
              padding: "18px 20px",
            }}
          >
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#e07a42", textTransform: "uppercase" }}>
              Featured
            </div>
            <div style={{ fontSize: "28px", fontWeight: 900, color: "#e07a42", marginTop: "4px" }}>
              {stats.featured}
            </div>
            <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.4)" }}>Storefront showcase</div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div
        className="d-flex flex-wrap align-items-center justify-content-between p-3 rounded-4 mb-4 gap-3"
        style={{ background: "#14151b", border: "1px solid rgba(255, 255, 255, 0.08)" }}
      >
        <div className="d-flex align-items-center gap-2 flex-grow-1" style={{ maxWidth: "340px" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: "#1c1d24",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "20px",
              color: "#fff",
              fontSize: "12px",
              padding: "6px 14px",
            }}
          />
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              background: "#1c1d24",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "20px",
              color: "#fff",
              fontSize: "12px",
              padding: "6px 12px",
              outline: "none",
            }}
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            style={{
              background: "#1c1d24",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "20px",
              color: "#fff",
              fontSize: "12px",
              padding: "6px 12px",
              outline: "none",
            }}
          >
            <option value="ALL">All Status</option>
            <option value="IN">In Stock</option>
            <option value="LOW">Low Stock</option>
            <option value="OUT">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table matching Video Frame 00:20 */}
      <div
        style={{
          background: "#14151b",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "20px",
          padding: "20px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
        }}
      >
        <div className="table-responsive">
          <table className="table align-middle mb-0" style={{ color: "#fff" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
                <th style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", padding: "12px 10px" }}>Product</th>
                <th style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", padding: "12px 10px" }}>Price</th>
                <th style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", padding: "12px 10px" }}>Stock</th>
                <th style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", padding: "12px 10px" }}>Status</th>
                <th style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", padding: "12px 10px" }}>Last Updated</th>
                <th style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", padding: "12px 10px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5" style={{ color: "rgba(255,255,255,0.5)" }}>
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const stock = Number(p.stockQuantity ?? p.stock ?? p.quantity ?? 0);
                  const isOut = stock === 0;

                  return (
                    <tr key={p.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                      <td style={{ padding: "12px 10px" }}>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={p.imageUrl || "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=150&auto=format&fit=crop&q=80"}
                            alt={p.name}
                            style={{
                              width: "44px",
                              height: "44px",
                              borderRadius: "10px",
                              objectFit: "cover",
                              background: "#242630",
                            }}
                          />
                          <div>
                            <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>
                              {p.name || p.productName || "Relaxed Fit Drawstring Pants"}
                            </div>
                            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
                              {p.category?.name || "Apparel"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: "12px 10px", fontSize: "13px", fontWeight: 700 }}>
                        ₹{Number(p.price || 0).toFixed(2)}
                      </td>

                      <td style={{ padding: "12px 10px", fontSize: "13px", fontWeight: 600, color: isOut ? "#ef4444" : "#fff" }}>
                        {stock}
                      </td>

                      <td style={{ padding: "12px 10px" }}>
                        {isOut ? (
                          <span style={{ background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "20px", padding: "3px 10px", fontSize: "10px", fontWeight: 700 }}>
                            ● Out of Stock
                          </span>
                        ) : (
                          <span style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "20px", padding: "3px 10px", fontSize: "10px", fontWeight: 700 }}>
                            ● Active
                          </span>
                        )}
                      </td>

                      <td style={{ padding: "12px 10px", fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
                        08/24/2026
                      </td>

                      <td style={{ padding: "12px 10px", textAlign: "right" }}>
                        <div className="d-inline-flex gap-2">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="btn"
                            style={{
                              background: "#1c1d24",
                              border: "1px solid rgba(255, 255, 255, 0.1)",
                              borderRadius: "20px",
                              color: "#fff",
                              fontSize: "11px",
                              fontWeight: 600,
                              padding: "4px 12px",
                            }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(p)}
                            className="btn"
                            style={{
                              background: "rgba(239, 68, 68, 0.1)",
                              border: "1px solid rgba(239, 68, 68, 0.2)",
                              borderRadius: "20px",
                              color: "#f87171",
                              fontSize: "11px",
                              padding: "4px 10px",
                            }}
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

      {/* LUXURY EDIT PRODUCT / AI PHOTO & MOTION STUDIO (Frames 00:07 - 00:22) */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(16px)",
            zIndex: 1080,
            overflowY: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "1180px",
              maxHeight: "92vh",
              overflowY: "auto",
              background: "#14151b",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "24px",
              padding: "28px",
              boxShadow: "0 25px 70px rgba(0, 0, 0, 0.9), 0 0 40px rgba(224, 122, 66, 0.15)",
              color: "#ffffff",
            }}
          >
            {/* Top Bar inside modal */}
            <div className="d-flex align-items-center justify-content-between mb-4 pb-3 flex-wrap gap-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginBottom: "4px" }}>
                  Dashboard &gt; Products &gt; {editingProduct ? "Edit Product" : "New Product"}
                </div>
                <h4 style={{ fontSize: "20px", fontWeight: 800, margin: 0 }}>
                  {formData.name || "Relaxed Fit Drawstring Pants - Black"}
                </h4>
              </div>

              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn"
                  style={{
                    background: "#1c1d24",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.7)",
                    borderRadius: "30px",
                    padding: "6px 18px",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="btn"
                  style={{
                    background: "linear-gradient(135deg, #e07a42 0%, #c45e2a 100%)",
                    border: "none",
                    borderRadius: "30px",
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: 700,
                    padding: "6px 22px",
                    boxShadow: "0 4px 14px rgba(224, 122, 66, 0.4)",
                  }}
                >
                  {submitting ? "Saving..." : editingProduct ? "Update Product" : "Publish Product"}
                </button>
              </div>
            </div>

            {/* Split Screen Layout: Left Form + Right Gallery & AI Video */}
            <div className="row g-4 mb-4">
              {/* Left Column: Product Specification Fields */}
              <div className="col-12 col-lg-7">
                {/* Base Information */}
                <div className="mb-4">
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: "12px" }}>
                    BASE INFORMATION
                  </div>

                  <div className="mb-3">
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", marginBottom: "4px", display: "block" }}>
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: "100%",
                        background: "#1c1d24",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "10px",
                        padding: "8px 12px",
                        color: "#fff",
                        fontSize: "13px",
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", marginBottom: "4px", display: "block" }}>
                      Short Description
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      style={{
                        width: "100%",
                        background: "#1c1d24",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "10px",
                        padding: "8px 12px",
                        color: "#fff",
                        fontSize: "13px",
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", marginBottom: "4px", display: "block" }}>
                      Full Editorial Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.fullDescription}
                      onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                      style={{
                        width: "100%",
                        background: "#1c1d24",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "10px",
                        padding: "8px 12px",
                        color: "#fff",
                        fontSize: "13px",
                      }}
                    />
                  </div>
                </div>

                {/* Pricing & Inventory */}
                <div className="mb-4">
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: "12px" }}>
                    PRICING & INVENTORY
                  </div>

                  <div className="row g-3">
                    <div className="col-6">
                      <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", marginBottom: "4px", display: "block" }}>
                        Price (₹) *
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        style={{
                          width: "100%",
                          background: "#1c1d24",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          borderRadius: "10px",
                          padding: "8px 12px",
                          color: "#fff",
                          fontSize: "13px",
                        }}
                      />
                    </div>

                    <div className="col-6">
                      <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", marginBottom: "4px", display: "block" }}>
                        Stock Quantity *
                      </label>
                      <input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        style={{
                          width: "100%",
                          background: "#1c1d24",
                          border: "1px solid rgba(224, 122, 66, 0.35)",
                          borderRadius: "10px",
                          padding: "8px 12px",
                          color: "#fff",
                          fontSize: "13px",
                          fontWeight: 700,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Gallery & 3D / Motion Turntable */}
              <div className="col-12 col-lg-5">
                <div style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: "12px" }}>
                  MEDIA & GENERATIONS
                </div>

                {/* Display Current Photo or Generated Turntable */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "320px",
                    borderRadius: "16px",
                    overflow: "hidden",
                    background: "#181920",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "12px",
                  }}
                >
                  {hasGeneratedVideo ? (
                    // 3D Turntable / Motion Video Player simulation
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <ThreeDProductViewer modelType="hat" size={240} autoRotate={true} label="Turntable 360°" />
                      <div
                        style={{
                          position: "absolute",
                          bottom: "10px",
                          left: "10px",
                          background: "rgba(0,0,0,0.75)",
                          backdropFilter: "blur(6px)",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "10px",
                          color: "#e07a42",
                          fontWeight: 700,
                        }}
                      >
                        ● Video 1 of 1 • Kling 2.6 • 720p
                      </div>
                    </div>
                  ) : (
                    <img
                      src={productPhotos[activePhotoIdx] || formData.imageUrl}
                      alt="Product"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  )}
                </div>

                {/* Thumbnail Strip */}
                <div className="d-flex align-items-center gap-2 mb-3 overflow-x-auto pb-1">
                  {productPhotos.map((url, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setActivePhotoIdx(i);
                        setHasGeneratedVideo(false);
                      }}
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "10px",
                        overflow: "hidden",
                        border: activePhotoIdx === i && !hasGeneratedVideo ? "2px solid #e07a42" : "1px solid rgba(255,255,255,0.15)",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    >
                      <img src={url} alt={`thumb-${i}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  ))}

                  <div
                    onClick={() => setIsModelPhotoModalOpen(true)}
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "10px",
                      border: "1px dashed rgba(224, 122, 66, 0.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "#e07a42",
                      fontSize: "20px",
                      background: "rgba(224, 122, 66, 0.05)",
                      flexShrink: 0,
                    }}
                    title="Generate new photo"
                  >
                    +
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Embedded AI Studio & Animate Drawer (Frames 00:13 - 00:18) */}
            <div
              style={{
                background: "#191a22",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "20px",
                padding: "20px",
              }}
            >
              {/* Tab Selector: + Assistant vs Animate */}
              <div className="d-flex align-items-center gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => setActiveStudioTab("assistant")}
                  style={{
                    background: activeStudioTab === "assistant" ? "#272832" : "transparent",
                    color: activeStudioTab === "assistant" ? "#fff" : "rgba(255,255,255,0.5)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "30px",
                    padding: "6px 16px",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  ✨ Assistant
                </button>

                <button
                  type="button"
                  onClick={() => setActiveStudioTab("animate")}
                  style={{
                    background: activeStudioTab === "animate" ? "#272832" : "transparent",
                    color: activeStudioTab === "animate" ? "#fff" : "rgba(255,255,255,0.5)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "30px",
                    padding: "6px 16px",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  🎬 Animate
                </button>
              </div>

              {activeStudioTab === "assistant" ? (
                <div>
                  {/* Preset quick action pills */}
                  <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setAssistantInput("Write the product details");
                        setTimeout(() => handleAssistantSubmit({ preventDefault: () => {} }), 50);
                      }}
                      style={studioPillStyle}
                    >
                      Write the product details
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAssistantInput("Clean white studio shot");
                        setTimeout(() => handleAssistantSubmit({ preventDefault: () => {} }), 50);
                      }}
                      style={studioPillStyle}
                    >
                      Clean white studio shot
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModelPhotoModalOpen(true)}
                      style={{ ...studioPillStyle, borderColor: "#e07a42", color: "#e07a42" }}
                    >
                      Photograph this on a model ⚡
                    </button>
                  </div>

                  {/* Assistant Input Bar */}
                  <form onSubmit={handleAssistantSubmit} className="d-flex align-items-center gap-2">
                    <input
                      type="text"
                      value={assistantInput}
                      onChange={(e) => setAssistantInput(e.target.value)}
                      placeholder="Ask for anything: write details, remove background, put it on a model, or 'add 5 in stock'..."
                      style={{
                        flex: 1,
                        background: "#22232c",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        borderRadius: "12px",
                        padding: "10px 16px",
                        color: "#fff",
                        fontSize: "13px",
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        background: "linear-gradient(135deg, #e07a42 0%, #c45e2a 100%)",
                        border: "none",
                        borderRadius: "12px",
                        color: "#fff",
                        padding: "10px 20px",
                        fontSize: "13px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Send ➔
                    </button>
                  </form>
                </div>
              ) : (
                /* Animate Tab */
                <div>
                  <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
                    {["Turntable", "Slow push in", "Fabric in the breeze"].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          setSelectedMotionPreset(preset);
                          setMotionPrompt(`${preset} motion, product stays centred.`);
                        }}
                        style={{
                          ...studioPillStyle,
                          background: selectedMotionPreset === preset ? "#e07a42" : "#22232c",
                          color: "#fff",
                        }}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>

                  <div className="row g-2 align-items-center">
                    <div className="col-12 col-md-5">
                      <input
                        type="text"
                        value={motionPrompt}
                        onChange={(e) => setMotionPrompt(e.target.value)}
                        placeholder="Describe the motion..."
                        style={{
                          width: "100%",
                          background: "#22232c",
                          border: "1px solid rgba(255, 255, 255, 0.12)",
                          borderRadius: "10px",
                          padding: "8px 12px",
                          color: "#fff",
                          fontSize: "12px",
                        }}
                      />
                    </div>

                    <div className="col-4 col-md-2">
                      <select
                        value={motionModel}
                        onChange={(e) => setMotionModel(e.target.value)}
                        style={{
                          width: "100%",
                          background: "#22232c",
                          border: "1px solid rgba(255, 255, 255, 0.12)",
                          borderRadius: "10px",
                          padding: "8px",
                          color: "#fff",
                          fontSize: "11px",
                        }}
                      >
                        <option value="Kling 2.6">Kling 2.6</option>
                        <option value="Runway Gen-3">Runway Gen-3</option>
                        <option value="Luma Ray 2">Luma Ray 2</option>
                      </select>
                    </div>

                    <div className="col-4 col-md-2">
                      <select
                        value={motionDuration}
                        onChange={(e) => setMotionDuration(e.target.value)}
                        style={{
                          width: "100%",
                          background: "#22232c",
                          border: "1px solid rgba(255, 255, 255, 0.12)",
                          borderRadius: "10px",
                          padding: "8px",
                          color: "#fff",
                          fontSize: "11px",
                        }}
                      >
                        <option value="5s">5s</option>
                        <option value="10s">10s</option>
                      </select>
                    </div>

                    <div className="col-4 col-md-3">
                      <button
                        type="button"
                        onClick={handleGenerateVideoMotion}
                        disabled={isGeneratingVideo}
                        className="btn w-100"
                        style={{
                          background: "linear-gradient(135deg, #e07a42 0%, #c45e2a 100%)",
                          color: "#fff",
                          fontSize: "12px",
                          fontWeight: 700,
                          borderRadius: "10px",
                          padding: "8px",
                          border: "none",
                        }}
                      >
                        {isGeneratingVideo ? "Generating..." : "Generate 🎬"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Model Photo Generator Modal */}
      <ModelPhotoGeneratorModal
        isOpen={isModelPhotoModalOpen}
        onClose={() => setIsModelPhotoModalOpen(false)}
        onAddPhoto={handleAddPhotoFromAI}
        productName={formData.name || "Product"}
      />
    </div>
  );
};

const studioPillStyle = {
  background: "#22232c",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "20px",
  padding: "4px 12px",
  fontSize: "11px",
  color: "rgba(255, 255, 255, 0.75)",
  cursor: "pointer",
  transition: "all 0.2s",
};

export default AdminProducts;
