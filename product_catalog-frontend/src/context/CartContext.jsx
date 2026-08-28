import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";
import Swal from "sweetalert2";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user?.email) {
      setCartCount(0);
      setCartItems([]);
      return;
    }

    try {
      setCartLoading(true);
      const res = await api.get(`/cart?email=${encodeURIComponent(user.email)}`);
      // Backend returns ApiResponse wrapper: { success: true, data: [...] }
      const rawData = res.data;
      const items = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.data)
        ? rawData.data
        : (rawData?.items || []);
      setCartItems(items);

      const totalQty = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(totalQty);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        setCartCount(0);
        setCartItems([]);
      } else {
        console.warn("Cart fetch warning:", error.message);
      }
    } finally {
      setCartLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchCart();

    const handleCartUpdated = () => fetchCart();
    window.addEventListener("cartUpdated", handleCartUpdated);
    return () => window.removeEventListener("cartUpdated", handleCartUpdated);
  }, [fetchCart]);

  const addToCart = async (productId) => {
    if (!user?.email) {
      Swal.fire({
        icon: "info",
        title: "Login Required",
        text: "Please sign in to add products to your cart.",
        confirmButtonText: "Sign In",
        confirmButtonColor: "#10b981",
      });
      return false;
    }

    try {
      await api.post(`/cart/add/${productId}?email=${encodeURIComponent(user.email)}`);

      Swal.fire({
        icon: "success",
        title: "Added to Cart!",
        text: "Item successfully added to your shopping cart.",
        toast: true,
        position: "top-end",
        timer: 1500,
        showConfirmButton: false,
      });

      await fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
      return true;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Unable to Add",
        text: error.response?.data?.message || error.message || "Failed to add item to cart.",
        confirmButtonColor: "#ef4444",
      });
      return false;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartCount,
        cartItems,
        cartLoading,
        refreshCart: fetchCart,
        addToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};