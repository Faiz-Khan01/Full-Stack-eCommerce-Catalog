import { describe, it, expect } from "vitest";
import { getProductSizes } from "./productSizes.js";

describe("Smart Sizing Engine (productSizes.js)", () => {
  it("should categorize perfumes into 50ml, 100ml, and 150ml volume options", () => {
    const perfumeProduct = {
      name: "Oud Noir Eau De Parfum",
      category: "Fragrances",
      description: "A luxury evening scent with amber notes.",
    };

    const sizes = getProductSizes(perfumeProduct);

    expect(sizes).toHaveLength(3);
    expect(sizes.map((s) => s.label)).toEqual(["50 ml", "100 ml", "150 ml"]);
    expect(sizes.find((s) => s.isDefault)?.label).toBe("100 ml");
  });

  it("should categorize footwear into UK 7 through UK 11 shoe sizes", () => {
    const shoeProduct = {
      name: "Italian Leather Loafer",
      category: "Footwear",
      description: "Handcrafted calfskin dress shoes.",
    };

    const sizes = getProductSizes(shoeProduct);

    expect(sizes).toHaveLength(5);
    expect(sizes.map((s) => s.label)).toEqual([
      "UK 7",
      "UK 8",
      "UK 9",
      "UK 10",
      "UK 11",
    ]);
    expect(sizes.find((s) => s.isDefault)?.label).toBe("UK 9");
  });

  it("should categorize bottoms and pants into waist measurements", () => {
    const pantProduct = {
      name: "Relaxed Fit Drawstring Pants",
      category: "Clothing",
      description: "Tailored wool trousers for daily wear.",
    };

    const sizes = getProductSizes(pantProduct);

    expect(sizes).toHaveLength(4);
    expect(sizes.map((s) => s.label)).toEqual([
      'S (30")',
      'M (32")',
      'L (34")',
      'XL (36")',
    ]);
    expect(sizes.find((s) => s.isDefault)?.label).toBe('M (32")');
  });

  it("should categorize general apparel into S, M, L, XL with scale factors", () => {
    const apparelProduct = {
      name: "Cashmere Knit Sweater",
      category: "Clothing",
      description: "Winter outerwear pullover.",
    };

    const sizes = getProductSizes(apparelProduct);

    expect(sizes).toHaveLength(4);
    expect(sizes.map((s) => s.label)).toEqual(["S", "M", "L", "XL"]);
    expect(sizes[0].scale).toBeLessThan(sizes[3].scale);
  });

  it("should categorize accessories into Standard One Size", () => {
    const watchProduct = {
      name: "Chronograph Gold Watch",
      category: "Accessories",
      description: "Luxury timepiece.",
    };

    const sizes = getProductSizes(watchProduct);

    expect(sizes).toHaveLength(1);
    expect(sizes[0].label).toBe("Standard");
    expect(sizes[0].isDefault).toBe(true);
  });

  it("should safely return Standard fallback when product is null or undefined", () => {
    const sizes = getProductSizes(null);
    expect(sizes).toHaveLength(1);
    expect(sizes[0].label).toBe("Standard");
  });
});
