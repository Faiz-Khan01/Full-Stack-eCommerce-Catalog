/**
 * Product Sizing & Variant Utility
 * Provides intelligent, category-specific sizing options for:
 * - Apparel (Shirts, T-Shirts, Jackets, Hoodies): S, M, L, XL
 * - Pants / Trousers / Jeans: S (30"), M (32"), L (34"), XL (36")
 * - Footwear (Shoes, Boots, Sneakers): UK 7, UK 8, UK 9, UK 10, UK 11
 * - Fragrances / Perfumes: 50 ml, 100 ml, 150 ml
 * - General / Accessories: Standard (One Size)
 */

export const getProductSizes = (product) => {
  if (!product) return [{ label: "Standard", desc: "One Size", scale: 1.0 }];

  const str = `${product.name || ""} ${product.category?.name || product.category || ""} ${product.description || ""}`.toLowerCase();

  // 1. Perfumes & Fragrances
  if (
    str.includes("perfume") ||
    str.includes("fragrance") ||
    str.includes("cologne") ||
    str.includes("scent") ||
    str.includes("eau de") ||
    str.includes("parfum") ||
    str.includes("attar")
  ) {
    return [
      { label: "50 ml", desc: "Travel Spray", scale: 0.95 },
      { label: "100 ml", desc: "Signature Flacon", scale: 1.0, isDefault: true },
      { label: "150 ml", desc: "Atelier Edition", scale: 1.08 },
    ];
  }

  // 2. Shoes, Boots, Footwear
  if (
    str.includes("shoe") ||
    str.includes("boot") ||
    str.includes("sneaker") ||
    str.includes("loafer") ||
    str.includes("footwear") ||
    str.includes("slide") ||
    str.includes("sandal") ||
    str.includes("heel")
  ) {
    return [
      { label: "UK 7", desc: "EU 41", scale: 0.94 },
      { label: "UK 8", desc: "EU 42", scale: 0.97 },
      { label: "UK 9", desc: "EU 43", scale: 1.0, isDefault: true },
      { label: "UK 10", desc: "EU 44", scale: 1.04 },
      { label: "UK 11", desc: "EU 45", scale: 1.08 },
    ];
  }

  // 3. Pants, Trousers, Bottoms, Jeans, Shorts
  if (
    str.includes("pant") ||
    str.includes("trouser") ||
    str.includes("jean") ||
    str.includes("short") ||
    str.includes("bottom") ||
    str.includes("cargo")
  ) {
    return [
      { label: "S (30\")", desc: "Waist 30", scale: 0.94 },
      { label: "M (32\")", desc: "Waist 32", scale: 1.0, isDefault: true },
      { label: "L (34\")", desc: "Waist 34", scale: 1.06 },
      { label: "XL (36\")", desc: "Waist 36", scale: 1.12 },
    ];
  }

  // 4. Watches, Jewellery, Electronics, Bags
  if (
    str.includes("watch") ||
    str.includes("bag") ||
    str.includes("belt") ||
    str.includes("ring") ||
    str.includes("headphone") ||
    str.includes("wallet")
  ) {
    return [
      { label: "Standard", desc: "Bespoke Size", scale: 1.0, isDefault: true },
    ];
  }

  // 5. Default: Shirts, T-Shirts, Jackets, Coats, Sweaters (Apparel)
  return [
    { label: "S", desc: "Chest 38\"", scale: 0.94 },
    { label: "M", desc: "Chest 40\"", scale: 1.0, isDefault: true },
    { label: "L", desc: "Chest 42\"", scale: 1.06 },
    { label: "XL", desc: "Chest 44\"", scale: 1.12 },
  ];
};
