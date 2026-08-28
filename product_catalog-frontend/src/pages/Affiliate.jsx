import React from "react";

const Affiliate = () => {
  return (
    <div className="affiliate-page">
      <section className="affiliate-hero">
        <span>TECHSTORE PARTNERS</span>

        <h1>
          Share great tech.
          <br />
          <strong>Earn rewards.</strong>
        </h1>

        <p>
          Join the TechStore Affiliate Program and earn by recommending
          products you love to your audience.
        </p>

        <a href="/signup" className="affiliate-btn">
          Become an Affiliate →
        </a>
      </section>

      <section className="affiliate-steps">
        <div>
          <div className="number">01</div>
          <h3>Join</h3>
          <p>
            Create your TechStore account and become part of our growing
            partner community.
          </p>
        </div>

        <div>
          <div className="number">02</div>
          <h3>Share</h3>
          <p>
            Recommend products through your website, social channels, or
            content.
          </p>
        </div>

        <div>
          <div className="number">03</div>
          <h3>Earn</h3>
          <p>
            Earn rewards when customers discover and purchase products
            through your referrals.
          </p>
        </div>
      </section>

      <style>{`
        .affiliate-page {
          min-height:100vh;
          background:var(--bg);
          color:var(--text-primary);
        }

        .affiliate-hero {
          text-align:center;
          padding:120px 20px 100px;
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(124,58,237,.18),
              transparent 45%
            );
        }

        .affiliate-hero > span {
          color:#7c3aed;
          font-size:12px;
          font-weight:800;
          letter-spacing:2px;
        }

        .affiliate-hero h1 {
          margin:20px auto;
          max-width:900px;
          font-size:clamp(3rem,7vw,6rem);
          line-height:.98;
          letter-spacing:-5px;
          font-weight:900;
        }

        .affiliate-hero h1 strong {
          background:linear-gradient(135deg,#2563eb,#7c3aed);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
        }

        .affiliate-hero p {
          max-width:650px;
          margin:30px auto;
          color:var(--text-secondary);
          font-size:18px;
          line-height:1.8;
        }

        .affiliate-btn {
          display:inline-block;
          padding:15px 26px;
          border-radius:14px;
          color:white;
          text-decoration:none;
          font-weight:800;
          background:linear-gradient(135deg,#2563eb,#7c3aed);
          box-shadow:0 18px 40px rgba(99,102,241,.25);
          transition:.25s;
        }

        .affiliate-btn:hover {
          color:#fff;
          transform:translateY(-3px);
        }

        .affiliate-steps {
          max-width:1050px;
          margin:auto;
          padding:20px 20px 100px;
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:22px;
        }

        .affiliate-steps > div {
          padding:32px;
          border:1px solid var(--border);
          border-radius:24px;
          background:var(--card);
        }

        .number {
          color:#2563eb;
          font-size:13px;
          font-weight:900;
          margin-bottom:20px;
        }

        .affiliate-steps h3 {
          font-size:24px;
          margin-bottom:12px;
        }

        .affiliate-steps p {
          color:var(--text-secondary);
          line-height:1.7;
          margin:0;
        }

        @media(max-width:768px) {
          .affiliate-steps {
            grid-template-columns:1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Affiliate;