// src/pages/ContactSupport.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";

const ContactSupport = () => {
  const [formData, setFormData] = useState({
    category: "",
    priority: "Normal",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.category ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      alert("Please complete all required fields.");
      return;
    }

    // You can connect your support-ticket API here.
    console.log("Support Ticket:", formData);

    setSubmitted(true);
  };

  const handleCreateAnother = () => {
    setFormData({
      category: "",
      priority: "Normal",
      subject: "",
      message: "",
    });

    setSubmitted(false);
  };

  return (
    <div className="support-page">
      <div className="support-background">
        <div className="support-glow glow-one"></div>
        <div className="support-glow glow-two"></div>
      </div>

      <main className="support-container">

        {/* =========================
            HERO
        ========================== */}
        <section className="support-hero">
          <div className="support-hero-icon">
            🎧
          </div>

          <div>
            <div className="support-eyebrow">
              TECHSTORE SUPPORT
            </div>

            <h1>
              Customer <span>Support</span>
            </h1>

            <p>
              Need personal assistance? Tell us what happened and
              our support team will help you get it sorted.
            </p>
          </div>
        </section>

        {submitted ? (
          /* =========================
             SUCCESS STATE
          ========================== */
          <section className="success-card">

            <div className="success-icon">
              ✓
            </div>

            <div className="success-badge">
              TICKET CREATED
            </div>

            <h2>
              We've got your request.
            </h2>

            <p>
              Your support request has been submitted successfully.
              Our team will review it and get back to you as soon
              as possible.
            </p>

            <div className="ticket-preview">
              <div>
                <span>Category</span>
                <strong>{formData.category}</strong>
              </div>

              <div>
                <span>Priority</span>
                <strong>{formData.priority}</strong>
              </div>

              <div>
                <span>Subject</span>
                <strong>{formData.subject}</strong>
              </div>
            </div>

            <div className="success-actions">
              <button
                type="button"
                className="primary-btn"
                onClick={handleCreateAnother}
              >
                Create Another Ticket
              </button>

              <Link
                to="/orders"
                className="secondary-btn"
              >
                View My Orders
              </Link>
            </div>
          </section>
        ) : (
          <div className="support-layout">

            {/* =========================
                SUPPORT FORM
            ========================== */}
            <section className="support-card">

              <div className="card-heading">
                <div className="heading-icon">
                  💬
                </div>

                <div>
                  <span className="section-label">
                    CUSTOMER SUPPORT
                  </span>

                  <h2>
                    Tell us how we can help
                  </h2>

                  <p>
                    Describe your issue and our support team
                    will review your request.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>

                {/* CATEGORY */}
                <div className="form-group">
                  <label>
                    <span>🎧</span>
                    Support Category
                    <b>*</b>
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select a category
                    </option>
                    <option value="Order Issue">
                      Order Issue
                    </option>
                    <option value="Delivery & Tracking">
                      Delivery & Tracking
                    </option>
                    <option value="Product Issue">
                      Product Issue
                    </option>
                    <option value="Payment Issue">
                      Payment Issue
                    </option>
                    <option value="Return & Refund">
                      Return & Refund
                    </option>
                    <option value="Account">
                      Account
                    </option>
                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                {/* PRIORITY */}
                <div className="form-group">
                  <label>
                    <span>⚡</span>
                    Priority
                  </label>

                  <div className="priority-grid">

                    <label
                      className={`priority-option ${
                        formData.priority === "Normal"
                          ? "active"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="priority"
                        value="Normal"
                        checked={
                          formData.priority === "Normal"
                        }
                        onChange={handleChange}
                      />

                      <div>
                        <strong>Normal</strong>
                        <small>
                          Need assistance
                        </small>
                      </div>
                    </label>

                    <label
                      className={`priority-option ${
                        formData.priority === "High"
                          ? "active high"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="priority"
                        value="High"
                        checked={
                          formData.priority === "High"
                        }
                        onChange={handleChange}
                      />

                      <div>
                        <strong>High</strong>
                        <small>
                          Requires attention
                        </small>
                      </div>
                    </label>

                    <label
                      className={`priority-option ${
                        formData.priority === "Urgent"
                          ? "active urgent"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="priority"
                        value="Urgent"
                        checked={
                          formData.priority === "Urgent"
                        }
                        onChange={handleChange}
                      />

                      <div>
                        <strong>Urgent</strong>
                        <small>
                          Critical issue
                        </small>
                      </div>
                    </label>

                  </div>
                </div>

                {/* SUBJECT */}
                <div className="form-group">
                  <div className="label-row">
                    <label>
                      <span>✦</span>
                      Subject
                      <b>*</b>
                    </label>

                    <span className="counter">
                      {formData.subject.length}/120
                    </span>
                  </div>

                  <input
                    type="text"
                    name="subject"
                    maxLength={120}
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Briefly describe your issue"
                  />

                  <small className="helper-text">
                    Keep it short and specific.
                  </small>
                </div>

                {/* MESSAGE */}
                <div className="form-group">
                  <div className="label-row">
                    <label>
                      <span>✎</span>
                      Describe your issue
                      <b>*</b>
                    </label>

                    <span className="counter">
                      {formData.message.length}/2000
                    </span>
                  </div>

                  <textarea
                    name="message"
                    maxLength={2000}
                    rows={7}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us what happened, what you expected, and any relevant order or product details..."
                  />

                  <div className="security-note">
                    <span>🔒</span>

                    <span>
                      Please don't share passwords or sensitive
                      payment information.
                    </span>
                  </div>
                </div>

                {/* WHAT HAPPENS NEXT */}
                <div className="next-info">
                  <div className="next-info-icon">
                    i
                  </div>

                  <div>
                    <strong>
                      What happens next?
                    </strong>

                    <p>
                      Your request will be reviewed by our support
                      team. Keep your ticket details available for
                      future communication.
                    </p>
                  </div>
                </div>

                <p className="agreement">
                  By submitting this ticket, you agree that our
                  support team may contact you regarding your request.
                </p>

                <button
                  type="submit"
                  className="submit-btn"
                >
                  <span>Send Support Request</span>
                  <span className="submit-arrow">→</span>
                </button>

              </form>
            </section>

            {/* =========================
                SIDE PANEL
            ========================== */}
            <aside className="support-side">

              <div className="side-card premium-card">

                <div className="side-icon">
                  💙
                </div>

                <span className="side-label">
                  WE'RE HERE FOR YOU
                </span>

                <h3>
                  Need help with something else?
                </h3>

                <p>
                  Explore your orders, track a shipment, or
                  continue shopping with TechStore.
                </p>

                <div className="side-links">

                  <Link to="/orders">
                    <span>📦</span>
                    <div>
                      <strong>My Orders</strong>
                      <small>
                        View your purchases
                      </small>
                    </div>
                    <span>→</span>
                  </Link>

                  <Link to="/track-order">
                    <span>🚚</span>
                    <div>
                      <strong>Track Order</strong>
                      <small>
                        Check delivery status
                      </small>
                    </div>
                    <span>→</span>
                  </Link>

                  <Link to="/">
                    <span>🛍️</span>
                    <div>
                      <strong>Continue Shopping</strong>
                      <small>
                        Explore latest products
                      </small>
                    </div>
                    <span>→</span>
                  </Link>

                </div>
              </div>

              {/* RESPONSE CARD */}
              <div className="response-card">

                <div className="response-status">
                  <span></span>
                  SUPPORT TEAM ONLINE
                </div>

                <h4>
                  Fast. Helpful. Human.
                </h4>

                <p>
                  We aim to respond to support requests as
                  quickly as possible.
                </p>

                <div className="response-line">
                  <span>Average response</span>
                  <strong>Within 24 hours</strong>
                </div>

              </div>

            </aside>

          </div>
        )}

      </main>

      <style>{`

        /* ==============================================
           PAGE
        ============================================== */

        .support-page {
          min-height: calc(100vh - 70px);
          background:
            radial-gradient(
              circle at 15% 10%,
              rgba(16,185,129,.08),
              transparent 30%
            ),
            radial-gradient(
              circle at 85% 70%,
              rgba(6,182,212,.06),
              transparent 30%
            ),
            var(--bg, #090d16);
          color: var(--text-primary, #f8fafc);
          position: relative;
          overflow: hidden;
        }

        .support-background {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .support-glow {
          position: absolute;
          width: 380px;
          height: 380px;
          border-radius: 50%;
          filter: blur(100px);
          opacity: .12;
        }

        .glow-one {
          background: #10b981;
          top: -180px;
          left: -100px;
        }

        .glow-two {
          background: #06b6d4;
          bottom: -180px;
          right: -100px;
        }

        .support-container {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
          padding: 55px 0 80px;
          position: relative;
          z-index: 1;
        }

        /* ==============================================
           HERO
        ============================================== */

        .support-hero {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 34px;
        }

        .support-hero-icon {
          width: 64px;
          height: 64px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
          background:
            linear-gradient(
              135deg,
              rgba(16,185,129,.18),
              rgba(6,182,212,.12)
            );
          border: 1px solid rgba(16,185,129,.25);
          font-size: 29px;
          box-shadow:
            0 15px 40px rgba(16,185,129,.12);
        }

        .support-eyebrow {
          color: #34d399;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
          margin-bottom: 7px;
        }

        .support-hero h1 {
          margin: 0;
          font-size: clamp(2rem, 5vw, 3rem);
          line-height: 1.05;
          letter-spacing: -1.5px;
          font-weight: 850;
        }

        .support-hero h1 span {
          background:
            linear-gradient(
              90deg,
              #10b981,
              #06b6d4
            );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .support-hero p {
          margin: 10px 0 0;
          max-width: 650px;
          color: var(--text-secondary, #94a3b8);
          font-size: 14px;
          line-height: 1.7;
        }

        /* ==============================================
           LAYOUT
        ============================================== */

        .support-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 340px;
          gap: 22px;
          align-items: start;
        }

        /* ==============================================
           MAIN CARD
        ============================================== */

        .support-card,
        .success-card {
          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.065),
              rgba(255,255,255,.025)
            );
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 24px;
          box-shadow:
            0 25px 70px rgba(0,0,0,.28);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        .support-card {
          padding: 30px;
        }

        .card-heading {
          display: flex;
          gap: 15px;
          padding-bottom: 24px;
          margin-bottom: 26px;
          border-bottom: 1px solid rgba(255,255,255,.07);
        }

        .heading-icon {
          width: 45px;
          height: 45px;
          flex-shrink: 0;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(16,185,129,.1);
          border: 1px solid rgba(16,185,129,.18);
          font-size: 20px;
        }

        .section-label {
          display: block;
          color: #64748b;
          font-size: 10px;
          letter-spacing: 1.5px;
          font-weight: 800;
          margin-bottom: 4px;
        }

        .card-heading h2 {
          margin: 0;
          font-size: 21px;
          font-weight: 800;
        }

        .card-heading p {
          margin: 6px 0 0;
          color: var(--text-secondary, #94a3b8);
          font-size: 13px;
        }

        /* ==============================================
           FORM
        ============================================== */

        .form-group {
          margin-bottom: 23px;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 9px;
          color: #e2e8f0;
          font-size: 12px;
          font-weight: 700;
        }

        .form-group label span {
          color: #34d399;
        }

        .form-group label b {
          color: #fb7185;
        }

        .label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .label-row label {
          margin-bottom: 9px;
        }

        .counter {
          color: #64748b;
          font-size: 10px;
          margin-bottom: 8px;
        }

        .form-group input[type="text"],
        .form-group select,
        .form-group textarea {
          width: 100%;
          border: 1px solid rgba(255,255,255,.1);
          background: rgba(255,255,255,.045);
          color: #f8fafc;
          border-radius: 13px;
          outline: none;
          transition: .2s ease;
          font-size: 13px;
        }

        .form-group input[type="text"],
        .form-group select {
          height: 46px;
          padding: 0 14px;
        }

        .form-group textarea {
          padding: 14px;
          resize: vertical;
          min-height: 145px;
          line-height: 1.6;
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: #526174;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: rgba(16,185,129,.65);
          background: rgba(16,185,129,.035);
          box-shadow:
            0 0 0 3px rgba(16,185,129,.08);
        }

        .form-group select option {
          background: #0f172a;
          color: #fff;
        }

        .helper-text {
          display: block;
          margin-top: 7px;
          color: #64748b;
          font-size: 10px;
        }

        /* ==============================================
           PRIORITY
        ============================================== */

        .priority-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 9px;
        }

        .priority-option {
          margin: 0 !important;
          min-height: 62px;
          padding: 11px 12px;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 13px;
          background: rgba(255,255,255,.025);
          cursor: pointer;
          transition: .2s ease;
          display: flex !important;
          align-items: center;
          gap: 10px !important;
        }

        .priority-option:hover {
          background: rgba(255,255,255,.05);
          border-color: rgba(255,255,255,.16);
        }

        .priority-option.active {
          border-color: rgba(16,185,129,.55);
          background: rgba(16,185,129,.08);
        }

        .priority-option.active.high {
          border-color: rgba(245,158,11,.55);
          background: rgba(245,158,11,.07);
        }

        .priority-option.active.urgent {
          border-color: rgba(244,63,94,.55);
          background: rgba(244,63,94,.07);
        }

        .priority-option input {
          accent-color: #10b981;
        }

        .priority-option div {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .priority-option strong {
          color: #f8fafc;
          font-size: 12px;
        }

        .priority-option small {
          color: #64748b;
          font-size: 9px;
          font-weight: 500;
        }

        /* ==============================================
           SECURITY
        ============================================== */

        .security-note {
          display: flex;
          gap: 8px;
          align-items: center;
          margin-top: 9px;
          color: #64748b;
          font-size: 10px;
        }

        .security-note span:first-child {
          color: #34d399;
        }

        /* ==============================================
           NEXT INFO
        ============================================== */

        .next-info {
          display: flex;
          gap: 12px;
          padding: 15px;
          border-radius: 14px;
          background: rgba(6,182,212,.045);
          border: 1px solid rgba(6,182,212,.12);
          margin-top: 6px;
        }

        .next-info-icon {
          width: 22px;
          height: 22px;
          flex-shrink: 0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(6,182,212,.4);
          color: #67e8f9;
          font-size: 11px;
          font-weight: 800;
        }

        .next-info strong {
          display: block;
          color: #e2e8f0;
          font-size: 12px;
          margin-bottom: 4px;
        }

        .next-info p {
          margin: 0;
          color: #64748b;
          font-size: 10px;
          line-height: 1.6;
        }

        .agreement {
          margin: 14px 0 18px;
          color: #526174;
          font-size: 9px;
          line-height: 1.5;
        }

        /* ==============================================
           SUBMIT
        ============================================== */

        .submit-btn {
          width: 100%;
          height: 49px;
          border: none;
          border-radius: 13px;
          background:
            linear-gradient(
              135deg,
              #10b981,
              #06b6d4
            );
          color: white;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          box-shadow:
            0 12px 30px rgba(16,185,129,.18);
          transition: .2s ease;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow:
            0 17px 38px rgba(16,185,129,.27);
        }

        .submit-arrow {
          font-size: 18px;
          transition: .2s ease;
        }

        .submit-btn:hover .submit-arrow {
          transform: translateX(4px);
        }

        /* ==============================================
           SIDE
        ============================================== */

        .support-side {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .side-card,
        .response-card {
          border-radius: 21px;
          border: 1px solid rgba(255,255,255,.09);
          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.055),
              rgba(255,255,255,.018)
            );
          backdrop-filter: blur(15px);
          box-shadow:
            0 20px 50px rgba(0,0,0,.2);
        }

        .premium-card {
          padding: 23px;
        }

        .side-icon {
          width: 48px;
          height: 48px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(59,130,246,.1);
          border: 1px solid rgba(59,130,246,.16);
          font-size: 21px;
          margin-bottom: 17px;
        }

        .side-label {
          color: #64748b;
          font-size: 9px;
          letter-spacing: 1.5px;
          font-weight: 800;
        }

        .premium-card h3 {
          font-size: 18px;
          margin: 7px 0;
          font-weight: 800;
        }

        .premium-card > p {
          color: #64748b;
          font-size: 11px;
          line-height: 1.6;
          margin-bottom: 18px;
        }

        .side-links {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .side-links a {
          display: grid;
          grid-template-columns: 30px 1fr auto;
          align-items: center;
          gap: 9px;
          padding: 10px;
          border-radius: 12px;
          text-decoration: none;
          color: #e2e8f0;
          background: rgba(255,255,255,.025);
          border: 1px solid transparent;
          transition: .2s ease;
        }

        .side-links a:hover {
          background: rgba(255,255,255,.055);
          border-color: rgba(16,185,129,.18);
          transform: translateX(2px);
        }

        .side-links a > span:first-child {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          background: rgba(255,255,255,.045);
        }

        .side-links strong {
          display: block;
          font-size: 11px;
        }

        .side-links small {
          display: block;
          margin-top: 2px;
          color: #64748b;
          font-size: 9px;
        }

        .side-links a > span:last-child {
          color: #64748b;
        }

        /* ==============================================
           RESPONSE CARD
        ============================================== */

        .response-card {
          padding: 19px;
        }

        .response-status {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #34d399;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .response-status span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
          box-shadow:
            0 0 10px #10b981;
        }

        .response-card h4 {
          margin: 12px 0 5px;
          font-size: 15px;
        }

        .response-card p {
          color: #64748b;
          font-size: 10px;
          line-height: 1.6;
          margin: 0 0 13px;
        }

        .response-line {
          padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,.07);
          display: flex;
          justify-content: space-between;
          gap: 10px;
          color: #64748b;
          font-size: 9px;
        }

        .response-line strong {
          color: #cbd5e1;
        }

        /* ==============================================
           SUCCESS
        ============================================== */

        .success-card {
          max-width: 760px;
          margin: 20px auto;
          padding: 50px 40px;
          text-align: center;
        }

        .success-icon {
          width: 75px;
          height: 75px;
          margin: 0 auto 18px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            linear-gradient(
              135deg,
              #10b981,
              #06b6d4
            );
          color: white;
          font-size: 35px;
          font-weight: 900;
          box-shadow:
            0 15px 40px rgba(16,185,129,.22);
        }

        .success-badge {
          color: #34d399;
          font-size: 10px;
          letter-spacing: 2px;
          font-weight: 800;
        }

        .success-card h2 {
          font-size: 28px;
          margin: 9px 0;
        }

        .success-card > p {
          color: #64748b;
          max-width: 550px;
          margin: 0 auto 25px;
          font-size: 13px;
          line-height: 1.7;
        }

        .ticket-preview {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 9px;
          text-align: left;
          margin-bottom: 25px;
        }

        .ticket-preview div {
          padding: 13px;
          border-radius: 12px;
          background: rgba(255,255,255,.035);
          border: 1px solid rgba(255,255,255,.07);
          min-width: 0;
        }

        .ticket-preview span {
          display: block;
          color: #64748b;
          font-size: 9px;
          margin-bottom: 5px;
        }

        .ticket-preview strong {
          display: block;
          color: #e2e8f0;
          font-size: 11px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .success-actions {
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        .primary-btn,
        .secondary-btn {
          min-height: 44px;
          padding: 0 18px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
        }

        .primary-btn {
          border: none;
          color: white;
          background:
            linear-gradient(
              135deg,
              #10b981,
              #06b6d4
            );
        }

        .secondary-btn {
          color: #cbd5e1;
          border: 1px solid rgba(255,255,255,.1);
          background: rgba(255,255,255,.04);
        }

        /* ==============================================
           RESPONSIVE
        ============================================== */

        @media (max-width: 991px) {
          .support-layout {
            grid-template-columns: 1fr;
          }

          .support-side {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 767px) {
          .support-container {
            width: min(100% - 20px, 700px);
            padding: 30px 0 55px;
          }

          .support-hero {
            align-items: flex-start;
            gap: 13px;
          }

          .support-hero-icon {
            width: 50px;
            height: 50px;
            border-radius: 15px;
            font-size: 22px;
          }

          .support-hero h1 {
            font-size: 2rem;
          }

          .support-card {
            padding: 20px;
            border-radius: 19px;
          }

          .priority-grid {
            grid-template-columns: 1fr;
          }

          .support-side {
            display: flex;
          }

          .ticket-preview {
            grid-template-columns: 1fr;
          }

          .success-card {
            padding: 35px 20px;
          }

          .success-actions {
            flex-direction: column;
          }

          .primary-btn,
          .secondary-btn {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .support-hero p {
            font-size: 12px;
          }

          .card-heading {
            gap: 10px;
          }

          .heading-icon {
            width: 39px;
            height: 39px;
          }

          .card-heading h2 {
            font-size: 17px;
          }

          .card-heading p {
            font-size: 11px;
          }
        }

      `}</style>
    </div>
  );
};

export default ContactSupport;
