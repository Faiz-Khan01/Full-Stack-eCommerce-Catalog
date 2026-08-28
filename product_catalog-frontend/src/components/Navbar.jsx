// import React, { useEffect, useMemo, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import CategoryFilter from "./CategoryFilter";
// import ThemeToggle from "./ThemeToggle";
// import { useAuth } from "../context/AuthContext";
// import { useCart } from "../context/CartContext";

// const getWishlistItems = () => {
//   try {
//     const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
//     return Array.isArray(saved) ? saved : [];
//   } catch {
//     return [];
//   }
// };

// const getCartItems = () => {
//   try {
//     const saved = JSON.parse(localStorage.getItem("cart") || "[]");
//     return Array.isArray(saved) ? saved : [];
//   } catch {
//     return [];
//   }
// };

// const calculateCartCount = (items) => {
//   if (!Array.isArray(items)) return 0;

//   return items.reduce((total, item) => {
//     return total + Number(item?.quantity || 1);
//   }, 0);
// };

// const Navbar = ({
//   searchTerm = "",
//   onSearch = () => {},
//   categories = [],
//   selectedCategory = "",
//   onCategoryChange = () => {},
//   sortOrder = "asc",
//   onSortChange = () => {},
// }) => {
//   const { user, logout, isAuthenticated, isAdmin } = useAuth();

//   /*
//    * CartContext may return:
//    * - cart
//    * - cartCount
//    *
//    * We support both so navbar doesn't break if cartCount
//    * isn't calculated inside the context.
//    */
//   const cartContext = useCart() || {};

//   const {
//     cartItems: cart = [],
//     cartCount: contextCartCount,
//   } = cartContext;

//   const [wishlistCount, setWishlistCount] = useState(0);
//   const [localCartCount, setLocalCartCount] = useState(0);

//   // Location
//   const [showLocationModal, setShowLocationModal] = useState(false);
//   const [pincode, setPincode] = useState("");
//   const [currentLocation, setCurrentLocation] =
//     useState("Nagpur 440001");

//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const navigate = useNavigate();

//   /*
//    * CART COUNT
//    *
//    * Priority:
//    * 1. CartContext cartCount
//    * 2. CartContext cart
//    * 3. localStorage cart
//    */
//   const calculatedContextCartCount = useMemo(() => {
//     if (Array.isArray(cart)) {
//       return calculateCartCount(cart);
//     }

//     return 0;
//   }, [cart]);

//   const cartCount =
//     Number(contextCartCount) > 0
//       ? Number(contextCartCount)
//       : calculatedContextCartCount > 0
//       ? calculatedContextCartCount
//       : localCartCount;

//   /*
//    * LOAD LOCATION + WISHLIST + CART
//    */
//   useEffect(() => {
//     const savedLocation = localStorage.getItem("delivery_location");
//     const savedPin = localStorage.getItem("delivery_pincode");

//     if (savedLocation) {
//       setCurrentLocation(savedLocation);
//     } else if (savedPin) {
//       setCurrentLocation(`Pincode ${savedPin}`);
//     }

//     const syncWishlist = () => {
//       setWishlistCount(getWishlistItems().length);
//     };

//     const syncCart = () => {
//       const items = getCartItems();
//       setLocalCartCount(calculateCartCount(items));
//     };

//     // Initial sync
//     syncWishlist();
//     syncCart();

//     /*
//      * Wishlist events
//      */
//     window.addEventListener("wishlistUpdated", syncWishlist);

//     /*
//      * Cart custom events
//      *
//      * Your CartContext / Cart page can dispatch:
//      *
//      * window.dispatchEvent(new Event("cartUpdated"));
//      */
//     window.addEventListener("cartUpdated", syncCart);

//     /*
//      * Storage event works when localStorage
//      * changes from another browser tab.
//      */
//     window.addEventListener("storage", syncWishlist);
//     window.addEventListener("storage", syncCart);

//     return () => {
//       window.removeEventListener("wishlistUpdated", syncWishlist);
//       window.removeEventListener("cartUpdated", syncCart);
//       window.removeEventListener("storage", syncWishlist);
//       window.removeEventListener("storage", syncCart);
//     };
//   }, []);

//   /*
//    * Whenever CartContext cart changes,
//    * also keep local fallback synchronized.
//    */
//   useEffect(() => {
//     if (Array.isArray(cart)) {
//       setLocalCartCount(calculateCartCount(cart));
//     }
//   }, [cart]);

//   /*
//    * LOCATION
//    */
//   const handleApplyPincode = async () => {
//     const cleanPin = pincode.trim();

//     if (cleanPin.length !== 6) {
//       alert("Please enter a valid 6-digit Indian postal code");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `https://api.postalpincode.in/pincode/${cleanPin}`
//       );

//       const data = await response.json();

//       if (
//         data &&
//         data[0] &&
//         data[0].Status === "Success" &&
//         data[0].PostOffice &&
//         data[0].PostOffice.length > 0
//       ) {
//         const postOffice = data[0].PostOffice[0];

//         const cityName =
//           postOffice.District ||
//           postOffice.Name ||
//           "India";

//         const locationString = `${cityName} ${cleanPin}`;

//         localStorage.setItem(
//           "delivery_pincode",
//           cleanPin
//         );

//         localStorage.setItem(
//           "delivery_location",
//           locationString
//         );

//         setCurrentLocation(locationString);
//         setShowLocationModal(false);
//         setPincode("");
//       } else {
//         alert(
//           "Invalid Pincode! Please enter a valid Indian postal code."
//         );
//       }
//     } catch (error) {
//       console.error("Pincode API Error:", error);

//       localStorage.setItem(
//         "delivery_pincode",
//         cleanPin
//       );

//       setCurrentLocation(`Pincode ${cleanPin}`);
//       setShowLocationModal(false);
//       setPincode("");
//     }
//   };

//   /*
//    * LOGOUT
//    */
//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   /*
//    * CLOSE MOBILE MENU
//    */
//   const closeMobileMenu = () => {
//     setMobileMenuOpen(false);
//   };

//   return (
//     <>
//       <header className="portfolio-nav-header sticky-top">
//         <div className="portfolio-nav-container">

//           {/* =====================================================
//               BRAND
//           ====================================================== */}
//           <Link
//             to="/"
//             className="portfolio-brand"
//             onClick={closeMobileMenu}
//           >
//             <div className="brand-logo-glow">
//               <span className="brand-logo-icon">
//                 ⚡
//               </span>
//             </div>

//             <div className="brand-text-wrapper">
//               <span className="brand-name">
//                 TechStore
//               </span>

//               <span className="brand-badge">
//                 PRO
//               </span>
//             </div>
//           </Link>

//           {/* =====================================================
//               DELIVERY LOCATION
//           ====================================================== */}
//           <button
//             type="button"
//             className="nav-location-pill d-none d-xl-flex"
//             onClick={() =>
//               setShowLocationModal(true)
//             }
//             title="Choose delivery pincode"
//           >
//             <span className="location-pin-icon">
//               📍
//             </span>

//             <div className="location-text-col">
//               <span className="location-label">
//                 Deliver to
//               </span>

//               <span className="location-val text-truncate">
//                 {currentLocation}
//               </span>
//             </div>
//           </button>

//           {/* =====================================================
//               SEARCH
//           ====================================================== */}
//           <div className="portfolio-search-wrapper flex-grow-1">
//             <div className="portfolio-search-box">
//               <span className="search-icon-prefix">
//                 🔍
//               </span>

//               <input
//                 type="text"
//                 className="portfolio-search-input"
//                 placeholder="Search products, brands, tech..."
//                 value={searchTerm}
//                 onChange={(e) =>
//                   onSearch(e.target.value)
//                 }
//                 aria-label="Search catalog"
//               />

//               {searchTerm && (
//                 <button
//                   type="button"
//                   className="search-clear-btn"
//                   onClick={() => onSearch("")}
//                   aria-label="Clear search"
//                 >
//                   ✕
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* =====================================================
//               CATEGORY + SORT
//           ====================================================== */}
//           <div className="d-none d-lg-flex align-items-center gap-2">
//             <div className="category-filter-wrapper">
//               <CategoryFilter
//                 categories={categories}
//                 selectedCategory={selectedCategory}
//                 onSelect={onCategoryChange}
//               />
//             </div>

//             <select
//               className="portfolio-sort-select"
//               value={sortOrder}
//               onChange={(e) =>
//                 onSortChange(e.target.value)
//               }
//               aria-label="Sort products"
//             >
//               <option value="asc">
//                 Price: Low ↑
//               </option>

//               <option value="desc">
//                 Price: High ↓
//               </option>
//             </select>
//           </div>

//           {/* =====================================================
//               RIGHT ACTIONS
//           ====================================================== */}
//           <div className="portfolio-actions-group">

//             {/* Theme */}
//             <div className="action-pill">
//               <ThemeToggle />
//             </div>

//             {/* =================================================
//                 WISHLIST
//             ================================================== */}
//             <Link
//               to="/wishlist"
//               className="action-pill-btn wishlist-action"
//               title={
//                 wishlistCount > 0
//                   ? `${wishlistCount} wishlist ${
//                       wishlistCount === 1
//                         ? "item"
//                         : "items"
//                     }`
//                   : "Wishlist"
//               }
//             >
//               <span className="action-icon text-rose">
//                 ♥
//               </span>

//               {wishlistCount > 0 && (
//                 <span className="action-badge bg-rose">
//                   {wishlistCount > 99
//                     ? "99+"
//                     : wishlistCount}
//                 </span>
//               )}
//             </Link>

//             {/* =================================================
//                 CART
//             ================================================== */}
//             <Link
//               to="/cart"
//               className="action-pill-btn cart-action"
//               title={
//                 cartCount > 0
//                   ? `${cartCount} cart ${
//                       cartCount === 1
//                         ? "item"
//                         : "items"
//                     }`
//                   : "Cart"
//               }
//             >
//               <span className="action-icon">
//                 🛒
//               </span>

//               {cartCount > 0 && (
//                 <span className="action-badge bg-rose cart-badge">
//                   {cartCount > 99
//                     ? "99+"
//                     : cartCount}
//                 </span>
//               )}
//             </Link>

//             {/* =================================================
//                 USER
//             ================================================== */}
//             <div className="dropdown">
//               <button
//                 className="user-profile-btn dropdown-toggle"
//                 type="button"
//                 data-bs-toggle="dropdown"
//                 aria-expanded="false"
//               >
//                 <div className="user-avatar-circle">
//                   {isAuthenticated
//                     ? user?.name
//                       ? user.name[0].toUpperCase()
//                       : "U"
//                     : "👤"}
//                 </div>

//                 <span className="user-name-text d-none d-md-inline">
//                   {isAuthenticated
//                     ? user?.name || "Account"
//                     : "Sign In"}
//                 </span>
//               </button>

//               <ul className="dropdown-menu dropdown-menu-end portfolio-dropdown shadow-2xl">

//                 {!isAuthenticated ? (
//                   <>
//                     <li>
//                       <Link
//                         className="dropdown-item portfolio-dropdown-item"
//                         to="/login"
//                       >
//                         <span>🔐</span>
//                         Sign In
//                       </Link>
//                     </li>

//                     <li>
//                       <Link
//                         className="dropdown-item portfolio-dropdown-item"
//                         to="/signup"
//                       >
//                         <span>📝</span>
//                         Create Account
//                       </Link>
//                     </li>
//                   </>
//                 ) : (
//                   <>
//                     <li className="dropdown-header">
//                       <div className="fw-bold text-white text-truncate">
//                         {user?.name || "User"}
//                       </div>

//                       <div className="small text-slate-400 text-truncate">
//                         {user?.email}
//                       </div>
//                     </li>

//                     <li>
//                       <hr className="dropdown-divider border-slate-700" />
//                     </li>

//                     <li>
//                       <Link
//                         className="dropdown-item portfolio-dropdown-item"
//                         to="/profile"
//                       >
//                         <span>👤</span>
//                         Profile Settings
//                       </Link>
//                     </li>

//                     <li>
//                       <Link
//                         className="dropdown-item portfolio-dropdown-item"
//                         to="/orders"
//                       >
//                         <span>📦</span>
//                         My Orders & Tracking
//                       </Link>
//                     </li>

//                     {isAdmin && (
//                       <li>
//                         <Link
//                           className="dropdown-item portfolio-dropdown-item text-warning"
//                           to="/admin"
//                         >
//                           <span>⚡</span>
//                           Admin Dashboard
//                         </Link>
//                       </li>
//                     )}

//                     <li>
//                       <hr className="dropdown-divider border-slate-700" />
//                     </li>

//                     <li>
//                       <button
//                         type="button"
//                         className="dropdown-item portfolio-dropdown-item text-danger"
//                         onClick={handleLogout}
//                       >
//                         <span>🚪</span>
//                         Log Out
//                       </button>
//                     </li>
//                   </>
//                 )}
//               </ul>
//             </div>

//             {/* =================================================
//                 MOBILE MENU
//             ================================================== */}
//             <button
//               type="button"
//               className="mobile-menu-trigger d-lg-none"
//               onClick={() =>
//                 setMobileMenuOpen(
//                   !mobileMenuOpen
//                 )
//               }
//               aria-label="Toggle navigation"
//             >
//               <span>
//                 {mobileMenuOpen ? "✕" : "☰"}
//               </span>
//             </button>
//           </div>
//         </div>

//         {/* =====================================================
//             MOBILE DRAWER
//         ====================================================== */}
//         {mobileMenuOpen && (
//           <div className="portfolio-mobile-drawer d-lg-none">
//             <div className="p-3 d-flex flex-column gap-3">

//               {/* Mobile Location */}
//               <button
//                 type="button"
//                 className="btn btn-dark border-slate-700 text-start d-flex align-items-center gap-2 w-100 py-2 rounded-3"
//                 onClick={() => {
//                   setShowLocationModal(true);
//                   closeMobileMenu();
//                 }}
//               >
//                 <span>📍</span>

//                 <div>
//                   <div className="text-muted small">
//                     Deliver to
//                   </div>

//                   <div className="fw-semibold text-white">
//                     {currentLocation}
//                   </div>
//                 </div>
//               </button>

//               {/* Mobile Category + Sort */}
//               <div className="d-flex gap-2">
//                 <div className="flex-grow-1">
//                   <CategoryFilter
//                     categories={categories}
//                     selectedCategory={selectedCategory}
//                     onSelect={(cat) => {
//                       onCategoryChange(cat);
//                       closeMobileMenu();
//                     }}
//                   />
//                 </div>

//                 <select
//                   className="portfolio-sort-select flex-grow-1"
//                   value={sortOrder}
//                   onChange={(e) =>
//                     onSortChange(
//                       e.target.value
//                     )
//                   }
//                 >
//                   <option value="asc">
//                     Price: Low ↑
//                   </option>

//                   <option value="desc">
//                     Price: High ↓
//                   </option>
//                 </select>
//               </div>

//               {/* Mobile Quick Actions */}
//               <div className="mobile-quick-actions">

//                 <Link
//                   to="/wishlist"
//                   className="mobile-quick-action"
//                   onClick={closeMobileMenu}
//                 >
//                   <span className="mobile-action-icon text-rose">
//                     ♥
//                   </span>

//                   <span>Wishlist</span>

//                   {wishlistCount > 0 && (
//                     <span className="mobile-action-count bg-rose">
//                       {wishlistCount}
//                     </span>
//                   )}
//                 </Link>

//                 <Link
//                   to="/cart"
//                   className="mobile-quick-action"
//                   onClick={closeMobileMenu}
//                 >
//                   <span className="mobile-action-icon">
//                     🛒
//                   </span>

//                   <span>Cart</span>

//                   {cartCount > 0 && (
//                     <span className="mobile-action-count bg-rose">
//                       {cartCount > 99
//                         ? "99+"
//                         : cartCount}
//                     </span>
//                   )}
//                 </Link>

//                 {isAuthenticated && (
//                   <Link
//                     to="/orders"
//                     className="mobile-quick-action"
//                     onClick={closeMobileMenu}
//                   >
//                     <span className="mobile-action-icon">
//                       📦
//                     </span>

//                     <span>My Orders</span>
//                   </Link>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </header>

//       {/* =========================================================
//           LOCATION MODAL
//       ========================================================== */}
//       {showLocationModal && (
//         <div
//           className="portfolio-modal-backdrop"
//           onClick={() =>
//             setShowLocationModal(false)
//           }
//         >
//           <div
//             className="portfolio-modal-card"
//             onClick={(e) =>
//               e.stopPropagation()
//             }
//           >
//             <div className="d-flex justify-content-between align-items-center pb-3 border-bottom border-slate-800">
//               <h5 className="fw-bold m-0 text-white d-flex align-items-center gap-2">
//                 <span>📍</span>
//                 Select Delivery Location
//               </h5>

//               <button
//                 type="button"
//                 className="btn-close-custom"
//                 onClick={() =>
//                   setShowLocationModal(false)
//                 }
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="py-4 text-center">
//               <p className="text-slate-400 small mb-4">
//                 Enter your 6-digit postal code to
//                 check estimated delivery times and
//                 shipping rates.
//               </p>

//               <div className="input-group mb-3">
//                 <input
//                   type="text"
//                   className="form-control portfolio-input"
//                   placeholder="Enter 6-digit PIN (e.g. 440001)"
//                   maxLength={6}
//                   value={pincode}
//                   onChange={(e) =>
//                     setPincode(
//                       e.target.value.replace(
//                         /\D/g,
//                         ""
//                       )
//                     )
//                   }
//                 />

//                 <button
//                   className="btn btn-emerald px-4 fw-semibold"
//                   type="button"
//                   onClick={handleApplyPincode}
//                 >
//                   Apply PIN
//                 </button>
//               </div>

//               {isAuthenticated ? (
//                 <div className="alert-glass small py-2 px-3 rounded-3 text-slate-300">
//                   Signed in as{" "}
//                   <b>{user?.email}</b>
//                 </div>
//               ) : (
//                 <button
//                   className="btn btn-outline-light w-100 rounded-pill py-2 text-sm"
//                   onClick={() => {
//                     setShowLocationModal(false);
//                     navigate("/login");
//                   }}
//                 >
//                   Sign in to view saved addresses
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* =========================================================
//           STYLES
//       ========================================================== */}
//       <style>{`

//         /* =====================================================
//            NAVBAR
//         ====================================================== */

//         .portfolio-nav-header {
//           background: rgba(9, 13, 22, 0.88);
//           backdrop-filter: blur(18px);
//           -webkit-backdrop-filter: blur(18px);
//           border-bottom: 1px solid rgba(255, 255, 255, 0.08);
//           box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
//           z-index: 1040;
//         }

//         .portfolio-nav-container {
//           max-width: 1440px;
//           margin: 0 auto;
//           padding: 10px 20px;
//           display: flex;
//           align-items: center;
//           gap: 16px;
//         }

//         /* =====================================================
//            BRAND
//         ====================================================== */

//         .portfolio-brand {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           text-decoration: none;
//           flex-shrink: 0;
//         }

//         .brand-logo-glow {
//           width: 38px;
//           height: 38px;
//           border-radius: 12px;
//           background: linear-gradient(
//             135deg,
//             #10b981,
//             #06b6d4
//           );
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           box-shadow:
//             0 0 20px rgba(16, 185, 129, 0.35);
//           transition:
//             transform 0.2s ease,
//             box-shadow 0.2s ease;
//         }

//         .portfolio-brand:hover .brand-logo-glow {
//           transform: scale(1.05);
//           box-shadow:
//             0 0 28px rgba(16, 185, 129, 0.55);
//         }

//         .brand-logo-icon {
//           font-size: 19px;
//         }

//         .brand-text-wrapper {
//           display: flex;
//           align-items: center;
//           gap: 6px;
//         }

//         .brand-name {
//           font-size: 1.25rem;
//           font-weight: 800;
//           letter-spacing: -0.5px;
//           background: linear-gradient(
//             90deg,
//             #f8fafc,
//             #94a3b8
//           );
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//         }

//         .brand-badge {
//           font-size: 9px;
//           font-weight: 800;
//           padding: 2px 6px;
//           border-radius: 6px;
//           background: rgba(16, 185, 129, 0.15);
//           color: #34d399;
//           border: 1px solid rgba(16, 185, 129, 0.3);
//           letter-spacing: 0.5px;
//         }

//         /* =====================================================
//            LOCATION
//         ====================================================== */

//         .nav-location-pill {
//           background: rgba(255, 255, 255, 0.04);
//           border: 1px solid rgba(255, 255, 255, 0.08);
//           border-radius: 12px;
//           padding: 5px 12px;
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           cursor: pointer;
//           transition: all 0.2s ease;
//         }

//         .nav-location-pill:hover {
//           background: rgba(255, 255, 255, 0.08);
//           border-color: rgba(16, 185, 129, 0.4);
//         }

//         .location-pin-icon {
//           font-size: 16px;
//         }

//         .location-text-col {
//           display: flex;
//           flex-direction: column;
//           text-align: left;
//           line-height: 1.15;
//         }

//         .location-label {
//           font-size: 10px;
//           color: #94a3b8;
//           font-weight: 500;
//         }

//         .location-val {
//           font-size: 12px;
//           color: #f8fafc;
//           font-weight: 600;
//           max-width: 110px;
//         }

//         /* =====================================================
//            SEARCH
//         ====================================================== */

//         .portfolio-search-wrapper {
//           max-width: 480px;
//           min-width: 120px;
//         }

//         .portfolio-search-box {
//           position: relative;
//           display: flex;
//           align-items: center;
//           width: 100%;
//         }

//         .search-icon-prefix {
//           position: absolute;
//           left: 14px;
//           font-size: 14px;
//           opacity: 0.6;
//           pointer-events: none;
//         }

//         .portfolio-search-input {
//           width: 100%;
//           height: 40px;
//           padding: 0 36px 0 38px;
//           background: rgba(255, 255, 255, 0.05);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           border-radius: 12px;
//           color: #f8fafc;
//           font-size: 13px;
//           outline: none;
//           transition: all 0.2s ease;
//         }

//         .portfolio-search-input::placeholder {
//           color: #64748b;
//         }

//         .portfolio-search-input:focus {
//           background: rgba(255, 255, 255, 0.08);
//           border-color: #10b981;
//           box-shadow:
//             0 0 0 3px rgba(16, 185, 129, 0.15);
//         }

//         .search-clear-btn {
//           position: absolute;
//           right: 12px;
//           background: transparent;
//           border: none;
//           color: #94a3b8;
//           font-size: 12px;
//           cursor: pointer;
//         }

//         /* =====================================================
//            SORT
//         ====================================================== */

//         .portfolio-sort-select {
//           height: 40px;
//           padding: 0 10px;
//           background: rgba(255, 255, 255, 0.05);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           border-radius: 12px;
//           color: #f8fafc;
//           font-size: 12px;
//           cursor: pointer;
//           outline: none;
//         }

//         .portfolio-sort-select option {
//           background: #0f172a;
//           color: #f8fafc;
//         }

//         /* =====================================================
//            ACTIONS
//         ====================================================== */

//         .portfolio-actions-group {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           flex-shrink: 0;
//         }

//         .action-pill {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .action-pill-btn {
//           width: 40px;
//           height: 40px;
//           border-radius: 12px;
//           background: rgba(255, 255, 255, 0.05);
//           border: 1px solid rgba(255, 255, 255, 0.08);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: #f8fafc;
//           text-decoration: none;
//           position: relative;
//           transition: all 0.2s ease;
//         }

//         .action-pill-btn:hover {
//           background: rgba(255, 255, 255, 0.1);
//           border-color: rgba(255, 255, 255, 0.2);
//           transform: translateY(-1px);
//           color: #ffffff;
//         }

//         .action-icon {
//           font-size: 18px;
//           line-height: 1;
//         }

//         /* =====================================================
//            BADGES
//         ====================================================== */

//         .action-badge {
//           position: absolute;
//           top: -7px;
//           right: -7px;

//           min-width: 20px;
//           height: 20px;

//           padding: 0 5px;

//           border-radius: 999px;

//           font-size: 10px;
//           line-height: 1;
//           font-weight: 800;

//           color: #ffffff;

//           display: flex;
//           align-items: center;
//           justify-content: center;

//           border: 2px solid #090d16;

//           z-index: 10;

//           box-shadow:
//             0 4px 12px rgba(0, 0, 0, 0.35);

//           animation: badgePop 0.2s ease-out;
//         }

//         .cart-badge {
//           background: linear-gradient(
//             135deg,
//             #10b981,
//             #06b6d4
//           );
//           box-shadow:
//             0 4px 14px rgba(16, 185, 129, 0.45);
//         }

//         .bg-rose {
//           background: #f43f5e;
//         }

//         .bg-emerald {
//           background: #10b981;
//         }

//         @keyframes badgePop {
//           from {
//             transform: scale(0.7);
//             opacity: 0;
//           }

//           to {
//             transform: scale(1);
//             opacity: 1;
//           }
//         }

//         /* =====================================================
//            USER
//         ====================================================== */

//         .user-profile-btn {
//           height: 40px;
//           padding: 4px 12px 4px 6px;
//           border-radius: 12px;
//           background: rgba(255, 255, 255, 0.06);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           color: #f8fafc;
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           cursor: pointer;
//           font-size: 13px;
//           font-weight: 600;
//           transition: all 0.2s ease;
//         }

//         .user-profile-btn:hover {
//           background: rgba(255, 255, 255, 0.1);
//           border-color: #10b981;
//         }

//         .user-avatar-circle {
//           width: 28px;
//           height: 28px;
//           border-radius: 8px;
//           background: linear-gradient(
//             135deg,
//             #10b981,
//             #06b6d4
//           );
//           color: white;
//           font-weight: 800;
//           font-size: 13px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           box-shadow:
//             0 2px 8px rgba(16, 185, 129, 0.3);
//         }

//         /* =====================================================
//            DROPDOWN
//         ====================================================== */

//         .portfolio-dropdown {
//           background: #0d1322 !important;
//           border: 1px solid rgba(255, 255, 255, 0.12) !important;
//           border-radius: 16px !important;
//           padding: 8px !important;
//           min-width: 220px;
//         }

//         .portfolio-dropdown-item {
//           color: #cbd5e1 !important;
//           border-radius: 10px !important;
//           padding: 9px 12px !important;
//           font-size: 13px !important;
//           font-weight: 500;
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           transition: all 0.15s ease;
//         }

//         .portfolio-dropdown-item:hover {
//           background: rgba(255, 255, 255, 0.08) !important;
//           color: #ffffff !important;
//         }

//         /* =====================================================
//            MOBILE
//         ====================================================== */

//         .mobile-menu-trigger {
//           width: 40px;
//           height: 40px;
//           border-radius: 12px;
//           background: rgba(255, 255, 255, 0.06);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           color: #f8fafc;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 16px;
//         }

//         .portfolio-mobile-drawer {
//           background: #090d16;
//           border-top: 1px solid rgba(255, 255, 255, 0.08);
//           box-shadow:
//             0 20px 40px rgba(0, 0, 0, 0.4);
//         }

//         .mobile-quick-actions {
//           display: grid;
//           grid-template-columns: repeat(2, 1fr);
//           gap: 10px;
//         }

//         .mobile-quick-action {
//           min-height: 48px;
//           padding: 10px 12px;
//           border-radius: 12px;
//           background: rgba(255, 255, 255, 0.04);
//           border: 1px solid rgba(255, 255, 255, 0.08);
//           color: #f8fafc;
//           text-decoration: none;
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           position: relative;
//           font-size: 13px;
//           font-weight: 600;
//         }

//         .mobile-action-icon {
//           font-size: 18px;
//         }

//         .mobile-action-count {
//           margin-left: auto;
//           min-width: 20px;
//           height: 20px;
//           padding: 0 5px;
//           border-radius: 999px;
//           color: white;
//           font-size: 10px;
//           font-weight: 800;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         /* =====================================================
//            MODAL
//         ====================================================== */

//         .portfolio-modal-backdrop {
//           position: fixed;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;

//           background: rgba(0, 0, 0, 0.75);

//           backdrop-filter: blur(8px);

//           display: flex;
//           align-items: center;
//           justify-content: center;

//           z-index: 2000;
//           padding: 16px;
//         }

//         .portfolio-modal-card {
//           width: 100%;
//           max-width: 460px;

//           background: #0f172a;

//           border: 1px solid rgba(255, 255, 255, 0.12);

//           border-radius: 20px;

//           padding: 24px;

//           box-shadow:
//             0 25px 60px rgba(0, 0, 0, 0.6);
//         }

//         .btn-close-custom {
//           background: transparent;
//           border: none;
//           color: #94a3b8;
//           font-size: 18px;
//           cursor: pointer;
//         }

//         .portfolio-input {
//           background: rgba(255, 255, 255, 0.06) !important;
//           border: 1px solid rgba(255, 255, 255, 0.12) !important;
//           color: #ffffff !important;
//           border-radius: 12px 0 0 12px !important;
//         }

//         .portfolio-input::placeholder {
//           color: #64748b;
//         }

//         .portfolio-input:focus {
//           border-color: #10b981 !important;
//           box-shadow: none !important;
//         }

//         .btn-emerald {
//           background: #10b981;
//           color: #ffffff;
//           border: none;
//           border-radius: 0 12px 12px 0;
//         }

//         .btn-emerald:hover {
//           background: #059669;
//           color: #ffffff;
//         }

//         .alert-glass {
//           background: rgba(255, 255, 255, 0.04);
//           border: 1px solid rgba(255, 255, 255, 0.08);
//         }

//         /* =====================================================
//            RESPONSIVE
//         ====================================================== */

//         @media (max-width: 991px) {
//           .portfolio-nav-container {
//             padding: 9px 14px;
//             gap: 10px;
//           }

//           .portfolio-search-wrapper {
//             max-width: none;
//           }

//           .portfolio-actions-group {
//             gap: 7px;
//           }
//         }

//         @media (max-width: 767px) {
//           .brand-text-wrapper {
//             display: none;
//           }

//           .portfolio-search-wrapper {
//             flex: 1;
//           }

//           .portfolio-search-input {
//             height: 38px;
//             font-size: 12px;
//           }

//           .action-pill {
//             display: none;
//           }

//           .action-pill-btn {
//             width: 38px;
//             height: 38px;
//           }

//           .user-profile-btn {
//             width: 38px;
//             height: 38px;
//             padding: 4px;
//             justify-content: center;
//           }

//           .user-avatar-circle {
//             width: 28px;
//             height: 28px;
//           }
//         }

//         @media (max-width: 480px) {
//           .portfolio-nav-container {
//             padding: 8px 10px;
//             gap: 7px;
//           }

//           .brand-logo-glow {
//             width: 36px;
//             height: 36px;
//           }

//           .portfolio-search-input {
//             padding-left: 34px;
//             padding-right: 30px;
//           }

//           .action-pill-btn,
//           .mobile-menu-trigger {
//             width: 36px;
//             height: 36px;
//           }

//           .portfolio-actions-group {
//             gap: 5px;
//           }

//           .action-icon {
//             font-size: 16px;
//           }

//           .action-badge {
//             top: -6px;
//             right: -6px;
//             min-width: 19px;
//             height: 19px;
//             font-size: 9px;
//           }
//         }

//       `}</style>
//     </>
//   );
// };

// export default Navbar;



import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CategoryFilter from "./CategoryFilter";
import api from "../services/api";
import ThemeToggle from "./ThemeToggle";

const getWishlistItems = () => {
  try {
    const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.error("Error reading wishlist:", error);
    return [];
  }
};

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch (error) {
    console.error("Error reading user:", error);
    return null;
  }
};

const Navbar = ({
  searchTerm,
  onSearch,
  categories,
  selectedCategory,
  onCategoryChange,
  sortOrder,
  onSortChange,
}) => {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [user, setUser] = useState(getStoredUser());
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [pincode, setPincode] = useState('');
  const [currentLocation, setCurrentLocation] = useState('Nagpur 440001');
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => setUser(getStoredUser());
    window.addEventListener("storage", handleStorageChange);
    const savedLocation = localStorage.getItem('delivery_location');
    const savedPin = localStorage.getItem('delivery_pincode');
    if (savedLocation) {
      setCurrentLocation(savedLocation);
    } else if (savedPin) {
      setCurrentLocation(`Pincode ${savedPin}`);
    }
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const syncWishlistCount = () => setWishlistCount(getWishlistItems().length);
    syncWishlistCount();
    window.addEventListener("wishlistUpdated", syncWishlistCount);
    window.addEventListener("storage", syncWishlistCount);
    return () => {
      window.removeEventListener("wishlistUpdated", syncWishlistCount);
      window.removeEventListener("storage", syncWishlistCount);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const fetchCartCount = async () => {
      if (!user?.email) {
        setCartCount(0);
        return;
      }
      try {
        const token = localStorage.getItem("token") || localStorage.getItem("jwtToken");
        const response = await api.get(`/cart?email=${encodeURIComponent(user.email)}`, {
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          signal: controller.signal,
        });
        const apiResponse = response.data;
        let cartItems = [];
        if (apiResponse && apiResponse.success && Array.isArray(apiResponse.data)) {
          cartItems = apiResponse.data;
        }
        const totalItemsCount = cartItems.reduce((total, item) => total + Number(item?.quantity || 0), 0);
        setCartCount(totalItemsCount);
      } catch (error) {
        if (error.code !== "ERR_CANCELED" && !api.isCancel?.(error)) {
          if (error.response?.status === 401 || error.response?.status === 403) {
            setCartCount(0);
            localStorage.removeItem("token");
            localStorage.removeItem("jwtToken");
            localStorage.removeItem("user");
            setUser(null);
          } else {
            console.error("Failed to fetch cart count:", error);
          }
        }
      }
    };

    if (user) fetchCartCount();
    else setCartCount(0);

    const handleCartUpdate = () => fetchCartCount();
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => {
      controller.abort();
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("jwtToken");
    setUser(null);
    setCartCount(0);
    navigate("/login");
  };

  const handleApplyPincode = async () => {
    const cleanPin = pincode.trim();
    if (cleanPin.length === 6) {
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`);
        const data = await response.json();
        if (data && data[0].Status === "Success") {
          const postOffice = data[0].PostOffice[0];
          const cityName = postOffice.District || postOffice.Name;
          const locationString = `${cityName} ${cleanPin}`;
          localStorage.setItem('delivery_pincode', cleanPin);
          localStorage.setItem('delivery_location', locationString);
          setCurrentLocation(locationString);
          setShowLocationModal(false);
          setPincode('');
        } else {
          alert('Invalid Pincode! Please enter a valid Indian postal code.');
        }
      } catch (error) {
        console.error("Error fetching location:", error);
        localStorage.setItem('delivery_pincode', cleanPin);
        setCurrentLocation(`Pincode ${cleanPin}`);
        setShowLocationModal(false);
        setPincode('');
      }
    } else {
      alert('Please enter a valid 6-digit Indian pincode');
    }
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-dark sticky-top px-3 px-lg-4 py-2"
        style={{
          background: "rgba(10, 15, 28, 0.94)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 10px 35px rgba(0,0,0,0.22)",
        }}
      >
        <div className="container-fluid p-0 d-flex align-items-center justify-content-between">
          
          {/* Brand & Location Left Side */}
          <div className="d-flex align-items-center gap-3">
            <Link
              to="/"
              className="navbar-brand d-flex align-items-center gap-2 m-0 text-decoration-none"
              style={{ fontSize: "1.35rem", fontWeight: 800, letterSpacing: "-0.6px" }}
            >
              <span
                className="d-inline-flex align-items-center justify-content-center"
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "11px",
                  background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                  boxShadow: "0 6px 20px rgba(245,158,11,0.25)",
                  fontSize: "18px",
                }}
              >
                🛍️
              </span>
              <span
                style={{
                  background: "linear-gradient(90deg, #fbbf24, #fde68a)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                TechStore
              </span>
            </Link>

            <div
              className="d-none d-xl-flex align-items-center text-white px-2 py-1 rounded location-box"
              style={{ cursor: 'pointer', fontSize: '12px', lineHeight: '1.2', border: '1px solid transparent' }}
              onClick={() => setShowLocationModal(true)}
            >
              <i className="bi bi-geo-alt-fill text-warning fs-5 me-1"></i>
              <div>
                <div className="text-secondary" style={{ fontSize: '10px' }}>Delivering to</div>
                <div className="fw-bold text-white">{currentLocation}</div>
              </div>
            </div>
          </div>

          {/* Mobile Toggle Button */}
          <button
            className="navbar-toggler border-0 shadow-none ms-auto me-2"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style={{ borderRadius: "10px", padding: "6px 10px", background: "rgba(255,255,255,0.07)" }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Collapsible Content */}
          <div className="collapse navbar-collapse justify-content-between mt-2 mt-lg-0" id="navbarContent">
            
            {/* Search Bar */}
            <div className="flex-grow-1 px-lg-3 my-2 my-lg-0">
              <div className="position-relative mx-auto" style={{ maxWidth: "460px" }}>
                <span className="position-absolute" style={{ left: "15px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", opacity: 0.55, zIndex: 2 }}>
                  🔍
                </span>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => onSearch(e.target.value)}
                  aria-label="Search products"
                  style={{
                    height: "38px",
                    paddingLeft: "42px",
                    paddingRight: "15px",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(255,255,255,0.065)",
                    color: "#fff",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Filters & Actions Right Side */}
            <div className="d-flex align-items-center justify-content-end gap-2 flex-wrap m-0">
              
              <div className="d-flex align-items-center gap-2">
                <div style={{ borderRadius: "10px", overflow: "hidden" }}>
                  <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelect={onCategoryChange}
                  />
                </div>
                <select
                  className="form-select form-select-sm"
                  value={sortOrder}
                  onChange={(e) => onSortChange(e.target.value)}
                  aria-label="Sort products"
                  style={{
                    width: "115px",
                    height: "38px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(255,255,255,0.07)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.10)",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  <option value="asc" style={{ color: "#111827" }}>Low → High</option>
                  <option value="desc" style={{ color: "#111827" }}>High → Low</option>
                </select>
              </div>

              {/* Mobile Location View */}
              <div
                className="d-flex d-xl-none align-items-center text-white px-2 py-1 rounded location-box w-100 my-1"
                style={{ cursor: 'pointer', fontSize: '12px', background: 'rgba(255,255,255,0.05)' }}
                onClick={() => setShowLocationModal(true)}
              >
                <i className="bi bi-geo-alt-fill text-warning fs-5 me-2"></i>
                <div>
                  <div className="text-secondary" style={{ fontSize: '10px' }}>Delivering to</div>
                  <div className="fw-bold text-white">{currentLocation}</div>
                </div>
              </div>

              <ThemeToggle />

              {/* Wishlist Link */}
              <Link
                to="/wishlist"
                title="Wishlist"
                className="text-decoration-none d-flex align-items-center justify-content-center position-relative"
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  color: "#fff",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span aria-hidden="true" style={{ color: "#fb7185", fontSize: "16px", lineHeight: 1 }}>♥</span>
                {wishlistCount > 0 && (
                  <span
                    className="position-absolute d-flex align-items-center justify-content-center"
                    style={{
                      top: "-5px",
                      right: "-5px",
                      minWidth: "17px",
                      height: "17px",
                      padding: "0 4px",
                      borderRadius: "20px",
                      background: "linear-gradient(135deg, #fb7185, #e11d48)",
                      color: "#fff",
                      fontSize: "9px",
                      fontWeight: 800,
                      border: "2px solid #0a0f1c",
                    }}
                  >
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Link */}
              <Link
                to="/cart"
                title="Shopping Cart"
                className="text-decoration-none d-flex align-items-center justify-content-center position-relative"
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  color: "#fff",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span aria-hidden="true" style={{ fontSize: "15px", lineHeight: 1 }}>🛒</span>
                {cartCount > 0 && (
                  <span
                    className="position-absolute d-flex align-items-center justify-content-center"
                    style={{
                      top: "-5px",
                      right: "-5px",
                      minWidth: "17px",
                      height: "17px",
                      padding: "0 4px",
                      borderRadius: "20px",
                      background: "linear-gradient(135deg, #ef4444, #dc2626)",
                      color: "#fff",
                      fontSize: "9px",
                      fontWeight: 800,
                      border: "2px solid #0a0f1c",
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Account Dropdown */}
              <div className="dropdown">
                <button
                  className="btn btn-sm dropdown-toggle d-flex align-items-center gap-2"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    height: "38px",
                    padding: "4px 10px 4px 5px",
                    borderRadius: "10px",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(255,255,255,0.07)",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  <span
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "8px",
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      fontSize: "12px",
                    }}
                  >
                    👤
                  </span>
                  <span>{user ? `Hi, ${user.name || "User"}` : "Account"}</span>
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2"
                  style={{ minWidth: "190px", padding: "6px", borderRadius: "12px" }}
                >
                  {!user ? (
                    <>
                      <li><Link className="dropdown-item rounded-2 py-1.5" to="/login">🔐 Login</Link></li>
                      <li><Link className="dropdown-item rounded-2 py-1.5" to="/signup">📝 Signup</Link></li>
                    </>
                  ) : (
                    <>
                      <li><Link className="dropdown-item rounded-2 py-1.5" to="/profile">👤 Profile</Link></li>
                      <li><Link className="dropdown-item rounded-2 py-1.5" to="/orders">📦 Orders</Link></li>
                      <li><hr className="dropdown-divider my-1" /></li>
                      <li>
                        <button type="button" className="dropdown-item rounded-2 py-1.5 text-danger" onClick={handleLogout}>
                          🚪 Logout
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </div>

            </div>

          </div>
        </div>
      </nav>

      {/* Location Modal Popup */}
      {showLocationModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1055 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-white text-dark p-3 rounded-4 shadow-lg border-0">
              <div className="d-flex justify-content-between align-items-center pb-2 border-bottom">
                <h5 className="fw-bold m-0" style={{ fontSize: '18px' }}>Choose your location</h5>
                <button type="button" className="btn-close shadow-none" onClick={() => setShowLocationModal(false)}></button>
              </div>
              <div className="py-4 text-center">
                <p className="text-muted small mb-4">Select a delivery location to see product availability and delivery options</p>
                {user ? (
                  <div className="alert alert-light border py-2 small mb-3">
                    Logged in as <b>{user.email}</b>
                  </div>
                ) : (
                  <button
                    className="btn btn-warning w-100 fw-semibold rounded-pill py-2 mb-3 text-dark shadow-sm"
                    onClick={() => {
                      setShowLocationModal(false);
                      navigate('/login');
                    }}
                  >
                    Sign in to see your addresses
                  </button>
                )}
                <div className="d-flex align-items-center my-3">
                  <div className="flex-grow-1 border-bottom"></div>
                  <span className="px-2 text-muted small">or enter an Indian pincode</span>
                  <div className="flex-grow-1 border-bottom"></div>
                </div>
                <div className="input-group mt-3">
                  <input
                    type="text"
                    className="form-control rounded-start-pill px-3 shadow-none text-dark"
                    placeholder="Enter Pincode (e.g. 440001)"
                    maxLength="6"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    style={{ backgroundColor: '#ffffff', borderColor: '#ced4da', boxShadow: 'none' }}
                  />
                  <button className="btn btn-outline-secondary rounded-end-pill px-4 fw-semibold" type="button" onClick={handleApplyPincode}>
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .location-box:hover {
          border: 1px solid rgba(255,255,255,0.4) !important;
        }
      `}</style>
    </>
  );
};

export default Navbar;