import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const Account = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      setUser(storedUser);
    } catch {
      setUser(null);
    }
  }, []);

  const displayName =
    user?.name ||
    user?.username ||
    user?.email?.split("@")[0] ||
    "TechStore Customer";

  const email =
    user?.email || "No email available";

  const handleLogout = () => {
    Swal.fire({
      title: "Sign out?",
      text: "You'll need to sign in again to access your account.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sign Out",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2563eb",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("user");

        window.dispatchEvent(
          new Event("authChanged")
        );

        navigate("/login");
      }
    });
  };

  const accountSections = [
    {
      icon: "📦",
      title: "Your Orders",
      description:
        "Track, manage and review your recent purchases.",
      link: "/orders",
      label: "View Orders",
    },
    {
      icon: "❤️",
      title: "Your Wishlist",
      description:
        "Keep your favourite products saved for later.",
      link: "/wishlist",
      label: "View Wishlist",
    },
    {
      icon: "↩",
      title: "Returns & Refunds",
      description:
        "Manage returns and learn about refund options.",
      link: "/returns",
      label: "Manage Returns",
    },
    {
      icon: "🛡️",
      title: "Purchase Protection",
      description:
        "Learn how TechStore helps protect your purchases.",
      link: "/protection",
      label: "Learn More",
    },
    {
      icon: "💬",
      title: "Help Centre",
      description:
        "Find answers and get assistance with your account.",
      link: "/help",
      label: "Get Help",
    },
    {
      icon: "🛒",
      title: "Shopping Cart",
      description:
        "Review products you've added to your cart.",
      link: "/cart",
      label: "View Cart",
    },
  ];

  return (
    <main className="account-page">
      <div className="container py-5">

        {/* PAGE HEADER */}
        <section className="account-header">
          <div>
            <span className="eyebrow">
              YOUR TECHSTORE
            </span>

            <h1>
              Account
              <span>.</span>
            </h1>

            <p>
              Manage your profile, orders, saved products
              and shopping preferences.
            </p>
          </div>

          <Link
            to="/"
            className="continue-shopping"
          >
            Continue Shopping
            <span>→</span>
          </Link>
        </section>

        {/* PROFILE CARD */}
        <section className="profile-card">

          <div className="profile-avatar">
            {displayName
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="profile-info">
            <span className="profile-label">
              SIGNED IN AS
            </span>

            <h2>{displayName}</h2>

            <p>{email}</p>
          </div>

          <div className="profile-actions">
            <Link
              to="/profile"
              className="profile-button primary"
            >
              Edit Profile
            </Link>

            <button
              type="button"
              className="profile-button secondary"
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </div>
        </section>

        {/* ACCOUNT OPTIONS */}
        <section className="account-section">

          <div className="section-heading">
            <div>
              <span className="eyebrow">
                ACCOUNT CENTRE
              </span>

              <h2>
                Manage your account
              </h2>
            </div>
          </div>

          <div className="row g-3">
            {accountSections.map((item) => (
              <div
                className="col-12 col-md-6 col-lg-4"
                key={item.title}
              >
                <Link
                  to={item.link}
                  className="account-option"
                >
                  <div className="option-top">
                    <div className="option-icon">
                      {item.icon}
                    </div>

                    <span className="option-arrow">
                      ↗
                    </span>
                  </div>

                  <h3>{item.title}</h3>

                  <p>
                    {item.description}
                  </p>

                  <span className="option-link">
                    {item.label}
                    <span>→</span>
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* SECURITY CARD */}
        <section className="security-card">

          <div className="security-icon">
            ✓
          </div>

          <div className="security-content">
            <span className="eyebrow">
              ACCOUNT SECURITY
            </span>

            <h2>
              Your account, protected.
            </h2>

            <p>
              Keep your account information up to date
              and use a strong password to help protect
              your TechStore account.
            </p>
          </div>

          <Link
            to="/profile"
            className="security-button"
          >
            Review Account
            <span>→</span>
          </Link>

        </section>

        {/* SUPPORT */}
        <section className="account-support">

          <div>
            <span className="eyebrow">
              NEED ASSISTANCE?
            </span>

            <h2>
              Something not right?
            </h2>

            <p>
              Our Help Centre has answers to common
              account, order and payment questions.
            </p>
          </div>

          <Link
            to="/help"
            className="support-link"
          >
            Visit Help Centre
            <span>→</span>
          </Link>

        </section>

      </div>

      <style>{`
        .account-page {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text-primary);
        }

        .account-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
          padding: 45px 0 35px;
        }

        .eyebrow {
          display: inline-block;
          color: #3b82f6;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.7px;
        }

        .account-header h1 {
          margin: 10px 0 8px;
          font-size: clamp(2.8rem, 6vw, 4.5rem);
          line-height: .95;
          letter-spacing: -3px;
          font-weight: 850;
        }

        .account-header h1 span {
          color: #3b82f6;
        }

        .account-header p {
          max-width: 580px;
          margin: 0;
          color: var(--text-secondary);
          font-size: 14px;
          line-height: 1.7;
        }

        .continue-shopping {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 17px;
          border: 1px solid var(--border);
          border-radius: 11px;
          color: var(--text-primary);
          background: var(--card);
          text-decoration: none;
          font-size: 11px;
          font-weight: 750;
          white-space: nowrap;
          box-shadow: 0 10px 30px var(--shadow);
          transition: .2s ease;
        }

        .continue-shopping:hover {
          color: #2563eb;
          transform: translateY(-2px);
        }

        .continue-shopping span {
          color: #3b82f6;
          font-size: 15px;
        }

        /* PROFILE */

        .profile-card {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 25px;
          border: 1px solid var(--border);
          border-radius: 20px;
          background: var(--card);
          box-shadow: 0 15px 40px var(--shadow);
        }

        .profile-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 65px;
          height: 65px;
          flex-shrink: 0;
          border-radius: 19px;
          color: white;
          background:
            linear-gradient(
              135deg,
              #2563eb,
              #6366f1
            );
          font-size: 25px;
          font-weight: 800;
          box-shadow:
            0 12px 25px
            rgba(37, 99, 235, .2);
        }

        .profile-info {
          flex: 1;
          min-width: 0;
        }

        .profile-label {
          color: var(--text-secondary);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.3px;
        }

        .profile-info h2 {
          margin: 4px 0 2px;
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -.4px;
        }

        .profile-info p {
          margin: 0;
          overflow: hidden;
          color: var(--text-secondary);
          font-size: 12px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .profile-actions {
          display: flex;
          gap: 8px;
        }

        .profile-button {
          padding: 10px 15px;
          border-radius: 9px;
          font-size: 10px;
          font-weight: 750;
          text-decoration: none;
          transition: .2s ease;
        }

        .profile-button.primary {
          color: white;
          background:
            linear-gradient(
              135deg,
              #2563eb,
              #4f46e5
            );
        }

        .profile-button.secondary {
          border: 1px solid var(--border);
          color: var(--text-primary);
          background: var(--card);
        }

        .profile-button:hover {
          transform: translateY(-2px);
        }

        /* SECTION */

        .account-section {
          padding-top: 55px;
        }

        .section-heading {
          margin-bottom: 22px;
        }

        .section-heading h2 {
          margin: 6px 0 0;
          font-size: 25px;
          font-weight: 800;
          letter-spacing: -.8px;
        }

        /* OPTIONS */

        .account-option {
          display: block;
          height: 100%;
          padding: 23px;
          border: 1px solid var(--border);
          border-radius: 18px;
          color: var(--text-primary);
          background: var(--card);
          text-decoration: none;
          box-shadow: 0 10px 30px var(--shadow);
          transition: .25s ease;
        }

        .account-option:hover {
          color: var(--text-primary);
          border-color:
            rgba(59, 130, 246, .35);
          transform: translateY(-4px);
          box-shadow:
            0 20px 45px var(--shadow);
        }

        .option-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 22px;
        }

        .option-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 45px;
          height: 45px;
          border-radius: 13px;
          background: var(--hover-bg);
          font-size: 19px;
        }

        .option-arrow {
          color: var(--text-secondary);
          font-size: 17px;
          transition: .2s ease;
        }

        .account-option:hover .option-arrow {
          color: #3b82f6;
          transform: translate(2px, -2px);
        }

        .account-option h3 {
          margin: 0 0 7px;
          font-size: 15px;
          font-weight: 800;
        }

        .account-option p {
          min-height: 39px;
          margin: 0 0 17px;
          color: var(--text-secondary);
          font-size: 11px;
          line-height: 1.7;
        }

        .option-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #3b82f6;
          font-size: 10px;
          font-weight: 800;
        }

        .option-link span {
          font-size: 14px;
        }

        /* SECURITY */

        .security-card {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-top: 55px;
          padding: 28px;
          border: 1px solid
            rgba(34, 197, 94, .15);
          border-radius: 20px;
          background:
            linear-gradient(
              135deg,
              rgba(34,197,94,.07),
              rgba(59,130,246,.04)
            );
        }

        .security-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 52px;
          height: 52px;
          flex-shrink: 0;
          border-radius: 15px;
          color: #16a34a;
          background: rgba(34,197,94,.1);
          font-size: 22px;
          font-weight: 800;
        }

        .security-content {
          flex: 1;
        }

        .security-content h2 {
          margin: 5px 0 5px;
          font-size: 18px;
          font-weight: 800;
        }

        .security-content p {
          max-width: 650px;
          margin: 0;
          color: var(--text-secondary);
          font-size: 11px;
          line-height: 1.7;
        }

        .security-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 15px;
          border-radius: 10px;
          color: white;
          background: #16a34a;
          text-decoration: none;
          font-size: 10px;
          font-weight: 750;
          white-space: nowrap;
        }

        /* SUPPORT */

        .account-support {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          margin-top: 25px;
          padding: 28px;
          border-radius: 20px;
          color: white;
          background:
            linear-gradient(
              135deg,
              #0f172a,
              #172554
            );
        }

        .account-support h2 {
          margin: 5px 0;
          font-size: 19px;
          font-weight: 800;
        }

        .account-support p {
          margin: 0;
          color: #94a3b8;
          font-size: 11px;
        }

        .support-link {
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

        .support-link span {
          color: #2563eb;
          font-size: 14px;
        }

        @media (max-width: 767px) {
          .account-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .continue-shopping {
            width: 100%;
            justify-content: center;
          }

          .profile-card {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .profile-info {
            width: calc(100% - 85px);
          }

          .profile-actions {
            width: 100%;
          }

          .profile-button {
            flex: 1;
            text-align: center;
          }

          .security-card {
            align-items: flex-start;
            flex-direction: column;
          }

          .security-button {
            width: 100%;
            justify-content: center;
          }

          .account-support {
            align-items: flex-start;
            flex-direction: column;
          }

          .support-link {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </main>
  );
};

export default Account;