import { Link } from "react-router-dom";

const About = () => {
  const values = [
    {
      icon: "✦",
      title: "Customer First",
      text: "Every decision starts with creating a better shopping experience for our customers.",
    },
    {
      icon: "⚡",
      title: "Built for Speed",
      text: "From discovery to delivery, we focus on making every part of shopping feel effortless.",
    },
    {
      icon: "◇",
      title: "Quality Matters",
      text: "We believe great products, reliable service and attention to detail should go together.",
    },
    {
      icon: "∞",
      title: "Always Improving",
      text: "Technology keeps moving, and so do we. We continuously improve how TechStore works.",
    },
  ];

  const stats = [
    ["01", "Customer focused"],
    ["02", "Technology driven"],
    ["03", "Built to scale"],
    ["04", "Always evolving"],
  ];

  return (
    <main className="about-page">
      <div className="container">

        {/* HERO */}
        <section className="about-hero">
          <div className="hero-content">
            <span className="eyebrow">
              ABOUT TECHSTORE
            </span>

            <h1>
              Technology
              <br />
              <span>made simpler.</span>
            </h1>

            <p>
              TechStore is built around one simple idea:
              technology shopping should feel effortless,
              trustworthy and genuinely enjoyable.
            </p>

            <div className="hero-actions">
              <Link
                to="/"
                className="primary-button"
              >
                Explore TechStore
                <span>→</span>
              </Link>

              <Link
                to="/careers"
                className="secondary-button"
              >
                Join Our Team
              </Link>
            </div>
          </div>

          <div className="hero-art">
            <div className="orb orb-one" />
            <div className="orb orb-two" />

            <div className="brand-card">
              <div className="brand-mark">
                T
              </div>

              <div>
                <span>TECHSTORE</span>
                <strong>
                  Technology.
                  <br />
                  Simplified.
                </strong>
              </div>
            </div>

            <div className="floating-stat">
              <span>✦</span>
              <div>
                <small>OUR FOCUS</small>
                <strong>Better shopping</strong>
              </div>
            </div>
          </div>
        </section>

        {/* INTRO */}
        <section className="intro-section">
          <div className="intro-label">
            <span className="eyebrow">
              OUR STORY
            </span>
          </div>

          <div className="intro-content">
            <h2>
              We believe buying technology
              should be as exciting as using it.
            </h2>

            <p>
              TechStore brings products, people and
              technology together in one modern shopping
              experience. Our goal is to make it easier
              to discover products you love, understand
              what you're buying and shop with confidence.
            </p>

            <p>
              We're building TechStore with a long-term
              mindset: better products, better technology,
              better service and a better experience at
              every step.
            </p>
          </div>
        </section>

        {/* VALUES */}
        <section className="values-section">
          <div className="section-heading">
            <span className="eyebrow">
              WHAT DRIVES US
            </span>

            <h2>
              Built around better experiences.
            </h2>

            <p>
              The principles behind everything we build.
            </p>
          </div>

          <div className="row g-3">
            {values.map((value) => (
              <div
                className="col-12 col-md-6"
                key={value.title}
              >
                <div className="value-card">
                  <div className="value-icon">
                    {value.icon}
                  </div>

                  <div>
                    <h3>{value.title}</h3>
                    <p>{value.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* NUMBERS */}
        <section className="numbers-section">
          {stats.map(([number, label]) => (
            <div
              className="number-item"
              key={number}
            >
              <span>{number}</span>
              <strong>{label}</strong>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="about-cta">
          <div>
            <span className="eyebrow">
              BUILD THE FUTURE
            </span>

            <h2>
              There's more to come.
            </h2>

            <p>
              TechStore is just getting started. We're
              constantly working on new ways to make
              technology shopping better.
            </p>
          </div>

          <Link
            to="/"
            className="cta-button"
          >
            Start Exploring
            <span>→</span>
          </Link>
        </section>
      </div>

      <style>{`
        .about-page {
          min-height: 100vh;
          padding-bottom: 80px;
          background: var(--bg);
          color: var(--text-primary);
        }

        .eyebrow {
          color: #3b82f6;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.8px;
        }

        .about-hero {
          min-height: 590px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 60px;
        }

        .hero-content {
          max-width: 650px;
        }

        .hero-content h1 {
          margin: 16px 0;
          font-size: clamp(3.2rem, 7vw, 6rem);
          line-height: .92;
          letter-spacing: -5px;
          font-weight: 900;
        }

        .hero-content h1 span {
          background: linear-gradient(
            135deg,
            #2563eb,
            #6366f1
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-content p {
          max-width: 560px;
          margin: 0 0 28px;
          color: var(--text-secondary);
          font-size: 15px;
          line-height: 1.8;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .primary-button,
        .secondary-button,
        .cta-button {
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

        .primary-button,
        .cta-button {
          color: white;
          background: linear-gradient(
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
        .secondary-button:hover,
        .cta-button:hover {
          transform: translateY(-2px);
        }

        .hero-art {
          position: relative;
          width: 390px;
          height: 390px;
          flex-shrink: 0;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(59,130,246,.15);
        }

        .orb-one {
          inset: 20px;
        }

        .orb-two {
          inset: 70px;
        }

        .brand-card {
          position: absolute;
          inset: 105px 65px;
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 25px;
          border: 1px solid var(--border);
          border-radius: 22px;
          background: var(--card);
          box-shadow:
            0 25px 60px var(--shadow);
          transform: rotate(-4deg);
        }

        .brand-mark {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 62px;
          height: 62px;
          border-radius: 18px;
          color: white;
          background: linear-gradient(
            135deg,
            #2563eb,
            #6366f1
          );
          font-size: 28px;
          font-weight: 900;
        }

        .brand-card span,
        .floating-stat small {
          display: block;
          color: var(--text-secondary);
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 1.3px;
        }

        .brand-card strong {
          display: block;
          margin-top: 5px;
          font-size: 15px;
          line-height: 1.3;
        }

        .floating-stat {
          position: absolute;
          right: 0;
          bottom: 48px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 15px;
          border: 1px solid var(--border);
          border-radius: 13px;
          background: var(--card);
          box-shadow: 0 15px 35px var(--shadow);
        }

        .floating-stat > span {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 10px;
          color: #2563eb;
          background: rgba(37,99,235,.1);
        }

        .floating-stat strong {
          display: block;
          margin-top: 3px;
          font-size: 11px;
        }

        .intro-section {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 60px;
          padding: 75px 0;
          border-top: 1px solid var(--border);
        }

        .intro-content {
          max-width: 800px;
        }

        .intro-content h2 {
          margin: 0 0 22px;
          font-size: clamp(2rem, 4vw, 3.2rem);
          line-height: 1.08;
          letter-spacing: -2px;
          font-weight: 850;
        }

        .intro-content p {
          max-width: 750px;
          color: var(--text-secondary);
          font-size: 13px;
          line-height: 1.9;
        }

        .values-section {
          padding: 20px 0 70px;
        }

        .section-heading {
          margin-bottom: 25px;
        }

        .section-heading h2 {
          margin: 7px 0 5px;
          font-size: 27px;
          font-weight: 850;
          letter-spacing: -1px;
        }

        .section-heading p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 12px;
        }

        .value-card {
          display: flex;
          gap: 18px;
          height: 100%;
          padding: 25px;
          border: 1px solid var(--border);
          border-radius: 18px;
          background: var(--card);
          transition: .2s ease;
        }

        .value-card:hover {
          transform: translateY(-3px);
          border-color: rgba(59,130,246,.3);
        }

        .value-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          border-radius: 14px;
          color: #2563eb;
          background: rgba(37,99,235,.1);
          font-size: 20px;
          font-weight: 800;
        }

        .value-card h3 {
          margin: 3px 0 6px;
          font-size: 15px;
          font-weight: 800;
        }

        .value-card p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 11px;
          line-height: 1.7;
        }

        .numbers-section {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          margin: 10px 0 70px;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }

        .number-item {
          padding: 25px 15px;
          border-right: 1px solid var(--border);
        }

        .number-item:last-child {
          border-right: 0;
        }

        .number-item span {
          display: block;
          margin-bottom: 8px;
          color: #3b82f6;
          font-size: 10px;
          font-weight: 800;
        }

        .number-item strong {
          font-size: 13px;
        }

        .about-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          padding: 35px;
          border-radius: 22px;
          color: white;
          background:
            linear-gradient(
              135deg,
              #0f172a,
              #172554
            );
        }

        .about-cta h2 {
          margin: 6px 0;
          font-size: 24px;
          font-weight: 850;
        }

        .about-cta p {
          max-width: 600px;
          margin: 0;
          color: #94a3b8;
          font-size: 11px;
          line-height: 1.7;
        }

        .cta-button {
          background: white;
          color: #0f172a;
          white-space: nowrap;
          box-shadow: none;
        }

        @media (max-width: 767px) {
          .about-hero {
            min-height: auto;
            padding: 60px 0;
            flex-direction: column;
            align-items: flex-start;
          }

          .hero-art {
            align-self: center;
            transform: scale(.8);
            margin-top: -20px;
          }

          .intro-section {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .numbers-section {
            grid-template-columns: 1fr 1fr;
          }

          .number-item:nth-child(2) {
            border-right: 0;
          }

          .about-cta {
            align-items: flex-start;
            flex-direction: column;
          }

          .cta-button {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
};

export default About;