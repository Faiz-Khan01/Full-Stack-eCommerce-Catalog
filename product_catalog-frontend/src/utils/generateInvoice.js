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

    // =====================================================
    // AMOUNTS
    // =====================================================

    const totalAmount =
      Number(order.totalAmount || 0);

    const shippingFee =
      Number(order.shippingFee || 0);

    // IMPORTANT:
    // Use discountAmount coming from backend.
    const discountAmount =
      Number(order.discountAmount || 0);

    // Coupon code coming from backend
    const couponCode =
      order.couponCode ||
      null;

    // Product subtotal BEFORE coupon discount.
    //
    // Prefer calculating it from order items because this is
    // the actual product value shown in the invoice.
    const itemsSubtotal =
      Array.isArray(order.items) && order.items.length > 0
        ? order.items.reduce((sum, item) => {
            const qty = Number(item.quantity || 1);
            const price = Number(item.price || 0);

            return sum + qty * price;
          }, 0)
        : Math.max(
            totalAmount +
              discountAmount -
              shippingFee,
            0
          );

    // =====================================================
    // COLORS
    // =====================================================

    const NAVY = [15, 23, 42];
    const EMERALD = [16, 185, 129];
    const EMERALD_DARK = [5, 150, 105];

    const WHITE = [255, 255, 255];

    const TEXT = [51, 65, 85];
    const MUTED = [100, 116, 139];

    const LIGHT_BG = [248, 250, 252];
    const BORDER = [226, 232, 240];

    const RED = [220, 38, 38];

    // =====================================================
    // HELPER
    // =====================================================

    // jsPDF Helvetica doesn't reliably support ₹.
    // Rs. is safer for generated PDFs.
    const money = (value) =>
      `Rs. ${Number(value || 0).toFixed(2)}`;

    // =====================================================
    // HEADER
    // =====================================================

    doc.setFillColor(...NAVY);
    doc.rect(0, 0, 210, 42, "F");

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
    doc.roundedRect(
      108,
      y,
      88,
      48,
      3,
      3,
      "F"
    );

    // -----------------------------------------------------
    // BILLED TO
    // -----------------------------------------------------

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...NAVY);

    doc.text(
      "BILLED TO",
      19,
      y + 9
    );

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

    doc.text(
      customerName,
      19,
      y + 20
    );

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

    // -----------------------------------------------------
    // ORDER INFORMATION
    // -----------------------------------------------------

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
              price: itemsSubtotal,
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
      doc.setFillColor(
        240,
        253,
        250
      );

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

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(9);
    doc.setTextColor(...MUTED);

    // -----------------------------------------------------
    // ORIGINAL / SUBTOTAL
    // -----------------------------------------------------

    doc.text(
      "Subtotal",
      totalsX,
      finalY
    );

    doc.text(
      money(itemsSubtotal),
      totalsRight,
      finalY,
      {
        align: "right",
      }
    );

    // -----------------------------------------------------
    // COUPON / DISCOUNT
    // -----------------------------------------------------

    if (discountAmount > 0) {
      doc.setTextColor(
        ...EMERALD_DARK
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.text(
        couponCode
          ? `Coupon Discount (${couponCode})`
          : "Coupon Discount",
        totalsX,
        finalY + 7
      );

      doc.text(
        `- ${money(discountAmount)}`,
        totalsRight,
        finalY + 7,
        {
          align: "right",
        }
      );
    }

    // -----------------------------------------------------
    // SHIPPING
    // -----------------------------------------------------

    const shippingY =
      discountAmount > 0
        ? finalY + 14
        : finalY + 7;

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setTextColor(...MUTED);

    doc.text(
      "Shipping & Handling",
      totalsX,
      shippingY
    );

    doc.text(
      money(shippingFee),
      totalsRight,
      shippingY,
      {
        align: "right",
      }
    );

    // =====================================================
    // DIVIDER
    // =====================================================

    const dividerY =
      shippingY + 6;

    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.5);

    doc.line(
      totalsX,
      dividerY,
      totalsRight,
      dividerY
    );

    // =====================================================
    // GRAND TOTAL
    // =====================================================

    const grandTotalY =
      dividerY + 16;

    doc.setFillColor(...NAVY);

    doc.roundedRect(
      totalsX - 5,
      dividerY + 4,
      75,
      18,
      3,
      3,
      "F"
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(10);
    doc.setTextColor(...WHITE);

    doc.text(
      "GRAND TOTAL",
      totalsX,
      grandTotalY - 1
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
      grandTotalY - 1,
      {
        align: "right",
      }
    );

    // =====================================================
    // PAYMENT BADGE
    // =====================================================

    const badgeText =
      paymentStatus.toUpperCase();

    const isSuccess =
      badgeText === "SUCCESS" ||
      badgeText === "PAID";

    const badgeColor =
      isSuccess
        ? EMERALD
        : [245, 158, 11];

    doc.setFillColor(
      ...badgeColor
    );

    doc.roundedRect(
      14,
      dividerY + 5,
      50,
      9,
      4,
      4,
      "F"
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(7.5);
    doc.setTextColor(...WHITE);

    doc.text(
      `PAYMENT: ${badgeText}`,
      39,
      dividerY + 11,
      {
        align: "center",
      }
    );

    // =====================================================
    // COUPON BADGE
    // =====================================================

    if (couponCode && discountAmount > 0) {
      doc.setFillColor(
        236,
        253,
        245
      );

      doc.setDrawColor(
        167,
        243,
        208
      );

      doc.roundedRect(
        14,
        dividerY + 18,
        75,
        13,
        3,
        3,
        "FD"
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(7.5);
      doc.setTextColor(
        ...EMERALD_DARK
      );

      doc.text(
        `COUPON: ${couponCode}`,
        18,
        dividerY + 24
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(7);

      doc.text(
        `You saved ${money(discountAmount)}`,
        18,
        dividerY + 28
      );
    }

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

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(9);
    doc.setTextColor(...NAVY);

    doc.text(
      "Thank you for shopping with TechStore!",
      105,
      footerY,
      {
        align: "center",
      }
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);

    doc.text(
      "This is a computer-generated tax invoice. No physical signature is required.",
      105,
      footerY + 6,
      {
        align: "center",
      }
    );

    doc.text(
      "For support: support@techstore.com",
      105,
      footerY + 12,
      {
        align: "center",
      }
    );

    // =====================================================
    // SAVE PDF
    // =====================================================

    const safeOrderId =
      String(orderId)
        .replace(
          /[^a-zA-Z0-9-_]/g,
          "_"
        );

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
