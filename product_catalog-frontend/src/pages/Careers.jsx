import { Link } from "react-router-dom";

const Careers = () => {
  const jobs = [
    {
      team: "Engineering",
      role: "Frontend Developer",
      type: "Full-time",
      location: "Remote",
    },
    {
      team: "Engineering",
      role: "Backend Developer",
      type: "Full-time",
      location: "Remote",
    },
    {
      team: "Product",
      role: "Product Designer",
      type: "Full-time",
      location: "Hybrid",
    },
    {
      team: "Marketing",
      role: "Growth Marketing Manager",
      type: "Full-time",
      location: "Hybrid",
    },
  ];

  const perks = [
    ["⚡", "Work with modern technology"],
    ["🌎", "Flexible working environment"],
    ["📚", "Learning & development"],
    ["✦", "Build products people love"],
  ];

  return (
    <main className="careers-page">
      <div className="container">

        {/* HERO */}
        <section className="careers-hero">
          <div>
            <span className="eyebrow">
              CAREERS AT TECHSTORE
            </span>

            <h1>
              Build what's
              <br />
              <span>next.</span>
            </h1>

            <p>
              We're looking for curious, ambitious people
              who want to build the future of technology
              shopping.
            </p>

            <a
              href="#openings"
              className="career-button"
            >
              View Open Positions
              <span>↓</span>
            </a>
          </div>

          <div className="career-art">
            <div className="career-card main-card">
              <span className="card-label">
                TECHSTORE
              </span>

              <strong>
                Ideas
                <br />
                become
                <br />
                products.
              </strong>

              <div className="card-line" />
            </div>

            <div className="career-card small-card">
              <span>●</span>
              <div>
                <small>TEAM STATUS</small>
                <strong>Growing</strong>
              </div>
            </div>
          </div>
        </section>

        {/* CULTURE */}
        <section className="culture-section">
          <div className="culture-copy">
            <span className="eyebrow">
              OUR CULTURE
            </span>

            <h2>
              Smart people.
              <br />
              Big ideas.
              <br />
              No unnecessary drama.
            </h2>
          </div>

          <div className="culture-text">
            <p>
              We believe great products come from teams
              that trust each other, move quickly and care
              deeply about the details.
            </p>

            <p>
              At TechStore, you'll have room to experiment,
              solve meaningful problems and make an impact
              from day one.
            </p>
          </div>
        </section>

        {/* PERKS */}
        <section className="perks-section">
          <div className="section-heading">
            <span className="eyebrow">
              WHY TECHSTORE
            </span>

            <h2>
              Work that feels meaningful.
            </h2>
          </div>

          <div className="row g-3">
            {perks.map(([icon, title]) => (
              <div
                className="col-12 col-md-6 col-lg-3"
                key={title}
              >
                <div className="perk-card">
                  <span>{icon}</span>
                  <strong>{title}</strong>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* JOBS */}
        <section
          className="jobs-section"
          id="openings"
        >
          <div className="section-heading jobs-heading">
            <div>
              <span className="eyebrow">
                OPEN POSITIONS
              </span>

              <h2>
                Find your next role.
              </h2>
            </div>

            <span className="job-count">
              {jobs.length} positions
            </span>
          </div>

          <div className="jobs-list">
            {jobs.map((job) => (
              <div
                className="job-row"
                key={job.role}
              >
                <div className="job-main">
                  <span>{job.team}</span>
                  <h3>{job.role}</h3>
                </div>

                <div className="job-meta">
                  <span>{job.type}</span>
                  <span>{job.location}</span>
                </div>

                <button
                  type="button"
                  className="job-arrow"
                >
                  →
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="careers-cta">
          <div>
            <span className="eyebrow">
              DON'T SEE YOUR ROLE?
            </span>

            <h2>
              We still want to hear from you.
            </h2>

            <p>
              Great people don't always fit neatly into
              job descriptions. Tell us what you could
              bring to TechStore.
            </p>
          </div>

          <a
            href="mailto:careers@techstore.com"
            className="cta-link"
          >
            Send Your Resume
            <span>→</span>
          </a>
        </section>

      </div>

      <style>{`
        .careers-page {
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

        .careers-hero {
          min-height: 580px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 70px;
        }

        .careers-hero > div:first-child {
          max-width: 650px;
        }

        .careers-hero h1 {
          margin: 16px 0;
          font-size: clamp(3.5rem, 7vw, 6rem);
          line-height: .9;
          letter-spacing: -5px;
          font-weight: 900;
        }

        .careers-hero h1 span {
          color: #3b82f6;
        }

        .careers-hero p {
          max-width: 550px;
          margin: 0 0 28px;
          color: var(--text-secondary);
          font-size: 15px;
          line-height: 1.8;
        }

        .career-button,
        .cta-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 13px 18px;
          border-radius: 10px;
          color: white;
          background: linear-gradient(
            135deg,
            #2563eb,
            #4f46e5
          );
          text-decoration: none;
          font-size: 11px;
          font-weight: 800;
          box-shadow:
            0 10px 25px
            rgba(37,99,235,.2);
        }

        .career-art {
          position: relative;
          width: 370px;
          height: 400px;
          flex-shrink: 0;
        }

        .career-card {
          border: 1px solid var(--border);
          border-radius: 22px;
          background: var(--card);
          box-shadow: 0 25px 60px var(--shadow);
        }

        .main-card {
          position: absolute;
          inset: 35px 30px 80px;
          padding: 35px;
          transform: rotate(4deg);
        }

        .card-label {
          color: #3b82f6;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .main-card strong {
          display: block;
          margin-top: 45px;
          font-size: 35px;
          line-height: .98;
          letter-spacing: -2px;
        }

        .card-line {
          width: 55px;
          height: 3px;
          margin-top: 35px;
          background: #3b82f6;
        }

        .small-card {
          position: absolute;
          right: 0;
          bottom: 35px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px 16px;
        }

        .small-card > span {
          color: #22c55e;
          font-size: 16px;
        }

        .small-card small {
          display: block;
          color: var(--text-secondary);
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .small-card strong {
          font-size: 11px;
        }

        .culture-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 70px;
          padding: 75px 0;
          border-top: 1px solid var(--border);
        }

        .culture-copy h2 {
          margin: 10px 0 0;
          font-size: clamp(2rem, 4vw, 3.3rem);
          line-height: 1;
          letter-spacing: -2px;
          font-weight: 850;
        }

        .culture-text {
          align-self: end;
          max-width: 600px;
        }

        .culture-text p {
          margin-bottom: 18px;
          color: var(--text-secondary);
          font-size: 13px;
          line-height: 1.9;
        }

        .perks-section {
          padding-bottom: 70px;
        }

        .section-heading {
          margin-bottom: 24px;
        }

        .section-heading h2 {
          margin: 7px 0 0;
          font-size: 27px;
          font-weight: 850;
          letter-spacing: -1px;
        }

        .perk-card {
          height: 100%;
          padding: 25px;
          border: 1px solid var(--border);
          border-radius: 17px;
          background: var(--card);
        }

        .perk-card > span {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 43px;
          height: 43px;
          margin-bottom: 20px;
          border-radius: 12px;
          background: var(--hover-bg);
          font-size: 18px;
        }

        .perk-card strong {
          font-size: 12px;
        }

        .jobs-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
        }

        .job-count {
          color: var(--text-secondary);
          font-size: 10px;
        }

        .jobs-list {
          border-top: 1px solid var(--border);
        }

        .job-row {
          display: flex;
          align-items: center;
          gap: 25px;
          padding: 22px 5px;
          border-bottom: 1px solid var(--border);
          transition: .2s ease;
        }

        .job-row:hover {
          padding-left: 12px;
          padding-right: 12px;
          background: var(--hover-bg);
        }

        .job-main {
          flex: 1;
        }

        .job-main > span {
          color: #3b82f6;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .job-main h3 {
          margin: 5px 0 0;
          font-size: 14px;
          font-weight: 800;
        }

        .job-meta {
          display: flex;
          gap: 10px;
        }

        .job-meta span {
          padding: 6px 9px;
          border-radius: 7px;
          color: var(--text-secondary);
          background: var(--hover-bg);
          font-size: 9px;
        }

        .job-arrow {
          width: 35px;
          height: 35px;
          border: 1px solid var(--border);
          border-radius: 9px;
          color: var(--text-primary);
          background: var(--card);
          font-size: 15px;
        }

        .careers-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          margin-top: 70px;
          padding: 35px;
          border-radius: 22px;
          color: white;
          background: linear-gradient(
            135deg,
            #0f172a,
            #172554
          );
        }

        .careers-cta h2 {
          margin: 6px 0;
          font-size: 23px;
          font-weight: 850;
        }

        .careers-cta p {
          max-width: 600px;
          margin: 0;
          color: #94a3b8;
          font-size: 11px;
          line-height: 1.7;
        }

        .cta-link {
          color: #0f172a;
          background: white;
          box-shadow: none;
          white-space: nowrap;
        }

        @media (max-width: 767px) {
          .careers-hero {
            min-height: auto;
            padding: 60px 0;
            flex-direction: column;
            align-items: flex-start;
          }

          .career-art {
            align-self: center;
            transform: scale(.8);
            margin-top: -20px;
          }

          .culture-section {
            grid-template-columns: 1fr;
            gap: 25px;
          }

          .jobs-heading {
            align-items: flex-start;
            flex-direction: column;
            gap: 8px;
          }

          .job-row {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .job-meta {
            width: 100%;
          }

          .job-arrow {
            position: absolute;
            right: 20px;
          }

          .careers-cta {
            align-items: flex-start;
            flex-direction: column;
          }

          .cta-link {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </main>
  );
};

export default Careers;