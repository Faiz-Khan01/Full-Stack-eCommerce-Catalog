// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import Swal from "sweetalert2";
// import api from "../services/api";
// import { useAuth } from "../context/AuthContext";
// import { generateInvoice } from "../utils/generateInvoice";

// const STATUS_STEPS = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED"];

// const getStatus = (status) => {
//   const normalized = (status || "PLACED").toUpperCase();

//   if (normalized === "PENDING") return "PLACED";
//   if (STATUS_STEPS.includes(normalized)) return normalized;

//   return "PLACED";
// };

// const getStepIndex = (status) => {
//   const normalized = getStatus(status);
//   return STATUS_STEPS.indexOf(normalized);
// };

// const formatDate = (date) => {
//   if (!date) return "N/A";

//   return new Date(date).toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// const formatDateTime = (date) => {
//   if (!date) return "";

//   return new Date(date).toLocaleString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// };

// const getStatusMeta = (status) => {
//   const normalized = getStatus(status);

//   const meta = {
//     PLACED: {
//       label: "Order Placed",
//       color: "#60a5fa",
//       bg: "rgba(96,165,250,.10)",
//       border: "rgba(96,165,250,.25)",
//       icon: "✓",
//     },
//     PROCESSING: {
//       label: "Processing",
//       color: "#fbbf24",
//       bg: "rgba(251,191,36,.10)",
//       border: "rgba(251,191,36,.25)",
//       icon: "⚙",
//     },
//     SHIPPED: {
//       label: "Shipped",
//       color: "#22d3ee",
//       bg: "rgba(34,211,238,.10)",
//       border: "rgba(34,211,238,.25)",
//       icon: "🚚",
//     },
//     DELIVERED: {
//       label: "Delivered",
//       color: "#34d399",
//       bg: "rgba(52,211,153,.10)",
//       border: "rgba(52,211,153,.25)",
//       icon: "✓",
//     },
//   };

//   return meta[normalized] || meta.PLACED;
// };

// const Orders = () => {
//   const { user, token } = useAuth();

//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrderTracking, setSelectedOrderTracking] = useState(null);
//   const [cancellingOrderId, setCancellingOrderId] = useState(null);

//   const fetchOrders = async () => {
//     if (!user?.email || !token) {
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await api.get(
//         `/orders/user/${encodeURIComponent(user.email)}`
//       );

//       const data = Array.isArray(res.data) ? res.data : [];

//       const sorted = [...data].sort((a, b) => {
//         const aId = Number(a.id || 0);
//         const bId = Number(b.id || 0);
//         return bId - aId;
//       });

//       setOrders(sorted);
//     } catch (error) {
//       console.error("Orders Fetch Error:", error);

//       Swal.fire({
//         icon: "error",
//         title: "Unable to load orders",
//         text:
//           error.response?.data?.message ||
//           "Something went wrong while loading your orders.",
//         background: "#111827",
//         color: "#fff",
//         confirmButtonColor: "#10b981",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, [user?.email, token]);

//   const handleCancelOrder = async (orderId) => {
//     const { value: reason } = await Swal.fire({
//       title: "Cancel this order?",
//       text: "This action cannot be undone.",
//       input: "select",
//       inputOptions: {
//         "Changed my mind": "Changed my mind",
//         "Found better price": "Found better price elsewhere",
//         "Ordered by mistake": "Ordered by mistake",
//         "Delay in delivery": "Delivery taking too long",
//         Other: "Other reason",
//       },
//       inputPlaceholder: "Select cancellation reason",
//       showCancelButton: true,
//       confirmButtonColor: "#ef4444",
//       cancelButtonColor: "#475569",
//       confirmButtonText: "Cancel Order",
//       background: "#111827",
//       color: "#fff",
//       inputValidator: (value) => {
//         if (!value) {
//           return "Please select a reason";
//         }
//       },
//     });

//     if (!reason) return;

//     try {
//       setCancellingOrderId(orderId);

//       await api.post(
//         `/orders/${orderId}/cancel?userEmail=${encodeURIComponent(
//           user.email
//         )}&reason=${encodeURIComponent(reason)}`
//       );

//       await Swal.fire({
//         icon: "success",
//         title: "Order Cancelled",
//         text: "Your cancellation request has been processed.",
//         timer: 1800,
//         showConfirmButton: false,
//         background: "#111827",
//         color: "#fff",
//       });

//       await fetchOrders();
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Cancellation Failed",
//         text:
//           error.response?.data?.message ||
//           error.message ||
//           "Failed to cancel order.",
//         background: "#111827",
//         color: "#fff",
//         confirmButtonColor: "#10b981",
//       });
//     } finally {
//       setCancellingOrderId(null);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="orders-premium-page orders-loading">
//         <div className="loading-orb">
//           <div className="loading-ring"></div>
//           <div className="loading-icon">📦</div>
//         </div>

//         <h5>Loading your orders</h5>
//         <p>Please wait while we fetch your latest purchases...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="orders-premium-page">
//       <div className="orders-container">

//         {/* HERO */}
//         <section className="orders-hero">
//           <div>
//             <div className="hero-eyebrow">
//               <span className="eyebrow-dot"></span>
//               YOUR SHOPPING ACTIVITY
//             </div>

//             <h1>
//               My Orders
//               <span>& Tracking</span>
//             </h1>

//             <p>
//               Manage your purchases, download invoices and follow every
//               delivery from checkout to doorstep.
//             </p>
//           </div>

//           <div className="orders-stat">
//             <div className="stat-icon">📦</div>

//             <div>
//               <strong>{orders.length}</strong>
//               <span>
//                 {orders.length === 1 ? "Order" : "Orders"} Placed
//               </span>
//             </div>
//           </div>
//         </section>

//         {/* EMPTY */}
//         {orders.length === 0 ? (
//           <div className="empty-order-card">
//             <div className="empty-bag">🛍️</div>

//             <h2>No orders yet</h2>

//             <p>
//               Your shopping journey starts here. Explore our collection
//               and place your first order.
//             </p>

//             <Link to="/" className="premium-primary-btn">
//               Explore Products
//               <span>→</span>
//             </Link>
//           </div>
//         ) : (
//           <div className="orders-list">

//             {orders.map((order) => {
//               const normalizedStatus = getStatus(order.orderStatus);
//               const currentStep = getStepIndex(order.orderStatus);

//               const isCancelled =
//                 (order.orderStatus || "").toUpperCase() === "CANCELLED";

//               const isDelivered = normalizedStatus === "DELIVERED";

//               const canCancel =
//                 !isCancelled &&
//                 !isDelivered &&
//                 ["PENDING", "PLACED", "PROCESSING"].includes(
//                   (order.orderStatus || "PLACED").toUpperCase()
//                 );

//               const statusMeta = getStatusMeta(order.orderStatus);

//               const hasShipping =
//                 normalizedStatus === "SHIPPED" ||
//                 normalizedStatus === "DELIVERED";

//               return (
//                 <article
//                   key={order.id}
//                   className={`premium-order-card ${
//                     isCancelled ? "order-cancelled" : ""
//                   }`}
//                 >
//                   {/* TOP HEADER */}
//                   <div className="premium-order-header">

//                     <div className="order-heading-left">
//                       <div className="order-number-icon">
//                         #
//                         {order.id}
//                       </div>

//                       <div>
//                         <div className="order-number">
//                           {order.orderNumber || `ORD-${order.id}`}
//                         </div>

//                         <div className="order-date">
//                           Placed on {formatDate(order.orderDate)}
//                         </div>
//                       </div>
//                     </div>

//                     <div className="order-heading-right">

//                       <div className="amount-box">
//                         <span>Total Amount</span>
//                         <strong>
//                           ₹
//                           {Number(order.totalAmount || 0).toLocaleString(
//                             "en-IN",
//                             {
//                               minimumFractionDigits: 2,
//                               maximumFractionDigits: 2,
//                             }
//                           )}
//                         </strong>
//                       </div>

//                       <button
//                         type="button"
//                         className="invoice-btn"
//                         onClick={() => generateInvoice(order)}
//                       >
//                         <span>📄</span>
//                         <span>Invoice</span>
//                       </button>

//                       {canCancel && (
//                         <button
//                           type="button"
//                           className="cancel-btn"
//                           onClick={() => handleCancelOrder(order.id)}
//                           disabled={cancellingOrderId === order.id}
//                         >
//                           {cancellingOrderId === order.id
//                             ? "Cancelling..."
//                             : "Cancel"}
//                         </button>
//                       )}
//                     </div>
//                   </div>

//                   {/* CANCELLED */}
//                   {isCancelled ? (
//                     <div className="cancelled-panel">
//                       <div className="cancelled-icon">×</div>

//                       <div>
//                         <strong>Order Cancelled</strong>

//                         <p>
//                           This order has been cancelled successfully.
//                         </p>

//                         <span>
//                           Payment Status:
//                           <b>{order.paymentStatus || "PENDING"}</b>
//                         </span>
//                       </div>
//                     </div>
//                   ) : (
//                     <>
//                       {/* STATUS */}
//                       <div className="status-section">

//                         <div className="status-section-top">
//                           <div>
//                             <span className="section-label">
//                               ORDER STATUS
//                             </span>

//                             <div
//                               className="live-status"
//                               style={{
//                                 color: statusMeta.color,
//                                 background: statusMeta.bg,
//                                 borderColor: statusMeta.border,
//                               }}
//                             >
//                               <span>{statusMeta.icon}</span>
//                               {statusMeta.label}
//                             </div>
//                           </div>

//                           <div className="status-caption">
//                             {normalizedStatus === "DELIVERED"
//                               ? "Your package has arrived"
//                               : normalizedStatus === "SHIPPED"
//                               ? "Your package is on the way"
//                               : normalizedStatus === "PROCESSING"
//                               ? "We're preparing your order"
//                               : "We've received your order"}
//                           </div>
//                         </div>

//                         {/* STEPPER */}
//                         <div className="premium-stepper">

//                           <div className="stepper-line">
//                             <div
//                               className="stepper-line-active"
//                               style={{
//                                 width: `${(currentStep / 3) * 100}%`,
//                               }}
//                             />
//                           </div>

//                           {STATUS_STEPS.map((step, index) => {
//                             const completed = index <= currentStep;
//                             const current = index === currentStep;

//                             return (
//                               <div
//                                 className={`premium-step ${
//                                   completed ? "completed" : ""
//                                 } ${current ? "active" : ""}`}
//                                 key={step}
//                               >
//                                 <div className="premium-step-circle">
//                                   {completed ? "✓" : index + 1}
//                                 </div>

//                                 <span>{step}</span>

//                                 {current && (
//                                   <small>Current</small>
//                                 )}
//                               </div>
//                             );
//                           })}
//                         </div>
//                       </div>

//                       {/* SHIPPING */}
//                       {hasShipping && (
//                         <div className="shipping-card">

//                           <div className="shipping-left">

//                             <div className="truck-icon">
//                               🚚
//                             </div>

//                             <div>
//                               <span className="shipping-label">
//                                 DELIVERY PARTNER
//                               </span>

//                               <strong>
//                                 {order.courierName || "Courier Partner"}
//                               </strong>

//                               <div className="awb">
//                                 AWB
//                                 <b>
//                                   {order.trackingNumber || "Not available"}
//                                 </b>
//                               </div>
//                             </div>
//                           </div>

//                           <div className="shipping-actions">

//                             {order.trackingUrl && (
//                               <a
//                                 href={order.trackingUrl}
//                                 target="_blank"
//                                 rel="noreferrer"
//                                 className="track-external-btn"
//                               >
//                                 Track Shipment
//                                 <span>↗</span>
//                               </a>
//                             )}

//                             {order.orderHistories?.length > 0 && (
//                               <button
//                                 type="button"
//                                 className="timeline-btn"
//                                 onClick={() =>
//                                   setSelectedOrderTracking(order)
//                                 }
//                               >
//                                 <span>◉</span>
//                                 Timeline
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       )}

//                       {/* PAYMENT INFO */}
//                       <div className="order-meta-grid">

//                         <div className="meta-item">
//                           <span>PAYMENT</span>
//                           <strong>
//                             {order.paymentMethod || "COD"}
//                           </strong>
//                         </div>

//                         <div className="meta-item">
//                           <span>PAYMENT STATUS</span>
//                           <strong
//                             className={
//                               String(order.paymentStatus)
//                                 .toUpperCase() === "SUCCESS"
//                                 ? "success-text"
//                                 : ""
//                             }
//                           >
//                             {order.paymentStatus || "PENDING"}
//                           </strong>
//                         </div>

//                         <div className="meta-item">
//                           <span>ORDER ID</span>
//                           <strong className="mono">
//                             {order.orderNumber || `ORD-${order.id}`}
//                           </strong>
//                         </div>

//                       </div>

//                       {/* PRODUCTS */}
//                       <div className="products-section">

//                         <div className="products-title">
//                           <span>ORDER ITEMS</span>
//                           <small>
//                             {order.items?.length || 0} items
//                           </small>
//                         </div>

//                         <div className="products-grid">

//                           {order.items?.length > 0 ? (
//                             order.items.map((item, index) => (
//                               <div
//                                 className="premium-product"
//                                 key={index}
//                               >
//                                 <div className="product-image-wrap">
//                                   {item.productImageUrl ? (
//                                     <img
//                                       src={item.productImageUrl}
//                                       alt={item.productName}
//                                     />
//                                   ) : (
//                                     <span>📦</span>
//                                   )}
//                                 </div>

//                                 <div className="product-info">
//                                   <strong>
//                                     {item.productName ||
//                                       item.name ||
//                                       `Product #${item.productId}`}
//                                   </strong>

//                                   <span>
//                                     Qty {item.quantity || 1}
//                                     {" × "}
//                                     ₹
//                                     {Number(
//                                       item.price || 0
//                                     ).toFixed(2)}
//                                   </span>
//                                 </div>

//                                 <div className="product-total">
//                                   ₹
//                                   {(
//                                     Number(item.price || 0) *
//                                     Number(item.quantity || 1)
//                                   ).toFixed(2)}
//                                 </div>
//                               </div>
//                             ))
//                           ) : (
//                             <div className="no-items">
//                               Order item information unavailable.
//                             </div>
//                           )}

//                         </div>
//                       </div>
//                     </>
//                   )}
//                 </article>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* TIMELINE MODAL */}
//       {selectedOrderTracking && (
//         <div
//           className="premium-modal-backdrop"
//           onClick={() => setSelectedOrderTracking(null)}
//         >
//           <div
//             className="premium-modal"
//             onClick={(e) => e.stopPropagation()}
//           >

//             <div className="modal-header">
//               <div>
//                 <span className="modal-eyebrow">
//                   SHIPMENT TRACKING
//                 </span>

//                 <h2>
//                   Live Delivery
//                   <span> Timeline</span>
//                 </h2>
//               </div>

//               <button
//                 type="button"
//                 className="modal-close"
//                 onClick={() => setSelectedOrderTracking(null)}
//               >
//                 ×
//               </button>
//             </div>

//             <div className="modal-order-info">

//               <div>
//                 <span>ORDER REFERENCE</span>
//                 <strong>
//                   {selectedOrderTracking.orderNumber ||
//                     `ORD-${selectedOrderTracking.id}`}
//                 </strong>
//               </div>

//               <div>
//                 <span>COURIER</span>
//                 <strong>
//                   {selectedOrderTracking.courierName ||
//                     "Courier Partner"}
//                 </strong>
//               </div>

//               <div>
//                 <span>AWB</span>
//                 <strong className="mono">
//                   {selectedOrderTracking.trackingNumber ||
//                     "N/A"}
//                 </strong>
//               </div>

//             </div>

//             <div className="modal-timeline">

//               {selectedOrderTracking.orderHistories?.length > 0 ? (
//                 [...selectedOrderTracking.orderHistories]
//                   .reverse()
//                   .map((history, index, array) => (
//                     <div
//                       className="timeline-row"
//                       key={history.id || index}
//                     >

//                       <div className="timeline-marker">

//                         <div className="timeline-dot">
//                           ✓
//                         </div>

//                         {index < array.length - 1 && (
//                           <div className="timeline-connector" />
//                         )}
//                       </div>

//                       <div className="timeline-content">

//                         <div className="timeline-top">
//                           <strong>
//                             {history.status}
//                           </strong>

//                           <time>
//                             {formatDateTime(history.timestamp)}
//                           </time>
//                         </div>

//                         {history.location && (
//                           <div className="timeline-location">
//                             📍 {history.location}
//                           </div>
//                         )}

//                         {history.notes && (
//                           <p>{history.notes}</p>
//                         )}

//                       </div>
//                     </div>
//                   ))
//               ) : (
//                 <div className="timeline-empty">
//                   <div>📦</div>
//                   <h4>Tracking will appear here</h4>
//                   <p>
//                     Shipment events will be displayed once your
//                     courier updates the package.
//                   </p>
//                 </div>
//               )}

//             </div>

//           </div>
//         </div>
//       )}

//       {/* PREMIUM CSS */}
//       <style>{`

//         * {
//           box-sizing: border-box;
//         }

//         .orders-premium-page {
//           min-height: 100vh;
//           padding: 48px 20px 80px;
//           background:
//             radial-gradient(
//               circle at 10% 0%,
//               rgba(16,185,129,.08),
//               transparent 28%
//             ),
//             radial-gradient(
//               circle at 90% 10%,
//               rgba(6,182,212,.06),
//               transparent 25%
//             ),
//             #070b13;
//           color: #f8fafc;
//         }

//         .orders-container {
//           width: 100%;
//           max-width: 1180px;
//           margin: 0 auto;
//         }

//         /* HERO */

//         .orders-hero {
//           display: flex;
//           justify-content: space-between;
//           align-items: flex-end;
//           gap: 30px;
//           margin-bottom: 38px;
//         }

//         .hero-eyebrow {
//           display: flex;
//           align-items: center;
//           gap: 9px;
//           color: #64748b;
//           font-size: 11px;
//           font-weight: 800;
//           letter-spacing: 1.8px;
//           margin-bottom: 12px;
//         }

//         .eyebrow-dot {
//           width: 7px;
//           height: 7px;
//           border-radius: 50%;
//           background: #10b981;
//           box-shadow: 0 0 12px rgba(16,185,129,.8);
//         }

//         .orders-hero h1 {
//           margin: 0;
//           font-size: clamp(34px, 5vw, 48px);
//           line-height: 1;
//           letter-spacing: -2px;
//           font-weight: 900;
//           color: #fff;
//         }

//         .orders-hero h1 span {
//           color: #10b981;
//         }

//         .orders-hero p {
//           max-width: 650px;
//           margin: 15px 0 0;
//           color: #718096;
//           font-size: 14px;
//           line-height: 1.7;
//         }

//         .orders-stat {
//           min-width: 190px;
//           padding: 18px;
//           border-radius: 18px;
//           border: 1px solid rgba(255,255,255,.08);
//           background: rgba(255,255,255,.035);
//           display: flex;
//           align-items: center;
//           gap: 13px;
//           backdrop-filter: blur(15px);
//         }

//         .stat-icon {
//           width: 46px;
//           height: 46px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           border-radius: 14px;
//           background: rgba(16,185,129,.1);
//           font-size: 21px;
//         }

//         .orders-stat strong {
//           display: block;
//           color: #fff;
//           font-size: 23px;
//           line-height: 1;
//         }

//         .orders-stat span {
//           display: block;
//           color: #64748b;
//           font-size: 11px;
//           margin-top: 5px;
//         }

//         /* ORDER CARD */

//         .orders-list {
//           display: flex;
//           flex-direction: column;
//           gap: 22px;
//         }

//         .premium-order-card {
//           overflow: hidden;
//           border: 1px solid rgba(255,255,255,.075);
//           border-radius: 24px;
//           background:
//             linear-gradient(
//               145deg,
//               rgba(17,24,39,.96),
//               rgba(10,15,25,.98)
//             );
//           box-shadow:
//             0 20px 60px rgba(0,0,0,.20),
//             inset 0 1px 0 rgba(255,255,255,.025);
//           transition: .3s ease;
//         }

//         .premium-order-card:hover {
//           border-color: rgba(16,185,129,.22);
//           transform: translateY(-2px);
//           box-shadow:
//             0 25px 70px rgba(0,0,0,.30),
//             0 0 35px rgba(16,185,129,.035);
//         }

//         .premium-order-header {
//           padding: 22px 24px;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           gap: 20px;
//           border-bottom: 1px solid rgba(255,255,255,.055);
//         }

//         .order-heading-left {
//           display: flex;
//           align-items: center;
//           gap: 13px;
//         }

//         .order-number-icon {
//           width: 47px;
//           height: 47px;
//           border-radius: 14px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           background:
//             linear-gradient(
//               145deg,
//               rgba(16,185,129,.18),
//               rgba(6,182,212,.07)
//             );
//           border: 1px solid rgba(16,185,129,.2);
//           color: #34d399;
//           font-weight: 900;
//           font-size: 14px;
//         }

//         .order-number {
//           color: #f8fafc;
//           font-size: 15px;
//           font-weight: 800;
//           letter-spacing: .2px;
//         }

//         .order-date {
//           margin-top: 4px;
//           color: #64748b;
//           font-size: 11px;
//         }

//         .order-heading-right {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           flex-wrap: wrap;
//           justify-content: flex-end;
//         }

//         .amount-box {
//           padding-right: 14px;
//           margin-right: 3px;
//           border-right: 1px solid rgba(255,255,255,.07);
//           text-align: right;
//         }

//         .amount-box span {
//           display: block;
//           color: #64748b;
//           font-size: 10px;
//           text-transform: uppercase;
//           letter-spacing: .8px;
//         }

//         .amount-box strong {
//           display: block;
//           color: #34d399;
//           margin-top: 3px;
//           font-size: 19px;
//         }

//         .invoice-btn,
//         .cancel-btn,
//         .track-external-btn,
//         .timeline-btn {
//           border-radius: 12px;
//           padding: 9px 13px;
//           font-size: 12px;
//           font-weight: 700;
//           cursor: pointer;
//           transition: .2s ease;
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           gap: 7px;
//           text-decoration: none;
//         }

//         .invoice-btn {
//           color: #e2e8f0;
//           background: rgba(255,255,255,.045);
//           border: 1px solid rgba(255,255,255,.09);
//         }

//         .invoice-btn:hover {
//           color: #fff;
//           background: rgba(255,255,255,.09);
//           border-color: rgba(255,255,255,.15);
//         }

//         .cancel-btn {
//           color: #fca5a5;
//           background: rgba(239,68,68,.06);
//           border: 1px solid rgba(239,68,68,.2);
//         }

//         .cancel-btn:hover {
//           background: rgba(239,68,68,.13);
//         }

//         /* STATUS */

//         .status-section {
//           padding: 25px 24px 26px;
//         }

//         .status-section-top {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           gap: 20px;
//           margin-bottom: 26px;
//         }

//         .section-label,
//         .shipping-label,
//         .products-title span,
//         .modal-eyebrow {
//           display: block;
//           color: #475569;
//           font-size: 9px;
//           font-weight: 900;
//           letter-spacing: 1.4px;
//         }

//         .live-status {
//           display: inline-flex;
//           align-items: center;
//           gap: 7px;
//           padding: 7px 11px;
//           margin-top: 8px;
//           border-radius: 9px;
//           border: 1px solid;
//           font-size: 11px;
//           font-weight: 800;
//         }

//         .status-caption {
//           color: #64748b;
//           font-size: 11px;
//         }

//         /* STEPPER */

//         .premium-stepper {
//           position: relative;
//           display: flex;
//           justify-content: space-between;
//         }

//         .stepper-line {
//           position: absolute;
//           top: 17px;
//           left: 6%;
//           right: 6%;
//           height: 2px;
//           background: #1e293b;
//           z-index: 0;
//         }

//         .stepper-line-active {
//           height: 100%;
//           background: linear-gradient(
//             90deg,
//             #10b981,
//             #06b6d4
//           );
//           box-shadow: 0 0 10px rgba(16,185,129,.35);
//           transition: width .5s ease;
//         }

//         .premium-step {
//           position: relative;
//           z-index: 1;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           width: 25%;
//         }

//         .premium-step-circle {
//           width: 35px;
//           height: 35px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           border-radius: 50%;
//           background: #111827;
//           border: 2px solid #334155;
//           color: #64748b;
//           font-size: 11px;
//           font-weight: 900;
//           transition: .3s ease;
//         }

//         .premium-step.completed .premium-step-circle {
//           background: #10b981;
//           border-color: #10b981;
//           color: #fff;
//           box-shadow: 0 0 18px rgba(16,185,129,.28);
//         }

//         .premium-step.active .premium-step-circle {
//           background: #06b6d4;
//           border-color: #06b6d4;
//           box-shadow:
//             0 0 0 5px rgba(6,182,212,.08),
//             0 0 20px rgba(6,182,212,.4);
//         }

//         .premium-step > span {
//           margin-top: 9px;
//           color: #475569;
//           font-size: 9px;
//           font-weight: 900;
//           letter-spacing: .8px;
//         }

//         .premium-step.completed > span {
//           color: #cbd5e1;
//         }

//         .premium-step small {
//           color: #22d3ee;
//           font-size: 8px;
//           margin-top: 3px;
//           font-weight: 800;
//         }

//         /* SHIPPING */

//         .shipping-card {
//           margin: 0 24px 20px;
//           padding: 17px;
//           border-radius: 17px;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           gap: 20px;
//           background:
//             linear-gradient(
//               100deg,
//               rgba(6,182,212,.065),
//               rgba(16,185,129,.035)
//             );
//           border: 1px solid rgba(34,211,238,.12);
//         }

//         .shipping-left {
//           display: flex;
//           align-items: center;
//           gap: 13px;
//         }

//         .truck-icon {
//           width: 44px;
//           height: 44px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           border-radius: 13px;
//           background: rgba(34,211,238,.09);
//           font-size: 20px;
//         }

//         .shipping-left strong {
//           display: block;
//           color: #f8fafc;
//           margin-top: 4px;
//           font-size: 13px;
//         }

//         .awb {
//           color: #64748b;
//           margin-top: 4px;
//           font-size: 10px;
//         }

//         .awb b {
//           color: #cbd5e1;
//           margin-left: 7px;
//           font-family: monospace;
//         }

//         .shipping-actions {
//           display: flex;
//           gap: 8px;
//         }

//         .track-external-btn {
//           color: #67e8f9;
//           background: rgba(34,211,238,.07);
//           border: 1px solid rgba(34,211,238,.16);
//         }

//         .track-external-btn:hover {
//           background: rgba(34,211,238,.13);
//         }

//         .timeline-btn {
//           color: #34d399;
//           background: rgba(16,185,129,.07);
//           border: 1px solid rgba(16,185,129,.16);
//         }

//         .timeline-btn:hover {
//           background: rgba(16,185,129,.13);
//         }

//         /* META */

//         .order-meta-grid {
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           margin: 0 24px 22px;
//           border: 1px solid rgba(255,255,255,.055);
//           border-radius: 14px;
//           overflow: hidden;
//         }

//         .meta-item {
//           padding: 13px 15px;
//           background: rgba(255,255,255,.018);
//           border-right: 1px solid rgba(255,255,255,.055);
//         }

//         .meta-item:last-child {
//           border-right: 0;
//         }

//         .meta-item span {
//           display: block;
//           color: #475569;
//           font-size: 8px;
//           font-weight: 900;
//           letter-spacing: 1px;
//         }

//         .meta-item strong {
//           display: block;
//           color: #cbd5e1;
//           margin-top: 5px;
//           font-size: 11px;
//         }

//         .success-text {
//           color: #34d399 !important;
//         }

//         .mono {
//           font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
//         }

//         /* PRODUCTS */

//         .products-section {
//           padding: 0 24px 25px;
//         }

//         .products-title {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           margin-bottom: 11px;
//         }

//         .products-title small {
//           color: #475569;
//           font-size: 10px;
//         }

//         .products-grid {
//           display: grid;
//           grid-template-columns: repeat(2, 1fr);
//           gap: 8px;
//         }

//         .premium-product {
//           display: flex;
//           align-items: center;
//           gap: 11px;
//           min-width: 0;
//           padding: 9px;
//           border-radius: 13px;
//           background: rgba(255,255,255,.025);
//           border: 1px solid rgba(255,255,255,.05);
//           transition: .2s ease;
//         }

//         .premium-product:hover {
//           background: rgba(255,255,255,.04);
//           border-color: rgba(255,255,255,.09);
//         }

//         .product-image-wrap {
//           width: 51px;
//           height: 51px;
//           flex: 0 0 51px;
//           overflow: hidden;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           border-radius: 10px;
//           background: #111827;
//           color: #475569;
//         }

//         .product-image-wrap img {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//         }

//         .product-info {
//           min-width: 0;
//           flex: 1;
//         }

//         .product-info strong {
//           display: block;
//           overflow: hidden;
//           color: #e2e8f0;
//           font-size: 11px;
//           font-weight: 700;
//           white-space: nowrap;
//           text-overflow: ellipsis;
//         }

//         .product-info span {
//           display: block;
//           color: #64748b;
//           margin-top: 4px;
//           font-size: 9px;
//         }

//         .product-total {
//           color: #94a3b8;
//           font-family: monospace;
//           font-size: 10px;
//           white-space: nowrap;
//         }

//         /* CANCEL */

//         .cancelled-panel {
//           margin: 25px 24px;
//           padding: 18px;
//           display: flex;
//           gap: 14px;
//           align-items: center;
//           border-radius: 15px;
//           background: rgba(239,68,68,.055);
//           border: 1px solid rgba(239,68,68,.15);
//         }

//         .cancelled-icon {
//           width: 42px;
//           height: 42px;
//           flex: 0 0 42px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           border-radius: 12px;
//           background: rgba(239,68,68,.1);
//           color: #f87171;
//           font-size: 23px;
//         }

//         .cancelled-panel strong {
//           color: #fca5a5;
//           font-size: 13px;
//         }

//         .cancelled-panel p {
//           margin: 3px 0;
//           color: #64748b;
//           font-size: 10px;
//         }

//         .cancelled-panel span {
//           color: #64748b;
//           font-size: 9px;
//         }

//         .cancelled-panel b {
//           color: #cbd5e1;
//           margin-left: 5px;
//         }

//         /* EMPTY */

//         .empty-order-card {
//           padding: 80px 20px;
//           text-align: center;
//           border-radius: 25px;
//           border: 1px solid rgba(255,255,255,.07);
//           background: rgba(15,23,42,.6);
//         }

//         .empty-bag {
//           width: 75px;
//           height: 75px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           margin: 0 auto 20px;
//           border-radius: 23px;
//           background: rgba(16,185,129,.08);
//           font-size: 30px;
//         }

//         .empty-order-card h2 {
//           color: #fff;
//           font-size: 22px;
//         }

//         .empty-order-card p {
//           max-width: 480px;
//           margin: 8px auto 25px;
//           color: #64748b;
//           font-size: 13px;
//           line-height: 1.7;
//         }

//         .premium-primary-btn {
//           display: inline-flex;
//           align-items: center;
//           gap: 10px;
//           padding: 12px 18px;
//           border-radius: 12px;
//           background: #10b981;
//           color: #fff;
//           text-decoration: none;
//           font-size: 12px;
//           font-weight: 800;
//           box-shadow: 0 10px 30px rgba(16,185,129,.18);
//         }

//         /* MODAL */

//         .premium-modal-backdrop {
//           position: fixed;
//           inset: 0;
//           z-index: 9999;
//           padding: 20px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           background: rgba(2,6,23,.78);
//           backdrop-filter: blur(12px);
//         }

//         .premium-modal {
//           width: 100%;
//           max-width: 650px;
//           max-height: 90vh;
//           overflow-y: auto;
//           border: 1px solid rgba(255,255,255,.09);
//           border-radius: 25px;
//           background: #0c121e;
//           box-shadow: 0 30px 100px rgba(0,0,0,.55);
//         }

//         .modal-header {
//           padding: 22px;
//           display: flex;
//           align-items: flex-start;
//           justify-content: space-between;
//           border-bottom: 1px solid rgba(255,255,255,.06);
//         }

//         .modal-header h2 {
//           margin: 5px 0 0;
//           color: #fff;
//           font-size: 23px;
//           font-weight: 900;
//         }

//         .modal-header h2 span {
//           color: #10b981;
//         }

//         .modal-close {
//           width: 34px;
//           height: 34px;
//           border: 1px solid rgba(255,255,255,.08);
//           border-radius: 10px;
//           background: rgba(255,255,255,.04);
//           color: #94a3b8;
//           font-size: 20px;
//           cursor: pointer;
//         }

//         .modal-order-info {
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 1px;
//           margin: 18px;
//           overflow: hidden;
//           border-radius: 13px;
//           background: rgba(255,255,255,.06);
//         }

//         .modal-order-info > div {
//           padding: 13px;
//           background: #0f172a;
//         }

//         .modal-order-info span {
//           display: block;
//           color: #475569;
//           font-size: 8px;
//           font-weight: 900;
//           letter-spacing: 1px;
//         }

//         .modal-order-info strong {
//           display: block;
//           color: #cbd5e1;
//           margin-top: 5px;
//           font-size: 10px;
//         }

//         .modal-timeline {
//           padding: 8px 22px 25px;
//         }

//         .timeline-row {
//           display: flex;
//           gap: 15px;
//         }

//         .timeline-marker {
//           position: relative;
//           width: 20px;
//           flex: 0 0 20px;
//           display: flex;
//           justify-content: center;
//         }

//         .timeline-dot {
//           position: relative;
//           z-index: 2;
//           width: 18px;
//           height: 18px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           border-radius: 50%;
//           background: #10b981;
//           color: #fff;
//           font-size: 9px;
//           font-weight: 900;
//           box-shadow: 0 0 13px rgba(16,185,129,.35);
//         }

//         .timeline-connector {
//           position: absolute;
//           top: 18px;
//           bottom: 0;
//           width: 1px;
//           background: linear-gradient(
//             #10b981,
//             rgba(255,255,255,.08)
//           );
//         }

//         .timeline-content {
//           flex: 1;
//           padding-bottom: 24px;
//         }

//         .timeline-top {
//           display: flex;
//           justify-content: space-between;
//           gap: 15px;
//         }

//         .timeline-top strong {
//           color: #e2e8f0;
//           font-size: 12px;
//         }

//         .timeline-top time {
//           color: #475569;
//           font-size: 9px;
//         }

//         .timeline-location {
//           color: #22d3ee;
//           margin-top: 6px;
//           font-size: 10px;
//         }

//         .timeline-content p {
//           margin: 5px 0 0;
//           color: #64748b;
//           font-size: 10px;
//           line-height: 1.6;
//         }

//         .timeline-empty {
//           padding: 40px 10px;
//           text-align: center;
//         }

//         .timeline-empty div {
//           font-size: 32px;
//         }

//         .timeline-empty h4 {
//           margin: 12px 0 5px;
//           color: #e2e8f0;
//           font-size: 14px;
//         }

//         .timeline-empty p {
//           color: #64748b;
//           font-size: 10px;
//         }

//         /* LOADING */

//         .orders-loading {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           text-align: center;
//         }

//         .loading-orb {
//           position: relative;
//           width: 70px;
//           height: 70px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           margin-bottom: 18px;
//         }

//         .loading-ring {
//           position: absolute;
//           inset: 0;
//           border: 2px solid rgba(16,185,129,.15);
//           border-top-color: #10b981;
//           border-radius: 50%;
//           animation: premiumSpin 1s linear infinite;
//         }

//         .loading-icon {
//           font-size: 25px;
//         }

//         .orders-loading h5 {
//           margin: 0;
//           color: #e2e8f0;
//         }

//         .orders-loading p {
//           margin-top: 7px;
//           color: #475569;
//           font-size: 11px;
//         }

//         @keyframes premiumSpin {
//           to {
//             transform: rotate(360deg);
//           }
//         }

//         /* MOBILE */

//         @media (max-width: 768px) {

//           .orders-premium-page {
//             padding: 28px 12px 60px;
//           }

//           .orders-hero {
//             align-items: flex-start;
//             flex-direction: column;
//             margin-bottom: 25px;
//           }

//           .orders-stat {
//             width: 100%;
//           }

//           .premium-order-header {
//             align-items: flex-start;
//             flex-direction: column;
//             padding: 17px;
//           }

//           .order-heading-right {
//             width: 100%;
//             justify-content: flex-start;
//           }

//           .amount-box {
//             margin-right: auto;
//             text-align: left;
//             border-right: 0;
//           }

//           .status-section {
//             padding: 20px 17px;
//           }

//           .status-section-top {
//             align-items: flex-start;
//             flex-direction: column;
//             gap: 8px;
//           }

//           .premium-step > span {
//             font-size: 8px;
//           }

//           .shipping-card {
//             margin: 0 17px 18px;
//             align-items: flex-start;
//             flex-direction: column;
//           }

//           .shipping-actions {
//             width: 100%;
//           }

//           .track-external-btn,
//           .timeline-btn {
//             flex: 1;
//           }

//           .order-meta-grid {
//             margin: 0 17px 18px;
//             grid-template-columns: 1fr;
//           }

//           .meta-item {
//             border-right: 0;
//             border-bottom: 1px solid rgba(255,255,255,.055);
//           }

//           .meta-item:last-child {
//             border-bottom: 0;
//           }

//           .products-section {
//             padding: 0 17px 20px;
//           }

//           .products-grid {
//             grid-template-columns: 1fr;
//           }

//           .product-total {
//             display: none;
//           }

//           .cancelled-panel {
//             margin: 20px 17px;
//           }

//           .modal-order-info {
//             grid-template-columns: 1fr;
//           }

//           .modal-header {
//             padding: 18px;
//           }

//           .modal-timeline {
//             padding-left: 18px;
//             padding-right: 18px;
//           }

//           .timeline-top {
//             flex-direction: column;
//             gap: 3px;
//           }
//         }

//         @media (max-width: 480px) {

//           .orders-hero h1 {
//             font-size: 34px;
//           }

//           .invoice-btn,
//           .cancel-btn {
//             flex: 1;
//           }

//           .order-heading-right {
//             display: grid;
//             grid-template-columns: 1fr 1fr;
//           }

//           .amount-box {
//             grid-column: 1 / -1;
//           }

//           .premium-step-circle {
//             width: 30px;
//             height: 30px;
//           }

//           .stepper-line {
//             top: 15px;
//           }

//           .premium-step > span {
//             font-size: 7px;
//           }
//         }

//       `}</style>
//     </div>
//   );
// };

// export default Orders;




import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { generateInvoice } from "../utils/generateInvoice";

const STATUS_STEPS = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED"];

const getStatus = (status) => {
  const normalized = (status || "PLACED").toUpperCase();

  if (normalized === "PENDING") return "PLACED";
  if (STATUS_STEPS.includes(normalized)) return normalized;

  return "PLACED";
};

const getStepIndex = (status) => {
  const normalized = getStatus(status);
  return STATUS_STEPS.indexOf(normalized);
};

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusMeta = (status) => {
  const normalized = getStatus(status);

  const meta = {
    PLACED: {
      label: "Order Placed",
      color: "#2563eb",
      bg: "rgba(37,99,235,.08)",
      border: "rgba(37,99,235,.20)",
      icon: "✓",
    },
    PROCESSING: {
      label: "Processing",
      color: "#d97706",
      bg: "rgba(217,119,6,.08)",
      border: "rgba(217,119,6,.20)",
      icon: "⚙",
    },
    SHIPPED: {
      label: "Shipped",
      color: "#0891b2",
      bg: "rgba(8,145,178,.08)",
      border: "rgba(8,145,178,.20)",
      icon: "🚚",
    },
    DELIVERED: {
      label: "Delivered",
      color: "#059669",
      bg: "rgba(5,150,105,.08)",
      border: "rgba(5,150,105,.20)",
      icon: "✓",
    },
  };

  return meta[normalized] || meta.PLACED;
};

const Orders = () => {
  const { user, token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderTracking, setSelectedOrderTracking] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  const fetchOrders = async () => {
    if (!user?.email || !token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await api.get(
        `/orders/user/${encodeURIComponent(user.email)}`
      );

      const data = Array.isArray(res.data) ? res.data : [];

      const sorted = [...data].sort((a, b) => {
        const aId = Number(a.id || 0);
        const bId = Number(b.id || 0);
        return bId - aId;
      });

      setOrders(sorted);
    } catch (error) {
      console.error("Orders Fetch Error:", error);

      Swal.fire({
        icon: "error",
        title: "Unable to load orders",
        text:
          error.response?.data?.message ||
          "Something went wrong while loading your orders.",
        background: "#fffdf8",
        color: "#1f2937",
        confirmButtonColor: "#10b981",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user?.email, token]);

  const handleCancelOrder = async (orderId) => {
    const { value: reason } = await Swal.fire({
      title: "Cancel this order?",
      text: "This action cannot be undone.",
      input: "select",
      inputOptions: {
        "Changed my mind": "Changed my mind",
        "Found better price": "Found better price elsewhere",
        "Ordered by mistake": "Ordered by mistake",
        "Delay in delivery": "Delivery taking too long",
        Other: "Other reason",
      },
      inputPlaceholder: "Select cancellation reason",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Cancel Order",
      background: "#fffdf8",
      color: "#1f2937",
      inputValidator: (value) => {
        if (!value) {
          return "Please select a reason";
        }
      },
    });

    if (!reason) return;

    try {
      setCancellingOrderId(orderId);

      await api.post(
        `/orders/${orderId}/cancel?userEmail=${encodeURIComponent(
          user.email
        )}&reason=${encodeURIComponent(reason)}`
      );

      await Swal.fire({
        icon: "success",
        title: "Order Cancelled",
        text: "Your cancellation request has been processed.",
        timer: 1800,
        showConfirmButton: false,
        background: "#fffdf8",
        color: "#1f2937",
      });

      await fetchOrders();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Cancellation Failed",
        text:
          error.response?.data?.message ||
          error.message ||
          "Failed to cancel order.",
        background: "#fffdf8",
        color: "#1f2937",
        confirmButtonColor: "#10b981",
      });
    } finally {
      setCancellingOrderId(null);
    }
  };

  if (loading) {
    return (
      <div className="orders-premium-page orders-loading">
        <div className="loading-orb">
          <div className="loading-ring"></div>
          <div className="loading-icon">📦</div>
        </div>

        <h5>Loading your orders</h5>
        <p>Please wait while we fetch your latest purchases...</p>
      </div>
    );
  }

  return (
    <div className="orders-premium-page">
      <div className="orders-container">

        {/* HERO */}
        <section className="orders-hero">
          <div>
            <div className="hero-eyebrow">
              <span className="eyebrow-dot"></span>
              YOUR SHOPPING ACTIVITY
            </div>

            <h1>
              My Orders
              <span>& Tracking</span>
            </h1>

            <p>
              Manage your purchases, download invoices and follow every
              delivery from checkout to doorstep.
            </p>
          </div>

          <div className="orders-stat">
            <div className="stat-icon">📦</div>

            <div>
              <strong>{orders.length}</strong>
              <span>
                {orders.length === 1 ? "Order" : "Orders"} Placed
              </span>
            </div>
          </div>
        </section>

        {/* EMPTY */}
        {orders.length === 0 ? (
          <div className="empty-order-card">
            <div className="empty-bag">🛍️</div>

            <h2>No orders yet</h2>

            <p>
              Your shopping journey starts here. Explore our collection
              and place your first order.
            </p>

            <Link to="/" className="premium-primary-btn">
              Explore Products
              <span>→</span>
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const normalizedStatus = getStatus(order.orderStatus);
              const currentStep = getStepIndex(order.orderStatus);

              const isCancelled =
                (order.orderStatus || "").toUpperCase() === "CANCELLED";

              const isDelivered = normalizedStatus === "DELIVERED";

              const canCancel =
                !isCancelled &&
                !isDelivered &&
                ["PENDING", "PLACED", "PROCESSING"].includes(
                  (order.orderStatus || "PLACED").toUpperCase()
                );

              const statusMeta = getStatusMeta(order.orderStatus);

              const hasShipping =
                normalizedStatus === "SHIPPED" ||
                normalizedStatus === "DELIVERED";

              return (
                <article
                  key={order.id}
                  className={`premium-order-card ${
                    isCancelled ? "order-cancelled" : ""
                  }`}
                >
                  {/* TOP HEADER */}
                  <div className="premium-order-header">
                    <div className="order-heading-left">
                      <div className="order-number-icon">
                        #{order.id}
                      </div>

                      <div>
                        <div className="order-number">
                          {order.orderNumber || `ORD-${order.id}`}
                        </div>

                        <div className="order-date">
                          Placed on {formatDate(order.orderDate)}
                        </div>
                      </div>
                    </div>

                    <div className="order-heading-right">
                      <div className="amount-box">
                        <span>Total Amount</span>

                        <strong>
                          ₹
                          {Number(order.totalAmount || 0).toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </strong>
                      </div>

                      <button
                        type="button"
                        className="invoice-btn"
                        onClick={() => generateInvoice(order)}
                      >
                        <span>📄</span>
                        <span>Invoice</span>
                      </button>

                      {canCancel && (
                        <button
                          type="button"
                          className="cancel-btn"
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={cancellingOrderId === order.id}
                        >
                          {cancellingOrderId === order.id
                            ? "Cancelling..."
                            : "Cancel"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* CANCELLED */}
                  {isCancelled ? (
                    <div className="cancelled-panel">
                      <div className="cancelled-icon">×</div>

                      <div>
                        <strong>Order Cancelled</strong>

                        <p>
                          This order has been cancelled successfully.
                        </p>

                        <span>
                          Payment Status:
                          <b>{order.paymentStatus || "PENDING"}</b>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* STATUS */}
                      <div className="status-section">
                        <div className="status-section-top">
                          <div>
                            <span className="section-label">
                              ORDER STATUS
                            </span>

                            <div
                              className="live-status"
                              style={{
                                color: statusMeta.color,
                                background: statusMeta.bg,
                                borderColor: statusMeta.border,
                              }}
                            >
                              <span>{statusMeta.icon}</span>
                              {statusMeta.label}
                            </div>
                          </div>

                          <div className="status-caption">
                            {normalizedStatus === "DELIVERED"
                              ? "Your package has arrived"
                              : normalizedStatus === "SHIPPED"
                              ? "Your package is on the way"
                              : normalizedStatus === "PROCESSING"
                              ? "We're preparing your order"
                              : "We've received your order"}
                          </div>
                        </div>

                        {/* STEPPER */}
                        <div className="premium-stepper">
                          <div className="stepper-line">
                            <div
                              className="stepper-line-active"
                              style={{
                                width: `${(currentStep / 3) * 100}%`,
                              }}
                            />
                          </div>

                          {STATUS_STEPS.map((step, index) => {
                            const completed = index <= currentStep;
                            const current = index === currentStep;

                            return (
                              <div
                                className={`premium-step ${
                                  completed ? "completed" : ""
                                } ${current ? "active" : ""}`}
                                key={step}
                              >
                                <div className="premium-step-circle">
                                  {completed ? "✓" : index + 1}
                                </div>

                                <span>{step}</span>

                                {current && <small>Current</small>}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* SHIPPING */}
                      {hasShipping && (
                        <div className="shipping-card">
                          <div className="shipping-left">
                            <div className="truck-icon">🚚</div>

                            <div>
                              <span className="shipping-label">
                                DELIVERY PARTNER
                              </span>

                              <strong>
                                {order.courierName || "Courier Partner"}
                              </strong>

                              <div className="awb">
                                AWB
                                <b>
                                  {order.trackingNumber || "Not available"}
                                </b>
                              </div>
                            </div>
                          </div>

                          <div className="shipping-actions">
                            {order.trackingUrl && (
                              <a
                                href={order.trackingUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="track-external-btn"
                              >
                                Track Shipment
                                <span>↗</span>
                              </a>
                            )}

                            {order.orderHistories?.length > 0 && (
                              <button
                                type="button"
                                className="timeline-btn"
                                onClick={() =>
                                  setSelectedOrderTracking(order)
                                }
                              >
                                <span>◉</span>
                                Timeline
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* PAYMENT INFO */}
                      <div className="order-meta-grid">
                        <div className="meta-item">
                          <span>PAYMENT</span>

                          <strong>
                            {order.paymentMethod || "COD"}
                          </strong>
                        </div>

                        <div className="meta-item">
                          <span>PAYMENT STATUS</span>

                          <strong
                            className={
                              String(order.paymentStatus)
                                .toUpperCase() === "SUCCESS"
                                ? "success-text"
                                : ""
                            }
                          >
                            {order.paymentStatus || "PENDING"}
                          </strong>
                        </div>

                        <div className="meta-item">
                          <span>ORDER ID</span>

                          <strong className="mono">
                            {order.orderNumber || `ORD-${order.id}`}
                          </strong>
                        </div>
                      </div>

                      {/* PRODUCTS */}
                      <div className="products-section">
                        <div className="products-title">
                          <span>ORDER ITEMS</span>

                          <small>
                            {order.items?.length || 0} items
                          </small>
                        </div>

                        <div className="products-grid">
                          {order.items?.length > 0 ? (
                            order.items.map((item, index) => (
                              <div
                                className="premium-product"
                                key={index}
                              >
                                <div className="product-image-wrap">
                                  {item.productImageUrl ? (
                                    <img
                                      src={item.productImageUrl}
                                      alt={item.productName}
                                    />
                                  ) : (
                                    <span>📦</span>
                                  )}
                                </div>

                                <div className="product-info">
                                  <strong>
                                    {item.productName ||
                                      item.name ||
                                      `Product #${item.productId}`}
                                  </strong>

                                  <span>
                                    Qty {item.quantity || 1}
                                    {" × "}
                                    ₹
                                    {Number(
                                      item.price || 0
                                    ).toFixed(2)}
                                  </span>
                                </div>

                                <div className="product-total">
                                  ₹
                                  {(
                                    Number(item.price || 0) *
                                    Number(item.quantity || 1)
                                  ).toFixed(2)}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="no-items">
                              Order item information unavailable.
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* TIMELINE MODAL */}
      {selectedOrderTracking && (
        <div
          className="premium-modal-backdrop"
          onClick={() => setSelectedOrderTracking(null)}
        >
          <div
            className="premium-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span className="modal-eyebrow">
                  SHIPMENT TRACKING
                </span>

                <h2>
                  Live Delivery
                  <span> Timeline</span>
                </h2>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() => setSelectedOrderTracking(null)}
              >
                ×
              </button>
            </div>

            <div className="modal-order-info">
              <div>
                <span>ORDER REFERENCE</span>

                <strong>
                  {selectedOrderTracking.orderNumber ||
                    `ORD-${selectedOrderTracking.id}`}
                </strong>
              </div>

              <div>
                <span>COURIER</span>

                <strong>
                  {selectedOrderTracking.courierName ||
                    "Courier Partner"}
                </strong>
              </div>

              <div>
                <span>AWB</span>

                <strong className="mono">
                  {selectedOrderTracking.trackingNumber || "N/A"}
                </strong>
              </div>
            </div>

            <div className="modal-timeline">
              {selectedOrderTracking.orderHistories?.length > 0 ? (
                [...selectedOrderTracking.orderHistories]
                  .reverse()
                  .map((history, index, array) => (
                    <div
                      className="timeline-row"
                      key={history.id || index}
                    >
                      <div className="timeline-marker">
                        <div className="timeline-dot">✓</div>

                        {index < array.length - 1 && (
                          <div className="timeline-connector" />
                        )}
                      </div>

                      <div className="timeline-content">
                        <div className="timeline-top">
                          <strong>{history.status}</strong>

                          <time>
                            {formatDateTime(history.timestamp)}
                          </time>
                        </div>

                        {history.location && (
                          <div className="timeline-location">
                            📍 {history.location}
                          </div>
                        )}

                        {history.notes && <p>{history.notes}</p>}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="timeline-empty">
                  <div>📦</div>

                  <h4>Tracking will appear here</h4>

                  <p>
                    Shipment events will be displayed once your
                    courier updates the package.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* OFF-WHITE PREMIUM CSS */}
      <style>{`

        * {
          box-sizing: border-box;
        }

        body {
          background: #f7f5ef;
        }

        .orders-premium-page {
          min-height: 100vh;
          padding: 48px 20px 80px;

          background:
            radial-gradient(
              circle at 8% 0%,
              rgba(16,185,129,.07),
              transparent 28%
            ),
            radial-gradient(
              circle at 92% 8%,
              rgba(6,182,212,.055),
              transparent 25%
            ),
            #f7f5ef;

          color: #1f2937;
        }

        .orders-container {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
        }

        /* HERO */

        .orders-hero {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 30px;
          margin-bottom: 38px;
        }

        .hero-eyebrow {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #64748b;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.8px;
          margin-bottom: 12px;
        }

        .eyebrow-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 12px rgba(16,185,129,.45);
        }

        .orders-hero h1 {
          margin: 0;
          font-size: clamp(34px, 5vw, 48px);
          line-height: 1;
          letter-spacing: -2px;
          font-weight: 900;
          color: #172033;
        }

        .orders-hero h1 span {
          color: #059669;
        }

        .orders-hero p {
          max-width: 650px;
          margin: 15px 0 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.7;
        }

        .orders-stat {
          min-width: 190px;
          padding: 18px;
          border-radius: 18px;

          border: 1px solid #e6e1d7;
          background: rgba(255,255,255,.72);

          display: flex;
          align-items: center;
          gap: 13px;

          box-shadow: 0 10px 35px rgba(71,85,105,.07);
          backdrop-filter: blur(15px);
        }

        .stat-icon {
          width: 46px;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          background: #ecfdf5;
          font-size: 21px;
        }

        .orders-stat strong {
          display: block;
          color: #172033;
          font-size: 23px;
          line-height: 1;
        }

        .orders-stat span {
          display: block;
          color: #64748b;
          font-size: 11px;
          margin-top: 5px;
        }

        /* ORDER LIST */

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        /* ORDER CARD */

        .premium-order-card {
          overflow: hidden;
          border: 1px solid #e5e0d7;
          border-radius: 24px;

          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.98),
              rgba(252,250,245,.98)
            );

          box-shadow:
            0 18px 50px rgba(71,85,105,.09),
            inset 0 1px 0 rgba(255,255,255,.8);

          transition: .3s ease;
        }

        .premium-order-card:hover {
          border-color: rgba(16,185,129,.28);
          transform: translateY(-2px);

          box-shadow:
            0 25px 65px rgba(71,85,105,.13),
            0 0 30px rgba(16,185,129,.04);
        }

        .premium-order-header {
          padding: 22px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;

          border-bottom: 1px solid #eee9df;
          background: rgba(255,255,255,.45);
        }

        .order-heading-left {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .order-number-icon {
          width: 47px;
          height: 47px;
          border-radius: 14px;

          display: flex;
          align-items: center;
          justify-content: center;

          background:
            linear-gradient(
              145deg,
              #ecfdf5,
              #f0fdfa
            );

          border: 1px solid #bbf7d0;
          color: #059669;

          font-weight: 900;
          font-size: 14px;
        }

        .order-number {
          color: #1f2937;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: .2px;
        }

        .order-date {
          margin-top: 4px;
          color: #64748b;
          font-size: 11px;
        }

        .order-heading-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .amount-box {
          padding-right: 14px;
          margin-right: 3px;
          border-right: 1px solid #e5e7eb;
          text-align: right;
        }

        .amount-box span {
          display: block;
          color: #64748b;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: .8px;
        }

        .amount-box strong {
          display: block;
          color: #059669;
          margin-top: 3px;
          font-size: 19px;
        }

        .invoice-btn,
        .cancel-btn,
        .track-external-btn,
        .timeline-btn {
          border-radius: 12px;
          padding: 9px 13px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: .2s ease;

          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          text-decoration: none;
        }

        .invoice-btn {
          color: #334155;
          background: #ffffff;
          border: 1px solid #dfe4ea;
          box-shadow: 0 3px 10px rgba(71,85,105,.04);
        }

        .invoice-btn:hover {
          color: #111827;
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .cancel-btn {
          color: #dc2626;
          background: #fff7f7;
          border: 1px solid #fecaca;
        }

        .cancel-btn:hover {
          background: #fef2f2;
        }

        /* STATUS */

        .status-section {
          padding: 25px 24px 26px;
        }

        .status-section-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 26px;
        }

        .section-label,
        .shipping-label,
        .products-title span,
        .modal-eyebrow {
          display: block;
          color: #94a3b8;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.4px;
        }

        .live-status {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 11px;
          margin-top: 8px;
          border-radius: 9px;
          border: 1px solid;
          font-size: 11px;
          font-weight: 800;
        }

        .status-caption {
          color: #64748b;
          font-size: 11px;
        }

        /* STEPPER */

        .premium-stepper {
          position: relative;
          display: flex;
          justify-content: space-between;
        }

        .stepper-line {
          position: absolute;
          top: 17px;
          left: 6%;
          right: 6%;
          height: 2px;
          background: #e2e8f0;
          z-index: 0;
        }

        .stepper-line-active {
          height: 100%;

          background: linear-gradient(
            90deg,
            #10b981,
            #06b6d4
          );

          box-shadow: 0 0 8px rgba(16,185,129,.22);
          transition: width .5s ease;
        }

        .premium-step {
          position: relative;
          z-index: 1;

          display: flex;
          flex-direction: column;
          align-items: center;

          width: 25%;
        }

        .premium-step-circle {
          width: 35px;
          height: 35px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: #ffffff;
          border: 2px solid #cbd5e1;

          color: #94a3b8;
          font-size: 11px;
          font-weight: 900;

          transition: .3s ease;
        }

        .premium-step.completed .premium-step-circle {
          background: #10b981;
          border-color: #10b981;
          color: #fff;
          box-shadow: 0 0 15px rgba(16,185,129,.20);
        }

        .premium-step.active .premium-step-circle {
          background: #06b6d4;
          border-color: #06b6d4;

          box-shadow:
            0 0 0 5px rgba(6,182,212,.08),
            0 0 16px rgba(6,182,212,.20);
        }

        .premium-step > span {
          margin-top: 9px;
          color: #94a3b8;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .8px;
        }

        .premium-step.completed > span {
          color: #475569;
        }

        .premium-step small {
          color: #0891b2;
          font-size: 8px;
          margin-top: 3px;
          font-weight: 800;
        }

        /* SHIPPING */

        .shipping-card {
          margin: 0 24px 20px;
          padding: 17px;

          border-radius: 17px;

          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;

          background:
            linear-gradient(
              100deg,
              rgba(6,182,212,.06),
              rgba(16,185,129,.045)
            );

          border: 1px solid rgba(8,145,178,.13);
        }

        .shipping-left {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .truck-icon {
          width: 44px;
          height: 44px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 13px;
          background: #ecfeff;
          font-size: 20px;
        }

        .shipping-left strong {
          display: block;
          color: #334155;
          margin-top: 4px;
          font-size: 13px;
        }

        .awb {
          color: #64748b;
          margin-top: 4px;
          font-size: 10px;
        }

        .awb b {
          color: #475569;
          margin-left: 7px;
          font-family: monospace;
        }

        .shipping-actions {
          display: flex;
          gap: 8px;
        }

        .track-external-btn {
          color: #0891b2;
          background: #ecfeff;
          border: 1px solid #bae6fd;
        }

        .track-external-btn:hover {
          background: #cffafe;
        }

        .timeline-btn {
          color: #059669;
          background: #ecfdf5;
          border: 1px solid #bbf7d0;
        }

        .timeline-btn:hover {
          background: #d1fae5;
        }

        /* META */

        .order-meta-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);

          margin: 0 24px 22px;

          border: 1px solid #e5e7eb;
          border-radius: 14px;

          overflow: hidden;
        }

        .meta-item {
          padding: 13px 15px;

          background: #fffefa;
          border-right: 1px solid #e5e7eb;
        }

        .meta-item:last-child {
          border-right: 0;
        }

        .meta-item span {
          display: block;
          color: #94a3b8;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .meta-item strong {
          display: block;
          color: #475569;
          margin-top: 5px;
          font-size: 11px;
        }

        .success-text {
          color: #059669 !important;
        }

        .mono {
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        }

        /* PRODUCTS */

        .products-section {
          padding: 0 24px 25px;
        }

        .products-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 11px;
        }

        .products-title small {
          color: #94a3b8;
          font-size: 10px;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .premium-product {
          display: flex;
          align-items: center;
          gap: 11px;
          min-width: 0;

          padding: 9px;
          border-radius: 13px;

          background: #fffefa;
          border: 1px solid #e8e4dc;

          transition: .2s ease;
        }

        .premium-product:hover {
          background: #ffffff;
          border-color: #d6d3d1;
          box-shadow: 0 5px 15px rgba(71,85,105,.06);
        }

        .product-image-wrap {
          width: 51px;
          height: 51px;
          flex: 0 0 51px;

          overflow: hidden;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 10px;
          background: #f1f5f9;
          color: #94a3b8;
        }

        .product-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-info {
          min-width: 0;
          flex: 1;
        }

        .product-info strong {
          display: block;
          overflow: hidden;

          color: #334155;
          font-size: 11px;
          font-weight: 700;

          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .product-info span {
          display: block;
          color: #64748b;
          margin-top: 4px;
          font-size: 9px;
        }

        .product-total {
          color: #475569;
          font-family: monospace;
          font-size: 10px;
          white-space: nowrap;
        }

        .no-items {
          color: #64748b;
          font-size: 11px;
          padding: 15px;
        }

        /* CANCEL */

        .cancelled-panel {
          margin: 25px 24px;
          padding: 18px;

          display: flex;
          gap: 14px;
          align-items: center;

          border-radius: 15px;

          background: #fff7f7;
          border: 1px solid #fecaca;
        }

        .cancelled-icon {
          width: 42px;
          height: 42px;
          flex: 0 0 42px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 12px;
          background: #fee2e2;

          color: #dc2626;
          font-size: 23px;
        }

        .cancelled-panel strong {
          color: #dc2626;
          font-size: 13px;
        }

        .cancelled-panel p {
          margin: 3px 0;
          color: #64748b;
          font-size: 10px;
        }

        .cancelled-panel span {
          color: #64748b;
          font-size: 9px;
        }

        .cancelled-panel b {
          color: #475569;
          margin-left: 5px;
        }

        /* EMPTY */

        .empty-order-card {
          padding: 80px 20px;
          text-align: center;

          border-radius: 25px;
          border: 1px solid #e5e0d7;

          background: rgba(255,255,255,.75);

          box-shadow: 0 15px 45px rgba(71,85,105,.07);
        }

        .empty-bag {
          width: 75px;
          height: 75px;

          display: flex;
          align-items: center;
          justify-content: center;

          margin: 0 auto 20px;

          border-radius: 23px;
          background: #ecfdf5;

          font-size: 30px;
        }

        .empty-order-card h2 {
          color: #1f2937;
          font-size: 22px;
        }

        .empty-order-card p {
          max-width: 480px;
          margin: 8px auto 25px;

          color: #64748b;
          font-size: 13px;
          line-height: 1.7;
        }

        .premium-primary-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;

          padding: 12px 18px;

          border-radius: 12px;

          background: #10b981;
          color: #fff;

          text-decoration: none;

          font-size: 12px;
          font-weight: 800;

          box-shadow: 0 10px 25px rgba(16,185,129,.18);
        }

        .premium-primary-btn:hover {
          background: #059669;
        }

        /* MODAL */

        .premium-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 9999;

          padding: 20px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: rgba(30,41,59,.35);
          backdrop-filter: blur(12px);
        }

        .premium-modal {
          width: 100%;
          max-width: 650px;
          max-height: 90vh;

          overflow-y: auto;

          border: 1px solid #e2e8f0;
          border-radius: 25px;

          background: #fffdf8;

          box-shadow:
            0 30px 100px rgba(15,23,42,.20);
        }

        .modal-header {
          padding: 22px;

          display: flex;
          align-items: flex-start;
          justify-content: space-between;

          border-bottom: 1px solid #eee9df;
        }

        .modal-header h2 {
          margin: 5px 0 0;
          color: #1f2937;
          font-size: 23px;
          font-weight: 900;
        }

        .modal-header h2 span {
          color: #059669;
        }

        .modal-close {
          width: 34px;
          height: 34px;

          border: 1px solid #e2e8f0;
          border-radius: 10px;

          background: #ffffff;
          color: #64748b;

          font-size: 20px;
          cursor: pointer;
        }

        .modal-close:hover {
          background: #f8fafc;
          color: #1f2937;
        }

        .modal-order-info {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;

          margin: 18px;

          overflow: hidden;

          border-radius: 13px;
          background: #e5e7eb;
        }

        .modal-order-info > div {
          padding: 13px;
          background: #ffffff;
        }

        .modal-order-info span {
          display: block;
          color: #94a3b8;

          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .modal-order-info strong {
          display: block;

          color: #475569;
          margin-top: 5px;
          font-size: 10px;
        }

        .modal-timeline {
          padding: 8px 22px 25px;
        }

        .timeline-row {
          display: flex;
          gap: 15px;
        }

        .timeline-marker {
          position: relative;

          width: 20px;
          flex: 0 0 20px;

          display: flex;
          justify-content: center;
        }

        .timeline-dot {
          position: relative;
          z-index: 2;

          width: 18px;
          height: 18px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: #10b981;
          color: #fff;

          font-size: 9px;
          font-weight: 900;

          box-shadow: 0 0 13px rgba(16,185,129,.25);
        }

        .timeline-connector {
          position: absolute;
          top: 18px;
          bottom: 0;

          width: 1px;

          background: linear-gradient(
            #10b981,
            #e2e8f0
          );
        }

        .timeline-content {
          flex: 1;
          padding-bottom: 24px;
        }

        .timeline-top {
          display: flex;
          justify-content: space-between;
          gap: 15px;
        }

        .timeline-top strong {
          color: #334155;
          font-size: 12px;
        }

        .timeline-top time {
          color: #94a3b8;
          font-size: 9px;
        }

        .timeline-location {
          color: #0891b2;
          margin-top: 6px;
          font-size: 10px;
        }

        .timeline-content p {
          margin: 5px 0 0;

          color: #64748b;
          font-size: 10px;
          line-height: 1.6;
        }

        .timeline-empty {
          padding: 40px 10px;
          text-align: center;
        }

        .timeline-empty div {
          font-size: 32px;
        }

        .timeline-empty h4 {
          margin: 12px 0 5px;
          color: #334155;
          font-size: 14px;
        }

        .timeline-empty p {
          color: #64748b;
          font-size: 10px;
        }

        /* LOADING */

        .orders-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          min-height: 100vh;

          text-align: center;
        }

        .loading-orb {
          position: relative;

          width: 70px;
          height: 70px;

          display: flex;
          align-items: center;
          justify-content: center;

          margin-bottom: 18px;
        }

        .loading-ring {
          position: absolute;
          inset: 0;

          border: 2px solid rgba(16,185,129,.15);
          border-top-color: #10b981;

          border-radius: 50%;

          animation: premiumSpin 1s linear infinite;
        }

        .loading-icon {
          font-size: 25px;
        }

        .orders-loading h5 {
          margin: 0;
          color: #334155;
        }

        .orders-loading p {
          margin-top: 7px;
          color: #64748b;
          font-size: 11px;
        }

        @keyframes premiumSpin {
          to {
            transform: rotate(360deg);
          }
        }

        /* MOBILE */

        @media (max-width: 768px) {

          .orders-premium-page {
            padding: 28px 12px 60px;
          }

          .orders-hero {
            align-items: flex-start;
            flex-direction: column;
            margin-bottom: 25px;
          }

          .orders-stat {
            width: 100%;
          }

          .premium-order-header {
            align-items: flex-start;
            flex-direction: column;
            padding: 17px;
          }

          .order-heading-right {
            width: 100%;
            justify-content: flex-start;
          }

          .amount-box {
            margin-right: auto;
            text-align: left;
            border-right: 0;
          }

          .status-section {
            padding: 20px 17px;
          }

          .status-section-top {
            align-items: flex-start;
            flex-direction: column;
            gap: 8px;
          }

          .premium-step > span {
            font-size: 8px;
          }

          .shipping-card {
            margin: 0 17px 18px;

            align-items: flex-start;
            flex-direction: column;
          }

          .shipping-actions {
            width: 100%;
          }

          .track-external-btn,
          .timeline-btn {
            flex: 1;
          }

          .order-meta-grid {
            margin: 0 17px 18px;
            grid-template-columns: 1fr;
          }

          .meta-item {
            border-right: 0;
            border-bottom: 1px solid #e5e7eb;
          }

          .meta-item:last-child {
            border-bottom: 0;
          }

          .products-section {
            padding: 0 17px 20px;
          }

          .products-grid {
            grid-template-columns: 1fr;
          }

          .product-total {
            display: none;
          }

          .cancelled-panel {
            margin: 20px 17px;
          }

          .modal-order-info {
            grid-template-columns: 1fr;
          }

          .modal-header {
            padding: 18px;
          }

          .modal-timeline {
            padding-left: 18px;
            padding-right: 18px;
          }

          .timeline-top {
            flex-direction: column;
            gap: 3px;
          }
        }

        @media (max-width: 480px) {

          .orders-hero h1 {
            font-size: 34px;
          }

          .invoice-btn,
          .cancel-btn {
            flex: 1;
          }

          .order-heading-right {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .amount-box {
            grid-column: 1 / -1;
          }

          .premium-step-circle {
            width: 30px;
            height: 30px;
          }

          .stepper-line {
            top: 15px;
          }

          .premium-step > span {
            font-size: 7px;
          }
        }

      `}</style>
    </div>
  );
};

export default Orders;