import React from "react";

const Advertise = () => {
  return (
    <div className="advertise-page">
      <div className="advertise-hero">
        <div className="ad-badge">TECHSTORE ADVERTISING</div>

        <h1>
          Put your products
          <span> in the spotlight.</span>
        </h1>

        <p>
          Reach shoppers when they're discovering, comparing, and
          purchasing technology products on TechStore.
        </p>

        <a href="/sell" className="ad-btn">
          Advertise With Us →
        </a>
      </div>

      <div className="ad-features">
        <div className="ad-feature">
          <div className="ad-icon">🎯</div>
          <h3>Reach the Right Audience</h3>
          <p>
            Connect your products with customers actively interested in
            technology and electronics.
          </p>
        </div>

        <div className="ad-feature">
          <div className="ad-icon">⚡</div>
          <h3>Increase Visibility</h3>
          <p>
            Give your products greater visibility throughout the shopping
            journey.
          </p>
        </div>

        <div className="ad-feature">
          <div className="ad-icon">📊</div>
          <h3>Grow Your Business</h3>
          <p>
            Build awareness and drive more attention toward your
            products.
          </p>
        </div>
      </div>

      <style>{`
        .advertise-page {
          min-height:100vh;
          background:var(--bg);
          color:var(--text-primary);
        }

        .advertise-hero {
          text-align:center;
          padding:120px 20px 100px;
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(37,99,235,.16),
              transparent 45%
            );
        }

        .ad-badge {
          color:#2563eb;
          font-size:12px;
          font-weight:900;
          letter-spacing:2px;
        }

        .advertise-hero h1 {
          max-width:900px;
          margin:18px auto 25px;
          font-size:clamp(3rem,7vw,6rem);
          line-height:1;
          letter-spacing:-5px;
          font-weight:900;
        }

        .advertise-hero h1 span {
          display:block;
          background:linear-gradient(135deg,#2563eb,#4f46e5);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
        }

        .advertise-hero p {
          max-width:650px;
          margin:0 auto 35px;
          color:var(--text-secondary);
          font-size:18px;
          line-height:1.8;
        }

        .ad-btn {
          display:inline-block;
          padding:15px 26px;
          border-radius:14px;
          background:linear-gradient(135deg,#2563eb,#4f46e5);
          color:#fff;
          text-decoration:none;
          font-weight:800;
          box-shadow:0 18px 40px rgba(37,99,235,.25);
          transition:.25s;
        }

        .ad-btn:hover {
          color:#fff;
          transform:translateY(-3px);
        }

        .ad-features {
          max-width:1050px;
          margin:auto;
          padding:20px 20px 100px;
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:22px;
        }

        .ad-feature {
          padding:34px;
          background:var(--card);
          border:1px solid var(--border);
          border-radius:24px;
          transition:.3s;
        }

        .ad-feature:hover {
          transform:translateY(-6px);
          box-shadow:0 20px 45px var(--shadow);
        }

        .ad-icon {
          font-size:30px;
          margin-bottom:20px;
        }

        .ad-feature h3 {
          font-size:20px;
          margin-bottom:12px;
        }

        .ad-feature p {
          color:var(--text-secondary);
          line-height:1.7;
          margin:0;
        }

        @media(max-width:768px) {
          .ad-features {
            grid-template-columns:1fr;
          }

          .advertise-hero h1 {
            letter-spacing:-3px;
          }
        }
      `}</style>
    </div>
  );
};

export default Advertise;