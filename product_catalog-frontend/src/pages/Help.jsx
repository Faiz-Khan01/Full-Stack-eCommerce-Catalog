import React, { useState } from "react";
import { Link } from "react-router-dom";

import SupportTicketForm from "../components/SupportTicketForm";

const Help = () => {
  const [createdTicket, setCreatedTicket] = useState(null);

  // =====================================================
  // HELP TOPICS
  // =====================================================

  const helpTopics = [
    {
      icon: "📦",
      title: "Orders & Delivery",
      description:
        "Track your order, check delivery information, or get help with a delayed shipment.",
      link: "/orders",
      action: "View Orders",
    },
    {
      icon: "↩️",
      title: "Returns & Refunds",
      description:
        "Learn how to return eligible products and understand the refund process.",
      link: "/returns",
      action: "Returns Centre",
    },
    {
      icon: "💳",
      title: "Payments",
      description:
        "Get help with payments, billing information, and checkout issues.",
      link: "/checkout",
      action: "Learn More",
    },
    {
      icon: "🛡️",
      title: "Purchase Protection",
      description:
        "Learn how TechStore helps protect eligible purchases.",
      link: "/protection",
      action: "View Protection",
    },
    {
      icon: "👤",
      title: "Your Account",
      description:
        "Manage your profile, account information, and personal preferences.",
      link: "/account",
      action: "Manage Account",
    },
    {
      icon: "🔐",
      title: "Login & Security",
      description:
        "Having trouble signing in? Find help with your account access.",
      link: "/login",
      action: "Go to Login",
    },
  ];

  // =====================================================
  // FAQ
  // =====================================================

  const faqs = [
    {
      question: "How can I track my order?",
      answer:
        "Sign in to your account and open the Orders section to view your order status and available delivery information.",
    },
    {
      question: "How do I return a product?",
      answer:
        "Visit the Returns Centre to review return options and eligibility for your purchase.",
    },
    {
      question: "How can I contact support?",
      answer:
        "You can create a support ticket directly from this Help Centre. Provide your order information whenever possible so our team can assist you faster.",
    },
    {
      question: "What if I received the wrong product?",
      answer:
        "Create a support ticket with your order details and explain the issue. Our support team will review your request and help you with the available options.",
    },
  ];

  // =====================================================
  // SUPPORT TICKET SUCCESS
  // =====================================================

  const handleTicketSuccess = (ticket) => {
    console.log("Created ticket:", ticket);

    setCreatedTicket(ticket);

    // Scroll smoothly to success message
    setTimeout(() => {
      document
        .getElementById("ticket-success")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }, 100);
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text-primary)",
        transition:
          "background-color 0.25s ease, color 0.25s ease",
      }}
    >
      {/* =====================================================
          HERO
      ====================================================== */}

      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "85px 20px 100px",
          background:
            "linear-gradient(135deg, #0f172a 0%, #172554 50%, #1e3a8a 100%)",
          color: "#ffffff",
        }}
      >
        {/* Background Glow */}

        <div
          style={{
            position: "absolute",
            width: "420px",
            height: "420px",
            borderRadius: "50%",
            background:
              "rgba(59, 130, 246, 0.18)",
            filter: "blur(90px)",
            top: "-220px",
            right: "-100px",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background:
              "rgba(99, 102, 241, 0.14)",
            filter: "blur(80px)",
            bottom: "-220px",
            left: "-100px",
            pointerEvents: "none",
          }}
        />

        <div
          className="container"
          style={{
            maxWidth: "1100px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Breadcrumb */}

          <div className="mb-4">
            <Link
              to="/"
              style={{
                color:
                  "rgba(255,255,255,0.6)",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              Home
            </Link>

            <span
              style={{
                margin: "0 10px",
                color:
                  "rgba(255,255,255,0.3)",
              }}
            >
              /
            </span>

            <span
              style={{
                color:
                  "rgba(255,255,255,0.9)",
                fontSize: "14px",
              }}
            >
              Help Centre
            </span>
          </div>

          {/* Hero Content */}

          <div
            style={{
              maxWidth: "750px",
            }}
          >
            <div
              className="d-inline-flex align-items-center gap-2 mb-4"
              style={{
                padding: "8px 14px",
                borderRadius: "999px",
                background:
                  "rgba(255,255,255,0.09)",
                border:
                  "1px solid rgba(255,255,255,0.14)",
                fontSize: "13px",
                fontWeight: 600,
                backdropFilter: "blur(10px)",
              }}
            >
              <span>💬</span>
              <span>We're here to help</span>
            </div>

            <h1
              className="fw-bold mb-4"
              style={{
                fontSize:
                  "clamp(2.7rem, 6vw, 5rem)",
                lineHeight: 1.02,
                letterSpacing: "-2.5px",
              }}
            >
              How can we
              <br />

              <span
                style={{
                  background:
                    "linear-gradient(90deg, #60a5fa, #a5b4fc)",
                  WebkitBackgroundClip:
                    "text",
                  WebkitTextFillColor:
                    "transparent",
                }}
              >
                help you?
              </span>
            </h1>

            <p
              className="mb-0"
              style={{
                color:
                  "rgba(255,255,255,0.72)",
                fontSize: "18px",
                lineHeight: 1.75,
              }}
            >
              Find answers, manage your orders,
              learn about returns, or get help
              with your TechStore account.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          HELP TOPICS
      ====================================================== */}

      <section
        className="container"
        style={{
          maxWidth: "1100px",
          marginTop: "-55px",
          position: "relative",
          zIndex: 5,
        }}
      >
        <div className="row g-4">
          {helpTopics.map((topic) => (
            <div
              className="col-12 col-md-6 col-lg-4"
              key={topic.title}
            >
              <div
                style={{
                  height: "100%",
                  padding: "28px",
                  borderRadius: "22px",
                  background: "var(--card)",
                  border:
                    "1px solid var(--border)",
                  boxShadow:
                    "0 18px 45px rgba(15,23,42,0.09)",
                  transition:
                    "transform 0.25s ease, box-shadow 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-6px)";

                  e.currentTarget.style.boxShadow =
                    "0 25px 55px rgba(15,23,42,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(0)";

                  e.currentTarget.style.boxShadow =
                    "0 18px 45px rgba(15,23,42,0.09)";
                }}
              >
                {/* Icon */}

                <div
                  className="d-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "16px",
                    background:
                      "linear-gradient(135deg, #eff6ff, #eef2ff)",
                    fontSize: "23px",
                  }}
                >
                  {topic.icon}
                </div>

                {/* Title */}

                <h4
                  className="fw-bold mb-2"
                  style={{
                    fontSize: "18px",
                  }}
                >
                  {topic.title}
                </h4>

                {/* Description */}

                <p
                  className="mb-4"
                  style={{
                    color:
                      "var(--text-secondary)",
                    fontSize: "14px",
                    lineHeight: 1.7,
                  }}
                >
                  {topic.description}
                </p>

                {/* Link */}

                <Link
                  to={topic.link}
                  className="text-decoration-none fw-semibold"
                  style={{
                    color: "#2563eb",
                    fontSize: "14px",
                  }}
                >
                  {topic.action}

                  <span className="ms-2">
                    →
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          FAQ
      ====================================================== */}

      <section
        className="container"
        style={{
          maxWidth: "900px",
          padding: "100px 20px",
        }}
      >
        <div className="text-center mb-5">
          <span
            style={{
              display: "inline-block",
              padding: "7px 13px",
              borderRadius: "999px",
              background:
                "rgba(37,99,235,0.08)",
              color: "#2563eb",
              fontSize: "12px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            FAQ
          </span>

          <h2
            className="fw-bold mt-3 mb-3"
            style={{
              fontSize:
                "clamp(2rem, 4vw, 3rem)",
              letterSpacing: "-1.5px",
            }}
          >
            Frequently asked questions
          </h2>

          <p
            style={{
              color:
                "var(--text-secondary)",
              lineHeight: 1.7,
            }}
          >
            Quick answers to some of the most
            common questions from our customers.
          </p>
        </div>

        <div className="d-flex flex-column gap-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              style={{
                background:
                  "var(--card)",
                border:
                  "1px solid var(--border)",
                borderRadius: "16px",
                padding:
                  "20px 22px",
                boxShadow:
                  "0 8px 25px rgba(15,23,42,0.04)",
              }}
            >
              <summary
                className="fw-semibold"
                style={{
                  cursor: "pointer",
                  fontSize: "15px",
                }}
              >
                {faq.question}
              </summary>

              <p
                className="mb-0 mt-3"
                style={{
                  color:
                    "var(--text-secondary)",
                  fontSize: "14px",
                  lineHeight: 1.75,
                }}
              >
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* =====================================================
          SUPPORT TICKET SECTION
      ====================================================== */}

      <section
        id="support-ticket"
        style={{
          padding: "100px 20px",
          background:
            "linear-gradient(180deg, var(--bg), var(--muted-bg))",
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: "900px",
          }}
        >
          {/* Section Header */}

          <div
            className="text-center mb-5"
            style={{
              maxWidth: "680px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                padding: "8px 14px",
                borderRadius: "999px",
                background:
                  "rgba(37,99,235,0.08)",
                color: "#2563eb",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              🎧 Customer Support
            </span>

            <h2
              className="fw-bold mt-3 mb-3"
              style={{
                fontSize:
                  "clamp(2rem, 4vw, 3rem)",
                letterSpacing: "-1.5px",
              }}
            >
              Need personal assistance?
            </h2>

            <p
              className="mb-0"
              style={{
                color:
                  "var(--text-secondary)",
                fontSize: "15px",
                lineHeight: 1.8,
              }}
            >
              Can't find the answer you're looking
              for? Create a support ticket and our
              team will review your request.
            </p>
          </div>

          {/* Success Message */}

          {createdTicket && (
            <div
              id="ticket-success"
              className="mb-4"
              style={{
                padding: "22px",
                borderRadius: "18px",
                background:
                  "linear-gradient(135deg, #ecfdf5, #f0fdf4)",
                border:
                  "1px solid #bbf7d0",
                color: "#166534",
                boxShadow:
                  "0 15px 35px rgba(22,101,52,0.08)",
              }}
            >
              <div className="d-flex align-items-start gap-3">
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    minWidth: "44px",
                    borderRadius: "14px",
                    background: "#dcfce7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "21px",
                  }}
                >
                  ✓
                </div>

                <div>
                  <h5
                    className="fw-bold mb-1"
                    style={{
                      color: "#166534",
                    }}
                  >
                    Support ticket created
                  </h5>

                  <p
                    className="mb-0"
                    style={{
                      fontSize: "14px",
                      lineHeight: 1.6,
                    }}
                  >
                    Your request has been submitted
                    successfully.

                    {createdTicket?.id && (
                      <>
                        {" "}
                        Ticket ID:{" "}
                        <strong>
                          #{createdTicket.id}
                        </strong>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* =================================================
              SUPPORT FORM
          ================================================== */}

          <div
            style={{
              background: "var(--card)",
              border:
                "1px solid var(--border)",
              borderRadius: "26px",
              padding:
                "clamp(22px, 5vw, 42px)",
              boxShadow:
                "0 25px 70px rgba(15,23,42,0.10)",
            }}
          >
            <SupportTicketForm
              embedded={true}
              onSuccess={(ticket) => {
                handleTicketSuccess(ticket);
              }}
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT CTA
      ====================================================== */}

      <section
        style={{
          padding: "80px 20px",
          background:
            "linear-gradient(135deg, #0f172a, #1e3a8a)",
          color: "#ffffff",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow */}

        <div
          style={{
            position: "absolute",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background:
              "rgba(59,130,246,0.16)",
            filter: "blur(90px)",
            top: "-200px",
            right: "-100px",
            pointerEvents: "none",
          }}
        />

        <div
          className="container"
          style={{
            maxWidth: "700px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: "40px",
              marginBottom: "18px",
            }}
          >
            💙
          </div>

          <h2
            className="fw-bold mb-3"
            style={{
              fontSize:
                "clamp(2rem, 5vw, 3rem)",
              letterSpacing: "-1.5px",
            }}
          >
            We're always here for you
          </h2>

          <p
            className="mb-4"
            style={{
              color:
                "rgba(255,255,255,0.7)",
              lineHeight: 1.7,
            }}
          >
            Need help with something else?
            Explore your orders or continue
            shopping with TechStore.
          </p>

          <div className="d-flex justify-content-center flex-wrap gap-3">
            <Link
              to="/orders"
              className="btn px-4 py-3 fw-semibold"
              style={{
                background: "#ffffff",
                color: "#1d4ed8",
                borderRadius: "12px",
                border: "none",
                boxShadow:
                  "0 10px 25px rgba(0,0,0,0.12)",
              }}
            >
              View My Orders
            </Link>

            <a
              href="#support-ticket"
              className="btn px-4 py-3 fw-semibold"
              style={{
                color: "#ffffff",
                border:
                  "1px solid rgba(255,255,255,0.25)",
                borderRadius: "12px",
                background:
                  "rgba(255,255,255,0.08)",
                textDecoration: "none",
              }}
            >
              Contact Support
            </a>

            <Link
              to="/"
              className="btn px-4 py-3 fw-semibold"
              style={{
                color: "#ffffff",
                border:
                  "1px solid rgba(255,255,255,0.25)",
                borderRadius: "12px",
                background:
                  "rgba(255,255,255,0.08)",
              }}
            >
              Back to Shopping
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Help;