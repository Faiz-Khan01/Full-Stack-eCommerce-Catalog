import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="container mt-4">
      <h1>Admin Dashboard</h1>
      <p>Welcome to your admin panel. Manage products and categories here.</p>

      <div className="list-group">
        <Link className="list-group-item list-group-item-action" to="/admin/products">
          Manage Products
        </Link>
        <Link className="list-group-item list-group-item-action" to="/admin/categories">
          Manage Categories
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
