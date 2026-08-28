import { Link } from "react-router-dom";

const Science = () => {
  const areas = [
    {
      number: "01",
      title: "Personalized Discovery",
      text: "We explore smarter ways to help customers find products that match what they actually need.",
    },
    {
      number: "02",
      title: "Search & Intelligence",
      text: "Better search should understand intent, not just keywords. We're constantly improving product discovery.",
    },
    {
      number: "03",
      title: "Customer Experience",
      text: "Every interaction gives us an opportunity to make shopping faster, clearer and more useful.",
    },
    {
      number: "04",
      title: "Responsible Technology",
      text: "We think carefully about how technology is designed, deployed and used throughout the platform.",
    },
  ];

  return (
    <main className="science-page">
      <div className="container">

        {/* HERO */}
        <section className="science-hero">

          <div className="science-copy">
            <span className="eyebrow">
              TECHSTORE SCIENCE
            </span>

            <h1>
              Technology
              <br />
              <span>behind the experience.</span>
            </h1>

            <p>
              We use technology, data and thoughtful
              experimentation to build a shopping
              experience that gets better over time.
            </p>

            <Link
              to="/"
              className="science-button"
            >
              Explore TechStore
              <span>→</span>
            </Link>
          </div>

          <div className="science-visual">

            <div className="grid-lines" />

            <div className="science-core">
              <div className="core-dot" />
              <span>TS</span>
            </div>

            <div className="science-node node-one">
              DATA
            </div>

            <div className="science-node node-two">
              SEARCH
            </div>

            <div className="science-node node-three">
              AI
            </div>

            <div className="science-node node-four">
              UX
            </div>

          </div>

        </section>

        {/* INTRO */}
        <section className="science-intro">

          <span className="eyebrow">
            OUR APPROACH
          </span>

          <div>
            <h2>
              Great technology should disappear
              into a great experience.
            </h2>

            <p>
              The best technology isn't always the most
              visible. It works quietly in the background
              to help customers discover products, make
              decisions and complete purchases with less
              friction.
            </p>

            <p>
              That's what we're building at TechStore:
              technology that makes the experience feel
              simple.
            </p>
          </div>

        </section>

        {/* AREAS */}
        <section className="science-areas">

          <div className="section-heading">
            <span className="eyebrow">
              AREAS OF EXPLORATION
            </span>

            <h2>
              Where we're experimenting.
            </h2>
          </div>

          <div className="areas-list">

            {areas.map((area) => (
              <article
                className="area-row"
                key={area.number}
              >
                <span className="area-number">
                  {area.number}
                </span>

                <div className="area-content">
                  <h3>
                    {area.title}
                  </h3>

                  <p>
                    {area.text}
                  </p>
                </div>

                <span className="area-arrow">
                  ↗
                </span>
              </article>
            ))}

          </div>

        </section>

        {/* TECHNOLOGY STACK */}
        <section className="technology-section">

          <div className="technology-copy">
            <span className="eyebrow">
              THE TECH MINDSET
            </span>

            <h2>
              Curious by default.
            </h2>

            <p>
              We believe meaningful innovation comes from
              asking better questions, testing ideas and
              learning quickly.
            </p>
          </div>

          <div className="tech-grid">

            <div className="tech-box">
              <span>01</span>
              <strong>Explore</strong>
              <p>
                Understand the problem before solving it.
              </p>
            </div>

            <div className="tech-box">
              <span>02</span>
              <strong>Experiment</strong>
              <p>
                Turn ideas into measurable experiments.
              </p>
            </div>

            <div className="tech-box">
              <span>03</span>
              <strong>Learn</strong>
              <p>
                Use evidence to improve the next version.
              </p>
            </div>

            <div className="tech-box">
              <span>04</span>
              <strong>Build</strong>
              <p>
                Ship technology that creates real value.
              </p>
            </div>

          </div>

        </section>

        {/* CTA */}
        <section className="science-cta">

          <div>
            <span className="eyebrow">
              KEEP EXPLORING
            </span>

            <h2>
              Interested in building with us?
            </h2>

            <p>
              Meet the people behind TechStore and see
              where your ideas could take you.
            </p>
          </div>

          <Link
            to="/careers"
            className="science-cta-button"
          >
            Explore Careers
            <span>→</span>
          </Link>

        </section>

      </div>

      <style>{`
        .science-page {
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

        /* HERO */

        .science-hero {
          min-height: 590px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 70px;
        }

        .science-copy {
          max-width: 650px;
        }

        .science-copy h1 {
          margin: 16px 0;
          font-size: clamp(3.2rem, 7vw, 5.8rem);
          line-height: .92;
          letter-spacing: -5px;
          font-weight: 900;
        }

        .science-copy h1 span {
          background: linear-gradient(
            135deg,
            #2563eb,
            #6366f1
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .science-copy p {
          max-width: 570px;
          margin-bottom: 28px;
          color: var(--text-secondary);
          font-size: 14px;
          line-height: 1.8;
        }

        .science-button {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 12px 17px;
          border-radius: 10px;
          color: white;
          background: linear-gradient(
            135deg,
            #2563eb,
            #4f46e5
          );
          text-decoration: none;
          font-size: 10px;
          font-weight: 800;
          box-shadow:
            0 10px 25px
            rgba(37,99,235,.2);
        }

        /* VISUAL */

        .science-visual {
          position: relative;
          width: 390px;
          height: 390px;
          flex-shrink: 0;
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: 30px;
          background:
            radial-gradient(
              circle at center,
              rgba(59,130,246,.09),
              transparent 55%
            );
        }

        .grid-lines {
          position: absolute;
          inset: 0;
          opacity: .5;
          background-image:
            linear-gradient(
              rgba(59,130,246,.08) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(59,130,246,.08) 1px,
              transparent 1px
            );
          background-size: 35px 35px;
        }

        .science-core {
          position: absolute;
          top: 145px;
          left: 145px;
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(59,130,246,.3);
          border-radius: 50%;
          color: white;
          background: linear-gradient(
            135deg,
            #2563eb,
            #4f46e5
          );
          box-shadow:
            0 0 60px
            rgba(37,99,235,.3);
          font-size: 20px;
          font-weight: 900;
        }

        .core-dot {
          position: absolute;
          top: 14px;
          right: 18px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #60a5fa;
          box-shadow:
            0 0 15px #60a5fa;
        }

        .science-node {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 62px;
          height: 62px;
          border: 1px solid var(--border);
          border-radius: 17px;
          color: #3b82f6;
          background: var(--card);
          box-shadow: 0 10px 25px var(--shadow);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .node-one {
          top: 45px;
          left: 45px;
        }

        .node-two {
          top: 55px;
          right: 40px;
        }

        .node-three {
          bottom: 45px;
          left: 50px;
        }

        .node-four {
          right: 45px;
          bottom: 50px;
        }

        /* INTRO */

        .science-intro {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 60px;
          padding: 75px 0;
          border-top: 1px solid var(--border);
        }

        .science-intro h2 {
          max-width: 850px;
          margin: 0 0 22px;
          font-size: clamp(2rem, 4vw, 3.2rem);
          line-height: 1.08;
          letter-spacing: -2px;
          font-weight: 850;
        }

        .science-intro p {
          max-width: 750px;
          color: var(--text-secondary);
          font-size: 13px;
          line-height: 1.9;
        }

        /* AREAS */

        .science-areas {
          padding: 10px 0 70px;
        }

        .section-heading {
          margin-bottom: 25px;
        }

        .section-heading h2 {
          margin: 7px 0 0;
          font-size: 28px;
          font-weight: 850;
          letter-spacing: -1px;
        }

        .areas-list {
          border-top: 1px solid var(--border);
        }

        .area-row {
          display: grid;
          grid-template-columns: 100px 1fr 40px;
          gap: 25px;
          align-items: start;
          padding: 28px 5px;
          border-bottom: 1px solid var(--border);
          transition: .2s ease;
        }

        .area-row:hover {
          padding-left: 12px;
          padding-right: 12px;
          background: var(--hover-bg);
        }

        .area-number {
          color: #3b82f6;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .area-content h3 {
          margin: 0 0 8px;
          font-size: 16px;
          font-weight: 800;
        }

        .area-content p {
          max-width: 700px;
          margin: 0;
          color: var(--text-secondary);
          font-size: 11px;
          line-height: 1.8;
        }

        .area-arrow {
          color: var(--text-secondary);
          font-size: 17px;
        }

        /* TECHNOLOGY */

        .technology-section {
          display: grid;
          grid-template-columns: .8fr 1.2fr;
          gap: 60px;
          padding: 70px 0;
          border-top: 1px solid var(--border);
        }

        .technology-copy h2 {
          margin: 8px 0;
          font-size: 32px;
          font-weight: 850;
          letter-spacing: -1.5px;
        }

        .technology-copy p {
          max-width: 430px;
          color: var(--text-secondary);
          font-size: 12px;
          line-height: 1.8;
        }

        .tech-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .tech-box {
          padding: 22px;
          border: 1px solid var(--border);
          border-radius: 15px;
          background: var(--card);
        }

        .tech-box > span {
          display: block;
          margin-bottom: 18px;
          color: #3b82f6;
          font-size: 9px;
          font-weight: 900;
        }

        .tech-box strong {
          font-size: 13px;
        }

        .tech-box p {
          margin: 7px 0 0;
          color: var(--text-secondary);
          font-size: 10px;
          line-height: 1.6;
        }

        /* CTA */

        .science-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          padding: 35px;
          border-radius: 22px;
          color: white;
          background: linear-gradient(
            135deg,
            #0f172a,
            #172554
          );
        }

        .science-cta h2 {
          margin: 6px 0;
          font-size: 23px;
          font-weight: 850;
        }

        .science-cta p {
          margin: 0;
          color: #94a3b8;
          font-size: 11px;
        }

        .science-cta-button {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 12px 17px;
          border-radius: 10px;
          color: #0f172a;
          background: white;
          text-decoration: none;
          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
        }

        @media (max-width: 767px) {
          .science-hero {
            min-height: auto;
            padding: 60px 0;
            flex-direction: column;
            align-items: flex-start;
          }

          .science-visual {
            align-self: center;
            transform: scale(.8);
            margin-top: -20px;
          }

          .science-intro {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .area-row {
            grid-template-columns: 45px 1fr 25px;
            gap: 10px;
          }

          .technology-section {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .science-cta {
            align-items: flex-start;
            flex-direction: column;
          }

          .science-cta-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </main>
  );
};

export default Science;