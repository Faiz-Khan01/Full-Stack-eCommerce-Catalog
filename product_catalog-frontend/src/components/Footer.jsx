    const Footer = () => {
  const footerSections = [
    {
      title: "Company",
      links: [
        ["About TechStore", "/about"],
        ["Careers", "/careers"],
        ["Press Releases", "/press"],
        ["TechStore Science", "/science"],
      ],
    },
    {
      title: "Connect",
      links: [
        ["Facebook", "https://facebook.com"],
        ["Twitter", "https://twitter.com"],
        ["Instagram", "https://instagram.com"],
      ],
    },
    {
      title: "Sell With Us",
      links: [
        ["Sell on TechStore", "/sell"],
        ["Protect & Build Your Brand", "/protect-brand"],
        ["Become an Affiliate", "/affiliate"],
        ["Advertise Your Products", "/advertise"],
      ],
    },
    {
      title: "Support",
      links: [
        ["Your Account", "/account"],
        ["Returns Centre", "/returns"],
        ["Purchase Protection", "/protection"],
        ["Help Centre", "/help"],
      ],
    },
  ];

  return (
    <footer className="premium-footer">
      {/* Back to Top */}
      <button
        className="back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <span>↑</span>
        Back to top
      </button>

      {/* Main Footer */}
      <div className="footer-main">
        <div className="container">
          {/* Newsletter / Brand Header */}
          <div className="footer-header">
            <div>
              <div className="footer-logo">
                Tech<span>Store</span>
              </div>

              <p className="footer-tagline">
                Premium technology. Exceptional experiences.
              </p>
            </div>

            <div className="footer-newsletter">
              <div>
                <strong>Stay in the loop</strong>
                <small>Get product updates and exclusive offers.</small>
              </div>

              <div className="newsletter-form">
                <input
                  type="email"
                  placeholder="Enter your email"
                  aria-label="Email address"
                />
                <button>Subscribe</button>
              </div>
            </div>
          </div>

          <div className="footer-divider" />

          {/* Link Columns */}
          <div className="row g-5 footer-links">
            {footerSections.map((section) => (
              <div className="col-6 col-md-3" key={section.title}>
                <h6>{section.title}</h6>

                <ul>
                  {section.links.map(([label, href]) => (
                    <li key={label}>
                      <a
                        href={href}
                        target={
                          href.startsWith("http") ? "_blank" : undefined
                        }
                        rel={
                          href.startsWith("http") ? "noreferrer" : undefined
                        }
                      >
                        {label}
                        <span className="link-arrow">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="footer-divider" />

          {/* Bottom Brand / Preferences */}
          <div className="footer-bottom">
            <div className="footer-mini-brand">
              <div className="mini-logo">
                T<span>S</span>
              </div>

              <div>
                <strong>TechStore</strong>
                <small>Technology, elevated.</small>
              </div>
            </div>

            <div className="footer-preferences">
              <button>
                <span>◎</span>
                English
              </button>

              <button>
                <span>🇮🇳</span>
                India
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Bar */}
      <div className="footer-legal">
        <div className="container">
          <div className="legal-links">
            <a href="/conditions">Conditions of Use & Sale</a>
            <a href="/privacy">Privacy Notice</a>
            <a href="/ads">Interest-Based Ads</a>
          </div>

          <div className="copyright">
            © 1996–2026 TechStore.com, Inc. or its affiliates
          </div>
        </div>
      </div>

      <style>{`
        .premium-footer {
          color: #f8fafc;
          background: #080b12;
          font-family: inherit;
        }

        /* Back to top */
        .back-to-top {
          width: 100%;
          border: 0;
          color: #cbd5e1;
          background: #101722;
          padding: 13px 20px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: .2px;
          transition: all .25s ease;
        }

        .back-to-top:hover {
          color: #fff;
          background: #151e2c;
        }

        .back-to-top span {
          margin-right: 8px;
          font-size: 16px;
          transition: transform .25s ease;
        }

        .back-to-top:hover span {
          display: inline-block;
          transform: translateY(-3px);
        }

        /* Main */
        .footer-main {
          position: relative;
          overflow: hidden;
          padding: 70px 0 42px;
          background:
            radial-gradient(
              circle at 85% 10%,
              rgba(59, 130, 246, .13),
              transparent 30%
            ),
            radial-gradient(
              circle at 10% 90%,
              rgba(124, 58, 237, .08),
              transparent 30%
            ),
            #080b12;
        }

        .footer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
        }

        .footer-logo {
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -1.5px;
          color: #fff;
        }

        .footer-logo span {
          background: linear-gradient(135deg, #60a5fa, #818cf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .footer-tagline {
          margin: 8px 0 0;
          color: #64748b;
          font-size: 14px;
        }

        /* Newsletter */
        .footer-newsletter {
          display: flex;
          align-items: center;
          gap: 25px;
        }

        .footer-newsletter strong {
          display: block;
          color: #e2e8f0;
          font-size: 14px;
          margin-bottom: 4px;
        }

        .footer-newsletter small {
          color: #64748b;
          font-size: 12px;
        }

        .newsletter-form {
          display: flex;
          padding: 4px;
          border: 1px solid #273244;
          border-radius: 12px;
          background: rgba(15, 23, 42, .8);
          box-shadow: 0 10px 35px rgba(0,0,0,.15);
        }

        .newsletter-form input {
          width: 190px;
          border: 0;
          outline: 0;
          color: #fff;
          background: transparent;
          padding: 10px 12px;
          font-size: 13px;
        }

        .newsletter-form input::placeholder {
          color: #64748b;
        }

        .newsletter-form button {
          border: 0;
          border-radius: 8px;
          padding: 9px 16px;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          box-shadow: 0 4px 14px rgba(37, 99, 235, .25);
          transition: all .25s ease;
        }

        .newsletter-form button:hover {
          transform: translateY(-1px);
          box-shadow: 0 7px 20px rgba(37, 99, 235, .35);
        }

        /* Divider */
        .footer-divider {
          height: 1px;
          margin: 50px 0;
          background: linear-gradient(
            90deg,
            transparent,
            #1e293b,
            transparent
          );
        }

        /* Links */
        .footer-links h6 {
          margin-bottom: 20px;
          color: #f8fafc;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: .5px;
          text-transform: uppercase;
        }

        .footer-links ul {
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .footer-links li {
          margin-bottom: 13px;
        }

        .footer-links a {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
          text-decoration: none;
          font-size: 13px;
          transition: all .25s ease;
        }

        .footer-links a:hover {
          color: #e2e8f0;
          transform: translateX(3px);
        }

        .link-arrow {
          opacity: 0;
          color: #60a5fa;
          font-size: 11px;
          transition: opacity .2s ease;
        }

        .footer-links a:hover .link-arrow {
          opacity: 1;
        }

        /* Bottom */
        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .footer-mini-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mini-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          color: #fff;
          font-size: 13px;
          font-weight: 800;
          background: linear-gradient(135deg, #2563eb, #6366f1);
          box-shadow: 0 8px 25px rgba(37, 99, 235, .2);
        }

        .mini-logo span {
          opacity: .7;
        }

        .footer-mini-brand strong {
          display: block;
          color: #e2e8f0;
          font-size: 13px;
        }

        .footer-mini-brand small {
          display: block;
          margin-top: 2px;
          color: #475569;
          font-size: 11px;
        }

        .footer-preferences {
          display: flex;
          gap: 8px;
        }

        .footer-preferences button {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 13px;
          border: 1px solid #263244;
          border-radius: 9px;
          color: #94a3b8;
          background: rgba(15, 23, 42, .65);
          font-size: 12px;
          transition: all .2s ease;
        }

        .footer-preferences button:hover {
          color: #fff;
          border-color: #3b4b63;
          background: #111827;
        }

        /* Legal */
        .footer-legal {
          padding: 25px 0;
          border-top: 1px solid #111827;
          background: #05070b;
        }

        .legal-links {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 25px;
          margin-bottom: 10px;
        }

        .legal-links a {
          color: #475569;
          text-decoration: none;
          font-size: 11px;
          transition: color .2s ease;
        }

        .legal-links a:hover {
          color: #94a3b8;
        }

        .copyright {
          color: #334155;
          text-align: center;
          font-size: 11px;
        }

        /* Responsive */
        @media (max-width: 767px) {
          .footer-main {
            padding: 50px 0 30px;
          }

          .footer-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .footer-newsletter {
            width: 100%;
            align-items: flex-start;
            flex-direction: column;
            gap: 12px;
          }

          .newsletter-form {
            width: 100%;
          }

          .newsletter-form input {
            width: 100%;
          }

          .footer-divider {
            margin: 38px 0;
          }

          .footer-bottom {
            align-items: flex-start;
            flex-direction: column;
          }

          .footer-preferences {
            width: 100%;
          }

          .footer-preferences button {
            flex: 1;
            justify-content: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;