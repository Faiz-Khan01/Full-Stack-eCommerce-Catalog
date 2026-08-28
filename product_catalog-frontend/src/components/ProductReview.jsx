import React, { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import api from "../services/api";

const ProductReview = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // =====================================================
  // Get Logged-in User
  // =====================================================

  const getStoredUser = () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      const user = JSON.parse(storedUser);

      return user;
    } catch (error) {
      console.error("Unable to read stored user:", error);
      return null;
    }
  };

  // =====================================================
  // Get User ID Safely
  // =====================================================

  const getUserId = (user) => {
    if (!user) {
      return null;
    }

    return (
      user.id ??
      user.userId ??
      user.user?.id ??
      null
    );
  };

  // =====================================================
  // Get User Name Safely
  // =====================================================

  const getUserName = (user) => {
    if (!user) {
      return "Anonymous User";
    }

    return (
      user.name ||
      user.userName ||
      user.username ||
      user.email ||
      "Anonymous User"
    );
  };

  // =====================================================
  // Fetch Product Reviews
  // =====================================================

  const fetchReviews = useCallback(async () => {
    if (!productId) {
      setReviews([]);
      setReviewsLoading(false);
      return;
    }

    try {
      setReviewsLoading(true);

      const response = await api.get(
        `/reviews/product/${productId}`
      );

      const data =
        response.data?.data ??
        response.data;

      setReviews(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {
      console.error(
        "Fetch reviews error:",
        error
      );

      setReviews([]);

    } finally {
      setReviewsLoading(false);
    }
  }, [productId]);

  // =====================================================
  // Fetch Reviews When Product Changes
  // =====================================================

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // =====================================================
  // Handle Review Submission
  // =====================================================

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    const user = getStoredUser();

    // ---------------------------------------------------
    // Login Check
    // ---------------------------------------------------

    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to write a product review.",
        confirmButtonText: "OK",
      });

      return;
    }

    // ---------------------------------------------------
    // Token Check
    // ---------------------------------------------------

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("jwtToken");

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Session Expired",
        text: "Your login session has expired. Please login again.",
      });

      return;
    }

    // ---------------------------------------------------
    // Product ID Check
    // ---------------------------------------------------

    if (!productId) {
      Swal.fire({
        icon: "error",
        title: "Invalid Product",
        text: "Unable to identify this product.",
      });

      return;
    }

    // ---------------------------------------------------
    // Comment Validation
    // ---------------------------------------------------

    const trimmedComment = comment.trim();

    if (!trimmedComment) {
      Swal.fire({
        icon: "warning",
        title: "Comment Required",
        text: "Please write a comment before submitting your review.",
      });

      return;
    }

    if (trimmedComment.length < 3) {
      Swal.fire({
        icon: "warning",
        title: "Comment Too Short",
        text: "Please write at least 3 characters.",
      });

      return;
    }

    // ---------------------------------------------------
    // Get User Information
    // ---------------------------------------------------

    const userId = getUserId(user);
    const userName = getUserName(user);

    console.log("Review User:", user);
    console.log("Review User ID:", userId);
    console.log("Review User Name:", userName);

    // ---------------------------------------------------
    // Build Review
    // ---------------------------------------------------

    const newReview = {
      productId: Number(productId),

      /*
       * This is the important part.
       * It sends the actual logged-in user's ID.
       */
      userId: userId ? Number(userId) : null,

      userName: userName,

      rating: Number(rating),

      comment: trimmedComment,
    };

    console.log(
      "Sending review:",
      newReview
    );

    // ---------------------------------------------------
    // Submit
    // ---------------------------------------------------

    try {
      setLoading(true);

      await api.post(
        "/reviews/add",
        newReview
      );

      // -------------------------------------------------
      // Reload reviews from backend
      // -------------------------------------------------

      await fetchReviews();

      // -------------------------------------------------
      // Reset form
      // -------------------------------------------------

      setComment("");
      setRating(5);

      Swal.fire({
        icon: "success",
        title: "Review Submitted",
        text: "Thank you for sharing your experience!",
        toast: true,
        position: "top-end",
        timer: 1800,
        showConfirmButton: false,
      });

    } catch (error) {

      console.error(
        "Submit review error:",
        error
      );

      let message =
        "Could not submit your review.";

      if (error.response) {

        const {
          status,
          data: responseData,
        } = error.response;

        if (status === 401) {

          message =
            "Your session has expired. Please login again.";

          localStorage.removeItem("token");
          localStorage.removeItem("jwtToken");

        } else if (status === 403) {

          message =
            "You are not authorized to submit a review.";

        } else {

          message =
            responseData?.message ||
            responseData?.error ||
            `Server error: ${status}`;
        }

      } else if (error.request) {

        message =
          "Unable to connect to the server.";
      }

      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: message,
      });

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // Render Stars
  // =====================================================

  const renderStars = (value) => {

    const count = Math.max(
      0,
      Math.min(
        5,
        Number(value) || 0
      )
    );

    return "⭐".repeat(count);
  };

  // =====================================================
  // Calculate Average Rating
  // =====================================================

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (acc, review) =>
              acc +
              (Number(review.rating) || 0),
            0
          ) / reviews.length
        ).toFixed(1)
      : "0.0";

  // =====================================================
  // Loading UI
  // =====================================================

  if (reviewsLoading) {
    return (
      <div className="product-review-section loading-section">

        <div className="review-loading">

          <div className="premium-spinner">
            <span></span>
          </div>

          <span className="loading-text">
            Loading customer reviews...
          </span>

        </div>

        <style>{`

          .product-review-section {
            margin-top: 48px;
            padding-top: 32px;
            border-top: 1px solid #e8edf5;
          }

          .review-loading {
            min-height: 130px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
          }

          .premium-spinner {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 3px solid #e8ecf5;
            border-top-color: #6366f1;
            animation: premiumSpin 0.75s linear infinite;
          }

          .loading-text {
            color: #64748b;
            font-size: 13px;
            font-weight: 500;
          }

          @keyframes premiumSpin {
            to {
              transform: rotate(360deg);
            }
          }

        `}</style>

      </div>
    );
  }

  // =====================================================
  // Main UI
  // =====================================================

  return (
    <div className="premium-review-section">

      {/* =================================================
          Header
      ================================================= */}

      <div className="review-section-header">

        <div className="review-heading">

          <div className="review-heading-icon">

            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4z" />
              <path d="M8 10h8" />
              <path d="M8 14h5" />
            </svg>

          </div>

          <div>

            <h5 className="review-title">
              Ratings & Reviews
            </h5>

            <p className="review-subtitle">
              Real feedback from customers
            </p>

          </div>

        </div>

        {/* Rating Summary */}

        {reviews.length > 0 && (

          <div className="rating-summary">

            <div className="rating-star">
              ⭐
            </div>

            <div className="rating-value">
              {averageRating}
            </div>

            <div className="rating-divider"></div>

            <div className="rating-count">
              ({reviews.length}{" "}
              {reviews.length === 1
                ? "review"
                : "reviews"})
            </div>

          </div>

        )}

      </div>

      <div className="row g-4">

        {/* =================================================
            Write Review
        ================================================= */}

        <div className="col-lg-5">

          <div className="review-form-card">

            <div className="card-glow"></div>

            <div className="form-card-content">

              <div className="form-card-header">

                <div className="form-icon">
                  ✨
                </div>

                <div>

                  <h6>
                    Share Your Experience
                  </h6>

                  <span>
                    Your feedback helps other customers
                  </span>

                </div>

              </div>

              <form onSubmit={handleSubmitReview}>

                {/* Rating */}

                <div className="modern-field">

                  <label htmlFor="reviewRating">
                    Overall Rating
                  </label>

                  <div className="select-wrapper">

                    <select
                      id="reviewRating"
                      value={rating}
                      onChange={(e) =>
                        setRating(
                          Number(
                            e.target.value
                          )
                        )
                      }
                      disabled={loading}
                    >

                      <option value={5}>
                        ⭐⭐⭐⭐⭐ (5 - Excellent)
                      </option>

                      <option value={4}>
                        ⭐⭐⭐⭐ (4 - Very Good)
                      </option>

                      <option value={3}>
                        ⭐⭐⭐ (3 - Average)
                      </option>

                      <option value={2}>
                        ⭐⭐ (2 - Poor)
                      </option>

                      <option value={1}>
                        ⭐ (1 - Terrible)
                      </option>

                    </select>

                    <span className="select-arrow">
                      ▾
                    </span>

                  </div>

                </div>

                {/* Comment */}

                <div className="modern-field">

                  <label htmlFor="reviewComment">
                    Your Review
                  </label>

                  <div className="textarea-wrapper">

                    <textarea
                      id="reviewComment"
                      rows="4"
                      placeholder="What did you like or dislike about this product?"
                      required
                      minLength={3}
                      value={comment}
                      disabled={loading}
                      onChange={(e) =>
                        setComment(
                          e.target.value
                        )
                      }
                    />

                    <div className="textarea-bottom">

                      <span>
                        Minimum 3 characters
                      </span>

                      <span>
                        {comment.length} characters
                      </span>

                    </div>

                  </div>

                </div>

                {/* Submit */}

                <button
                  type="submit"
                  className="premium-submit"
                  disabled={
                    loading ||
                    !comment.trim() ||
                    comment.trim().length < 3
                  }
                >

                  {loading ? (
                    <>
                      <span className="button-spinner"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Post Review

                      <svg
                        viewBox="0 0 24 24"
                        width="17"
                        height="17"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 12h14" />
                        <path d="m13 6 6 6-6 6" />
                      </svg>
                    </>
                  )}

                </button>

              </form>

            </div>

          </div>

        </div>

        {/* =================================================
            Reviews List
        ================================================= */}

        <div className="col-lg-7">

          <div className="reviews-feed">

            {reviews.length === 0 ? (

              <div className="empty-reviews">

                <div className="empty-icon">
                  📝
                </div>

                <h6>
                  No reviews yet
                </h6>

                <p>
                  Be the first to share your thoughts on
                  this product!
                </p>

              </div>

            ) : (

              reviews.map((rev, index) => {

                const userName =
                  rev.userName ||
                  "Anonymous User";

                const initials =
                  userName
                    .charAt(0)
                    .toUpperCase();

                const reviewKey =
                  rev.id ||
                  `${rev.userId || "user"}-${rev.createdAt || index}`;

                return (

                  <div
                    key={reviewKey}
                    className="premium-review-card"
                  >

                    <div className="review-accent"></div>

                    <div className="review-card-header">

                      <div className="review-user">

                        <div className="user-avatar">
                          {initials}
                        </div>

                        <div className="user-info">

                          <h6>
                            {userName}
                          </h6>

                          <span>

                            {rev.createdAt
                              ? new Date(
                                  rev.createdAt
                                ).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "Recently"}

                          </span>

                        </div>

                      </div>

                      <div className="review-stars">
                        {renderStars(
                          rev.rating
                        )}
                      </div>

                    </div>

                    <p className="review-comment">
                      {rev.comment ||
                        "No comment provided."}
                    </p>

                  </div>

                );
              })
            )}

          </div>

        </div>

      </div>

      {/* =====================================================
          Styles
      ===================================================== */}

      <style>{`

        .premium-review-section {
          margin-top: 52px;
          padding-top: 34px;
          border-top: 1px solid #e8edf5;
          color: #0f172a;
        }

        .review-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 28px;
        }

        .review-heading {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .review-heading-icon {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6366f1;
          background: linear-gradient(
            135deg,
            #eef2ff,
            #f5f3ff
          );
          border: 1px solid #e0e7ff;
          border-radius: 13px;
          box-shadow:
            0 8px 20px rgba(79, 70, 229, 0.08);
        }

        .review-title {
          margin: 0;
          color: #111827;
          font-size: 19px;
          font-weight: 800;
          letter-spacing: -0.4px;
        }

        .review-subtitle {
          margin: 3px 0 0;
          color: #94a3b8;
          font-size: 12px;
        }

        .rating-summary {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 9px 14px;
          border-radius: 14px;
          background: linear-gradient(
            135deg,
            #fffdf5,
            #fff9e8
          );
          border: 1px solid #f5e8b3;
          box-shadow:
            0 8px 22px rgba(245, 158, 11, 0.08);
        }

        .rating-star {
          font-size: 15px;
        }

        .rating-value {
          font-size: 15px;
          font-weight: 800;
          color: #111827;
        }

        .rating-divider {
          width: 1px;
          height: 15px;
          background: #e5dcae;
        }

        .rating-count {
          color: #78716c;
          font-size: 11px;
          font-weight: 500;
        }

        .review-form-card {
          position: relative;
          overflow: hidden;
          height: 100%;
          border-radius: 22px;
          background: linear-gradient(
            145deg,
            #ffffff 0%,
            #f8faff 100%
          );
          border: 1px solid #e4e9f2;
          box-shadow:
            0 18px 45px rgba(15, 23, 42, 0.07),
            0 4px 12px rgba(15, 23, 42, 0.03);
        }

        .card-glow {
          position: absolute;
          width: 180px;
          height: 180px;
          top: -100px;
          right: -80px;
          border-radius: 50%;
          background: rgba(99, 102, 241, 0.10);
          filter: blur(10px);
          pointer-events: none;
        }

        .form-card-content {
          position: relative;
          padding: 25px;
          z-index: 1;
        }

        .form-card-header {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-bottom: 22px;
        }

        .form-icon {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          background: #eef2ff;
          font-size: 17px;
        }

        .form-card-header h6 {
          margin: 0;
          color: #111827;
          font-size: 14px;
          font-weight: 750;
        }

        .form-card-header span {
          display: block;
          margin-top: 2px;
          color: #94a3b8;
          font-size: 10px;
        }

        .modern-field {
          margin-bottom: 18px;
        }

        .modern-field label {
          display: block;
          margin-bottom: 7px;
          color: #334155;
          font-size: 11px;
          font-weight: 700;
        }

        .select-wrapper {
          position: relative;
        }

        .select-wrapper select {
          width: 100%;
          height: 44px;
          appearance: none;
          border: 1px solid #e2e8f0;
          border-radius: 11px;
          padding: 0 40px 0 13px;
          background: #fff;
          color: #334155;
          font-size: 12px;
          outline: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .select-wrapper select:hover {
          border-color: #cbd5e1;
        }

        .select-wrapper select:focus {
          border-color: #6366f1;
          box-shadow:
            0 0 0 4px rgba(99, 102, 241, 0.09);
        }

        .select-arrow {
          position: absolute;
          right: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          pointer-events: none;
        }

        .textarea-wrapper {
          position: relative;
        }

        .textarea-wrapper textarea {
          width: 100%;
          min-height: 125px;
          resize: vertical;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 13px;
          padding-bottom: 35px;
          background: #fff;
          color: #1e293b;
          font-size: 12px;
          line-height: 1.55;
          outline: none;
          transition: all 0.2s ease;
        }

        .textarea-wrapper textarea::placeholder {
          color: #a8b2c1;
        }

        .textarea-wrapper textarea:hover {
          border-color: #cbd5e1;
        }

        .textarea-wrapper textarea:focus {
          border-color: #6366f1;
          box-shadow:
            0 0 0 4px rgba(99, 102, 241, 0.09);
        }

        .textarea-bottom {
          position: absolute;
          left: 13px;
          right: 13px;
          bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          pointer-events: none;
        }

        .textarea-bottom span {
          color: #a1aabd;
          font-size: 9px;
        }

        .premium-submit {
          width: 100%;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border: 0;
          border-radius: 11px;
          background: linear-gradient(
            135deg,
            #4f46e5,
            #7c3aed
          );
          color: white;
          font-size: 12px;
          font-weight: 750;
          cursor: pointer;
          box-shadow:
            0 10px 22px rgba(79, 70, 229, 0.22);
          transition: all 0.22s ease;
        }

        .premium-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow:
            0 14px 28px rgba(79, 70, 229, 0.30);
        }

        .premium-submit:active:not(:disabled) {
          transform: translateY(0);
        }

        .premium-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          box-shadow: none;
        }

        .button-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: premiumSpin 0.7s linear infinite;
        }

        .reviews-feed {
          max-height: 450px;
          overflow-y: auto;
          padding: 3px 5px 3px 3px;
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }

        .reviews-feed::-webkit-scrollbar {
          width: 5px;
        }

        .reviews-feed::-webkit-scrollbar-track {
          background: transparent;
        }

        .reviews-feed::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 20px;
        }

        .empty-reviews {
          min-height: 250px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 35px 20px;
          text-align: center;
          border: 1px dashed #dbe2ec;
          border-radius: 20px;
          background: linear-gradient(
            145deg,
            #fafbff,
            #f8fafc
          );
        }

        .empty-icon {
          width: 58px;
          height: 58px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 13px;
          border-radius: 17px;
          background: #f1f5f9;
          font-size: 25px;
          opacity: 0.75;
        }

        .empty-reviews h6 {
          margin-bottom: 5px;
          color: #1e293b;
          font-size: 14px;
          font-weight: 750;
        }

        .empty-reviews p {
          max-width: 300px;
          margin: 0;
          color: #94a3b8;
          font-size: 11px;
          line-height: 1.5;
        }

        .premium-review-card {
          position: relative;
          overflow: hidden;
          padding: 17px;
          margin-bottom: 12px;
          border: 1px solid #e7ebf2;
          border-radius: 16px;
          background: #fff;
          box-shadow:
            0 8px 24px rgba(15, 23, 42, 0.045);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;
        }

        .premium-review-card:hover {
          transform: translateY(-2px);
          border-color: #dbe2ff;
          box-shadow:
            0 14px 32px rgba(15, 23, 42, 0.075);
        }

        .review-accent {
          position: absolute;
          top: 0;
          left: 0;
          width: 3px;
          height: 100%;
          background: linear-gradient(
            180deg,
            #6366f1,
            #8b5cf6
          );
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .premium-review-card:hover .review-accent {
          opacity: 1;
        }

        .review-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 11px;
        }

        .review-user {
          display: flex;
          align-items: center;
          min-width: 0;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 10px;
          border-radius: 11px;
          background: linear-gradient(
            135deg,
            #4f46e5,
            #8b5cf6
          );
          color: white;
          font-size: 12px;
          font-weight: 800;
          box-shadow:
            0 7px 15px rgba(79, 70, 229, 0.20);
        }

        .user-info {
          min-width: 0;
        }

        .user-info h6 {
          max-width: 180px;
          margin: 0;
          overflow: hidden;
          color: #1e293b;
          font-size: 12px;
          font-weight: 750;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .user-info span {
          display: block;
          margin-top: 2px;
          color: #94a3b8;
          font-size: 9px;
        }

        .review-stars {
          flex-shrink: 0;
          padding: 5px 8px;
          border-radius: 8px;
          background: #fffbeb;
          font-size: 11px;
          letter-spacing: 1px;
          white-space: nowrap;
        }

        .review-comment {
          margin: 0;
          padding-left: 46px;
          color: #64748b;
          font-size: 11px;
          line-height: 1.65;
          white-space: pre-line;
        }

        @media (max-width: 767px) {

          .premium-review-section {
            margin-top: 38px;
            padding-top: 25px;
          }

          .review-section-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .rating-summary {
            align-self: flex-start;
          }

          .form-card-content {
            padding: 21px;
          }

          .reviews-feed {
            max-height: none;
          }

          .premium-review-card {
            padding: 15px;
          }

          .review-card-header {
            align-items: flex-start;
          }

          .review-stars {
            font-size: 9px;
          }

          .review-comment {
            padding-left: 0;
            margin-top: 9px;
          }
        }

        @media (max-width: 480px) {

          .review-title {
            font-size: 17px;
          }

          .review-subtitle {
            font-size: 10px;
          }

          .review-heading-icon {
            width: 38px;
            height: 38px;
          }

          .review-card-header {
            flex-direction: column;
          }

          .review-stars {
            align-self: flex-start;
          }
        }

        @keyframes premiumSpin {
          to {
            transform: rotate(360deg);
          }
        }

      `}</style>

    </div>
  );
};

export default ProductReview;