import React from "react";

const ProtectBrand = () => {
  return (
    <div className="brand-page">
      <div className="brand-card">
        <div className="brand-icon">✦</div>

        <span className="brand-badge">BRAND PROTECTION</span>

        <h1>Protect & Build Your Brand</h1>

        <p>
          Your brand deserves to be protected. TechStore provides sellers
          with tools and resources designed to help maintain brand
          identity, customer trust, and product authenticity.
        </p>

        <div className="brand-grid">
          <div>
            <strong>01</strong>
            <h3>Protect Your Identity</h3>
            <p>
              Help customers recognize authentic products and your
              official brand presence.
            </p>
          </div>

          <div>
            <strong>02</strong>
            <h3>Build Customer Trust</h3>
            <p>
              Create a consistent shopping experience that strengthens
              your relationship with customers.
            </p>
          </div>

          <div>
            <strong>03</strong>
            <h3>Grow With Confidence</h3>
            <p>
              Access marketplace tools that help your brand grow
              responsibly.
            </p>
          </div>
        </div>

        <a href="/sell" className="brand-btn">
          Start Selling
          <span>→</span>
        </a>
      </div>

      <style>{`
        .brand-page {
          min-height:100vh;
          padding:80px 20px;
          background:var(--bg);
          color:var(--text-primary);
          display:flex;
          justify-content:center;
        }

        .brand-card {
          width:100%;
          max-width:1050px;
          padding:70px 50px;
          text-align:center;
          background:var(--card);
          border:1px solid var(--border);
          border-radius:32px;
          box-shadow:0 30px 80px var(--shadow);
        }

        .brand-icon {
          width:76px;
          height:76px;
          margin:auto;
          display:flex;
          align-items:center;
          justify-content:center;
          border-radius:24px;
          background:linear-gradient(135deg,#2563eb,#7c3aed);
          color:#fff;
          font-size:32px;
          box-shadow:0 15px 35px rgba(37,99,235,.25);
        }

        .brand-badge {
          display:block;
          margin-top:25px;
          color:#2563eb;
          font-size:12px;
          font-weight:800;
          letter-spacing:2px;
        }

        .brand-card > h1 {
          font-size:clamp(2.5rem,6vw,4.5rem);
          font-weight:900;
          letter-spacing:-3px;
          margin:12px 0 20px;
        }

        .brand-card > p {
          max-width:700px;
          margin:auto;
          color:var(--text-secondary);
          font-size:17px;
          line-height:1.8;
        }

        .brand-grid {
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:20px;
          margin:55px 0 40px;
          text-align:left;
        }

        .brand-grid > div {
          padding:25px;
          border-radius:20px;
          border:1px solid var(--border);
          background:var(--muted-bg);
        }

        .brand-grid strong {
          color:#2563eb;
          font-size:13px;
        }

        .brand-grid h3 {
          font-size:18px;
          margin:12px 0;
        }

        .brand-grid p {
          color:var(--text-secondary);
          line-height:1.7;
          margin:0;
          font-size:14px;
        }

        .brand-btn {
          display:inline-flex;
          gap:12px;
          padding:14px 25px;
          border-radius:13px;
          background:linear-gradient(135deg,#2563eb,#4f46e5);
          color:#fff;
          text-decoration:none;
          font-weight:800;
          transition:.25s ease;
        }

        .brand-btn:hover {
          color:#fff;
          transform:translateY(-3px);
        }

        @media(max-width:768px) {
          .brand-card {
            padding:45px 22px;
          }

          .brand-grid {
            grid-template-columns:1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ProtectBrand;