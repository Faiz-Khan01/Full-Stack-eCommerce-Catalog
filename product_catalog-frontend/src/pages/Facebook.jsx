import React from "react";

const Facebook = () => {
  return (
    <div className="premium-page">
      <div className="premium-container">
        <div className="premium-icon">f</div>

        <span className="premium-badge">CONNECT WITH US</span>

        <h1>TechStore on Facebook</h1>

        <p>
          Follow TechStore on Facebook for product launches, exclusive
          offers, technology updates, tips, and the latest news from our
          community.
        </p>

        <div className="premium-actions">
          <a
            href="https://facebook.com/"
            target="_blank"
            rel="noreferrer"
            className="premium-btn"
          >
            Visit Facebook
            <span>↗</span>
          </a>

          <a href="/" className="premium-btn secondary">
            Back to Home
          </a>
        </div>
      </div>

      <style>{`
        .premium-page {
          min-height: calc(100vh - 80px);
          padding: 80px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg);
          color: var(--text-primary);
        }

        .premium-container {
          width: 100%;
          max-width: 720px;
          padding: 60px 45px;
          text-align: center;
          border: 1px solid var(--border);
          border-radius: 30px;
          background: var(--card);
          box-shadow: 0 30px 80px var(--shadow);
        }

        .premium-icon {
          width: 76px;
          height: 76px;
          margin: 0 auto 25px;
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1877f2, #0d5dcc);
          color: white;
          font-size: 42px;
          font-weight: 800;
          box-shadow: 0 15px 35px rgba(24,119,242,.25);
        }

        .premium-badge {
          display: inline-block;
          margin-bottom: 15px;
          color: #2563eb;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        h1 {
          font-size: clamp(2.2rem, 5vw, 3.5rem);
          font-weight: 800;
          letter-spacing: -2px;
          margin-bottom: 20px;
        }

        p {
          max-width: 580px;
          margin: auto;
          color: var(--text-secondary);
          font-size: 16px;
          line-height: 1.8;
        }

        .premium-actions {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 35px;
        }

        .premium-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 13px 22px;
          border-radius: 12px;
          background: linear-gradient(135deg,#2563eb,#4f46e5);
          color: white;
          text-decoration: none;
          font-weight: 700;
          box-shadow: 0 12px 25px rgba(37,99,235,.22);
          transition: .25s ease;
        }

        .premium-btn:hover {
          color: white;
          transform: translateY(-3px);
        }

        .premium-btn.secondary {
          background: var(--hover-bg);
          color: var(--text-primary);
          box-shadow: none;
          border: 1px solid var(--border);
        }

        .premium-btn.secondary:hover {
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
};

export default Facebook;