// ProductList.js
import React from "react";

const ProductList = ({ products, onAddToCart, onBuyNow }) => {
  const API_BASE_URL = "https://full-stack-ecommerce-catalog-13.onrender.com";

  return (
    <div className="row">
      {products.map((product) => (
        <div className="col-lg-4 col-md-6 mb-4" key={product.id}>
          <div className="card h-100 shadow-sm">
            <img
              src={product.imageUrl ? `${API_BASE_URL}${product.imageUrl}` : 'https://placehold.co/600x400'}
              className="card-img-top"
              alt={product.name}
              style={{ objectFit: 'cover', height: '200px' }}
              onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=Image+Not+Found'; }}
            />
            <div className="card-body d-flex flex-column">
              <h5 className="card-title fw-bold">{product.name}</h5>
              <p className="card-text text-muted">{product.description}</p>
              <h4 className="text-primary mt-auto">${Number(product.price).toFixed(2)}</h4>
              <div className="d-grid gap-2 d-md-block mt-3">
                <button
                  className="btn btn-success me-md-2"
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
