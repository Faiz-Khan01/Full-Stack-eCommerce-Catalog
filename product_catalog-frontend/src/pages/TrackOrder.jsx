import { useCallback, useEffect, useMemo, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://full-stack-ecommerce-catalog.onrender.com/api";

const TrackOrder = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // USER
  // =========================================================

  const getStoredUser = () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      return JSON.parse(storedUser);
    } catch (err) {
      console.error("Invalid user data:", err);
      return null;
    }
  };

  const user = getStoredUser();

  const token = localStorage.getItem("token");

  const userEmail = user?.email?.trim();

  // =========================================================
  // FETCH ORDERS
  // =========================================================

  const fetchOrders = useCallback(
    async (showRefreshLoader = false) => {
      if (!userEmail) {
        setOrders([]);
        setLoading(false);
        setError("Please log in to track your orders.");
        return;
      }

      try {
        setError("");

        if (showRefreshLoader) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const headers = {
          Accept: "application/json",
        };

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(
          `${API_BASE_URL}/orders/user/${encodeURIComponent(
            userEmail
          )}`,
          {
            method: "GET",
            headers,
          }
        );

        if (!response.ok) {
          const errorText = await response.text();

          console.error(
            "Track Orders Failed:",
            response.status,
            errorText
          );

          throw new Error(
            `Unable to load orders (${response.status})`
          );
        }

        const data = await response.json();

        const orderList = Array.isArray(data) ? data : [];

        const sortedOrders = [...orderList].sort((a, b) => {
          const idA = Number(a?.id || 0);
          const idB = Number(b?.id || 0);

          return idB - idA;
        });

        setOrders(sortedOrders);

        // Automatically select latest order
        if (sortedOrders.length > 0) {
          setSelectedOrderId((currentId) => {
            const stillExists = sortedOrders.some(
              (order) =>
                String(order?.id) === String(currentId)
              );

            if (stillExists) {
              return currentId;
            }

            return String(sortedOrders[0]?.id || "");
          });
        } else {
          setSelectedOrderId("");
        }
      } catch (err) {
        console.error("Track Order Error:", err);

        setOrders([]);

        setError(
          err?.message ||
            "Unable to load your orders. Please try again."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [userEmail, token]
  );

  // =========================================================
  // INITIAL FETCH
  // =========================================================

  useEffect(() => {
    fetchOrders(false);
  }, [fetchOrders]);

  // =========================================================
  // SELECTED ORDER
  // =========================================================

  const selectedOrder = useMemo(() => {
    if (!orders.length) {
      return null;
    }

    return (
      orders.find(
        (order) =>
          String(order?.id) === String(selectedOrderId)
      ) || orders[0]
    );
  }, [orders, selectedOrderId]);

  // =========================================================
  // PAYMENT METHOD
  // =========================================================

  const getPaymentMethod = (order) => {
    const method =
      order?.paymentMethod
        ?.toString()
        .trim()
        .toUpperCase() || "";

    if (method === "RAZORPAY") {
      return "RAZORPAY";
    }

    if (method === "COD") {
      return "COD";
    }

    return method;
  };

  // =========================================================
  // PAYMENT STATUS
  // =========================================================

  const getPaymentStatus = (order) => {
    const status =
      order?.paymentStatus
        ?.toString()
        .trim()
        .toUpperCase() || "";

    if (
      status === "SUCCESS" ||
      status === "PAID" ||
      status === "COMPLETED"
    ) {
      return "SUCCESS";
    }

    if (
      status === "FAILED" ||
      status === "FAILURE" ||
      status === "CANCELLED" ||
      status === "CANCELED"
    ) {
      return "FAILED";
    }

    return "PENDING";
  };

  // =========================================================
  // ORDER STATUS NORMALIZATION
  // =========================================================

  const normalizeOrderStatus = (order) => {
    const rawStatus =
      order?.orderStatus ||
      order?.status ||
      "";

    return rawStatus
      .toString()
      .trim()
      .toUpperCase()
      .replace(/[\s-]+/g, "_");
  };

  // =========================================================
  // TRACKING STATUS
  // =========================================================

  const getTrackingStatus = (order) => {
    const status = normalizeOrderStatus(order);

    /*
     * Supports common backend values:
     *
     * PLACED
     * CONFIRMED
     * PROCESSING
     * PACKED
     * SHIPPED
     * OUT_FOR_DELIVERY
     * DELIVERED
     * CANCELLED
     * FAILED
     */

    if (
      status === "CANCELLED" ||
      status === "CANCELED"
    ) {
      return {
        key: "cancelled",
        label: "Order Cancelled",
        description:
          "This order has been cancelled.",
        color: "red",
        icon: "✕",
      };
    }

    if (
      status === "FAILED" ||
      status === "PAYMENT_FAILED"
    ) {
      return {
        key: "failed",
        label: "Order Failed",
        description:
          "There was a problem processing this order.",
        color: "red",
        icon: "!",
      };
    }

    if (status === "DELIVERED") {
      return {
        key: "delivered",
        label: "Delivered",
        description:
          "Your order has been delivered successfully.",
        color: "green",
        icon: "✓",
      };
    }

    if (
      status === "OUT_FOR_DELIVERY" ||
      status === "OUTFORDELIVERY"
    ) {
      return {
        key: "out_for_delivery",
        label: "Out for Delivery",
        description:
          "Your order is on the way and should arrive soon.",
        color: "blue",
        icon: "🚚",
      };
    }

    if (status === "SHIPPED") {
      return {
        key: "shipped",
        label: "Shipped",
        description:
          "Your order has been shipped by the courier.",
        color: "blue",
        icon: "📦",
      };
    }

    if (status === "PACKED") {
      return {
        key: "packed",
        label: "Packed",
        description:
          "Your order has been packed and is ready for dispatch.",
        color: "purple",
        icon: "📦",
      };
    }

    if (
      status === "CONFIRMED" ||
      status === "CONFIRM"
    ) {
      return {
        key: "confirmed",
        label: "Order Confirmed",
        description:
          "Your order has been confirmed.",
        color: "green",
        icon: "✓",
      };
    }

    if (
      status === "PROCESSING" ||
      status === "PROCESS"
    ) {
      return {
        key: "processing",
        label: "Processing",
        description:
          "Your order is being prepared.",
        color: "purple",
        icon: "⚙",
      };
    }

    return {
      key: "placed",
      label: "Order Placed",
      description:
        "Your order has been placed successfully.",
      color: "green",
      icon: "✓",
    };
  };

  // =========================================================
  // STATUS STEP
  // =========================================================

  const getStatusStep = (order) => {
    const status = normalizeOrderStatus(order);

    if (
      status === "CANCELLED" ||
      status === "CANCELED" ||
      status === "FAILED" ||
      status === "PAYMENT_FAILED"
    ) {
      return -1;
    }

    if (status === "DELIVERED") {
      return 5;
    }

    if (
      status === "OUT_FOR_DELIVERY" ||
      status === "OUTFORDELIVERY"
    ) {
      return 4;
    }

    if (status === "SHIPPED") {
      return 3;
    }

    if (status === "PACKED") {
      return 2;
    }

    if (
      status === "PROCESSING" ||
      status === "PROCESS"
    ) {
      return 1;
    }

    if (
      status === "CONFIRMED" ||
      status === "CONFIRM"
    ) {
      return 1;
    }

    return 0;
  };

  // =========================================================
  // ORDER NUMBER
  // =========================================================

  const getDisplayOrderNumber = (order) => {
    if (order?.orderNumber) {
      return `#${String(order.orderNumber).replace(
        /^#/,
        ""
      )}`;
    }

    if (order?.id) {
      return `#ORD-${String(order.id).padStart(4, "0")}`;
    }

    return "#N/A";
  };

  // =========================================================
  // DATE
  // =========================================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "N/A";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "N/A";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================================
  // DATE + TIME
  // =========================================================

  const formatDateTime = (dateValue) => {
    if (!dateValue) {
      return "N/A";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "N/A";
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================================================
  // AMOUNT
  // =========================================================

  const formatAmount = (amount) => {
    const value = Number(amount || 0);

    return value.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // =========================================================
  // SHIPPING INFO
  // =========================================================

  const getCourierName = (order) => {
    return (
      order?.courierName ||
      order?.courier ||
      order?.shippingCourier ||
      ""
    );
  };

  const getTrackingNumber = (order) => {
    return (
      order?.trackingNumber ||
      order?.trackingId ||
      order?.shipmentTrackingNumber ||
      ""
    );
  };

  const getTrackingUrl = (order) => {
    return (
      order?.trackingUrl ||
      order?.trackingLink ||
      order?.shipmentTrackingUrl ||
      ""
    );
  };

  // =========================================================
  // SHIPPING ADDRESS
  // =========================================================

  const getShippingAddress = (order) => {
    if (order?.shippingAddress) {
      if (typeof order.shippingAddress === "string") {
        return order.shippingAddress;
      }

      const address = order.shippingAddress;

      return [
        address?.addressLine1,
        address?.addressLine2,
        address?.street,
        address?.city,
        address?.state,
        address?.postalCode ||
          address?.pincode ||
          address?.zipCode,
        address?.country,
      ]
        .filter(Boolean)
        .join(", ");
    }

    return [
      order?.address,
      order?.city,
      order?.state,
      order?.pincode ||
        order?.postalCode ||
        order?.zipCode,
    ]
      .filter(Boolean)
      .join(", ");
  };

  // =========================================================
  // ITEMS
  // =========================================================

  const getOrderItems = (order) => {
    if (Array.isArray(order?.items)) {
      return order.items;
    }

    if (Array.isArray(order?.orderItems)) {
      return order.orderItems;
    }

    if (Array.isArray(order?.products)) {
      return order.products;
    }

    return [];
  };

  // =========================================================
  // ITEM NAME
  // =========================================================

  const getItemName = (item) => {
    return (
      item?.productName ||
      item?.name ||
      item?.title ||
      item?.product?.name ||
      item?.product?.title ||
      "Product"
    );
  };

  // =========================================================
  // ITEM QUANTITY
  // =========================================================

  const getItemQuantity = (item) => {
    return Number(
      item?.quantity ||
        item?.qty ||
        item?.productQuantity ||
        1
    );
  };

  // =========================================================
  // REFRESH
  // =========================================================

  const handleRefresh = () => {
    fetchOrders(true);
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="track-page">
        <div className="track-loading">
          <div className="track-spinner"></div>
          <p>Loading your order tracking...</p>
        </div>

        <style>{`
          .track-page {
            min-height: 100vh;
            padding: 50px 20px;
            background:
              radial-gradient(
                circle at 10% 10%,
                rgba(99, 102, 241, 0.08),
                transparent 30%
              ),
              radial-gradient(
                circle at 90% 90%,
                rgba(124, 58, 237, 0.08),
                transparent 30%
              ),
              linear-gradient(
                180deg,
                #f8fafc 0%,
                #f1f5f9 100%
              );
          }

          .track-loading {
            min-height: 65vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #64748b;
          }

          .track-loading p {
            margin-top: 16px;
            font-size: 14px;
            font-weight: 600;
          }

          .track-spinner {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            border: 3px solid #e2e8f0;
            border-top-color: #4f46e5;
            border-right-color: #7c3aed;
            animation: trackSpin 0.8s linear infinite;
          }

          @keyframes trackSpin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error && !selectedOrder) {
    return (
      <div className="track-page">
        <div className="track-container">
          <div className="track-error">
            <div className="error-icon">!</div>

            <h2>Unable to load orders</h2>

            <p>{error}</p>

            <button
              type="button"
              className="primary-button"
              onClick={() => fetchOrders(false)}
            >
              Try Again
            </button>
          </div>
        </div>

        <style>{`
          .track-page {
            min-height: 100vh;
            padding: 48px 20px 70px;
            background:
              linear-gradient(
                180deg,
                #f8fafc 0%,
                #f1f5f9 100%
              );
          }

          .track-container {
            width: 100%;
            max-width: 1000px;
            margin: 0 auto;
          }

          .track-error {
            margin-top: 60px;
            padding: 60px 25px;
            text-align: center;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 20px;
            box-shadow: 0 20px 50px rgba(15, 23, 42, 0.06);
          }

          .error-icon {
            width: 60px;
            height: 60px;
            margin: 0 auto 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: #fef2f2;
            color: #dc2626;
            font-size: 24px;
            font-weight: 900;
          }

          .track-error h2 {
            margin: 0 0 8px;
            color: #1e293b;
          }

          .track-error p {
            margin: 0 auto 22px;
            max-width: 500px;
            color: #64748b;
            font-size: 14px;
          }

          .primary-button {
            border: 0;
            border-radius: 10px;
            padding: 11px 20px;
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            color: white;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }

  // =========================================================
  // NO ORDERS
  // =========================================================

  if (!selectedOrder) {
    return (
      <div className="track-page">
        <div className="track-container">
          <div className="empty-track">
            <div className="empty-track-icon">📦</div>

            <h2>No orders to track</h2>

            <p>
              You haven't placed any orders yet.
            </p>
          </div>
        </div>

        <style>{`
          .track-page {
            min-height: 100vh;
            padding: 48px 20px 70px;
            background:
              radial-gradient(
                circle at 0% 0%,
                rgba(99, 102, 241, 0.08),
                transparent 30%
              ),
              linear-gradient(
                180deg,
                #f8fafc,
                #f1f5f9
              );
          }

          .track-container {
            max-width: 1000px;
            margin: 0 auto;
          }

          .empty-track {
            margin-top: 50px;
            padding: 80px 25px;
            text-align: center;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 20px;
            box-shadow: 0 20px 50px rgba(15, 23, 42, 0.06);
          }

          .empty-track-icon {
            width: 76px;
            height: 76px;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 22px;
            background: #eef2ff;
            font-size: 34px;
          }

          .empty-track h2 {
            margin: 0 0 8px;
            color: #1e293b;
          }

          .empty-track p {
            margin: 0;
            color: #94a3b8;
            font-size: 14px;
          }
        `}</style>
      </div>
    );
  }

  // =========================================================
  // SELECTED ORDER DATA
  // =========================================================

  const trackingStatus = getTrackingStatus(selectedOrder);
  const statusStep = getStatusStep(selectedOrder);

  const paymentMethod = getPaymentMethod(selectedOrder);
  const paymentStatus = getPaymentStatus(selectedOrder);

  const courierName = getCourierName(selectedOrder);
  const trackingNumber = getTrackingNumber(selectedOrder);
  const trackingUrl = getTrackingUrl(selectedOrder);

  const shippingAddress = getShippingAddress(selectedOrder);
  const orderItems = getOrderItems(selectedOrder);

  const orderDate =
    selectedOrder?.orderDate ||
    selectedOrder?.createdAt ||
    selectedOrder?.createdDate;

  const statusDate =
    selectedOrder?.updatedAt ||
    selectedOrder?.statusUpdatedAt ||
    orderDate;

  const steps = [
    {
      title: "Order Placed",
      description: "Your order was placed successfully.",
      icon: "✓",
    },
    {
      title: "Processing",
      description: "Your order is being prepared.",
      icon: "⚙",
    },
    {
      title: "Packed",
      description: "Your package has been packed.",
      icon: "📦",
    },
    {
      title: "Shipped",
      description: "Your package is with the courier.",
      icon: "🚚",
    },
    {
      title: "Out for Delivery",
      description: "Your package is on the way.",
      icon: "🛵",
    },
    {
      title: "Delivered",
      description: "Your order has been delivered.",
      icon: "✓",
    },
  ];

  return (
    <div className="track-page">
      <div className="track-container">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="track-header">
          <div className="track-heading">
            <div className="track-main-icon">
              🚚
            </div>

            <div>
              <h1>Track Order</h1>

              <p>
                Follow your order from placement to delivery
              </p>
            </div>
          </div>

          <button
            type="button"
            className="refresh-button"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <span
              className={
                refreshing
                  ? "refresh-icon spinning"
                  : "refresh-icon"
              }
            >
              ↻
            </span>

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>
        </div>

        {/* ===================================================
            ORDER SELECTOR
        =================================================== */}

        {orders.length > 1 && (
          <div className="order-selector-card">
            <div>
              <span className="selector-label">
                SELECT ORDER
              </span>

              <strong>
                Choose an order to track
              </strong>
            </div>

            <select
              value={selectedOrderId}
              onChange={(event) =>
                setSelectedOrderId(event.target.value)
              }
              className="order-select"
            >
              {orders.map((order) => (
                <option
                  key={
                    order?.id ||
                    order?.orderNumber
                  }
                  value={order?.id}
                >
                  {getDisplayOrderNumber(order)}
                  {" — "}
                  ₹
                  {formatAmount(
                    order?.totalAmount
                  )}
                  {" — "}
                  {formatDate(
                    order?.orderDate
                  )}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ===================================================
            ORDER SUMMARY
        =================================================== */}

        <div className="summary-card">

          <div className="summary-left">
            <div className="summary-package-icon">
              📦
            </div>

            <div>
              <span className="summary-label">
                ORDER NUMBER
              </span>

              <h2>
                {getDisplayOrderNumber(
                  selectedOrder
                )}
              </h2>

              <p>
                Placed on{" "}
                <strong>
                  {formatDateTime(orderDate)}
                </strong>
              </p>
            </div>
          </div>

          <div className="summary-right">
            <span className="summary-label">
              ORDER TOTAL
            </span>

            <strong className="summary-total">
              ₹
              {formatAmount(
                selectedOrder?.totalAmount
              )}
            </strong>
          </div>

        </div>

        {/* ===================================================
            CURRENT STATUS
        =================================================== */}

        <div className="current-status-card">

          <div
            className={`current-status-icon ${trackingStatus.color}`}
          >
            {trackingStatus.icon}
          </div>

          <div className="current-status-content">
            <span className="current-status-label">
              CURRENT STATUS
            </span>

            <h2>
              {trackingStatus.label}
            </h2>

            <p>
              {trackingStatus.description}
            </p>

            {statusDate && (
              <small>
                Last updated:{" "}
                {formatDateTime(statusDate)}
              </small>
            )}
          </div>

        </div>

        {/* ===================================================
            TRACKING TIMELINE
        =================================================== */}

        {trackingStatus.key !== "cancelled" &&
          trackingStatus.key !== "failed" && (
            <div className="tracking-card">

              <div className="section-heading">
                <div>
                  <span className="section-eyebrow">
                    ORDER JOURNEY
                  </span>

                  <h2>
                    Shipment Progress
                  </h2>
                </div>

                <span className="progress-count">
                  {statusStep >= 0
                    ? `${Math.min(
                        statusStep + 1,
                        steps.length
                      )}/${steps.length}`
                    : "—"}
                </span>
              </div>

              <div className="timeline">

                {steps.map((step, index) => {

                  const completed =
                    statusStep >= index;

                  const active =
                    statusStep === index;

                  return (
                    <div
                      key={step.title}
                      className={`timeline-item ${
                        completed
                          ? "completed"
                          : ""
                      } ${
                        active
                          ? "active"
                          : ""
                      }`}
                    >

                      <div className="timeline-marker">
                        {completed
                          ? index ===
                            steps.length - 1
                            ? "✓"
                            : step.icon
                          : index + 1}
                      </div>

                      {index <
                        steps.length - 1 && (
                        <div
                          className={`timeline-line ${
                            statusStep >
                            index
                              ? "filled"
                              : ""
                          }`}
                        />
                      )}

                      <div className="timeline-content">

                        <strong>
                          {step.title}
                        </strong>

                        <span>
                          {step.description}
                        </span>

                        {active && (
                          <small>
                            Current status
                          </small>
                        )}

                      </div>

                    </div>
                  );
                })}

              </div>
            </div>
          )}

        {/* ===================================================
            CANCELLED / FAILED
        =================================================== */}

        {(trackingStatus.key ===
          "cancelled" ||
          trackingStatus.key ===
            "failed") && (
          <div className="special-status-card">

            <div className="special-icon">
              {trackingStatus.icon}
            </div>

            <div>
              <h3>
                {trackingStatus.label}
              </h3>

              <p>
                {trackingStatus.description}
              </p>
            </div>

          </div>
        )}

        {/* ===================================================
            SHIPPING / COURIER
        =================================================== */}

        <div className="information-grid">

          <div className="info-card">

            <div className="info-card-header">
              <div className="info-icon blue">
                🚚
              </div>

              <div>
                <span>
                  SHIPPING
                </span>

                <h3>
                  Courier Details
                </h3>
              </div>
            </div>

            {courierName ||
            trackingNumber ||
            trackingUrl ? (
              <div className="courier-details">

                {courierName && (
                  <div className="detail-row">
                    <span>
                      Courier
                    </span>

                    <strong>
                      {courierName}
                    </strong>
                  </div>
                )}

                {trackingNumber && (
                  <div className="detail-row">
                    <span>
                      Tracking Number
                    </span>

                    <strong className="tracking-number">
                      {trackingNumber}
                    </strong>
                  </div>
                )}

                {trackingUrl && (
                  <a
                    href={trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="track-courier-button"
                  >
                    Track on Courier Website
                    <span>↗</span>
                  </a>
                )}

              </div>
            ) : (
              <div className="not-available">
                <span>⏳</span>

                <p>
                  Courier and tracking
                  information will appear
                  here after your order
                  is shipped.
                </p>
              </div>
            )}

          </div>

          {/* =================================================
              PAYMENT
          ================================================= */}

          <div className="info-card">

            <div className="info-card-header">
              <div className="info-icon purple">
                💳
              </div>

              <div>
                <span>
                  PAYMENT
                </span>

                <h3>
                  Payment Details
                </h3>
              </div>
            </div>

            <div className="payment-details">

              <div className="detail-row">
                <span>
                  Method
                </span>

                <strong>
                  {paymentMethod ===
                  "RAZORPAY"
                    ? "Razorpay"
                    : paymentMethod ===
                      "COD"
                    ? "Cash on Delivery"
                    : paymentMethod ||
                      "N/A"}
                </strong>
              </div>

              <div className="detail-row">
                <span>
                  Status
                </span>

                <strong
                  className={`payment-status ${paymentStatus.toLowerCase()}`}
                >
                  {paymentStatus ===
                  "SUCCESS"
                    ? "✓ Paid"
                    : paymentStatus ===
                      "FAILED"
                    ? "✕ Failed"
                    : "⏳ Pending"}
                </strong>
              </div>

              {selectedOrder?.razorpayOrderId &&
                paymentMethod ===
                  "RAZORPAY" && (
                  <div className="detail-row">
                    <span>
                      Razorpay Order
                    </span>

                    <strong className="small-value">
                      {
                        selectedOrder.razorpayOrderId
                      }
                    </strong>
                  </div>
                )}

            </div>

          </div>

        </div>

        {/* ===================================================
            SHIPPING ADDRESS
        =================================================== */}

        {shippingAddress && (
          <div className="address-card">

            <div className="address-icon">
              📍
            </div>

            <div>
              <span className="section-eyebrow">
                DELIVERY ADDRESS
              </span>

              <h3>
                Shipping Address
              </h3>

              <p>
                {shippingAddress}
              </p>
            </div>

          </div>
        )}

        {/* ===================================================
            ORDER ITEMS
        =================================================== */}

        {orderItems.length > 0 && (
          <div className="items-card">

            <div className="section-heading">
              <div>
                <span className="section-eyebrow">
                  ORDER CONTENTS
                </span>

                <h2>
                  Items in this order
                </h2>
              </div>

              <span className="items-count">
                {orderItems.length}
                {" "}
                {orderItems.length === 1
                  ? "Item"
                  : "Items"}
              </span>
            </div>

            <div className="items-list">

              {orderItems.map(
                (item, index) => (
                  <div
                    className="item-row"
                    key={
                      item?.id ||
                      item?.productId ||
                      index
                    }
                  >

                    <div className="item-image">
                      {item?.image ||
                      item?.imageUrl ||
                      item?.product
                        ?.image ? (
                        <img
                          src={
                            item?.image ||
                            item?.imageUrl ||
                            item?.product
                              ?.image
                          }
                          alt={getItemName(
                            item
                          )}
                        />
                      ) : (
                        <span>
                          📦
                        </span>
                      )}
                    </div>

                    <div className="item-info">
                      <strong>
                        {getItemName(
                          item
                        )}
                      </strong>

                      <span>
                        Quantity:{" "}
                        {getItemQuantity(
                          item
                        )}
                      </span>
                    </div>

                    <div className="item-price">
                      ₹
                      {formatAmount(
                        item?.totalPrice ||
                          item?.subtotal ||
                          item?.price ||
                          0
                      )}
                    </div>

                  </div>
                )
              )}

            </div>
          </div>
        )}

        {/* ===================================================
            FOOTER MESSAGE
        =================================================== */}

        <div className="track-footer">
          <span>🔒</span>

          <p>
            Your order information is securely
            retrieved from your account.
          </p>
        </div>

      </div>

      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .track-page {
          min-height: 100vh;
          padding: 48px 20px 70px;

          background:
            radial-gradient(
              circle at 0% 0%,
              rgba(99, 102, 241, 0.09),
              transparent 30%
            ),
            radial-gradient(
              circle at 100% 100%,
              rgba(124, 58, 237, 0.08),
              transparent 30%
            ),
            linear-gradient(
              180deg,
              #f8fafc 0%,
              #f1f5f9 100%
            );
        }

        .track-container {
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
        }

        /* ===================================================
           HEADER
        =================================================== */

        .track-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 24px;
        }

        .track-heading {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .track-main-icon {
          width: 56px;
          height: 56px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 17px;

          font-size: 25px;

          background:
            linear-gradient(
              135deg,
              #4f46e5,
              #7c3aed
            );

          box-shadow:
            0 12px 28px
            rgba(79, 70, 229, 0.25);
        }

        .track-header h1 {
          margin: 0;
          color: #0f172a;
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.7px;
        }

        .track-header p {
          margin: 4px 0 0;
          color: #64748b;
          font-size: 13px;
        }

        .refresh-button {
          border: 1px solid #e2e8f0;
          background: white;
          color: #475569;

          padding: 10px 14px;
          border-radius: 10px;

          font-size: 12px;
          font-weight: 700;

          display: flex;
          align-items: center;
          gap: 7px;

          cursor: pointer;

          transition: all 0.2s ease;

          box-shadow:
            0 5px 15px
            rgba(15, 23, 42, 0.05);
        }

        .refresh-button:hover:not(:disabled) {
          color: #4f46e5;
          border-color: #c7d2fe;
          background: #eef2ff;
        }

        .refresh-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .refresh-icon {
          font-size: 17px;
          line-height: 1;
        }

        .refresh-icon.spinning {
          animation:
            refreshSpin 0.8s
            linear infinite;
        }

        @keyframes refreshSpin {
          to {
            transform: rotate(360deg);
          }
        }

        /* ===================================================
           ORDER SELECTOR
        =================================================== */

        .order-selector-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;

          margin-bottom: 18px;
          padding: 15px 17px;

          background: white;

          border: 1px solid #e2e8f0;
          border-radius: 15px;

          box-shadow:
            0 8px 25px
            rgba(15, 23, 42, 0.04);
        }

        .selector-label {
          display: block;
          margin-bottom: 4px;
          color: #94a3b8;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.8px;
        }

        .order-selector-card strong {
          color: #334155;
          font-size: 13px;
        }

        .order-select {
          min-width: 280px;

          padding: 10px 12px;

          border: 1px solid #cbd5e1;
          border-radius: 9px;

          background: #f8fafc;

          color: #334155;

          font-size: 12px;
          font-weight: 600;

          outline: none;

          cursor: pointer;
        }

        .order-select:focus {
          border-color: #818cf8;

          box-shadow:
            0 0 0 3px
            rgba(99, 102, 241, 0.1);
        }

        /* ===================================================
           SUMMARY
        =================================================== */

        .summary-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;

          padding: 22px;

          margin-bottom: 16px;

          border-radius: 18px;

          background:
            linear-gradient(
              135deg,
              #111827,
              #1e293b
            );

          color: white;

          box-shadow:
            0 20px 45px
            rgba(15, 23, 42, 0.14);
        }

        .summary-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .summary-package-icon {
          width: 48px;
          height: 48px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 13px;

          background:
            rgba(255,255,255,0.1);

          font-size: 21px;
        }

        .summary-label {
          display: block;

          color: #94a3b8;

          font-size: 9px;
          font-weight: 800;

          letter-spacing: 0.8px;
        }

        .summary-card h2 {
          margin: 4px 0;

          color: white;

          font-size: 18px;
          font-weight: 800;
        }

        .summary-card p {
          margin: 0;

          color: #94a3b8;

          font-size: 11px;
        }

        .summary-card p strong {
          color: #cbd5e1;
        }

        .summary-right {
          text-align: right;
        }

        .summary-total {
          display: block;

          margin-top: 4px;

          color: white;

          font-size: 22px;
          font-weight: 800;
        }

        /* ===================================================
           CURRENT STATUS
        =================================================== */

        .current-status-card {
          display: flex;
          align-items: center;
          gap: 15px;

          margin-bottom: 16px;

          padding: 20px;

          background: white;

          border: 1px solid #e2e8f0;
          border-radius: 18px;

          box-shadow:
            0 10px 30px
            rgba(15, 23, 42, 0.05);
        }

        .current-status-icon {
          width: 52px;
          height: 52px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 15px;

          font-size: 21px;
        }

        .current-status-icon.green {
          color: #15803d;
          background: #dcfce7;
        }

        .current-status-icon.blue {
          color: #1d4ed8;
          background: #dbeafe;
        }

        .current-status-icon.purple {
          color: #6d28d9;
          background: #ede9fe;
        }

        .current-status-icon.red {
          color: #dc2626;
          background: #fee2e2;
        }

        .current-status-content {
          min-width: 0;
        }

        .current-status-label {
          color: #94a3b8;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.8px;
        }

        .current-status-content h2 {
          margin: 3px 0;

          color: #1e293b;

          font-size: 18px;
          font-weight: 800;
        }

        .current-status-content p {
          margin: 0;

          color: #64748b;

          font-size: 12px;
        }

        .current-status-content small {
          display: block;

          margin-top: 5px;

          color: #94a3b8;

          font-size: 10px;
        }

        /* ===================================================
           COMMON CARD
        =================================================== */

        .tracking-card,
        .info-card,
        .address-card,
        .items-card {
          background: white;

          border: 1px solid #e2e8f0;
          border-radius: 18px;

          box-shadow:
            0 10px 30px
            rgba(15, 23, 42, 0.05);
        }

        .tracking-card {
          margin-bottom: 16px;
          padding: 22px;
        }

        .section-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 15px;

          margin-bottom: 22px;
        }

        .section-eyebrow {
          display: block;

          color: #94a3b8;

          font-size: 9px;
          font-weight: 800;

          letter-spacing: 0.8px;
        }

        .section-heading h2 {
          margin: 4px 0 0;

          color: #1e293b;

          font-size: 17px;
          font-weight: 800;
        }

        .progress-count,
        .items-count {
          padding: 6px 10px;

          border-radius: 20px;

          color: #4f46e5;

          background: #eef2ff;

          font-size: 10px;
          font-weight: 800;
        }

        /* ===================================================
           TIMELINE
        =================================================== */

        .timeline {
          position: relative;

          display: flex;
          justify-content: space-between;

          gap: 8px;

          padding: 5px 0;
        }

        .timeline-item {
          position: relative;

          flex: 1;

          display: flex;
          flex-direction: column;
          align-items: center;

          text-align: center;
        }

        .timeline-marker {
          position: relative;
          z-index: 3;

          width: 38px;
          height: 38px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          color: #94a3b8;

          background: #f1f5f9;

          border: 3px solid white;

          box-shadow:
            0 0 0 1px #e2e8f0;

          font-size: 12px;
          font-weight: 800;
        }

        .timeline-item.completed
          .timeline-marker {
          color: white;

          background:
            linear-gradient(
              135deg,
              #4f46e5,
              #7c3aed
            );

          box-shadow:
            0 0 0 1px #6366f1,
            0 5px 15px
            rgba(79, 70, 229, 0.2);
        }

        .timeline-item.active
          .timeline-marker {
          box-shadow:
            0 0 0 4px
            rgba(99, 102, 241, 0.13),
            0 0 0 1px #6366f1;
        }

        .timeline-line {
          position: absolute;

          z-index: 1;

          top: 18px;
          left: calc(50% + 19px);

          width: calc(100% - 38px);

          height: 3px;

          background: #e2e8f0;
        }

        .timeline-line.filled {
          background:
            linear-gradient(
              90deg,
              #4f46e5,
              #7c3aed
            );
        }

        .timeline-content {
          margin-top: 10px;

          display: flex;
          flex-direction: column;

          align-items: center;
        }

        .timeline-content strong {
          color: #334155;

          font-size: 11px;
          font-weight: 800;
        }

        .timeline-content span {
          max-width: 130px;

          margin-top: 4px;

          color: #94a3b8;

          font-size: 9px;
          line-height: 1.4;
        }

        .timeline-content small {
          margin-top: 5px;

          color: #4f46e5;

          font-size: 9px;
          font-weight: 800;
        }

        /* ===================================================
           SPECIAL STATUS
        =================================================== */

        .special-status-card {
          display: flex;
          align-items: center;
          gap: 14px;

          margin-bottom: 16px;
          padding: 20px;

          border: 1px solid #fecaca;
          border-radius: 18px;

          background: #fef2f2;
        }

        .special-icon {
          width: 45px;
          height: 45px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          border-radius: 13px;

          color: #dc2626;
          background: #fee2e2;

          font-weight: 900;
        }

        .special-status-card h3 {
          margin: 0 0 4px;

          color: #991b1b;

          font-size: 15px;
        }

        .special-status-card p {
          margin: 0;

          color: #b91c1c;

          font-size: 12px;
        }

        /* ===================================================
           INFORMATION GRID
        =================================================== */

        .information-grid {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 16px;

          margin-bottom: 16px;
        }

        .info-card {
          padding: 20px;
        }

        .info-card-header {
          display: flex;
          align-items: center;
          gap: 11px;

          margin-bottom: 18px;
        }

        .info-icon {
          width: 40px;
          height: 40px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 11px;

          font-size: 17px;
        }

        .info-icon.blue {
          background: #eff6ff;
        }

        .info-icon.purple {
          background: #f5f3ff;
        }

        .info-card-header span {
          display: block;

          color: #94a3b8;

          font-size: 8px;
          font-weight: 800;

          letter-spacing: 0.8px;
        }

        .info-card-header h3 {
          margin: 3px 0 0;

          color: #1e293b;

          font-size: 14px;
          font-weight: 800;
        }

        /* ===================================================
           DETAIL ROW
        =================================================== */

        .detail-row {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 15px;

          padding: 10px 0;

          border-bottom:
            1px solid #f1f5f9;
        }

        .detail-row:last-child {
          border-bottom: 0;
        }

        .detail-row span {
          color: #94a3b8;

          font-size: 11px;
        }

        .detail-row strong {
          color: #334155;

          font-size: 11px;

          text-align: right;
        }

        .tracking-number {
          color: #4f46e5 !important;
        }

        .small-value {
          max-width: 170px;

          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;
        }

        /* ===================================================
           TRACK COURIER BUTTON
        =================================================== */

        .track-courier-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;

          margin-top: 14px;

          padding: 10px 13px;

          border-radius: 9px;

          color: white;

          background:
            linear-gradient(
              135deg,
              #4f46e5,
              #7c3aed
            );

          text-decoration: none;

          font-size: 11px;
          font-weight: 800;

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .track-courier-button:hover {
          transform: translateY(-1px);

          box-shadow:
            0 8px 18px
            rgba(79, 70, 229, 0.2);
        }

        /* ===================================================
           NOT AVAILABLE
        =================================================== */

        .not-available {
          display: flex;
          align-items: flex-start;
          gap: 10px;

          padding: 13px;

          border-radius: 11px;

          background: #fffbeb;

          border: 1px solid #fde68a;
        }

        .not-available span {
          font-size: 15px;
        }

        .not-available p {
          margin: 0;

          color: #92400e;

          font-size: 11px;

          line-height: 1.5;
        }

        /* ===================================================
           PAYMENT
        =================================================== */

        .payment-status.success {
          color: #16a34a !important;
        }

        .payment-status.pending {
          color: #d97706 !important;
        }

        .payment-status.failed {
          color: #dc2626 !important;
        }

        /* ===================================================
           ADDRESS
        =================================================== */

        .address-card {
          display: flex;
          align-items: flex-start;
          gap: 13px;

          margin-bottom: 16px;

          padding: 20px;
        }

        .address-icon {
          width: 42px;
          height: 42px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 12px;

          background: #fef2f2;

          font-size: 18px;
        }

        .address-card h3 {
          margin: 4px 0 5px;

          color: #1e293b;

          font-size: 14px;
        }

        .address-card p {
          margin: 0;

          color: #64748b;

          font-size: 12px;

          line-height: 1.6;
        }

        /* ===================================================
           ITEMS
        =================================================== */

        .items-card {
          margin-bottom: 16px;

          padding: 20px;
        }

        .items-list {
          border-top:
            1px solid #f1f5f9;
        }

        .item-row {
          display: flex;
          align-items: center;

          gap: 13px;

          padding: 13px 0;

          border-bottom:
            1px solid #f1f5f9;
        }

        .item-row:last-child {
          border-bottom: 0;
        }

        .item-image {
          width: 50px;
          height: 50px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          overflow: hidden;

          border-radius: 11px;

          background: #f8fafc;

          border: 1px solid #e2e8f0;

          font-size: 19px;
        }

        .item-image img {
          width: 100%;
          height: 100%;

          object-fit: cover;
        }

        .item-info {
          flex: 1;

          min-width: 0;

          display: flex;
          flex-direction: column;

          gap: 4px;
        }

        .item-info strong {
          color: #334155;

          font-size: 12px;

          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .item-info span {
          color: #94a3b8;

          font-size: 10px;
        }

        .item-price {
          color: #0f172a;

          font-size: 12px;
          font-weight: 800;

          white-space: nowrap;
        }

        /* ===================================================
           FOOTER
        =================================================== */

        .track-footer {
          display: flex;
          align-items: center;
          justify-content: center;

          gap: 7px;

          padding: 12px;

          color: #94a3b8;

          font-size: 10px;
        }

        .track-footer p {
          margin: 0;
        }

        /* ===================================================
           RESPONSIVE
        =================================================== */

        @media (max-width: 768px) {

          .track-page {
            padding:
              30px 14px 50px;
          }

          .track-header {
            align-items: flex-start;
          }

          .track-header h1 {
            font-size: 23px;
          }

          .track-main-icon {
            width: 46px;
            height: 46px;

            border-radius: 13px;

            font-size: 21px;
          }

          .order-selector-card {
            flex-direction: column;
            align-items: stretch;
          }

          .order-select {
            width: 100%;
            min-width: 0;
          }

          .summary-card {
            align-items: flex-start;
            flex-direction: column;
          }

          .summary-right {
            width: 100%;
            padding-top: 14px;

            text-align: left;

            border-top:
              1px solid
              rgba(255,255,255,0.1);
          }

          .timeline {
            display: block;
          }

          .timeline-item {
            min-height: 67px;

            display: grid;

            grid-template-columns:
              38px 1fr;

            gap: 13px;

            align-items: start;

            text-align: left;
          }

          .timeline-marker {
            grid-column: 1;
          }

          .timeline-line {
            top: 38px;
            left: 17px;

            width: 3px;
            height: 29px;
          }

          .timeline-content {
            margin-top: 2px;

            align-items: flex-start;
          }

          .timeline-content span {
            max-width: none;
          }

          .information-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 576px) {

          .track-header {
            gap: 10px;
          }

          .track-header p {
            font-size: 11px;
          }

          .refresh-button {
            padding: 8px 10px;
            font-size: 11px;
          }

          .refresh-button .refresh-icon {
            font-size: 15px;
          }

          .summary-card {
            padding: 17px;
          }

          .tracking-card,
          .info-card,
          .address-card,
          .items-card {
            padding: 16px;
            border-radius: 15px;
          }

          .current-status-card {
            padding: 16px;
          }

          .current-status-icon {
            width: 44px;
            height: 44px;
          }

          .summary-total {
            font-size: 19px;
          }

          .detail-row {
            align-items: flex-start;
          }

          .detail-row strong {
            max-width: 55%;
          }

          .track-footer {
            text-align: center;
          }
        }

      `}</style>
    </div>
  );
};

export default TrackOrder;