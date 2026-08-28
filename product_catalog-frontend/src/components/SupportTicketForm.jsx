import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

// ==========================================
// API BASE URL
// ==========================================
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8082/api";

// ==========================================
// INITIAL FORM
// ==========================================
const initialForm = {
  category: "",
  subject: "",
  message: "",
  priority: "NORMAL",
};

// ==========================================
// SUPPORT TICKET FORM
// ==========================================
const SupportTicketForm = ({
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const [formData, setFormData] =
    useState(initialForm);

  const [loading, setLoading] =
    useState(false);

  const [errors, setErrors] =
    useState({});

  // ==========================================
  // GET CURRENT USER
  // ==========================================
  const getCurrentUser = () => {
    try {
      return JSON.parse(
        localStorage.getItem("user") || "null"
      );
    } catch {
      return null;
    }
  };

  // ==========================================
  // INPUT HANDLER
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove field error while typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // ==========================================
  // VALIDATION
  // ==========================================
  const validateForm = () => {
    const newErrors = {};

    if (!formData.category) {
      newErrors.category =
        "Please select a support category.";
    }

    if (!formData.subject.trim()) {
      newErrors.subject =
        "Please enter a subject.";
    } else if (
      formData.subject.trim().length < 5
    ) {
      newErrors.subject =
        "Subject must contain at least 5 characters.";
    }

    if (!formData.message.trim()) {
      newErrors.message =
        "Please describe your issue.";
    } else if (
      formData.message.trim().length < 20
    ) {
      newErrors.message =
        "Please provide at least 20 characters so our team can understand the issue.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ==========================================
  // SUBMIT TICKET
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("jwtToken");

    const user = getCurrentUser();

    if (!user?.email) {
      await Swal.fire({
        icon: "info",
        title: "Login Required",
        text: "Please log in to create a support ticket.",
        confirmButtonText: "Go to Login",
        confirmButtonColor: "#2563eb",
      });

      window.location.href = "/login";
      return;
    }

    setLoading(true);

    try {
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization =
          `Bearer ${token}`;
      }

      // ========================================
      // PAYLOAD
      // ========================================
      const payload = {
        email: user.email,
        category: formData.category,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        priority: formData.priority,
      };

      // ========================================
      // API REQUEST
      // ========================================
      const response = await fetch(
        `${API_BASE_URL}/support/tickets`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        }
      );

      // ========================================
      // PARSE RESPONSE
      // ========================================
      const data = await response
        .json()
        .catch(() => ({}));

      // ========================================
      // ERROR
      // ========================================
      if (!response.ok) {
        if (
          response.status === 401 ||
          response.status === 403
        ) {
          throw new Error(
            "Your session has expired. Please log in again."
          );
        }

        throw new Error(
          data.message ||
            data.error ||
            "Unable to create your support ticket."
        );
      }

      // ========================================
      // SUCCESS
      // ========================================
      setFormData(initialForm);
      setErrors({});

      await Swal.fire({
        icon: "success",
        title: "Ticket Created",
        text:
          data.message ||
          "Your support ticket has been submitted successfully.",
        confirmButtonColor: "#2563eb",
        confirmButtonText: "Done",
      });

      // Send created ticket to parent
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (error) {
      console.error(
        "Support ticket error:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text:
          error.message ||
          "We could not create your support ticket. Please try again.",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RESET FORM
  // ==========================================
  const handleReset = () => {
    setFormData(initialForm);
    setErrors({});
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: embedded
          ? "100%"
          : "900px",
        margin: "0 auto",
      }}
    >
      {/* =====================================================
          MAIN CARD
      ====================================================== */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "28px",
          background: "var(--card)",
          border:
            "1px solid var(--border)",
          boxShadow:
            "0 25px 70px rgba(15, 23, 42, 0.10)",
        }}
      >
        {/* Decorative glow */}
        <div
          style={{
            position: "absolute",
            top: "-130px",
            right: "-100px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background:
              "rgba(37, 99, 235, 0.08)",
            filter: "blur(70px)",
            pointerEvents: "none",
          }}
        />

        {/* ===================================================
            HEADER
        ==================================================== */}
        <div
          style={{
            position: "relative",
            padding:
              "38px 40px 30px",
            borderBottom:
              "1px solid var(--border)",
          }}
        >
          <div
            className="d-flex align-items-start justify-content-between gap-3"
          >
            <div>
              <div
                className="d-inline-flex align-items-center gap-2 mb-3"
                style={{
                  padding:
                    "7px 12px",
                  borderRadius:
                    "999px",
                  background:
                    "rgba(37, 99, 235, 0.08)",
                  color: "#2563eb",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing:
                    "0.3px",
                }}
              >
                <span>💬</span>
                <span>
                  CUSTOMER SUPPORT
                </span>
              </div>

              <h2
                className="fw-bold mb-2"
                style={{
                  fontSize:
                    "clamp(1.7rem, 4vw, 2.35rem)",
                  letterSpacing:
                    "-1.2px",
                  color:
                    "var(--text-primary)",
                }}
              >
                Tell us how we can help
              </h2>

              <p
                className="mb-0"
                style={{
                  maxWidth:
                    "620px",
                  color:
                    "var(--text-secondary)",
                  fontSize:
                    "14px",
                  lineHeight: 1.7,
                }}
              >
                Describe your issue and our support
                team will review your request and get
                back to you as soon as possible.
              </p>
            </div>

            <div
              className="d-none d-sm-flex align-items-center justify-content-center"
              style={{
                width: "58px",
                height: "58px",
                flexShrink: 0,
                borderRadius:
                  "18px",
                background:
                  "linear-gradient(135deg, #eff6ff, #eef2ff)",
                border:
                  "1px solid rgba(37,99,235,0.10)",
                fontSize: "25px",
              }}
            >
              🎧
            </div>
          </div>
        </div>

        {/* ===================================================
            FORM
        ==================================================== */}
        <form
          onSubmit={handleSubmit}
          noValidate
          style={{
            position: "relative",
            padding:
              "35px 40px 40px",
          }}
        >
          {/* ===============================================
              CATEGORY + PRIORITY
          ================================================ */}
          <div className="row g-4">
            {/* Category */}
            <div className="col-12 col-md-6">
              <label
                htmlFor="support-category"
                className="form-label fw-semibold"
                style={{
                  color:
                    "var(--text-primary)",
                  fontSize:
                    "13px",
                }}
              >
                Support Category
                <span
                  style={{
                    color: "#ef4444",
                    marginLeft: "4px",
                  }}
                >
                  *
                </span>
              </label>

              <select
                id="support-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={loading}
                className="form-select"
                style={{
                  minHeight:
                    "52px",
                  borderRadius:
                    "13px",
                  border:
                    errors.category
                      ? "1px solid #ef4444"
                      : "1px solid var(--border)",
                  background:
                    "var(--input-bg)",
                  color:
                    "var(--text-primary)",
                  boxShadow: "none",
                }}
              >
                <option value="">
                  Select a category
                </option>

                <option value="ORDER">
                  📦 Orders & Delivery
                </option>

                <option value="RETURN">
                  ↩️ Returns & Refunds
                </option>

                <option value="PAYMENT">
                  💳 Payments
                </option>

                <option value="PRODUCT">
                  🛍️ Product Issue
                </option>

                <option value="ACCOUNT">
                  👤 Account
                </option>

                <option value="TECHNICAL">
                  ⚙️ Technical Issue
                </option>

                <option value="OTHER">
                  💡 Other
                </option>
              </select>

              {errors.category && (
                <div
                  className="mt-2"
                  style={{
                    color: "#ef4444",
                    fontSize: "12px",
                  }}
                >
                  {errors.category}
                </div>
              )}
            </div>

            {/* Priority */}
            <div className="col-12 col-md-6">
              <label
                htmlFor="support-priority"
                className="form-label fw-semibold"
                style={{
                  color:
                    "var(--text-primary)",
                  fontSize:
                    "13px",
                }}
              >
                Priority
              </label>

              <select
                id="support-priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                disabled={loading}
                className="form-select"
                style={{
                  minHeight:
                    "52px",
                  borderRadius:
                    "13px",
                  border:
                    "1px solid var(--border)",
                  background:
                    "var(--input-bg)",
                  color:
                    "var(--text-primary)",
                  boxShadow: "none",
                }}
              >
                <option value="LOW">
                  Low — General question
                </option>

                <option value="NORMAL">
                  Normal — Need assistance
                </option>

                <option value="HIGH">
                  High — Important issue
                </option>

                <option value="URGENT">
                  Urgent — Critical issue
                </option>
              </select>
            </div>

            {/* =============================================
                SUBJECT
            ============================================== */}
            <div className="col-12">
              <label
                htmlFor="support-subject"
                className="form-label fw-semibold"
                style={{
                  color:
                    "var(--text-primary)",
                  fontSize:
                    "13px",
                }}
              >
                Subject
                <span
                  style={{
                    color: "#ef4444",
                    marginLeft: "4px",
                  }}
                >
                  *
                </span>
              </label>

              <input
                id="support-subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                disabled={loading}
                maxLength={120}
                placeholder="Briefly describe your issue"
                className="form-control"
                style={{
                  minHeight:
                    "52px",
                  borderRadius:
                    "13px",
                  border:
                    errors.subject
                      ? "1px solid #ef4444"
                      : "1px solid var(--border)",
                  background:
                    "var(--input-bg)",
                  color:
                    "var(--text-primary)",
                  boxShadow: "none",
                  padding:
                    "12px 15px",
                }}
              />

              <div className="d-flex justify-content-between mt-2">
                {errors.subject ? (
                  <span
                    style={{
                      color: "#ef4444",
                      fontSize:
                        "12px",
                    }}
                  >
                    {errors.subject}
                  </span>
                ) : (
                  <span
                    style={{
                      color:
                        "var(--text-secondary)",
                      fontSize:
                        "11px",
                    }}
                  >
                    Keep it short and specific.
                  </span>
                )}

                <span
                  style={{
                    color:
                      "var(--text-secondary)",
                    fontSize:
                      "11px",
                  }}
                >
                  {formData.subject.length}/120
                </span>
              </div>
            </div>

            {/* =============================================
                MESSAGE
            ============================================== */}
            <div className="col-12">
              <label
                htmlFor="support-message"
                className="form-label fw-semibold"
                style={{
                  color:
                    "var(--text-primary)",
                  fontSize:
                    "13px",
                }}
              >
                Describe your issue
                <span
                  style={{
                    color: "#ef4444",
                    marginLeft: "4px",
                  }}
                >
                  *
                </span>
              </label>

              <textarea
                id="support-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                disabled={loading}
                maxLength={2000}
                rows={7}
                placeholder="Tell us what happened, what you expected, and any relevant order or product details..."
                className="form-control"
                style={{
                  resize: "vertical",
                  minHeight:
                    "170px",
                  borderRadius:
                    "15px",
                  border:
                    errors.message
                      ? "1px solid #ef4444"
                      : "1px solid var(--border)",
                  background:
                    "var(--input-bg)",
                  color:
                    "var(--text-primary)",
                  boxShadow: "none",
                  padding:
                    "15px",
                  lineHeight:
                    "1.7",
                }}
              />

              <div className="d-flex justify-content-between mt-2">
                {errors.message ? (
                  <span
                    style={{
                      color: "#ef4444",
                      fontSize:
                        "12px",
                      maxWidth:
                        "75%",
                    }}
                  >
                    {errors.message}
                  </span>
                ) : (
                  <span
                    style={{
                      color:
                        "var(--text-secondary)",
                      fontSize:
                        "11px",
                    }}
                  >
                    Please don't share passwords or sensitive
                    payment information.
                  </span>
                )}

                <span
                  style={{
                    color:
                      "var(--text-secondary)",
                    fontSize:
                      "11px",
                  }}
                >
                  {formData.message.length}/2000
                </span>
              </div>
            </div>
          </div>

          {/* =================================================
              INFO BOX
          ================================================== */}
          <div
            className="d-flex align-items-start gap-3 mt-4"
            style={{
              padding:
                "16px 18px",
              borderRadius:
                "15px",
              background:
                "var(--muted-bg)",
              border:
                "1px solid var(--border)",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                flexShrink: 0,
                borderRadius:
                  "10px",
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                background:
                  "rgba(37,99,235,0.10)",
                color: "#2563eb",
                fontSize: "15px",
              }}
            >
              i
            </div>

            <div>
              <div
                className="fw-semibold mb-1"
                style={{
                  color:
                    "var(--text-primary)",
                  fontSize:
                    "13px",
                }}
              >
                What happens next?
              </div>

              <div
                style={{
                  color:
                    "var(--text-secondary)",
                  fontSize:
                    "12px",
                  lineHeight: 1.6,
                }}
              >
                Your request will be reviewed by our support
                team. Keep your ticket details available for
                future communication.
              </div>
            </div>
          </div>

          {/* =================================================
              ACTIONS
          ================================================== */}
          <div
            className="d-flex flex-column flex-sm-row justify-content-end gap-3 mt-4"
          >
            <button
              type="button"
              onClick={
                onCancel || handleReset
              }
              disabled={loading}
              className="btn fw-semibold"
              style={{
                minHeight:
                  "50px",
                padding:
                  "0 22px",
                borderRadius:
                  "12px",
                background:
                  "var(--muted-bg)",
                color:
                  "var(--text-primary)",
                border:
                  "1px solid var(--border)",
              }}
            >
              {onCancel
                ? "Cancel"
                : "Clear Form"}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn text-white fw-semibold"
              style={{
                minHeight:
                  "50px",
                minWidth:
                  "180px",
                padding:
                  "0 24px",
                borderRadius:
                  "12px",
                border: "none",
                background:
                  loading
                    ? "#64748b"
                    : "linear-gradient(135deg, #2563eb, #4f46e5)",
                boxShadow:
                  loading
                    ? "none"
                    : "0 12px 25px rgba(37,99,235,0.22)",
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {loading ? (
                <span className="d-flex align-items-center justify-content-center gap-2">
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Submitting...
                </span>
              ) : (
                <span>
                  Submit Ticket
                  <span className="ms-2">
                    →
                  </span>
                </span>
              )}
            </button>
          </div>

          {/* =================================================
              FOOTNOTE
          ================================================== */}
          <div
            className="text-center mt-4"
            style={{
              color:
                "var(--text-secondary)",
              fontSize: "11px",
              lineHeight: 1.6,
            }}
          >
            By submitting this ticket, you agree that our
            support team may contact you regarding your request.
          </div>
        </form>
      </div>

      {/* =====================================================
          BACK TO HELP
      ====================================================== */}
      {!embedded && (
        <div
          className="text-center mt-4"
        >
          <Link
            to="/help"
            className="text-decoration-none"
            style={{
              color: "#2563eb",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            ← Back to Help Centre
          </Link>
        </div>
      )}

      {/* =====================================================
          CUSTOM FOCUS STYLES
      ====================================================== */}
      <style>{`
        .form-control:focus,
        .form-select:focus {
          border-color: #2563eb !important;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.10) !important;
          outline: none !important;
        }

        .form-control::placeholder {
          color: var(--text-secondary);
          opacity: 0.65;
        }

        .form-select option {
          background: var(--card);
          color: var(--text-primary);
        }

        details summary::marker {
          color: #2563eb;
        }

        button {
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            opacity 0.2s ease;
        }

        button:not(:disabled):hover {
          transform: translateY(-1px);
        }

        button:not(:disabled):active {
          transform: translateY(0);
        }

        @media (max-width: 576px) {
          .support-form-card {
            border-radius: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default SupportTicketForm;