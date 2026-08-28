import React from "react";

const Sell = () => {
  return (
    <div className="sell-page">
      <section className="sell-hero">
        <div className="hero-badge">SELL WITH TECHSTORE</div>

        <h1>
          Turn your products into
          <span> opportunities.</span>
        </h1>

        <p>
          Reach more customers, grow your brand, and build your online
          business with TechStore.
        </p>

        <a href="/signup" className="hero-btn">
          Start Selling
          <span>→</span>
        </a>
      </section>

      <section className="sell-content">
        <div className="benefit">
          <div className="benefit-icon">👥</div>
          <h3>Reach More Customers</h3>
          <p>
            Put your products in front of customers actively looking for
            technology and electronics.
          </p>
        </div>

        <div className="benefit">
          <div className="benefit-icon">📈</div>
          <h3>Grow Your Business</h3>
          <p>
            Powerful tools and a professional marketplace designed to
            help your business scale.
          </p>
        </div>

        <div className="benefit">
          <div className="benefit-icon">🛡️</div>
          <h3>Build Your Brand</h3>
          <p>
            Create a trusted presence and build lasting relationships
            with your customers.
          </p>
        </div>
      </section>

      <style>{`
        .sell-page {
          min-height:100vh;
          background:var(--bg);
          color:var(--text-primary);
        }

        .sell-hero {
          padding:110px 20px 100px;
          text-align:center;
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(37,99,235,.18),
              transparent 45%
            ),
            var(--bg);
        }

        .hero-badge {
          color:#2563eb;
          font-size:12px;
          font-weight:800;
          letter-spacing:2px;
          margin-bottom:18px;
        }

        .sell-hero h1 {
          max-width:850px;
          margin:auto;
          font-size:clamp(3rem,7vw,6rem);
          line-height:1;
          letter-spacing:-5px;
          font-weight:900;
        }

        .sell-hero h1 span {
          background:linear-gradient(135deg,#2563eb,#7c3aed);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
        }

        .sell-hero p {
          max-width:620px;
          margin:30px auto;
          color:var(--text-secondary);
          font-size:18px;
          line-height:1.8;
        }

        .hero-btn {
          display:inline-flex;
          gap:12px;
          align-items:center;
          padding:15px 26px;
          border-radius:14px;
          background:linear-gradient(135deg,#2563eb,#4f46e5);
          color:#fff;
          text-decoration:none;
          font-weight:800;
          box-shadow:0 18px 35px rgba(37,99,235,.25);
          transition:.25s ease;
        }

        .hero-btn:hover {
          color:#fff;
          transform:translateY(-3px);
        }

        .sell-content {
          max-width:1100px;
          margin:auto;
          padding:30px 20px 100px;
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:22px;
        }

        .benefit {
          padding:32px;
          border:1px solid var(--border);
          border-radius:24px;
          background:var(--card);
          transition:.3s ease;
        }

        .benefit:hover {
          transform:translateY(-6px);
          box-shadow:0 20px 45px var(--shadow);
        }

        .benefit-icon {
          font-size:30px;
          margin-bottom:20px;
        }

        .benefit h3 {
          font-size:19px;
          margin-bottom:12px;
        }

        .benefit p {
          color:var(--text-secondary);
          line-height:1.7;
          margin:0;
        }

        @media(max-width:768px) {
          .sell-hero {
            padding:80px 20px;
          }

          .sell-hero h1 {
            letter-spacing:-3px;
          }

          .sell-content {
            grid-template-columns:1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Sell;