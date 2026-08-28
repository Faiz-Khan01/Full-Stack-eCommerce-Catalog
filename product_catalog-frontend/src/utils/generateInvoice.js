// import jsPDF from "jspdf";
// import "jspdf-autotable";

// export const generateInvoice = (order) => {
//   if (!order) return;

//   const doc = new jsPDF();
//   const orderId = order.orderNumber || `ORD-${order.id}`;
//   const orderDate = order.orderDate ? new Date(order.orderDate).toLocaleDateString("en-IN") : new Date().toLocaleDateString("en-IN");
//   const totalAmount = Number(order.totalAmount || 0).toFixed(2);
//   const shippingFee = Number(order.shippingFee || 0).toFixed(2);
//   const subtotal = (Number(order.totalAmount || 0) - Number(order.shippingFee || 0)).toFixed(2);

//   // Colors
//   const primaryColor = [15, 23, 42]; // Slate 900
//   const emeraldColor = [16, 185, 129]; // Emerald 500
//   const mutedColor = [100, 116, 139]; // Slate 500

//   // 1. Header Banner
//   doc.setFillColor(...primaryColor);
//   doc.rect(0, 0, 210, 40, "F");

//   // Logo & Title
//   doc.setTextColor(255, 255, 255);
//   doc.setFontSize(22);
//   doc.setFont("helvetica", "bold");
//   doc.text("TechStore", 14, 22);

//   doc.setFontSize(10);
//   doc.setFont("helvetica", "normal");
//   doc.setTextColor(203, 213, 225);
//   doc.text("Premium Electronics & Gadgets Hub", 14, 29);

//   // Invoice Title Right
//   doc.setFontSize(18);
//   doc.setFont("helvetica", "bold");
//   doc.setTextColor(255, 255, 255);
//   doc.text("TAX INVOICE", 196, 22, { align: "right" });

//   doc.setFontSize(9);
//   doc.setFont("helvetica", "normal");
//   doc.setTextColor(203, 213, 225);
//   doc.text(`Invoice #: INV-${order.id || "001"}`, 196, 29, { align: "right" });

//   // 2. Info Cards (Billed To & Order Details)
//   let y = 50;

//   // Left Column - Customer
//   doc.setFontSize(11);
//   doc.setFont("helvetica", "bold");
//   doc.setTextColor(...primaryColor);
//   doc.text("Billed To:", 14, y);

//   doc.setFontSize(10);
//   doc.setFont("helvetica", "normal");
//   doc.setTextColor(51, 65, 85);
//   doc.text(order.fullName || "Customer", 14, y + 6);
//   doc.text(`Email: ${order.userEmail || "N/A"}`, 14, y + 12);
//   doc.text(`Phone: ${order.mobile || "N/A"}`, 14, y + 18);
//   if (order.address) {
//     const addressLines = doc.splitTextToSize(`Address: ${order.address}`, 85);
//     doc.text(addressLines, 14, y + 24);
//   }

//   // Right Column - Order Info
//   doc.setFontSize(11);
//   doc.setFont("helvetica", "bold");
//   doc.setTextColor(...primaryColor);
//   doc.text("Order Information:", 120, y);

//   doc.setFontSize(10);
//   doc.setFont("helvetica", "normal");
//   doc.setTextColor(51, 65, 85);
//   doc.text(`Order Number: ${orderId}`, 120, y + 6);
//   doc.text(`Order Date: ${orderDate}`, 120, y + 12);
//   doc.text(`Payment Method: ${order.paymentMethod || "COD"}`, 120, y + 18);
//   doc.text(`Payment Status: ${order.paymentStatus || "PENDING"}`, 120, y + 24);
//   doc.text(`Order Status: ${order.orderStatus || "PLACED"}`, 120, y + 30);

//   if (order.courierName || order.trackingNumber) {
//     doc.text(`Courier: ${order.courierName || "Standard Courier"}`, 120, y + 36);
//     doc.text(`Tracking #: ${order.trackingNumber || "N/A"}`, 120, y + 42);
//   }

//   // 3. Items Table
//   const tableData = (order.items && order.items.length > 0)
//     ? order.items.map((item, idx) => [
//         idx + 1,
//         item.productName || item.name || `Product #${item.productId}`,
//         `₹${Number(item.price || 0).toFixed(2)}`,
//         item.quantity || 1,
//         `₹${(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}`,
//       ])
//     : [[1, "Order Item", `₹${subtotal}`, 1, `₹${subtotal}`]];

//   doc.autoTable({
//     startY: y + 52,
//     head: [["#", "Item Description", "Unit Price", "Qty", "Total Amount"]],
//     body: tableData,
//     theme: "striped",
//     headStyles: {
//       fillColor: primaryColor,
//       textColor: [255, 255, 255],
//       fontStyle: "bold",
//       fontSize: 9,
//     },
//     bodyStyles: {
//       fontSize: 9,
//       textColor: [51, 65, 85],
//     },
//     columnStyles: {
//       0: { cellWidth: 12, halign: "center" },
//       1: { cellWidth: 90 },
//       2: { cellWidth: 28, halign: "right" },
//       3: { cellWidth: 18, halign: "center" },
//       4: { cellWidth: 35, halign: "right" },
//     },
//     margin: { left: 14, right: 14 },
//   });

//   const finalY = doc.lastAutoTable.finalY + 10;

//   // 4. Totals Breakdown Card
//   const totalsX = 120;
//   doc.setFontSize(10);
//   doc.setTextColor(...mutedColor);

//   doc.text("Subtotal:", totalsX, finalY);
//   doc.text(`₹${subtotal}`, 196, finalY, { align: "right" });

//   doc.text("Shipping & Handling:", totalsX, finalY + 6);
//   doc.text(`₹${shippingFee}`, 196, finalY + 6, { align: "right" });

//   // Divider
//   doc.setDrawColor(226, 232, 240);
//   doc.line(totalsX, finalY + 10, 196, finalY + 10);

//   // Grand Total
//   doc.setFontSize(12);
//   doc.setFont("helvetica", "bold");
//   doc.setTextColor(...emeraldColor);
//   doc.text("Grand Total:", totalsX, finalY + 18);
//   doc.text(`₹${totalAmount}`, 196, finalY + 18, { align: "right" });

//   // 5. Footer
//   const footerY = 275;
//   doc.setDrawColor(226, 232, 240);
//   doc.line(14, footerY - 5, 196, footerY - 5);

//   doc.setFontSize(8);
//   doc.setFont("helvetica", "normal");
//   doc.setTextColor(...mutedColor);
//   doc.text("Thank you for shopping with TechStore! For support, reach us at support@techstore.com", 105, footerY, { align: "center" });
//   doc.text("This is a computer-generated invoice. No physical signature is required.", 105, footerY + 5, { align: "center" });

//   // Save PDF
//   doc.save(`Invoice_${orderId}.pdf`);
// };






// import { jsPDF } from "jspdf";
// import { autoTable } from "jspdf-autotable";

// export const generateInvoice = (order) => {
//   try {
//     if (!order) {
//       console.error("No order provided");
//       return;
//     }

//     const doc = new jsPDF();

//     doc.setFillColor(15, 23, 42);
//     doc.rect(0, 0, 210, 40, "F");

//     doc.setTextColor(255, 255, 255);
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(22);
//     doc.text("TechStore", 14, 20);

//     doc.setFontSize(16);
//     doc.text("TAX INVOICE", 196, 20, {
//       align: "right",
//     });

//     doc.setTextColor(15, 23, 42);
//     doc.setFontSize(11);

//     doc.text(
//       `Order: ${order.orderNumber || `ORD-${order.id}`}`,
//       14,
//       55
//     );

//     doc.text(
//       `Customer: ${order.fullName || "Customer"}`,
//       14,
//       63
//     );

//     doc.text(
//       `Date: ${
//         order.orderDate
//           ? new Date(order.orderDate).toLocaleDateString("en-IN")
//           : new Date().toLocaleDateString("en-IN")
//       }`,
//       14,
//       71
//     );

//     const items =
//       Array.isArray(order.items) && order.items.length
//         ? order.items
//         : [
//             {
//               productName: "Order Item",
//               quantity: 1,
//               price: Number(order.totalAmount || 0),
//             },
//           ];

//     const rows = items.map((item, index) => {
//       const qty = Number(item.quantity || 1);
//       const price = Number(item.price || 0);

//       return [
//         index + 1,
//         item.productName ||
//           item.name ||
//           `Product #${item.productId || index + 1}`,
//         qty,
//         `₹${price.toFixed(2)}`,
//         `₹${(qty * price).toFixed(2)}`,
//       ];
//     });

//     autoTable(doc, {
//       startY: 82,

//       head: [
//         ["#", "Product", "Qty", "Unit Price", "Total"],
//       ],

//       body: rows,

//       theme: "striped",

//       headStyles: {
//         fillColor: [15, 23, 42],
//         textColor: [255, 255, 255],
//         fontStyle: "bold",
//       },

//       styles: {
//         fontSize: 9,
//         cellPadding: 4,
//       },

//       columnStyles: {
//         0: {
//           cellWidth: 12,
//           halign: "center",
//         },
//         1: {
//           cellWidth: 85,
//         },
//         2: {
//           cellWidth: 20,
//           halign: "center",
//         },
//         3: {
//           cellWidth: 32,
//           halign: "right",
//         },
//         4: {
//           cellWidth: 35,
//           halign: "right",
//         },
//       },

//       margin: {
//         left: 14,
//         right: 14,
//       },
//     });

//     const finalY =
//       doc.lastAutoTable?.finalY || 120;

//     const total = Number(
//       order.totalAmount || 0
//     );

//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(12);
//     doc.setTextColor(16, 185, 129);

//     doc.text(
//       "Grand Total:",
//       130,
//       finalY + 15
//     );

//     doc.text(
//       `₹${total.toFixed(2)}`,
//       196,
//       finalY + 15,
//       {
//         align: "right",
//       }
//     );

//     doc.setDrawColor(226, 232, 240);

//     doc.line(
//       14,
//       275,
//       196,
//       275
//     );

//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(8);
//     doc.setTextColor(100, 116, 139);

//     doc.text(
//       "Thank you for shopping with TechStore!",
//       105,
//       283,
//       {
//         align: "center",
//       }
//     );

//     const orderId =
//       order.orderNumber ||
//       `ORD-${order.id || "001"}`;

//     doc.save(
//       `TechStore_Invoice_${orderId}.pdf`
//     );

//   } catch (error) {
//     console.error(
//       "Invoice generation error:",
//       error
//     );

//     alert(
//       "Unable to generate invoice. Please check the browser console."
//     );
//   }
// };







import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

export const generateInvoice = (order) => {
  try {
    if (!order) {
      console.error("No order provided");
      alert("Invoice data is not available.");
      return;
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // =====================================================
    // DATA
    // =====================================================

    const orderId =
      order.orderNumber || `ORD-${order.id || "001"}`;

    const invoiceId =
      `INV-${order.id || orderId.replace(/\D/g, "") || "001"}`;

    const orderDate = order.orderDate
      ? new Date(order.orderDate).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

    const customerName =
      order.fullName ||
      order.customerName ||
      "Customer";

    const email =
      order.userEmail ||
      order.email ||
      "N/A";

    const phone =
      order.mobile ||
      order.phone ||
      "N/A";

    const address =
      order.address ||
      order.shippingAddress ||
      "N/A";

    const paymentMethod =
      order.paymentMethod ||
      "COD";

    const paymentStatus =
      order.paymentStatus ||
      "PENDING";

    const orderStatus =
      order.orderStatus ||
      "PLACED";

    const courier =
      order.courierName ||
      "Express Courier";

    const tracking =
      order.trackingNumber ||
      "Assigned on Dispatch";

    const totalAmount =
      Number(order.totalAmount || 0);

    const shippingFee =
      Number(order.shippingFee || 0);

    const subtotal =
      Math.max(totalAmount - shippingFee, 0);

    // =====================================================
    // COLORS
    // =====================================================

    const NAVY = [15, 23, 42];
    const NAVY_2 = [30, 41, 59];

    const EMERALD = [16, 185, 129];
    const EMERALD_DARK = [5, 150, 105];

    const WHITE = [255, 255, 255];

    const TEXT = [51, 65, 85];
    const MUTED = [100, 116, 139];

    const LIGHT_BG = [248, 250, 252];
    const BORDER = [226, 232, 240];

    // =====================================================
    // HELPER
    // =====================================================

    // jsPDF default Helvetica doesn't reliably contain ₹.
    // Using "Rs." prevents broken/missing currency characters.
    const money = (value) =>
      `Rs. ${Number(value || 0).toFixed(2)}`;

    // =====================================================
    // HEADER
    // =====================================================

    doc.setFillColor(...NAVY);
    doc.rect(0, 0, 210, 42, "F");

    // Emerald accent
    doc.setFillColor(...EMERALD);
    doc.rect(0, 0, 5, 42, "F");

    // Brand
    doc.setTextColor(...WHITE);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("TechStore", 16, 19);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(203, 213, 225);
    doc.text(
      "Premium Electronics & Lifestyle Store",
      16,
      27
    );

    // Invoice title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);
    doc.setTextColor(...WHITE);
    doc.text(
      "TAX INVOICE",
      194,
      18,
      { align: "right" }
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(203, 213, 225);

    doc.text(
      `Invoice #: ${invoiceId}`,
      194,
      26,
      { align: "right" }
    );

    doc.text(
      `Order #: ${orderId}`,
      194,
      33,
      { align: "right" }
    );

    // =====================================================
    // CUSTOMER + ORDER INFO
    // =====================================================

    let y = 53;

    // Left card
    doc.setFillColor(...LIGHT_BG);
    doc.roundedRect(
      14,
      y,
      87,
      48,
      3,
      3,
      "F"
    );

    // Right card
    doc.setFillColor(...LIGHT_BG);
    doc.roundedRect(
      108,
      y,
      88,
      48,
      3,
      3,
      "F"
    );

    // Left heading
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...NAVY);
    doc.text("BILLED TO", 19, y + 9);

    doc.setDrawColor(...EMERALD);
    doc.setLineWidth(1);
    doc.line(
      19,
      y + 12,
      38,
      y + 12
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...TEXT);
    doc.text(customerName, 19, y + 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...MUTED);

    doc.text(
      `Email: ${email}`,
      19,
      y + 27
    );

    doc.text(
      `Phone: ${phone}`,
      19,
      y + 34
    );

    const addressLines =
      doc.splitTextToSize(
        `Address: ${address}`,
        78
      );

    doc.text(
      addressLines.slice(0, 2),
      19,
      y + 41
    );

    // Right heading
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...NAVY);
    doc.text(
      "ORDER INFORMATION",
      113,
      y + 9
    );

    doc.setDrawColor(...EMERALD);
    doc.line(
      113,
      y + 12,
      145,
      y + 12
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...TEXT);

    doc.text(
      `Order Date: ${orderDate}`,
      113,
      y + 20
    );

    doc.text(
      `Payment: ${paymentMethod}`,
      113,
      y + 27
    );

    doc.text(
      `Payment Status: ${paymentStatus}`,
      113,
      y + 34
    );

    doc.text(
      `Order Status: ${orderStatus}`,
      113,
      y + 41
    );

    // =====================================================
    // ITEMS
    // =====================================================

    const items =
      Array.isArray(order.items) &&
      order.items.length > 0
        ? order.items
        : [
            {
              productName: "Order Item",
              quantity: 1,
              price: subtotal,
            },
          ];

    const rows = items.map((item, index) => {
      const qty =
        Number(item.quantity || 1);

      const price =
        Number(item.price || 0);

      const lineTotal =
        qty * price;

      return [
        index + 1,
        item.productName ||
          item.name ||
          `Product #${item.productId || index + 1}`,
        qty,
        money(price),
        money(lineTotal),
      ];
    });

    autoTable(doc, {
      startY: 111,

      head: [
        [
          "#",
          "PRODUCT DESCRIPTION",
          "QTY",
          "UNIT PRICE",
          "TOTAL",
        ],
      ],

      body: rows,

      theme: "grid",

      styles: {
        font: "helvetica",
        fontSize: 9,
        cellPadding: 4,
        textColor: TEXT,
        lineColor: BORDER,
        lineWidth: 0.2,
        valign: "middle",
      },

      headStyles: {
        fillColor: NAVY,
        textColor: WHITE,
        fontStyle: "bold",
        fontSize: 8.5,
        cellPadding: 4,
      },

      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },

      columnStyles: {
        0: {
          cellWidth: 12,
          halign: "center",
        },

        1: {
          cellWidth: 82,
        },

        2: {
          cellWidth: 18,
          halign: "center",
        },

        3: {
          cellWidth: 36,
          halign: "right",
        },

        4: {
          cellWidth: 36,
          halign: "right",
          fontStyle: "bold",
        },
      },

      margin: {
        left: 14,
        right: 14,
      },
    });

    // =====================================================
    // SHIPPING DETAILS
    // =====================================================

    let finalY =
      doc.lastAutoTable?.finalY || 140;

    finalY += 8;

    if (
      order.courierName ||
      order.trackingNumber
    ) {
      doc.setFillColor(240, 253, 250);

      doc.roundedRect(
        14,
        finalY,
        182,
        25,
        3,
        3,
        "F"
      );

      doc.setDrawColor(
        167,
        243,
        208
      );

      doc.roundedRect(
        14,
        finalY,
        182,
        25,
        3,
        3,
        "S"
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(
        ...EMERALD_DARK
      );

      doc.text(
        "SHIPPING & TRACKING",
        19,
        finalY + 8
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...TEXT);

      doc.text(
        `Courier: ${courier}`,
        19,
        finalY + 16
      );

      doc.text(
        `Tracking: ${tracking}`,
        110,
        finalY + 16
      );

      finalY += 33;
    }

    // =====================================================
    // TOTALS
    // =====================================================

    const totalsX = 126;
    const totalsRight = 196;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);

    doc.text(
      "Subtotal",
      totalsX,
      finalY
    );

    doc.text(
      money(subtotal),
      totalsRight,
      finalY,
      { align: "right" }
    );

    doc.text(
      "Shipping & Handling",
      totalsX,
      finalY + 7
    );

    doc.text(
      money(shippingFee),
      totalsRight,
      finalY + 7,
      { align: "right" }
    );

    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.5);

    doc.line(
      totalsX,
      finalY + 12,
      totalsRight,
      finalY + 12
    );

    // Grand total background
    doc.setFillColor(...NAVY);

    doc.roundedRect(
      totalsX - 5,
      finalY + 16,
      75,
      18,
      3,
      3,
      "F"
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...WHITE);

    doc.text(
      "GRAND TOTAL",
      totalsX,
      finalY + 27
    );

    doc.setFontSize(11);
    doc.setTextColor(
      52,
      211,
      153
    );

    doc.text(
      money(totalAmount),
      totalsRight,
      finalY + 27,
      { align: "right" }
    );

    // =====================================================
    // PAYMENT BADGE
    // =====================================================

    const badgeText =
      paymentStatus.toUpperCase();

    const badgeColor =
      badgeText === "PAID"
        ? EMERALD
        : [245, 158, 11];

    doc.setFillColor(
      ...badgeColor
    );

    doc.roundedRect(
      14,
      finalY + 16,
      50,
      9,
      4,
      4,
      "F"
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...WHITE);

    doc.text(
      `PAYMENT: ${badgeText}`,
      39,
      finalY + 22,
      { align: "center" }
    );

    // =====================================================
    // FOOTER
    // =====================================================

    const pageHeight =
      doc.internal.pageSize.getHeight();

    const footerY =
      pageHeight - 20;

    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.4);

    doc.line(
      14,
      footerY - 7,
      196,
      footerY - 7
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...NAVY);

    doc.text(
      "Thank you for shopping with TechStore!",
      105,
      footerY,
      { align: "center" }
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);

    doc.text(
      "This is a computer-generated tax invoice. No physical signature is required.",
      105,
      footerY + 6,
      { align: "center" }
    );

    doc.text(
      "For support: support@techstore.com",
      105,
      footerY + 12,
      { align: "center" }
    );

    // =====================================================
    // SAVE
    // =====================================================

    const safeOrderId =
      String(orderId)
        .replace(/[^a-zA-Z0-9-_]/g, "_");

    doc.save(
      `TechStore_Invoice_${safeOrderId}.pdf`
    );

    console.log(
      "Invoice generated successfully:",
      safeOrderId
    );

  } catch (error) {
    console.error(
      "Invoice generation error:",
      error
    );

    alert(
      "Unable to generate invoice. Please try again."
    );
  }
};