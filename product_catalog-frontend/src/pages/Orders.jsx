import { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      // NOTE: In a real app, you should fetch by user email or ID:
      // fetch(`http://localhost:8080/api/orders/user/${user.email}`)
      fetch(`https://full-stack-ecommerce-catalog-13.onrender.com/api/orders`)
        .then((res) => res.json())
        .then((data) => {
          // Sort orders: Newest first
          const sortedData = data.sort((a, b) => b.id - a.id);
          setOrders(sortedData);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching orders:", err);
          setLoading(false);
        });
    }
  }, []);

  if (loading) return <div className="container mt-5 text-center"><h4>Loading your orders...</h4></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📦 My Orders</h2>
        <span className="badge bg-secondary">Total Orders: {orders.length}</span>
      </div>

      {orders.length === 0 ? (
        <div className="alert alert-info shadow-sm">
          You haven't placed any orders yet. <a href="/">Start Shopping</a>
        </div>
      ) : (
        <div className="table-responsive card shadow-sm border-0">
          <table className="table table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th className="ps-4">Order ID</th>
                <th>Date</th>
                <th>Total Paid</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="align-middle">
                  <td className="ps-4 fw-bold text-primary">#{order.id}</td>
                  <td>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</td>
                  <td className="fw-bold">${order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}</td>
                  <td className="text-center">
                    <span className="badge rounded-pill bg-success px-3">Success</span>
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
