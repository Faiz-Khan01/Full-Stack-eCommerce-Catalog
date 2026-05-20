import { useEffect, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://full-stack-ecommerce-catalog-13.onrender.com/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user?.email || !token) {
          setLoading(false);
          return;
        }

        const res = await fetch(
          `${API_BASE_URL}/orders/user/${user.email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();

        const sorted = data.sort((a, b) => b.id - a.id);

        setOrders(sorted);
      } catch (error) {
        console.error("Orders Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, token]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">📦 My Orders</h2>

      {orders.length === 0 ? (
        <div className="alert alert-info">
          No orders found
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>

                  <td>
                    {order.orderDate
                      ? new Date(
                          order.orderDate
                        ).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td>
                    ₹{Number(order.totalAmount || 0).toFixed(2)}
                  </td>

                  <td>
                    <span className="badge bg-success">
                      Success
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;