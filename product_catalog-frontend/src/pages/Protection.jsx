import React from "react";
import { Link } from "react-router-dom";

const Protection = () => {
  const benefits = [
    {
      icon: "🛡️",
      title: "Secure Payments",
      description:
        "Your payment information is handled securely with industry-standard protection.",
    },
    {
      icon: "✓",
      title: "Product Protection",
      description:
        "Shop confidently with support for eligible products purchased through TechStore.",
    },
    {
      icon: "↩",
      title: "Easy Returns",
      description:
        "Eligible products can be returned according to our return policy.",
    },
    {
      icon: "💬",
      title: "Dedicated Support",
      description:
        "Our support team is available to help when something doesn't go as expected.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Shop with confidence",
      description:
        "Choose from products listed on TechStore and review the product and seller information before purchasing.",
    },
    {
      number: "02",
      title: "Keep your order details",
      description:
        "Your order information helps us quickly understand and resolve any issue you may experience.",
    },
    {
      number: "03",
      title: "Contact us when needed",
      description:
        "If there is a problem with an eligible purchase, contact our support team for assistance.",
    },
  ];

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
          padding: "90px 20px 100px",
          background:
            "linear-gradient(135deg, #0f172a 0%, #172554 48%, #1e3a8a 100%)",
          color: "#ffffff",
        }}
      >
        {/* Decorative glow */}
        <div
          style={{
            position: "absolute",
            width: "420px",
            height: "420px",
            borderRadius: "50%",
            background:
              "rgba(59, 130, 246, 0.18)",
            filter: "blur(80px)",
            top: "-180px",
            right: "-100px",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            width: "320px",
            height: "320px",
            borderRadius: "50%",
            background:
              "rgba(99, 102, 241, 0.14)",
            filter: "blur(70px)",
            bottom: "-180px",
            left: "-100px",
            pointerEvents: "none",
          }}
        />

        <div
          className="container"
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "1100px",
          }}
        >
          {/* Breadcrumb */}
          <div className="mb-4">
            <Link
              to="/"
              style={{
                color: "rgba(255,255,255,0.65)",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              Home
            </Link>

            <span
              style={{
                margin: "0 10px",
                color: "rgba(255,255,255,0.35)",
              }}
            >
              /
            </span>

            <span
              style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: "14px",
              }}
            >
              Purchase Protection
            </span>
          </div>

          <div
            style={{
              maxWidth: "760px",
            }}
          >
            {/* Badge */}
            <div
              className="d-inline-flex align-items-center gap-2 mb-4"
              style={{
                padding: "8px 14px",
                borderRadius: "999px",
                background:
                  "rgba(255,255,255,0.09)",
                border:
                  "1px solid rgba(255,255,255,0.14)",
                backdropFilter:
                  "blur(10px)",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              <span>🛡️</span>
              <span>Shop with confidence</span>
            </div>

            <h1
              className="fw-bold mb-4"
              style={{
                fontSize:
                  "clamp(2.5rem, 6vw, 5rem)",
                lineHeight: 1.02,
                letterSpacing: "-2.5px",
              }}
            >
              Your purchase.
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
                Protected.
              </span>
            </h1>

            <p
              className="mb-0"
              style={{
                maxWidth: "680px",
                color:
                  "rgba(255,255,255,0.72)",
                fontSize: "18px",
                lineHeight: 1.75,
              }}
            >
              We want you to shop with confidence.
              TechStore provides support for eligible
              purchases, secure checkout, and assistance
              when something doesn't go according to plan.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          TRUST CARDS
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
        <div className="row g-3">
          {benefits.map((benefit) => (
            <div
              className="col-12 col-sm-6 col-lg-3"
              key={benefit.title}
            >
              <div
                style={{
                  height: "100%",
                  padding: "28px 22px",
                  borderRadius: "20px",
                  background:
                    "var(--card)",
                  border:
                    "1px solid var(--border)",
                  boxShadow:
                    "0 18px 45px rgba(15,23,42,0.10)",
                  transition:
                    "transform 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 25px 55px rgba(15,23,42,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 18px 45px rgba(15,23,42,0.10)";
                }}
              >
                <div
                  className="d-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "15px",
                    background:
                      "linear-gradient(135deg, #eff6ff, #eef2ff)",
                    color: "#2563eb",
                    fontSize: "22px",
                  }}
                >
                  {benefit.icon}
                </div>

                <h5
                  className="fw-bold mb-2"
                  style={{
                    color:
                      "var(--text-primary)",
                    fontSize: "16px",
                  }}
                >
                  {benefit.title}
                </h5>

                <p
                  className="mb-0"
                  style={{
                    color:
                      "var(--text-secondary)",
                    fontSize: "13px",
                    lineHeight: 1.65,
                  }}
                >
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          INTRODUCTION
      ====================================================== */}
      <section
        className="container"
        style={{
          maxWidth: "1000px",
          padding:
            "100px 20px 70px",
        }}
      >
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <div
              style={{
                width: "58px",
                height: "5px",
                borderRadius: "99px",
                background:
                  "linear-gradient(90deg, #2563eb, #6366f1)",
                marginBottom: "22px",
              }}
            />

            <h2
              className="fw-bold mb-3"
              style={{
                fontSize:
                  "clamp(2rem, 4vw, 3rem)",
                letterSpacing:
                  "-1.5px",
              }}
            >
              A safer way to shop online.
            </h2>

            <p
              style={{
                color:
                  "var(--text-secondary)",
                fontSize: "16px",
                lineHeight: 1.8,
                marginBottom: "18px",
              }}
            >
              Shopping online should feel simple,
              transparent, and secure. That's why we've
              designed TechStore with customer protection
              in mind at every important step.
            </p>

            <p
              style={{
                color:
                  "var(--text-secondary)",
                fontSize: "16px",
                lineHeight: 1.8,
              }}
            >
              From secure payments to returns and customer
              support, we're here to help you resolve issues
              with eligible purchases.
            </p>
          </div>

          <div className="col-lg-6">
            <div
              style={{
                padding: "38px",
                borderRadius: "28px",
                background:
                  "linear-gradient(145deg, #eff6ff, #eef2ff)",
                border:
                  "1px solid rgba(99,102,241,0.12)",
              }}
            >
              <div
                className="d-flex align-items-center justify-content-center mx-auto mb-4"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "30px",
                  background:
                    "linear-gradient(135deg, #2563eb, #4f46e5)",
                  boxShadow:
                    "0 20px 40px rgba(37,99,235,0.22)",
                  fontSize: "44px",
                }}
              >
                🛡️
              </div>

              <h3
                className="fw-bold text-center mb-3"
                style={{
                  color: "#0f172a",
                }}
              >
                Shop confidently
              </h3>

              <p
                className="text-center mb-0"
                style={{
                  color: "#64748b",
                  fontSize: "14px",
                  lineHeight: 1.7,
                }}
              >
                Your experience matters. We're committed
                to providing a secure and reliable shopping
                experience from checkout to after-sales
                support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}
      <section
        style={{
          background:
            "var(--muted-bg)",
          borderTop:
            "1px solid var(--border)",
          borderBottom:
            "1px solid var(--border)",
          padding:
            "85px 20px",
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: "1000px",
          }}
        >
          <div className="text-center mb-5">
            <span
              style={{
                display: "inline-block",
                padding:
                  "7px 13px",
                borderRadius:
                  "999px",
                background:
                  "rgba(37,99,235,0.08)",
                color: "#2563eb",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing:
                  "0.5px",
                textTransform:
                  "uppercase",
              }}
            >
              Simple Process
            </span>

            <h2
              className="fw-bold mt-3 mb-3"
              style={{
                fontSize:
                  "clamp(2rem, 4vw, 3rem)",
                letterSpacing:
                  "-1.5px",
              }}
            >
              Protection made simple.
            </h2>

            <p
              className="mx-auto mb-0"
              style={{
                maxWidth: "600px",
                color:
                  "var(--text-secondary)",
                lineHeight: 1.7,
              }}
            >
              If you experience a problem with an eligible
              purchase, we're here to help.
            </p>
          </div>

          <div className="row g-4">
            {steps.map((step) => (
              <div
                className="col-12 col-md-4"
                key={step.number}
              >
                <div
                  style={{
                    height: "100%",
                    padding: "30px",
                    borderRadius:
                      "22px",
                    background:
                      "var(--card)",
                    border:
                      "1px solid var(--border)",
                  }}
                >
                  <div
                    className="fw-bold mb-4"
                    style={{
                      fontSize:
                        "13px",
                      color:
                        "#2563eb",
                      letterSpacing:
                        "1px",
                    }}
                  >
                    {step.number}
                  </div>

                  <h4
                    className="fw-bold mb-3"
                    style={{
                      fontSize:
                        "18px",
                    }}
                  >
                    {step.title}
                  </h4>

                  <p
                    className="mb-0"
                    style={{
                      color:
                        "var(--text-secondary)",
                      fontSize:
                        "14px",
                      lineHeight:
                        1.75,
                    }}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          COVERAGE
      ====================================================== */}
      <section
        className="container"
        style={{
          maxWidth: "1000px",
          padding:
            "90px 20px",
        }}
      >
        <div className="row g-5">
          <div className="col-lg-7">
            <h2
              className="fw-bold mb-4"
              style={{
                fontSize:
                  "clamp(2rem, 4vw, 2.8rem)",
                letterSpacing:
                  "-1.2px",
              }}
            >
              What should you know?
            </h2>

            <div
              className="d-flex flex-column gap-3"
            >
              {[
                "Eligibility may vary depending on the product, seller, order, and circumstances.",
                "Always review product information, seller details, pricing, and return conditions before purchasing.",
                "Keep your order confirmation and relevant purchase information until your issue is resolved.",
                "For help with an order, contact TechStore support with your order details.",
              ].map(
                (item, index) => (
                  <div
                    key={index}
                    className="d-flex gap-3 align-items-start"
                  >
                    <div
                      className="flex-shrink-0 d-flex align-items-center justify-content-center"
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius:
                          "50%",
                        background:
                          "rgba(37,99,235,0.10)",
                        color:
                          "#2563eb",
                        fontSize:
                          "13px",
                        fontWeight:
                          800,
                      }}
                    >
                      ✓
                    </div>

                    <p
                      className="mb-0"
                      style={{
                        color:
                          "var(--text-secondary)",
                        fontSize:
                          "15px",
                        lineHeight:
                          1.7,
                      }}
                    >
                      {item}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="col-lg-5">
            <div
              style={{
                padding: "30px",
                borderRadius:
                  "24px",
                background:
                  "var(--card)",
                border:
                  "1px solid var(--border)",
                boxShadow:
                  "0 15px 40px var(--shadow)",
              }}
            >
              <div
                style={{
                  fontSize:
                    "30px",
                  marginBottom:
                    "18px",
                }}
              >
                💡
              </div>

              <h4
                className="fw-bold mb-3"
              >
                Need assistance?
              </h4>

              <p
                style={{
                  color:
                    "var(--text-secondary)",
                  fontSize:
                    "14px",
                  lineHeight:
                    1.7,
                }}
              >
                If you have an issue with your order,
                our support team can help guide you through
                the next steps.
              </p>

              <Link
                to="/help"
                className="btn w-100 py-3 fw-semibold text-white border-0"
                style={{
                  borderRadius:
                    "12px",
                  background:
                    "linear-gradient(135deg, #2563eb, #4f46e5)",
                  boxShadow:
                    "0 10px 25px rgba(37,99,235,0.20)",
                }}
              >
                Visit Help Centre
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FAQ
      ====================================================== */}
      <section
        style={{
          background:
            "var(--muted-bg)",
          borderTop:
            "1px solid var(--border)",
          padding:
            "80px 20px",
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: "850px",
          }}
        >
          <div className="text-center mb-5">
            <h2
              className="fw-bold mb-3"
              style={{
                fontSize:
                  "clamp(2rem, 4vw, 2.8rem)",
                letterSpacing:
                  "-1px",
              }}
            >
              Frequently asked questions
            </h2>

            <p
              style={{
                color:
                  "var(--text-secondary)",
              }}
            >
              A few things customers commonly ask.
            </p>
          </div>

          <div
            className="d-flex flex-column gap-3"
          >
            <details
              style={{
                background:
                  "var(--card)",
                border:
                  "1px solid var(--border)",
                borderRadius:
                  "16px",
                padding:
                  "20px 22px",
              }}
            >
              <summary
                className="fw-semibold"
                style={{
                  cursor:
                    "pointer",
                }}
              >
                Is every purchase covered?
              </summary>

              <p
                className="mb-0 mt-3"
                style={{
                  color:
                    "var(--text-secondary)",
                  fontSize:
                    "14px",
                  lineHeight:
                    1.7,
                }}
              >
                Protection and support can vary by product,
                seller, order, and situation. Please review
                the applicable product and order terms.
              </p>
            </details>

            <details
              style={{
                background:
                  "var(--card)",
                border:
                  "1px solid var(--border)",
                borderRadius:
                  "16px",
                padding:
                  "20px 22px",
              }}
            >
              <summary
                className="fw-semibold"
                style={{
                  cursor:
                    "pointer",
                }}
              >
                What should I do if my order has a problem?
              </summary>

              <p
                className="mb-0 mt-3"
                style={{
                  color:
                    "var(--text-secondary)",
                  fontSize:
                    "14px",
                  lineHeight:
                    1.7,
                }}
              >
                Keep your order information handy and visit
                the Help Centre to contact our support team.
              </p>
            </details>

            <details
              style={{
                background:
                  "var(--card)",
                border:
                  "1px solid var(--border)",
                borderRadius:
                  "16px",
                padding:
                  "20px 22px",
              }}
            >
              <summary
                className="fw-semibold"
                style={{
                  cursor:
                    "pointer",
                }}
              >
                Where can I check my return options?
              </summary>

              <p
                className="mb-0 mt-3"
                style={{
                  color:
                    "var(--text-secondary)",
                  fontSize:
                    "14px",
                  lineHeight:
                    1.7,
                }}
              >
                Visit the Returns Centre to learn about
                available return options and eligibility.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ====================================================== */}
      <section
        style={{
          padding:
            "80px 20px",
          background:
            "linear-gradient(135deg, #0f172a, #1e3a8a)",
          color: "#ffffff",
          textAlign: "center",
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: "700px",
          }}
        >
          <div
            style={{
              fontSize:
                "42px",
              marginBottom:
                "20px",
            }}
          >
            🛍️
          </div>

          <h2
            className="fw-bold mb-3"
            style={{
              fontSize:
                "clamp(2rem, 5vw, 3rem)",
              letterSpacing:
                "-1.5px",
            }}
          >
            Shop with confidence.
          </h2>

          <p
            className="mb-4"
            style={{
              color:
                "rgba(255,255,255,0.7)",
              fontSize:
                "16px",
              lineHeight:
                1.7,
            }}
          >
            Discover great products with the support you
            need, whenever you need it.
          </p>

          <Link
            to="/"
            className="btn px-4 py-3 fw-semibold"
            style={{
              background:
                "#ffffff",
              color:
                "#1d4ed8",
              borderRadius:
                "12px",
              border: "none",
              boxShadow:
                "0 12px 30px rgba(0,0,0,0.18)",
            }}
          >
            Start Shopping
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Protection;