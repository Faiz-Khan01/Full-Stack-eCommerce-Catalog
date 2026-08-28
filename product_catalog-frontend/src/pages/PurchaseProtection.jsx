import { Link } from "react-router-dom";

const PurchaseProtection = () => {
  const protections = [
    {
      icon: "🔐",
      title: "Secure Shopping",
      text: "Your account and shopping experience are designed with security in mind.",
    },
    {
      icon: "✓",
      title: "Product Support",
      text: "Get assistance when something doesn't go as expected with an eligible purchase.",
    },
    {
      icon: "↩",
      title: "Returns Support",
      text: "Access available return and refund options through your order.",
    },
    {
      icon: "◉",
      title: "Transparent Information",
      text: "We aim to provide clear product, pricing and order information.",
    },
  ];

  return (
    <main className="protection-page">
      <div className="container">
        <section className="protection-hero">
          <div className="protection-hero-content">
            <span>PURCHASE PROTECTION</span>

            <h1>
              Shop with
              <strong> confidence.</strong>
            </h1>

            <p>
              Your shopping experience should feel secure,
              transparent and dependable from discovery to
              delivery.
            </p>

            <div className="protection-actions">
              <Link to="/" className="protection-primary">
                Start Shopping
              </Link>

              <Link
                to="/help"
                className="protection-secondary"
              >
                Get Help
              </Link>
            </div>
          </div>

          <div className="protection-visual">
            <div className="shield">
              ✓
            </div>

            <div className="protection-orbit orbit-one" />
            <div className="protection-orbit orbit-two" />
          </div>
        </section>

        <section className="protection-section">
          <div className="protection-heading">
            <span>WHAT WE FOCUS ON</span>
            <h2>Built around your confidence.</h2>
          </div>

          <div className="row g-4">
            {protections.map((item) => (
              <div
                className="col-12 col-md-6"
                key={item.title}
              >
                <div className="protection-card">
                  <div className="protection-card-icon">
                    {item.icon}
                  </div>

                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="protection-how">
          <div>
            <span>WHEN SOMETHING GOES WRONG</span>

            <h2>
              We're here to help you find a solution.
            </h2>

            <p>
              If you experience an issue with an eligible
              purchase, start by opening your order details.
              Available options can depend on the product,
              seller, order status and circumstances.
            </p>
          </div>

          <div className="protection-checklist">
            <div>
              <span>01</span>
              Check your order
            </div>

            <div>
              <span>02</span>
              Review available options
            </div>

            <div>
              <span>03</span>
              Contact support if needed
            </div>
          </div>
        </section>

        <section className="protection-note">
          <strong>Important information</strong>

          <p>
            Purchase protection does not replace the
            individual terms, return policies, warranties
            or conditions applicable to a particular
            product or seller. Always review your order
            information for the options available to you.
          </p>
        </section>

        <section className="protection-bottom">
          <h2>Have a question about your purchase?</h2>

          <p>
            Visit the Help Centre or review your orders to
            find the next step.
          </p>

          <div>
            <Link to="/orders">
              View Orders →
            </Link>

            <Link to="/help">
              Help Centre →
            </Link>
          </div>
        </section>
      </div>

      <style>{`
        .protection-page {
          min-height: 100vh;
          padding-bottom: 90px;
          background: var(--bg);
          color: var(--text-primary);
        }

        .protection-hero {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 50px;
          min-height: 580px;
          overflow: hidden;
        }

        .protection-hero-content {
          position: relative;
          z-index: 2;
          max-width: 700px;
        }

        .protection-hero-content > span,
        .protection-heading > span,
        .protection-how > div:first-child > span {
          color: #3b82f6;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.8px;
        }

        .protection-hero h1 {
          margin: 20px 0;
          font-size: clamp(3rem, 7vw, 5.5rem);
          line-height: .98;
          letter-spacing: -4px;
          font-weight: 850;
        }

        .protection-hero h1 strong {
          display: block;
          background: linear-gradient(135deg,#2563eb,#6366f1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .protection-hero p {
          max-width: 620px;
          margin: 0;
          color: var(--text-secondary);
          font-size: 16px;
          line-height: 1.8;
        }

        .protection-actions {
          display: flex;
          gap: 10px;
          margin-top: 30px;
        }

        .protection-primary,
        .protection-secondary {
          padding: 13px 19px;
          border-radius: 10px;
          text-decoration: none;
          font-size: 12px;
          font-weight: 750;
        }

        .protection-primary {
          color: white;
          background: linear-gradient(135deg,#2563eb,#4f46e5);
          box-shadow: 0 10px 25px rgba(37,99,235,.22);
        }

        .protection-secondary {
          color: var(--text-primary);
          border: 1px solid var(--border);
          background: var(--card);
        }

        .protection-visual {
          position: relative;
          width: 340px;
          height: 340px;
          flex-shrink: 0;
        }

        .shield {
          position: absolute;
          z-index: 2;
          inset: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: white;
          font-size: 55px;
          font-weight: 800;
          background: linear-gradient(135deg,#2563eb,#6366f1);
          box-shadow:
            0 30px 80px rgba(37,99,235,.3),
            0 0 0 15px rgba(37,99,235,.05);
        }

        .protection-orbit {
          position: absolute;
          border: 1px solid rgba(59,130,246,.16);
          border-radius: 50%;
        }

        .orbit-one {
          inset: 30px;
        }

        .orbit-two {
          inset: 0;
          opacity: .5;
        }

        .protection-section {
          padding-top: 40px;
        }

        .protection-heading {
          margin-bottom: 27px;
        }

        .protection-heading h2 {
          margin: 8px 0 0;
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -.8px;
        }

        .protection-card {
          display: flex;
          gap: 20px;
          height: 100%;
          padding: 28px;
          border: 1px solid var(--border);
          border-radius: 20px;
          background: var(--card);
          box-shadow: 0 12px 35px var(--shadow);
          transition: .25s ease;
        }

        .protection-card:hover {
          transform: translateY(-4px);
          border-color: rgba(59,130,246,.35);
        }

        .protection-card-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          border-radius: 14px;
          color: #3b82f6;
          background: var(--hover-bg);
          font-size: 21px;
        }

        .protection-card h3 {
          margin: 3px 0 8px;
          font-size: 16px;
          font-weight: 750;
        }

        .protection-card p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 13px;
          line-height: 1.75;
        }

        .protection-how {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
          margin-top: 70px;
          padding: 40px;
          border-radius: 24px;
          background: linear-gradient(135deg,#0f172a,#172554);
          color: white;
        }

        .protection-how h2 {
          max-width: 500px;
          margin: 10px 0 13px;
          font-size: 27px;
          line-height: 1.2;
          font-weight: 800;
        }

        .protection-how p {
          max-width: 550px;
          margin: 0;
          color: #94a3b8;
          font-size: 13px;
          line-height: 1.8;
        }

        .protection-checklist {
          display: flex;
          justify-content: center;
          flex-direction: column;
          gap: 13px;
        }

        .protection-checklist div {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 15px;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 11px;
          background: rgba(255,255,255,.035);
          color: #e2e8f0;
          font-size: 12px;
          font-weight: 650;
        }

        .protection-checklist span {
          color: #60a5fa;
          font-size: 10px;
          font-weight: 800;
        }

        .protection-note {
          margin-top: 25px;
          padding: 25px;
          border: 1px solid var(--border);
          border-radius: 18px;
          background: var(--card);
        }

        .protection-note strong {
          display: block;
          margin-bottom: 7px;
          font-size: 13px;
        }

        .protection-note p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 12px;
          line-height: 1.8;
        }

        .protection-bottom {
          margin-top: 70px;
          text-align: center;
        }

        .protection-bottom h2 {
          margin-bottom: 8px;
          font-size: 25px;
          font-weight: 800;
        }

        .protection-bottom p {
          margin-bottom: 22px;
          color: var(--text-secondary);
          font-size: 13px;
        }

        .protection-bottom a {
          margin: 0 10px;
          color: #3b82f6;
          text-decoration: none;
          font-size: 13px;
          font-weight: 750;
        }

        @media (max-width: 767px) {
          .protection-hero {
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            min-height: auto;
            padding: 65px 0;
          }

          .protection-hero h1 {
            letter-spacing: -2.5px;
          }

          .protection-visual {
            width: 260px;
            height: 260px;
            align-self: center;
          }

          .shield {
            inset: 70px;
            font-size: 42px;
          }

          .orbit-one {
            inset: 20px;
          }

          .protection-how {
            grid-template-columns: 1fr;
            padding: 30px;
          }

          .protection-bottom {
            margin-top: 50px;
          }
        }
      `}</style>
    </main>
  );
};

export default PurchaseProtection;