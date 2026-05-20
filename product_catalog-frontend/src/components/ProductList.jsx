import React from "react";

// FIX: Removed the incorrect "-13" from the default fallback URL
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace("/api", "") ||
  "https://full-stack-ecommerce-catalog.onrender.com";

const ProductList = ({
  products = [],
  onAddToCart,
  onBuyNow,
}) => {
  // Empty State
  if (products.length === 0) {
    return (
      <div className="text-center py-5">
        <h3>No Products Found</h3>
        <p className="text-muted">
          Try changing search or category filters.
        </p>
      </div>
    );
  }

  return (
    <div className="row">
      {products.map((product) => (
        <div
          key={product.id}
          className="col-lg-4 col-md-6 mb-4"
        >
          <div className="card h-100 shadow-sm border-0">
            {/* Product Image */}
            <img
              src={
                product.imageUrl
                  ? `${BASE_URL}${product.imageUrl}`
                  : "https://placehold.co/600x400?text=No+Image"
              }
              alt={product.name}
              className="card-img-top"
              style={{
                height: "240px",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.target.src =
                  "https://placehold.co/600x400?text=Image+Not+Found";
              }}
            />

            {/* Product Body */}
            <div className="card-body d-flex flex-column">
              {/* Name */}
              <h5 className="card-title fw-bold">
                {product.name}
              </h5>

              {/* Description */}
              <p className="card-text text-muted small">
                {product.description}
              </p>

              {/* Category */}
              {product.category?.name && (
                <span className="badge bg-info text-dark mb-2 align-self-start">
                  {product.category.name}
                </span>
              )}

              {/* Price */}
              <h4 className="text-primary mt-auto fw-bold">
                ₹{Number(product.price).toFixed(2)}
              </h4>

              {/* Buttons */}
              <div className="d-grid gap-2 mt-3">
                <button
                  className="btn btn-success"
                  onClick={() => onBuyNow(product.id)}
                >
                  Buy Now 🛒
                </button>

                <button
                  className="btn btn-outline-primary"
                  onClick={() => onAddToCart(product.id)}
                >
                  Add to Cart 🛍️
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;