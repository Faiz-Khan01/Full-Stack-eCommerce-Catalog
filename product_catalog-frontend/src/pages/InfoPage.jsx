import { Link } from "react-router-dom";

const pageContent = {
  "/about": {
    eyebrow: "ABOUT TECHSTORE",
    title: "Technology, made simple.",
    description:
      "TechStore is your destination for reliable, innovative, and thoughtfully selected technology products.",
    sections: [
      {
        title: "Who We Are",
        text: "TechStore brings together the latest technology, everyday essentials, and smart products in one convenient place. We focus on making technology easier to discover, compare, and purchase.",
      },
      {
        title: "Our Mission",
        text: "Our mission is simple: provide quality technology, transparent information, competitive prices, and an experience customers can trust.",
      },
      {
        title: "Why TechStore",
        text: "From product discovery to checkout and after-sales support, every part of TechStore is designed around convenience, reliability, and customer satisfaction.",
      },
    ],
  },

  "/careers": {
    eyebrow: "CAREERS",
    title: "Build the future with us.",
    description:
      "Join a team that believes great technology should make everyday life better.",
    sections: [
      {
        title: "Work With Purpose",
        text: "At TechStore, you'll work on products and experiences used by people every day. We value curiosity, ownership, creativity, and a willingness to solve meaningful problems.",
      },
      {
        title: "Our Culture",
        text: "We believe in open communication, continuous learning, thoughtful decisions, and giving talented people the freedom to do their best work.",
      },
      {
        title: "Open Opportunities",
        text: "We're always interested in meeting talented people across engineering, design, operations, marketing, customer experience, and business.",
      },
    ],
  },

  "/press": {
    eyebrow: "PRESS RELEASES",
    title: "What's happening at TechStore.",
    description:
      "Discover the latest announcements, launches, partnerships, and updates from TechStore.",
    sections: [
      {
        title: "Company News",
        text: "Follow TechStore for announcements about new services, products, partnerships, and improvements to the customer experience.",
      },
      {
        title: "Product Updates",
        text: "We continuously expand and improve our technology catalog to help customers discover products that fit their needs.",
      },
      {
        title: "Media Contact",
        text: "For press and media inquiries, please contact our communications team through the TechStore support channel.",
      },
    ],
  },

  "/science": {
    eyebrow: "TECHSTORE SCIENCE",
    title: "Technology deserves thoughtful design.",
    description:
      "Explore how technology, data, design, and innovation shape the TechStore experience.",
    sections: [
      {
        title: "Innovation",
        text: "We explore better ways to organize products, improve discovery, personalize experiences, and make online shopping more useful.",
      },
      {
        title: "Technology",
        text: "Our platform brings together modern web technologies, scalable services, and data-driven systems to create a fast and reliable shopping experience.",
      },
      {
        title: "Always Improving",
        text: "Technology changes quickly. That's why we continuously experiment, measure, learn, and improve.",
      },
    ],
  },

  "/sell": {
    eyebrow: "SELL WITH TECHSTORE",
    title: "Grow your business with TechStore.",
    description:
      "Reach new customers and showcase your products through the TechStore marketplace.",
    sections: [
      {
        title: "Reach More Customers",
        text: "Put your products in front of customers looking for technology, electronics, accessories, and everyday digital products.",
      },
      {
        title: "Simple Selling",
        text: "Manage your products, inventory, pricing, and orders through a streamlined seller experience.",
      },
      {
        title: "Build Your Business",
        text: "Use TechStore as another channel to grow your brand, reach new audiences, and build lasting customer relationships.",
      },
    ],
  },

  "/protect-brand": {
    eyebrow: "BRAND PROTECTION",
    title: "Protect what you've built.",
    description:
      "TechStore is committed to helping brands maintain trust and protect customers from misleading or unauthorized products.",
    sections: [
      {
        title: "Brand Trust",
        text: "Strong brands deserve strong protection. We work to maintain a marketplace where customers can confidently discover genuine products.",
      },
      {
        title: "Product Integrity",
        text: "We encourage sellers and brands to provide accurate product information and maintain high standards throughout the selling process.",
      },
      {
        title: "Report a Concern",
        text: "If you believe a product or listing violates your intellectual property or brand rights, please contact our support team.",
      },
    ],
  },

  "/affiliate": {
    eyebrow: "AFFILIATE PROGRAM",
    title: "Share products. Earn rewards.",
    description:
      "Recommend products you love and earn when your audience shops through your referral.",
    sections: [
      {
        title: "How It Works",
        text: "Join the TechStore affiliate program, share products with your audience, and receive rewards for qualifying purchases made through your referral.",
      },
      {
        title: "Built for Creators",
        text: "Whether you're a content creator, blogger, reviewer, or technology enthusiast, our affiliate program gives you another way to monetize your recommendations.",
      },
      {
        title: "Get Started",
        text: "Create your affiliate account and start sharing products with your audience.",
      },
    ],
  },

  "/advertise": {
    eyebrow: "ADVERTISE WITH US",
    title: "Put your products in front of the right audience.",
    description:
      "Create meaningful visibility for your products with TechStore advertising.",
    sections: [
      {
        title: "Reach Interested Customers",
        text: "Promote products to customers who are actively exploring technology and related products.",
      },
      {
        title: "Flexible Campaigns",
        text: "Build campaigns around your business goals, product launches, seasonal promotions, or high-priority products.",
      },
      {
        title: "Measure Performance",
        text: "Use campaign insights to understand how your products perform and make smarter marketing decisions.",
      },
    ],
  },

  "/account": {
    eyebrow: "YOUR ACCOUNT",
    title: "Everything you need, in one place.",
    description:
      "Manage your profile, orders, preferences, and shopping activity from your TechStore account.",
    sections: [
      {
        title: "Account Management",
        text: "Keep your personal information and preferences up to date for a smoother shopping experience.",
      },
      {
        title: "Orders",
        text: "Review your previous purchases, track orders, and access important order information.",
      },
      {
        title: "Personalized Experience",
        text: "Your account helps TechStore provide a more convenient and personalized shopping experience.",
      },
    ],
  },

  "/returns": {
    eyebrow: "RETURNS CENTRE",
    title: "Returns made simple.",
    description:
      "Need to return something? We're here to help make the process straightforward.",
    sections: [
      {
        title: "Before You Return",
        text: "Check your order details and make sure the product meets the applicable return requirements.",
      },
      {
        title: "Start a Return",
        text: "Sign in to your account and open your order history to find the product you'd like to return.",
      },
      {
        title: "Refunds",
        text: "Once an eligible return is received and processed, your refund will be handled according to the applicable payment method and return policy.",
      },
    ],
  },

  "/protection": {
    eyebrow: "PURCHASE PROTECTION",
    title: "Shop with confidence.",
    description:
      "We want every TechStore purchase to feel secure, transparent, and dependable.",
    sections: [
      {
        title: "Secure Shopping",
        text: "We use modern security practices to help protect your account and shopping information.",
      },
      {
        title: "Product Support",
        text: "If something doesn't go as expected with an eligible purchase, our support team can help you understand the available options.",
      },
      {
        title: "Customer First",
        text: "Our goal is to make resolving purchase issues as simple and transparent as possible.",
      },
    ],
  },

  "/help": {
    eyebrow: "HELP CENTRE",
    title: "How can we help?",
    description:
      "Find answers, manage your orders, and get support when you need it.",
    sections: [
      {
        title: "Orders & Delivery",
        text: "Get help with order status, delivery information, cancellations, and other order-related questions.",
      },
      {
        title: "Payments",
        text: "Find information about payment methods, transactions, refunds, and billing.",
      },
      {
        title: "Account & Security",
        text: "Need help signing in, changing account details, or keeping your account secure? Our support team is here to help.",
      },
    ],
  },
};

const InfoPage = ({ page }) => {
  const content = pageContent[page];

  if (!content) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          background: "var(--bg)",
          color: "var(--text-primary)",
        }}
      >
        <div className="text-center">
          <h1 className="fw-bold">Page Not Found</h1>
          <Link
            to="/"
            className="btn btn-primary mt-3 px-4 py-2 rounded-3"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main
      style={{
        minHeight: "calc(100vh - 100px)",
        background: "var(--bg)",
        color: "var(--text-primary)",
        transition:
          "background-color .25s ease, color .25s ease",
      }}
    >
      {/* Hero */}
      <section className="info-hero">
        <div className="container">
          <div className="info-hero-content">
            <div className="info-eyebrow">
              {content.eyebrow}
            </div>

            <h1>{content.title}</h1>

            <p>{content.description}</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container info-content">
        <div className="row g-4">
          {content.sections.map((section, index) => (
            <div
              className="col-12 col-md-6 col-lg-4"
              key={section.title}
            >
              <article className="info-card">
                <div className="info-number">
                  0{index + 1}
                </div>

                <h2>{section.title}</h2>

                <p>{section.text}</p>
              </article>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="info-cta">
          <div>
            <span>TECHSTORE</span>
            <h3>Have more questions?</h3>
            <p>
              Our team is ready to help you get the most
              from your TechStore experience.
            </p>
          </div>

          <Link
            to="/help"
            className="info-cta-button"
          >
            Visit Help Centre
            <span>→</span>
          </Link>
        </div>
      </section>

      <style>{`
        .info-hero {
          position: relative;
          overflow: hidden;
          padding: 100px 0 90px;
          background:
            radial-gradient(
              circle at 80% 10%,
              rgba(59, 130, 246, .14),
              transparent 32%
            ),
            radial-gradient(
              circle at 10% 80%,
              rgba(99, 102, 241, .08),
              transparent 30%
            ),
            var(--bg);
        }

        .info-hero::after {
          content: "";
          position: absolute;
          width: 300px;
          height: 300px;
          right: -150px;
          top: -150px;
          border-radius: 50%;
          border: 1px solid rgba(99, 102, 241, .12);
        }

        .info-hero-content {
          position: relative;
          z-index: 1;
          max-width: 760px;
        }

        .info-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 22px;
          color: #3b82f6;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.8px;
        }

        .info-eyebrow::before {
          content: "";
          width: 28px;
          height: 2px;
          border-radius: 99px;
          background: linear-gradient(
            90deg,
            #2563eb,
            #6366f1
          );
        }

        .info-hero h1 {
          margin: 0;
          max-width: 760px;
          color: var(--text-primary);
          font-size: clamp(2.7rem, 6vw, 5rem);
          line-height: 1.02;
          letter-spacing: -3px;
          font-weight: 800;
        }

        .info-hero p {
          max-width: 650px;
          margin: 24px 0 0;
          color: var(--text-secondary);
          font-size: 17px;
          line-height: 1.8;
        }

        .info-content {
          padding-top: 70px;
          padding-bottom: 90px;
        }

        .info-card {
          position: relative;
          height: 100%;
          padding: 30px;
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: 22px;
          background: var(--card);
          box-shadow: 0 15px 45px var(--shadow);
          transition:
            transform .25s ease,
            border-color .25s ease,
            box-shadow .25s ease;
        }

        .info-card:hover {
          transform: translateY(-5px);
          border-color: rgba(59, 130, 246, .35);
          box-shadow: 0 22px 55px var(--shadow);
        }

        .info-number {
          margin-bottom: 28px;
          color: #3b82f6;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .info-card h2 {
          margin-bottom: 13px;
          color: var(--text-primary);
          font-size: 19px;
          font-weight: 750;
          letter-spacing: -.3px;
        }

        .info-card p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 14px;
          line-height: 1.8;
        }

        .info-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          margin-top: 60px;
          padding: 35px 40px;
          border: 1px solid rgba(59, 130, 246, .18);
          border-radius: 24px;
          background:
            linear-gradient(
              135deg,
              rgba(37, 99, 235, .10),
              rgba(99, 102, 241, .06)
            ),
            var(--card);
        }

        .info-cta span {
          color: #3b82f6;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .info-cta h3 {
          margin: 5px 0;
          color: var(--text-primary);
          font-size: 22px;
          font-weight: 750;
        }

        .info-cta p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 13px;
        }

        .info-cta-button {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
          padding: 13px 19px;
          border-radius: 11px;
          color: #fff;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
          background: linear-gradient(
            135deg,
            #2563eb,
            #4f46e5
          );
          box-shadow:
            0 10px 25px rgba(37, 99, 235, .22);
          transition: all .25s ease;
        }

        .info-cta-button:hover {
          color: #fff;
          transform: translateY(-2px);
          box-shadow:
            0 14px 30px rgba(37, 99, 235, .32);
        }

        .info-cta-button span {
          color: #fff;
          font-size: 17px;
          letter-spacing: 0;
        }

        @media (max-width: 767px) {
          .info-hero {
            padding: 65px 0 55px;
          }

          .info-hero h1 {
            letter-spacing: -2px;
          }

          .info-hero p {
            font-size: 15px;
          }

          .info-content {
            padding-top: 45px;
            padding-bottom: 60px;
          }

          .info-cta {
            align-items: flex-start;
            flex-direction: column;
            padding: 28px;
          }

          .info-cta-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </main>
  );
};

export default InfoPage;