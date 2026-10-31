import { describe, it, expect } from "vitest";

// Pricing & Shipping Business Logic
export const calculateShippingFee = (subtotal) => {
  if (subtotal <= 0) return 0;
  return subtotal >= 500 ? 0 : 50;
};

export const formatINR = (amount) => {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
};

export const calculateOrderTotal = (items = [], discount = 0) => {
  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
    0
  );
  const shippingFee = calculateShippingFee(subtotal);
  const total = Math.max(0, subtotal - discount + shippingFee);
  return { subtotal, shippingFee, discount, total };
};

describe("Pricing, Shipping & Currency Calculations", () => {
  it("should format numbers into standard Indian Rupee notation", () => {
    expect(formatINR(1250)).toBe("₹1,250");
    expect(formatINR(125000)).toBe("₹1,25,000");
    expect(formatINR(0)).toBe("₹0");
  });

  it("should charge ₹50 shipping fee when subtotal is below ₹500", () => {
    const fee = calculateShippingFee(399);
    expect(fee).toBe(50);
  });

  it("should provide FREE shipping when subtotal is ₹500 or above", () => {
    expect(calculateShippingFee(500)).toBe(0);
    expect(calculateShippingFee(2499)).toBe(0);
  });

  it("should accurately compute subtotal, shipping, and grand total", () => {
    const items = [
      { id: 1, name: "Silk Shirt", price: 2999, quantity: 2 },
      { id: 2, name: "Travel Perfume", price: 1200, quantity: 1 },
    ];

    const result = calculateOrderTotal(items, 500);

    expect(result.subtotal).toBe(7198); // (2999 * 2) + 1200
    expect(result.shippingFee).toBe(0); // >= 500
    expect(result.discount).toBe(500);
    expect(result.total).toBe(6698); // 7198 - 500 + 0
  });

  it("should handle empty cart correctly", () => {
    const result = calculateOrderTotal([]);
    expect(result.subtotal).toBe(0);
    expect(result.shippingFee).toBe(0);
    expect(result.total).toBe(0);
  });
});
