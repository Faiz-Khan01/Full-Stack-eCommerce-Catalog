import { Link } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";

const Returns = () => {
  const [orderId, setOrderId] = useState("");

  const handleStartReturn = () => {
    if (!orderId.trim()) {
      Swal.fire({
        icon: "info",
        title: "Order ID required",
        text: "Please enter your order ID to continue.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Return request started",
      text: `We'll help you with order ${orderId}.`,
      confirmButtonColor: "#2563eb",
    });
  };

  const steps = [
    {
      number: "01",
      title: "Find your order",
      text: "Enter your order ID or open your Orders page.",
    },
    {
      number: "02",
      title: "Select the product",
      text: "Choose the item you'd like to return.",
    },
    {
      number: "03",
      title: "Choose a reason",
      text: "Tell us why you're returning the product.",
    },
    {
      number: "04",
      title: "Send it back",
      text: "Follow the return instructions provided.",
    },
  ];

  const reasons = [
    {
      icon: "📦",
      title: "Product arrived damaged",
      text: "The product was damaged when it arrived.",
    },
    {
      icon: "↔️",
      title: "Wrong product",
      text: "You received a different product than ordered.",
    },
    {
      icon: "📐",
      title: "Doesn't fit or suit",
      text: "The product isn't the right fit for you.",
    },
    {
      icon: "⚙️",
      title: "Product issue",
      text: "The product isn't working as expected.",
    },
  ];

  return (
    <main className="returns-page">
      <div className="container">

        {/* HERO */}
        <section className="returns-hero">
          <div className="hero-copy">
            <span className="eyebrow">
              RETURNS CENTRE
            </span>

            <h1>
              Easy returns.
              <br />
              <span>Simple solutions.</span>
            </h1>

            <p>
              Need to return something? We're here to
              make the process clear, quick and
              hassle-free.
            </p>

            <div className="hero-buttons">
              <a
                href="#start-return"
                className="primary-button"
              >
                Start a Return
                <span>→</span>
              </a>

              <Link
                to="/orders"
                className="secondary-button"
              >
                View Your Orders
              </Link>
            </div>
          </div>

          <div className="return-visual">
            <div className="visual-ring ring-one" />
            <div className="visual-ring ring-two" />

            <div className="return-box">
              <div className="box-top" />
              <div className="box-front">
                <span>TS</span>
              </div>
            </div>

            <div className="floating-card">
              <span>✓</span>
              Return
              <strong>Ready</strong>
            </div>
          </div>
        </section>

        {/* START RETURN */}
        <section
          className="start-return"
          id="start-return"
        >
          <div className="start-copy">
            <span className="eyebrow">
              START HERE
            </span>

            <h2>
              What would you like
              <br />
              to return?
            </h2>

            <p>
              Enter your order ID to find your purchase
              and begin the return process.
            </p>
          </div>

          <div className="return-form">
            <label>
              ORDER ID
            </label>

            <div className="order-input">
              <input
                type="text"
                placeholder="e.g. TS-2026-000123"
                value={orderId}
                onChange={(e) =>
                  setOrderId(e.target.value)
                }
              />

              <button
                type="button"
                onClick={handleStartReturn}
              >
                Find Order →
              </button>
            </div>

            <Link to="/orders">
              Don't know your order ID? View your orders
            </Link>
          </div>
        </section>

        {/* STEPS */}
        <section className="returns-section">
          <div className="section-title">
            <span className="eyebrow">
              HOW IT WORKS
            </span>

            <h2>
              Returning something takes four steps.
            </h2>
          </div>

          <div className="row g-3">
            {steps.map((step) => (
              <div
                className="col-12 col-md-6 col-lg-3"
                key={step.number}
              >
                <div className="step-card">
                  <span className="step-number">
                    {step.number}
                  </span>

                  <div className="step-line" />

                  <h3>{step.title}</h3>

                  <p>{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RETURN REASONS */}
        <section className="returns-section">
          <div className="section-title">
            <span className="eyebrow">
              COMMON REASONS
            </span>

            <h2>
              Whatever went wrong, we'll help.
            </h2>
          </div>

          <div className="row g-3">
            {reasons.map((reason) => (
              <div
                className="col-12 col-md-6"
                key={reason.title}
              >
                <div className="reason-card">
                  <div className="reason-icon">
                    {reason.icon}
                  </div>

                  <div>
                    <h3>{reason.title}</h3>

                    <p>{reason.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* IMPORTANT INFORMATION */}
        <section className="info-grid">

          <div className="info-card">
            <div className="info-icon blue">
              ⏱
            </div>

            <div>
              <span className="eyebrow">
                RETURN WINDOW
              </span>

              <h3>
                Check your order details
              </h3>

              <p>
                Return eligibility can vary by product
                and order. Check your order for the
                applicable return information.
              </p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon green">
              ₹
            </div>

            <div>
              <span className="eyebrow">
                REFUNDS
              </span>

              <h3>
                Refunds are processed securely
              </h3>

              <p>
                Once your return is approved and
                processed, your refund will be handled
                according to your payment method.
              </p>
            </div>
          </div>

        </section>

        {/* SUPPORT */}
        <section className="return-support">

          <div className="support-mark">
            ?
          </div>

          <div className="support-copy">
            <span className="eyebrow">
              NEED HELP?
            </span>

            <h2>
              Have a question about a return?
            </h2>

            <p>
              Visit our Help Centre for answers to
              common questions or contact support.
            </p>
          </div>

          <Link
            to="/help"
            className="support-button"
          >
            Visit Help Centre
            <span>→</span>
          </Link>

        </section>

      </div>

      <style>{`
        .returns-page {
          min-height: 100vh;
          padding-bottom: 90px;
          background: var(--bg);
          color: var(--text-primary);
        }

        .eyebrow {
          display: inline-block;
          color: #3b82f6;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.7px;
        }

        /* HERO */

        .returns-hero {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 540px;
          gap: 60px;
        }

        .hero-copy {
          max-width: 650px;
        }

        .hero-copy h1 {
          margin: 16px 0;
          font-size: clamp(3rem, 6vw, 5.2rem);
          line-height: .98;
          letter-spacing: -4px;
          font-weight: 850;
        }

        .hero-copy h1 span {
          background:
            linear-gradient(
              135deg,
              #2563eb,
              #6366f1
            );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-copy p {
          max-width: 560px;
          margin-bottom: 28px;
          color: var(--text-secondary);
          font-size: 15px;
          line-height: 1.8;
        }

        .hero-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .primary-button,
        .secondary-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 12px 17px;
          border-radius: 10px;
          text-decoration: none;
          font-size: 11px;
          font-weight: 800;
          transition: .2s ease;
        }

        .primary-button {
          color: white;
          background:
            linear-gradient(
              135deg,
              #2563eb,
              #4f46e5
            );
          box-shadow:
            0 10px 25px
            rgba(37,99,235,.2);
        }

        .secondary-button {
          border: 1px solid var(--border);
          color: var(--text-primary);
          background: var(--card);
        }

        .primary-button:hover,
        .secondary-button:hover {
          transform: translateY(-2px);
        }

        /* VISUAL */

        .return-visual {
          position: relative;
          width: 370px;
          height: 370px;
          flex-shrink: 0;
        }

        .visual-ring {
          position: absolute;
          border: 1px solid rgba(59,130,246,.14);
          border-radius: 50%;
        }

        .ring-one {
          inset: 20px;
        }

        .ring-two {
          inset: 65px;
        }

        .return-box {
          position: absolute;
          top: 105px;
          left: 105px;
          width: 160px;
          height: 140px;
          transform: rotate(-7deg);
          filter:
            drop-shadow(
              0 25px 25px
              rgba(15,23,42,.18)
            );
        }

        .box-top {
          position: absolute;
          top: 0;
          left: 0;
          width: 160px;
          height: 45px;
          clip-path: polygon(
            0 30%,
            50% 0,
            100% 30%,
            50% 100%
          );
          background: #bfdbfe;
        }

        .box-front {
          position: absolute;
          left: 25px;
          top: 32px;
          width: 110px;
          height: 108px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 3px;
          color: white;
          background:
            linear-gradient(
              135deg,
              #2563eb,
              #1d4ed8
            );
          font-size: 30px;
          font-weight: 900;
          letter-spacing: -2px;
        }

        .floating-card {
          position: absolute;
          right: 0;
          bottom: 45px;
          display: grid;
          grid-template-columns: 35px auto;
          align-items: center;
          column-gap: 8px;
          padding: 12px 15px;
          border: 1px solid var(--border);
          border-radius: 13px;
          color: var(--text-secondary);
          background: var(--card);
          box-shadow:
            0 15px 35px var(--shadow);
          font-size: 10px;
        }

        .floating-card span {
          grid-row: span 2;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 35px;
          height: 35px;
          border-radius: 10px;
          color: #16a34a;
          background: rgba(34,197,94,.1);
          font-size: 17px;
        }

        .floating-card strong {
          color: var(--text-primary);
          font-size: 12px;
        }

        /* START */

        .start-return {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 50px;
          padding: 35px;
          border: 1px solid var(--border);
          border-radius: 22px;
          background: var(--card);
          box-shadow: 0 15px 40px var(--shadow);
        }

        .start-copy {
          flex: 1;
        }

        .start-copy h2 {
          margin: 8px 0;
          font-size: 27px;
          line-height: 1.15;
          font-weight: 800;
          letter-spacing: -.9px;
        }

        .start-copy p {
          max-width: 500px;
          margin: 0;
          color: var(--text-secondary);
          font-size: 12px;
          line-height: 1.7;
        }

        .return-form {
          width: min(480px, 100%);
        }

        .return-form label {
          display: block;
          margin-bottom: 7px;
          color: var(--text-secondary);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.2px;
        }

        .order-input {
          display: flex;
          padding: 4px;
          border: 1px solid var(--border);
          border-radius: 11px;
          background: var(--hover-bg);
        }

        .order-input input {
          min-width: 0;
          flex: 1;
          padding: 9px 11px;
          border: 0;
          outline: 0;
          color: var(--text-primary);
          background: transparent;
          font-size: 11px;
        }

        .order-input input::placeholder {
          color: var(--text-secondary);
        }

        .order-input button {
          padding: 10px 14px;
          border: 0;
          border-radius: 8px;
          color: white;
          background: #2563eb;
          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
        }

        .return-form > a {
          display: inline-block;
          margin-top: 10px;
          color: #3b82f6;
          text-decoration: none;
          font-size: 10px;
          font-weight: 700;
        }

        /* SECTIONS */

        .returns-section {
          padding-top: 60px;
        }

        .section-title {
          margin-bottom: 23px;
        }

        .section-title h2 {
          margin: 7px 0 0;
          font-size: 25px;
          font-weight: 800;
          letter-spacing: -.8px;
        }

        /* STEPS */

        .step-card {
          position: relative;
          height: 100%;
          padding: 23px;
          border: 1px solid var(--border);
          border-radius: 18px;
          background: var(--card);
          box-shadow: 0 10px 30px var(--shadow);
        }

        .step-number {
          color: #3b82f6;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .step-line {
          width: 30px;
          height: 2px;
          margin: 18px 0;
          background: #3b82f6;
        }

        .step-card h3 {
          margin: 0 0 7px;
          font-size: 14px;
          font-weight: 800;
        }

        .step-card p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 11px;
          line-height: 1.7;
        }

        /* REASONS */

        .reason-card {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          height: 100%;
          padding: 22px;
          border: 1px solid var(--border);
          border-radius: 17px;
          background: var(--card);
          transition: .2s ease;
        }

        .reason-card:hover {
          transform: translateY(-3px);
          border-color: rgba(59,130,246,.3);
        }

        .reason-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 45px;
          height: 45px;
          flex-shrink: 0;
          border-radius: 13px;
          background: var(--hover-bg);
          font-size: 19px;
        }

        .reason-card h3 {
          margin: 2px 0 6px;
          font-size: 14px;
          font-weight: 800;
        }

        .reason-card p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 11px;
          line-height: 1.7;
        }

        /* INFO */

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-top: 60px;
        }

        .info-card {
          display: flex;
          align-items: flex-start;
          gap: 17px;
          padding: 24px;
          border: 1px solid var(--border);
          border-radius: 18px;
          background: var(--card);
        }

        .info-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 45px;
          height: 45px;
          flex-shrink: 0;
          border-radius: 13px;
          font-size: 18px;
          font-weight: 800;
        }

        .info-icon.blue {
          color: #2563eb;
          background: rgba(37,99,235,.1);
        }

        .info-icon.green {
          color: #16a34a;
          background: rgba(34,197,94,.1);
        }

        .info-card h3 {
          margin: 5px 0;
          font-size: 14px;
          font-weight: 800;
        }

        .info-card p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 11px;
          line-height: 1.7;
        }

        /* SUPPORT */

        .return-support {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-top: 25px;
          padding: 28px;
          border-radius: 20px;
          color: white;
          background:
            linear-gradient(
              135deg,
              #0f172a,
              #172554
            );
        }

        .support-mark {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          flex-shrink: 0;
          border-radius: 14px;
          color: #60a5fa;
          background: rgba(59,130,246,.12);
          font-size: 21px;
          font-weight: 800;
        }

        .support-copy {
          flex: 1;
        }

        .support-copy h2 {
          margin: 5px 0;
          font-size: 18px;
          font-weight: 800;
        }

        .support-copy p {
          margin: 0;
          color: #94a3b8;
          font-size: 11px;
        }

        .support-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 10px;
          color: #0f172a;
          background: white;
          text-decoration: none;
          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
        }

        @media (max-width: 767px) {
          .returns-hero {
            min-height: auto;
            padding: 60px 0;
            flex-direction: column;
            align-items: flex-start;
          }

          .return-visual {
            align-self: center;
            transform: scale(.8);
            margin-top: -20px;
          }

          .start-return {
            align-items: flex-start;
            flex-direction: column;
            padding: 25px;
          }

          .return-form {
            width: 100%;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .return-support {
            align-items: flex-start;
            flex-direction: column;
          }

          .support-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </main>
  );
};

export default Returns;