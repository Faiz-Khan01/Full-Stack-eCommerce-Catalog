import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://full-stack-ecommerce-catalog-13.onrender.com/api";

const BASE_URL_NO_API =
  import.meta.env.VITE_API_BASE_URL?.replace("/api", "") ||
  "https://full-stack-ecommerce-catalog-13.onrender.com";

const Checkout = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Fetch Product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/products/${productId}`
        );

        if (!res.ok) throw new Error("Product not found");

        const data = await res.json();
        setProduct(data);

        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.email) setEmail(user.email);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Place Order
  const handleOrder = async (e) => {
    e.preventDefault();

    if (mobile.length !== 10) {
      return Swal.fire(
        "Invalid Mobile",
        "Enter 10 digit number",
        "warning"
      );
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/cart/buy/${productId}`,
        {
          method: "POST",
        }
      );

      if (!res.ok) throw new Error("Order failed");

      Swal.fire({
        icon: "success",
        title: "Order Placed!",
      });

      navigate("/order-success");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" />
      </div>
    );

  if (!product)
    return (
      <div className="text-center mt-5 text-danger">
        Product not found
      </div>
    );

  return (
    <div className="container py-5">
      <div className="row">
        {/* FORM */}
        <div className="col-md-7">
          <form onSubmit={handleOrder}>
            <h4 className="mb-3">Shipping Details</h4>

            <input
              type="email"
              className="form-control mb-3"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Mobile"
              value={mobile}
              onChange={(e) =>
                setMobile(
                  e.target.value.replace(/\D/g, "").slice(0, 10)
                )
              }
              required
            />

            <textarea
              className="form-control mb-3"
              placeholder="Address"
              rows="3"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />

            <h5>Payment Method</h5>

            <div className="form-check">
              <input
                type="radio"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              <label className="ms-2">Cash on Delivery</label>
            </div>

            <div className="form-check mb-3">
              <input
                type="radio"
                checked={paymentMethod === "upi"}
                onChange={() => setPaymentMethod("upi")}
              />
              <label className="ms-2">UPI / Online</label>
            </div>

            <button className="btn btn-success w-100">
              Place Order ₹{product.price}
            </button>
          </form>
        </div>

        {/* SUMMARY */}
        <div className="col-md-5">
          <div className="card shadow p-3">
            <img
              src={
                product.imageUrl
                  ? `${BASE_URL_NO_API}${product.imageUrl}`
                  : "https://placehold.co/300"
              }
              className="img-fluid mb-3"
              alt={product.name}
            />

            <h5>{product.name}</h5>
            <p className="text-muted">{product.description}</p>

            <hr />

            <h4 className="text-primary">
              ₹{product.price}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;