import { Link } from "react-router-dom";
import { useState } from "react";

const ReturnsCentre = () => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      number: "01",
      title: "Find your order",
      text: "Open your Orders page and select the product you want to return.",
    },
    {
      number: "02",
      title: "Choose a reason",
      text: "Tell us why you're returning the product and select the available return option.",
    },
    {
      number: "03",
      title: "Send it back",
      text: "Follow the provided instructions to package and return your product.",
    },
    {
      number: "04",
      title: "Receive your refund",
      text: "Once your return is processed, your eligible refund will be initiated.",
    },
  ];

  const reasons = [
    "Product arrived damaged",
    "Wrong product received",
    "Product doesn't match description",
    "Changed my mind",
    "Product has a defect",
    "Other issue",
  ];

  return (
    <main className="returns-page">
      <div className="container">
        {/* Hero */}
        <section className="returns-hero">
          <span>RETURNS CENTRE</span>

          <h1>
            Returns should be
            <strong> simple.</strong>
          </h1>

          <p>
            We're here to make returns, replacements and
            refunds as straightforward as possible.
          </p>

          <Link to="/orders" className="returns-primary">
            View Your Orders →
          </Link>
        </section>

        {/* Process */}
        <section className="returns-section">
          <div className="returns-heading">
            <span>HOW IT WORKS</span>
            <h2>Four simple steps.</h2>
          </div>

          <div className="returns-steps">
            {steps.map((step, index) => (
              <button
                key={step.number}
                className={`return-step ${
                  activeStep === index + 1
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveStep(index + 1)
                }
              >
                <div className="return-step-number">
                  {step.number}
                </div>

                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Reasons */}
        <section className="returns-section">
          <div className="returns-heading">
            <span>COMMON REASONS</span>
            <h2>Why are you returning it?</h2>
          </div>

          <div className="row g-3">
            {reasons.map((reason) => (
              <div
                className="col-12 col-md-6 col-lg-4"
                key={reason}
              >
                <div className="return-reason">
                  <span>✓</span>
                  {reason}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Policy */}
        <section className="returns-policy">
          <div className="policy-icon">↩</div>

          <div>
            <span>IMPORTANT</span>
            <h2>Return eligibility can vary.</h2>
            <p>
              Return eligibility, timelines and available
              options may depend on the product, seller,
              condition and reason for return. Always check
              your order details for the options available
              to you.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="returns-bottom">
          <h2>Need help with a return?</h2>

          <p>
            Our Help Centre has answers to common return
            and refund questions.
          </p>

          <Link to="/help">
            Visit Help Centre →
          </Link>
        </section>
      </div>

      <style>{`
        .returns-page {
          min-height: 100vh;
          padding-bottom: 90px;
          background: var(--bg);
          color: var(--text-primary);
        }

        .returns-hero {
          padding: 90px 0 75px;
          max-width: 780px;
        }

        .returns-hero > span,
        .returns-heading > span,
        .returns-policy span {
          color: #3b82f6;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.7px;
        }

        .returns-hero h1 {
          margin: 18px 0;
          font-size: clamp(2.8rem, 6vw, 5rem);
          line-height: 1;
          letter-spacing: -3px;
          font-weight: 850;
        }

        .returns-hero h1 strong {
          color: #3b82f6;
        }

        .returns-hero p {
          max-width: 620px;
          color: var(--text-secondary);
          font-size: 16px;
          line-height: 1.8;
        }

        .returns-primary {
          display: inline-block;
          margin-top: 18px;
          padding: 13px 20px;
          border-radius: 11px;
          color: white;
          background: linear-gradient(135deg,#2563eb,#4f46e5);
          text-decoration: none;
          font-size: 12px;
          font-weight: 750;
          box-shadow: 0 10px 25px rgba(37,99,235,.22);
        }

        .returns-section {
          padding-top: 45px;
        }

        .returns-heading {
          margin-bottom: 25px;
        }

        .returns-heading h2 {
          margin: 7px 0 0;
          font-size: 25px;
          font-weight: 800;
          letter-spacing: -.7px;
        }

        .returns-steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border: 1px solid var(--border);
          border-radius: 22px;
          overflow: hidden;
          background: var(--card);
        }

        .return-step {
          min-height: 220px;
          padding: 25px;
          border: 0;
          border-right: 1px solid var(--border);
          color: var(--text-primary);
          background: transparent;
          text-align: left;
          transition: .25s ease;
        }

        .return-step:last-child {
          border-right: 0;
        }

        .return-step:hover,
        .return-step.active {
          background: var(--hover-bg);
        }

        .return-step-number {
          margin-bottom: 35px;
          color: #3b82f6;
          font-size: 12px;
          font-weight: 800;
        }

        .return-step h3 {
          margin-bottom: 10px;
          font-size: 15px;
          font-weight: 750;
        }

        .return-step p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 12px;
          line-height: 1.7;
        }

        .return-reason {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 18px;
          border: 1px solid var(--border);
          border-radius: 13px;
          color: var(--text-secondary);
          background: var(--card);
          font-size: 13px;
        }

        .return-reason span {
          color: #22c55e;
          font-weight: 800;
        }

        .returns-policy {
          display: flex;
          gap: 20px;
          margin-top: 60px;
          padding: 30px;
          border: 1px solid rgba(245,158,11,.18);
          border-radius: 20px;
          background: rgba(245,158,11,.04);
        }

        .policy-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          border-radius: 14px;
          color: #f59e0b;
          background: rgba(245,158,11,.1);
          font-size: 23px;
        }

        .returns-policy h2 {
          margin: 5px 0 8px;
          font-size: 18px;
          font-weight: 750;
        }

        .returns-policy p {
          max-width: 800px;
          margin: 0;
          color: var(--text-secondary);
          font-size: 12px;
          line-height: 1.8;
        }

        .returns-bottom {
          margin-top: 70px;
          padding: 45px;
          border-radius: 23px;
          color: white;
          background: linear-gradient(135deg,#111827,#172554);
          text-align: center;
        }

        .returns-bottom h2 {
          margin: 0 0 8px;
          font-size: 25px;
          font-weight: 800;
        }

        .returns-bottom p {
          margin: 0 0 22px;
          color: #94a3b8;
          font-size: 13px;
        }

        .returns-bottom a {
          color: #60a5fa;
          text-decoration: none;
          font-size: 13px;
          font-weight: 750;
        }

        @media (max-width: 991px) {
          .returns-steps {
            grid-template-columns: repeat(2, 1fr);
          }

          .return-step:nth-child(2) {
            border-right: 0;
          }

          .return-step:nth-child(-n+2) {
            border-bottom: 1px solid var(--border);
          }
        }

        @media (max-width: 575px) {
          .returns-hero {
            padding: 60px 0 50px;
          }

          .returns-hero h1 {
            letter-spacing: -2px;
          }

          .returns-steps {
            grid-template-columns: 1fr;
          }

          .return-step,
          .return-step:nth-child(2) {
            border-right: 0;
            border-bottom: 1px solid var(--border);
          }

          .return-step:last-child {
            border-bottom: 0;
          }

          .returns-policy {
            align-items: flex-start;
          }

          .returns-bottom {
            padding: 35px 20px;
          }
        }
      `}</style>
    </main>
  );
};

export default ReturnsCentre;