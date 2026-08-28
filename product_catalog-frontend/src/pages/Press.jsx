import { Link } from "react-router-dom";

const Press = () => {
  const releases = [
    {
      date: "AUG 2026",
      title: "TechStore introduces a new generation of shopping experiences",
      text: "A more streamlined platform designed around discovery, simplicity and customer confidence.",
    },
    {
      date: "JUN 2026",
      title: "TechStore expands its technology marketplace",
      text: "New product categories and improved tools make it easier to discover the latest technology.",
    },
    {
      date: "MAR 2026",
      title: "TechStore announces its next chapter",
      text: "The company shares its vision for building a modern technology shopping destination.",
    },
  ];

  return (
    <main className="press-page">
      <div className="container">

        {/* HERO */}
        <section className="press-hero">
          <div>
            <span className="eyebrow">
              TECHSTORE PRESS
            </span>

            <h1>
              The latest
              <br />
              <span>from TechStore.</span>
            </h1>

            <p>
              Company news, product announcements,
              stories and updates from the TechStore team.
            </p>

            <div className="press-links">
              <a
                href="#releases"
                className="press-primary"
              >
                Latest Releases
                <span>↓</span>
              </a>

              <a
                href="mailto:press@techstore.com"
                className="press-secondary"
              >
                Contact Press
              </a>
            </div>
          </div>

          <div className="press-art">
            <div className="press-paper">
              <div className="paper-top">
                <span>TECHSTORE</span>
                <small>PRESS</small>
              </div>

              <div className="paper-line large" />
              <div className="paper-line" />
              <div className="paper-line" />

              <div className="paper-highlight">
                NEWS
              </div>
            </div>

            <div className="press-badge">
              <span>✦</span>
              NEWSROOM
            </div>
          </div>
        </section>

        {/* FEATURED */}
        <section className="featured-release">
          <div className="featured-label">
            <span className="eyebrow">
              FEATURED
            </span>

            <span>
              AUG 2026
            </span>
          </div>

          <div className="featured-content">
            <h2>
              Building a better way to
              shop for technology.
            </h2>

            <p>
              TechStore is continuing to evolve its
              shopping platform with a focus on simplicity,
              discovery and a premium customer experience.
            </p>

            <button
              type="button"
              className="read-button"
            >
              Read Story
              <span>→</span>
            </button>
          </div>
        </section>

        {/* RELEASES */}
        <section
          className="releases-section"
          id="releases"
        >
          <div className="section-heading">
            <span className="eyebrow">
              NEWS & ANNOUNCEMENTS
            </span>

            <h2>
              Latest releases.
            </h2>
          </div>

          <div className="releases-list">
            {releases.map((release) => (
              <article
                className="release-row"
                key={release.title}
              >
                <div className="release-date">
                  {release.date}
                </div>

                <div className="release-content">
                  <h3>
                    {release.title}
                  </h3>

                  <p>
                    {release.text}
                  </p>

                  <button
                    type="button"
                    className="release-link"
                  >
                    Read more
                    <span>→</span>
                  </button>
                </div>

                <div className="release-arrow">
                  ↗
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* MEDIA CONTACT */}
        <section className="media-section">

          <div className="media-icon">
            ✉
          </div>

          <div className="media-copy">
            <span className="eyebrow">
              MEDIA INQUIRIES
            </span>

            <h2>
              Need something from our team?
            </h2>

            <p>
              Journalists and media professionals can
              contact our press team for company
              information, interviews and requests.
            </p>
          </div>

          <a
            href="mailto:press@techstore.com"
            className="media-button"
          >
            press@techstore.com
            <span>→</span>
          </a>

        </section>

        {/* FOOTER CTA */}
        <section className="press-bottom">
          <div>
            <span className="eyebrow">
              MORE ABOUT TECHSTORE
            </span>

            <h2>
              Want to know the story behind us?
            </h2>
          </div>

          <Link
            to="/about"
            className="about-button"
          >
            About TechStore
            <span>→</span>
          </Link>
        </section>

      </div>

      <style>{`
        .press-page {
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

        .press-hero {
          min-height: 550px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 70px;
        }

        .press-hero h1 {
          margin: 16px 0;
          font-size: clamp(3.3rem, 7vw, 6rem);
          line-height: .92;
          letter-spacing: -5px;
          font-weight: 900;
        }

        .press-hero h1 span {
          background: linear-gradient(
            135deg,
            #2563eb,
            #6366f1
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .press-hero p {
          max-width: 550px;
          margin-bottom: 27px;
          color: var(--text-secondary);
          font-size: 14px;
          line-height: 1.8;
        }

        .press-links {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .press-primary,
        .press-secondary,
        .about-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 12px 17px;
          border-radius: 10px;
          text-decoration: none;
          font-size: 10px;
          font-weight: 800;
        }

        .press-primary {
          color: white;
          background: linear-gradient(
            135deg,
            #2563eb,
            #4f46e5
          );
        }

        .press-secondary {
          color: var(--text-primary);
          border: 1px solid var(--border);
          background: var(--card);
        }

        .press-art {
          position: relative;
          width: 350px;
          height: 390px;
          flex-shrink: 0;
        }

        .press-paper {
          position: absolute;
          inset: 35px 45px;
          padding: 25px;
          border: 1px solid var(--border);
          border-radius: 4px;
          background: var(--card);
          box-shadow: 0 25px 60px var(--shadow);
          transform: rotate(5deg);
        }

        .paper-top {
          display: flex;
          justify-content: space-between;
          padding-bottom: 15px;
          border-bottom: 2px solid var(--text-primary);
        }

        .paper-top span {
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .paper-top small {
          color: #3b82f6;
          font-size: 8px;
          font-weight: 800;
        }

        .paper-line {
          width: 80%;
          height: 5px;
          margin-top: 16px;
          border-radius: 5px;
          background: var(--border);
        }

        .paper-line.large {
          width: 95%;
          height: 10px;
          margin-top: 25px;
          background: var(--text-primary);
        }

        .paper-highlight {
          display: inline-block;
          margin-top: 35px;
          padding: 7px 9px;
          color: #2563eb;
          background: rgba(37,99,235,.1);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .press-badge {
          position: absolute;
          right: 0;
          bottom: 55px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 11px 14px;
          border: 1px solid var(--border);
          border-radius: 11px;
          background: var(--card);
          box-shadow: 0 15px 35px var(--shadow);
          font-size: 9px;
          font-weight: 800;
        }

        .press-badge span {
          color: #3b82f6;
        }

        /* FEATURED */

        .featured-release {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 50px;
          padding: 35px;
          border-radius: 22px;
          color: white;
          background: linear-gradient(
            135deg,
            #0f172a,
            #172554
          );
        }

        .featured-label > span:last-child {
          display: block;
          margin-top: 10px;
          color: #64748b;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .featured-content h2 {
          max-width: 750px;
          margin: 0 0 15px;
          font-size: clamp(2rem, 4vw, 3.2rem);
          line-height: 1.05;
          letter-spacing: -1.8px;
          font-weight: 850;
        }

        .featured-content p {
          max-width: 700px;
          color: #94a3b8;
          font-size: 12px;
          line-height: 1.8;
        }

        .read-button {
          margin-top: 10px;
          padding: 11px 15px;
          border: 0;
          border-radius: 9px;
          color: #0f172a;
          background: white;
          font-size: 10px;
          font-weight: 800;
        }

        /* RELEASES */

        .releases-section {
          padding: 70px 0;
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

        .releases-list {
          border-top: 1px solid var(--border);
        }

        .release-row {
          display: grid;
          grid-template-columns: 120px 1fr 40px;
          gap: 30px;
          align-items: start;
          padding: 27px 5px;
          border-bottom: 1px solid var(--border);
          transition: .2s ease;
        }

        .release-row:hover {
          padding-left: 12px;
          padding-right: 12px;
          background: var(--hover-bg);
        }

        .release-date {
          color: #3b82f6;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .release-content h3 {
          max-width: 700px;
          margin: 0 0 8px;
          font-size: 16px;
          font-weight: 800;
        }

        .release-content p {
          max-width: 700px;
          margin: 0 0 12px;
          color: var(--text-secondary);
          font-size: 11px;
          line-height: 1.7;
        }

        .release-link {
          padding: 0;
          border: 0;
          color: #3b82f6;
          background: transparent;
          font-size: 10px;
          font-weight: 800;
        }

        .release-arrow {
          font-size: 18px;
          color: var(--text-secondary);
        }

        /* MEDIA */

        .media-section {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 28px;
          border: 1px solid var(--border);
          border-radius: 20px;
          background: var(--card);
        }

        .media-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          flex-shrink: 0;
          border-radius: 14px;
          color: #2563eb;
          background: rgba(37,99,235,.1);
          font-size: 19px;
        }

        .media-copy {
          flex: 1;
        }

        .media-copy h2 {
          margin: 5px 0;
          font-size: 17px;
          font-weight: 800;
        }

        .media-copy p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 11px;
        }

        .media-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #2563eb;
          text-decoration: none;
          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
        }

        .press-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          margin-top: 25px;
          padding: 30px;
          border-radius: 20px;
          background: var(--hover-bg);
        }

        .press-bottom h2 {
          margin: 5px 0 0;
          font-size: 19px;
          font-weight: 800;
        }

        .about-button {
          color: white;
          background: #2563eb;
          white-space: nowrap;
        }

        @media (max-width: 767px) {
          .press-hero {
            min-height: auto;
            padding: 60px 0;
            flex-direction: column;
            align-items: flex-start;
          }

          .press-art {
            align-self: center;
            transform: scale(.8);
            margin-top: -20px;
          }

          .featured-release {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .release-row {
            grid-template-columns: 1fr 30px;
            gap: 10px;
          }

          .release-date {
            grid-column: 1 / -1;
          }

          .media-section {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .media-copy {
            width: calc(100% - 70px);
          }

          .media-button {
            width: 100%;
            padding-top: 10px;
          }

          .press-bottom {
            align-items: flex-start;
            flex-direction: column;
          }

          .about-button {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
};

export default Press;