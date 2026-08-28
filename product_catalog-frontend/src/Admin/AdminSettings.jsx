import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const DEFAULT_SETTINGS = {
  storeName: "TechStore PRO",
  supportEmail: "support@techstore.in",
  supportPhone: "+91 98765 43210",
  currency: "INR (₹)",
  warehouseCity: "Hyderabad, Telangana",
  warehouseAddress: "Plot 42, Hitech City, Hyderabad - 500081",
  
  standardShippingFee: 50,
  freeShippingThreshold: 500,
  defaultCourier: "Delhivery",
  estimatedDeliveryDays: "3-5 Business Days",

  enableCOD: true,
  enableRazorpay: true,
  razorpayKeyId: "rzp_test_1DP5mmOlF5G5ag",

  emailOrderConfirmation: true,
  emailShippingUpdates: true,
  emailOrderCancellation: true,
  emailLowStockAlert: true,
};

const AdminSettings = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [activeTab, setActiveTab] = useState("store");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("admin_settings");
      if (saved) {
        setSettings((prev) => ({ ...prev, ...JSON.parse(saved) }));
      }
    } catch (err) {
      console.warn("Failed to load settings:", err);
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      localStorage.setItem("admin_settings", JSON.stringify(settings));
      setTimeout(() => {
        setSaving(false);
        Swal.fire({
          icon: "success",
          title: "Settings Saved!",
          text: "Store configurations have been updated successfully.",
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
      }, 400);
    } catch (err) {
      setSaving(false);
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: "Could not save settings.",
      });
    }
  };

  const handleReset = async () => {
    const confirm = await Swal.fire({
      title: "Restore Default Settings?",
      text: "All settings will revert to their default initial values.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Reset",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem("admin_settings");
    Swal.fire({
      icon: "success",
      title: "Settings Reset",
      text: "Default store settings restored.",
      toast: true,
      position: "top-end",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  return (
    <div className="admin-settings-page p-4" style={{ background: "#f8fafc", minHeight: "100vh" }}>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold m-0 text-slate-900" style={{ fontSize: "22px" }}>
            ⚙️ Store & Operations Settings
          </h2>
          <p className="text-muted small m-0">
            Configure store identity, shipping rates, payment gateways, and automated emails.
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-danger rounded-pill px-4 fw-semibold"
            onClick={handleReset}
          >
            🔄 Reset Defaults
          </button>

          <button
            type="button"
            className="btn btn-dark rounded-pill px-5 fw-semibold"
            style={{ background: "#0f172a" }}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "💾 Save Changes"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="d-flex gap-2 p-1 bg-white border rounded-4 shadow-sm mb-4 overflow-x-auto">
        {[
          { key: "store", label: "🏬 Store Profile", icon: "🏬" },
          { key: "shipping", label: "🚚 Shipping & Rates", icon: "🚚" },
          { key: "payments", label: "💳 Payment Gateways", icon: "💳" },
          { key: "emails", label: "📧 Email Notifications", icon: "📧" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`btn rounded-pill px-4 py-2 fw-semibold text-nowrap transition ${
              activeTab === tab.key
                ? "btn-dark text-white shadow-sm"
                : "btn-light text-slate-600 bg-transparent border-0"
            }`}
            onClick={() => setActiveTab(tab.key)}
            style={activeTab === tab.key ? { background: "#0f172a" } : {}}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave}>
        {/* TAB 1: STORE PROFILE */}
        {activeTab === "store" && (
          <div className="bg-white border rounded-4 p-4 shadow-sm">
            <h5 className="fw-bold text-slate-900 mb-3">🏬 Store Identity & Contact</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-bold text-slate-700">Store Public Brand Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold text-slate-700">Default Currency</label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold text-slate-700">Support Email *</label>
                <input
                  type="email"
                  className="form-control"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold text-slate-700">Helpline / Support Phone</label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.supportPhone}
                  onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold text-slate-700">Warehouse Origin City</label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.warehouseCity}
                  onChange={(e) => setSettings({ ...settings, warehouseCity: e.target.value })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold text-slate-700">Warehouse Hub Address</label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.warehouseAddress}
                  onChange={(e) => setSettings({ ...settings, warehouseAddress: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SHIPPING & RATES */}
        {activeTab === "shipping" && (
          <div className="bg-white border rounded-4 p-4 shadow-sm">
            <h5 className="fw-bold text-slate-900 mb-3">🚚 Shipping Rates & Courier Defaults</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-bold text-slate-700">Standard Shipping Fee (₹)</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={settings.standardShippingFee}
                  onChange={(e) => setSettings({ ...settings, standardShippingFee: Number(e.target.value) })}
                />
                <span className="small text-muted">Applied when cart total is below free shipping threshold.</span>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold text-slate-700">Free Shipping Minimum Cart Total (₹)</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={settings.freeShippingThreshold}
                  onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                />
                <span className="small text-muted">Orders with subtotal ≥ this amount qualify for Free Shipping.</span>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold text-slate-700">Default Courier Partner</label>
                <select
                  className="form-select"
                  value={settings.defaultCourier}
                  onChange={(e) => setSettings({ ...settings, defaultCourier: e.target.value })}
                >
                  <option value="Delhivery">Delhivery</option>
                  <option value="BlueDart">BlueDart</option>
                  <option value="DTDC">DTDC</option>
                  <option value="Shadowfax">Shadowfax</option>
                  <option value="Ekart">Ekart</option>
                  <option value="FedEx">FedEx</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold text-slate-700">Estimated Delivery Timeframe</label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.estimatedDeliveryDays}
                  onChange={(e) => setSettings({ ...settings, estimatedDeliveryDays: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PAYMENT GATEWAYS */}
        {activeTab === "payments" && (
          <div className="bg-white border rounded-4 p-4 shadow-sm">
            <h5 className="fw-bold text-slate-900 mb-3">💳 Payment Gateways & Methods</h5>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="p-3 border rounded-3 bg-light d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="fw-bold text-slate-900 mb-1">💵 Cash on Delivery (COD)</h6>
                    <span className="small text-muted">Allow customers to pay in cash upon receiving package.</span>
                  </div>
                  <div className="form-check form-switch fs-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={settings.enableCOD}
                      onChange={(e) => setSettings({ ...settings, enableCOD: e.target.checked })}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="p-3 border rounded-3 bg-light d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="fw-bold text-slate-900 mb-1">⚡ Razorpay Gateway (UPI / Cards)</h6>
                    <span className="small text-muted">Accept online payments via UPI, Debit/Credit cards, NetBanking.</span>
                  </div>
                  <div className="form-check form-switch fs-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={settings.enableRazorpay}
                      onChange={(e) => setSettings({ ...settings, enableRazorpay: e.target.checked })}
                    />
                  </div>
                </div>
              </div>

              <div className="col-12">
                <label className="form-label small fw-bold text-slate-700">Razorpay Key ID (Test/Live)</label>
                <input
                  type="text"
                  className="form-control font-monospace"
                  value={settings.razorpayKeyId}
                  onChange={(e) => setSettings({ ...settings, razorpayKeyId: e.target.value })}
                />
                <span className="small text-muted">Used by checkout modal to securely verify customer transactions.</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: EMAIL NOTIFICATIONS */}
        {activeTab === "emails" && (
          <div className="bg-white border rounded-4 p-4 shadow-sm">
            <h5 className="fw-bold text-slate-900 mb-3">📧 Automated Email Notifications</h5>
            <div className="row g-3">
              {[
                {
                  key: "emailOrderConfirmation",
                  title: "Order Placement Confirmation",
                  desc: "Send invoice receipt email immediately after a customer places an order.",
                },
                {
                  key: "emailShippingUpdates",
                  title: "Shipping & Tracking Dispatch Email",
                  desc: "Email customer their courier AWB tracking number when order is marked SHIPPED.",
                },
                {
                  key: "emailOrderCancellation",
                  title: "Order Cancellation & Refund Notice",
                  desc: "Notify customer when an order is cancelled or refund is initiated.",
                },
                {
                  key: "emailLowStockAlert",
                  title: "Admin Low-Stock Alerts",
                  desc: "Receive alert notifications when product stock drops below 5 units.",
                },
              ].map((item) => (
                <div className="col-12 col-md-6" key={item.key}>
                  <div className="p-3 border rounded-3 bg-light d-flex justify-content-between align-items-center h-100">
                    <div>
                      <h6 className="fw-bold text-slate-900 mb-1">{item.title}</h6>
                      <span className="small text-muted">{item.desc}</span>
                    </div>
                    <div className="form-check form-switch fs-4 ms-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={settings[item.key]}
                        onChange={(e) => setSettings({ ...settings, [item.key]: e.target.checked })}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="d-flex justify-content-end mt-4">
          <button
            type="submit"
            className="btn btn-dark rounded-pill px-5 py-2 fw-semibold"
            style={{ background: "#0f172a" }}
            disabled={saving}
          >
            {saving ? "Saving..." : "💾 Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
