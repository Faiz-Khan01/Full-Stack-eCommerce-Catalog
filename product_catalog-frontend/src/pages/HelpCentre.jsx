import { useState } from "react";
import { Link } from "react-router-dom";

const HelpCentre = () => {
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const categories = [
    {
      icon: "📦",
      title: "Orders & Delivery",
      text: "Track orders, delivery status, cancellations and more.",
      link: "/orders",
    },
    {
      icon: "↩️",
      title: "Returns & Refunds",
      text: "Learn how returns, replacements and refunds work.",
      link: "/returns",
    },
    {
      icon: "💳",
      title: "Payments",
      text: "Get help with payments, refunds and transactions.",
      link: "/help",
    },
    {
      icon: "👤",
      title: "Account",
      text: "Manage your profile, password and account settings.",
      link: "/profile",
    },
  ];

  const faqs = [
    {
      question: "How can I track my order?",
      answer:
        "Sign in to your TechStore account and open the Orders section. You can view your order status and available delivery information there.",
    },
    {
      question: "How do I return a product?",
      answer:
        "Open your Orders page, select the relevant order and follow the available return instructions. Return eligibility may vary by product.",
    },
    {
      question: "How long does a refund take?",
      answer:
        "Refund processing times can vary depending on the payment method and financial institution. Once your refund is processed, the amount will be sent through the original payment method where applicable.",
    },
    {
      question: "Can I cancel my order?",
      answer:
        "Orders may be cancellable before they enter certain stages of fulfillment. Open your order details to check whether cancellation is available.",
    },
    {
      question: "How do I change my account information?",
      answer:
        "Go to your Profile page after signing in. From there you can update the account information supported by your account.",
    },
    {
      question: "What payment methods are supported?",
      answer:
        "Available payment methods are displayed during checkout and may vary depending on your location and order.",
    },
  ];

  const filteredFaqs = faqs.filter((faq) =>
    `${faq.question} ${faq.answer}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text-primary)",
      }}
    >
      {/* Hero */}
      <section className="support-hero">
        <div className="container">
          <div className="support-hero-content">
            <div className="support-eyebrow">
              TECHSTORE SUPPORT
            </div>

            <h1>
              How can we
              <span> help?</span>
            </h1>

            <p>
              Find answers, manage your orders and get
              support whenever you need it.
            </p>

            <div className="support-search">
              <span>⌕</span>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search for answers..."
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container support-section">
        <div className="support-section-heading">
          <div>
            <span>QUICK HELP</span>
            <h2>What can we help you with?</h2>
          </div>
        </div>

        <div className="row g-4">
          {categories.map((category) => (
            <div
              className="col-12 col-sm-6 col-lg-3"
              key={category.title}
            >
              <Link
                to={category.link}
                className="support-card"
              >
                <div className="support-card-icon">
                  {category.icon}
                </div>

                <h3>{category.title}</h3>

                <p>{category.text}</p>

                <span className="support-card-arrow">
                  →
                </span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="container support-section faq-section">
        <div className="support-section-heading">
          <div>
            <span>FAQ</span>
            <h2>
              {search
                ? "Search results"
                : "Frequently asked questions"}
            </h2>
          </div>
        </div>

        {filteredFaqs.length === 0 ? (
          <div className="no-results">
            <div>🔎</div>

            <h3>No results found</h3>

            <p>
              Try searching with a different keyword.
            </p>

            <button
              onClick={() => setSearch("")}
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="faq-list">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  className={`faq-item ${
                    isOpen ? "faq-open" : ""
                  }`}
                  key={faq.question}
                >
                  <button
                    className="faq-question"
                    onClick={() =>
                      setOpenFaq(
                        isOpen ? null : index
                      )
                    }
                  >
                    <span>{faq.question}</span>

                    <span className="faq-icon">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Contact */}
      <section className="container support-section">
        <div className="support-contact">
          <div className="support-contact-icon">
            ✦
          </div>

          <div>
            <span>STILL NEED HELP?</span>

            <h2>
              Our support team is here for you.
            </h2>

            <p>
              Can't find what you're looking for?
              Contact our support team and we'll
              help you find the right solution.
            </p>
          </div>

          <a
            href="mailto:support@techstore.com"
            className="support-contact-button"
          >
            Contact Support
            <span>→</span>
          </a>
        </div>
      </section>

      <style>{`
        .support-hero {
          position: relative;
          overflow: hidden;
          padding: 90px 0 100px;
          background:
            radial-gradient(
              circle at 80% 20%,
              rgba(37, 99, 235, .16),
              transparent 30%
            ),
            radial-gradient(
              circle at 15% 80%,
              rgba(99, 102, 241, .10),
              transparent 30%
            ),
            var(--bg);
        }

        .support-hero-content {
          max-width: 780px;
          margin: auto;
          text-align: center;
        }

        .support-eyebrow,
        .support-section-heading span,
        .support-contact span {
          color: #3b82f6;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.8px;
        }

        .support-hero h1 {
          margin: 18px 0;
          color: var(--text-primary);
          font-size: clamp(3rem, 7vw, 5.5rem);
          font-weight: 850;
          line-height: .95;
          letter-spacing: -4px;
        }

        .support-hero h1 span {
          background:
            linear-gradient(
              135deg,
              #2563eb,
              #6366f1
            );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .support-hero p {
          max-width: 560px;
          margin: 0 auto 35px;
          color: var(--text-secondary);
          font-size: 16px;
          line-height: 1.7;
        }

        .support-search {
          display: flex;
          align-items: center;
          max-width: 650px;
          margin: auto;
          padding: 7px 9px 7px 20px;
          border: 1px solid var(--border);
          border-radius: 16px;
          background: var(--card);
          box-shadow: 0 20px 60px var(--shadow);
          text-align: left;
        }

        .support-search > span {
          color: #64748b;
          font-size: 25px;
          margin-right: 12px;
        }

        .support-search input {
          width: 100%;
          border: 0;
          outline: 0;
          color: var(--text-primary);
          background: transparent;
          font-size: 14px;
        }

        .support-search input::placeholder {
          color: #64748b;
        }

        .support-search button {
          width: 34px;
          height: 34px;
          flex-shrink: 0;
          border: 0;
          border-radius: 9px;
          color: #64748b;
          background: var(--hover-bg);
          font-size: 20px;
        }

        .support-section {
          padding-top: 75px;
        }

        .support-section-heading {
          margin-bottom: 28px;
        }

        .support-section-heading h2 {
          margin: 8px 0 0;
          color: var(--text-primary);
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -.8px;
        }

        .support-card {
          position: relative;
          display: block;
          height: 100%;
          padding: 28px;
          border: 1px solid var(--border);
          border-radius: 20px;
          color: var(--text-primary);
          background: var(--card);
          text-decoration: none;
          box-shadow: 0 12px 35px var(--shadow);
          transition: all .25s ease;
        }

        .support-card:hover {
          color: var(--text-primary);
          transform: translateY(-5px);
          border-color: rgba(59,130,246,.35);
          box-shadow: 0 20px 45px var(--shadow);
        }

        .support-card-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          margin-bottom: 22px;
          border-radius: 14px;
          background: var(--hover-bg);
          font-size: 22px;
        }

        .support-card h3 {
          margin-bottom: 10px;
          font-size: 16px;
          font-weight: 750;
        }

        .support-card p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 13px;
          line-height: 1.7;
        }

        .support-card-arrow {
          display: block;
          margin-top: 20px;
          color: #3b82f6;
          font-size: 18px;
        }

        .faq-section {
          padding-bottom: 10px;
        }

        .faq-list {
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: 20px;
          background: var(--card);
        }

        .faq-item + .faq-item {
          border-top: 1px solid var(--border);
        }

        .faq-question {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 21px 25px;
          border: 0;
          color: var(--text-primary);
          background: transparent;
          text-align: left;
          font-size: 14px;
          font-weight: 650;
        }

        .faq-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          flex-shrink: 0;
          margin-left: 20px;
          border-radius: 8px;
          color: #3b82f6;
          background: var(--hover-bg);
          font-size: 18px;
        }

        .faq-answer {
          padding: 0 25px 23px;
        }

        .faq-answer p {
          max-width: 800px;
          margin: 0;
          color: var(--text-secondary);
          font-size: 13px;
          line-height: 1.8;
        }

        .no-results {
          padding: 60px 20px;
          border: 1px solid var(--border);
          border-radius: 20px;
          background: var(--card);
          text-align: center;
        }

        .no-results > div {
          font-size: 35px;
        }

        .no-results h3 {
          margin: 15px 0 7px;
          font-size: 18px;
        }

        .no-results p {
          color: var(--text-secondary);
          font-size: 13px;
        }

        .no-results button {
          border: 0;
          border-radius: 9px;
          padding: 10px 16px;
          color: white;
          background: #2563eb;
          font-size: 12px;
          font-weight: 700;
        }

        .support-contact {
          display: flex;
          align-items: center;
          gap: 22px;
          margin: 70px 0 90px;
          padding: 35px;
          border: 1px solid rgba(59,130,246,.2);
          border-radius: 24px;
          background:
            linear-gradient(
              135deg,
              rgba(37,99,235,.10),
              rgba(99,102,241,.06)
            ),
            var(--card);
        }

        .support-contact-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 55px;
          height: 55px;
          flex-shrink: 0;
          border-radius: 16px;
          color: white;
          background: linear-gradient(
            135deg,
            #2563eb,
            #6366f1
          );
        }

        .support-contact h2 {
          margin: 5px 0;
          color: var(--text-primary);
          font-size: 21px;
          font-weight: 800;
        }

        .support-contact p {
          max-width: 600px;
          margin: 0;
          color: var(--text-secondary);
          font-size: 13px;
          line-height: 1.7;
        }

        .support-contact-button {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-left: auto;
          flex-shrink: 0;
          padding: 13px 18px;
          border-radius: 10px;
          color: white;
          background: linear-gradient(
            135deg,
            #2563eb,
            #4f46e5
          );
          text-decoration: none;
          font-size: 12px;
          font-weight: 700;
          box-shadow: 0 10px 25px rgba(37,99,235,.22);
          transition: all .25s ease;
        }

        .support-contact-button:hover {
          color: white;
          transform: translateY(-2px);
        }

        .support-contact-button span {
          color: white;
          letter-spacing: 0;
          font-size: 16px;
        }

        @media (max-width: 767px) {
          .support-hero {
            padding: 65px 0 70px;
          }

          .support-hero h1 {
            letter-spacing: -2.5px;
          }

          .support-section {
            padding-top: 50px;
          }

          .support-contact {
            align-items: flex-start;
            flex-direction: column;
            margin: 50px 0 60px;
            padding: 28px;
          }

          .support-contact-button {
            width: 100%;
            justify-content: center;
            margin-left: 0;
          }
        }
      `}</style>
    </main>
  );
};

export default HelpCentre;