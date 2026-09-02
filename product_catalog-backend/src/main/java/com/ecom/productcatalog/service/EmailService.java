package com.ecom.productcatalog.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Collections;
import java.util.List;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private SpringTemplateEngine templateEngine;

    @Value("${app.admin.email:ukharry128@gmail.com}")
    private String adminEmail;

    @Value("${spring.mail.username:ukharry128@gmail.com}")
    private String senderEmail;


    // =========================================================
    // 1. CUSTOMER ORDER CONFIRMATION EMAIL
    // =========================================================

    @Async
    public void sendOrderConfirmationEmail(
            String customerEmail,
            String customerName,
            String orderId,
            BigDecimal subtotalAmount,
            BigDecimal discountAmount,
            String couponCode,
            BigDecimal totalAmount,
            List<String> itemsSummary,
            String paymentMethod,
            String paymentStatus
    ) {

        try {

            System.out.println(
                    "📩 Sending customer order confirmation email..."
            );

            // -------------------------------------------------
            // CUSTOMER EMAIL VALIDATION
            // -------------------------------------------------

            if (customerEmail == null ||
                    customerEmail.isBlank()) {

                System.err.println(
                        "❌ Customer email is empty. Email not sent."
                );

                return;
            }

            // -------------------------------------------------
            // SAFE CUSTOMER NAME
            // -------------------------------------------------

            String safeCustomerName =
                    customerName != null &&
                            !customerName.isBlank()
                            ? customerName.trim()
                            : "Valued Customer";

            // -------------------------------------------------
            // SAFE ORDER ID
            // -------------------------------------------------

            String safeOrderId =
                    orderId != null &&
                            !orderId.isBlank()
                            ? orderId.trim()
                            : "N/A";

            // -------------------------------------------------
            // SAFE SUBTOTAL
            // -------------------------------------------------

            BigDecimal safeSubtotalAmount =
                    subtotalAmount != null
                            ? subtotalAmount.setScale(
                            2,
                            RoundingMode.HALF_UP
                    )
                            : BigDecimal.ZERO.setScale(
                            2,
                            RoundingMode.HALF_UP
                    );

            // -------------------------------------------------
            // SAFE DISCOUNT
            // -------------------------------------------------

            BigDecimal safeDiscountAmount =
                    discountAmount != null
                            ? discountAmount.setScale(
                            2,
                            RoundingMode.HALF_UP
                    )
                            : BigDecimal.ZERO.setScale(
                            2,
                            RoundingMode.HALF_UP
                    );

            // -------------------------------------------------
            // SAFE COUPON
            // -------------------------------------------------

            String safeCouponCode =
                    couponCode != null &&
                            !couponCode.isBlank()
                            ? couponCode.trim()
                            : "";

            // -------------------------------------------------
            // SAFE TOTAL
            // -------------------------------------------------

            BigDecimal safeTotalAmount =
                    totalAmount != null
                            ? totalAmount.setScale(
                            2,
                            RoundingMode.HALF_UP
                    )
                            : BigDecimal.ZERO.setScale(
                            2,
                            RoundingMode.HALF_UP
                    );

            // -------------------------------------------------
            // SAFE ITEMS
            // -------------------------------------------------

            List<String> safeItems =
                    itemsSummary != null
                            ? itemsSummary
                            : Collections.emptyList();

            // -------------------------------------------------
            // PAYMENT METHOD
            // -------------------------------------------------

            String normalizedPaymentMethod =
                    normalizePaymentMethod(
                            paymentMethod
                    );

            // -------------------------------------------------
            // PAYMENT STATUS
            // -------------------------------------------------

            String normalizedPaymentStatus =
                    normalizePaymentStatus(
                            paymentStatus
                    );

            // -------------------------------------------------
            // PAYMENT FLAGS
            // -------------------------------------------------

            boolean isPaymentSuccessful =
                    "SUCCESS".equalsIgnoreCase(
                            normalizedPaymentStatus
                    );

            boolean isCashOnDelivery =
                    isCashOnDelivery(
                            normalizedPaymentMethod
                    );

            // -------------------------------------------------
            // PAYMENT TITLE
            // -------------------------------------------------

            String paymentTitle;

            if (isPaymentSuccessful) {

                paymentTitle = "Total Paid";

            } else if (isCashOnDelivery) {

                paymentTitle = "Total Amount";

            } else {

                paymentTitle = "Amount Due";
            }

            // -------------------------------------------------
            // THYMELEAF CONTEXT
            // -------------------------------------------------

            Context context =
                    new Context();

            context.setVariable(
                    "customerName",
                    safeCustomerName
            );

            context.setVariable(
                    "orderId",
                    safeOrderId
            );

            context.setVariable(
                    "subtotalAmount",
                    safeSubtotalAmount
            );

            context.setVariable(
                    "discountAmount",
                    safeDiscountAmount
            );

            context.setVariable(
                    "couponCode",
                    safeCouponCode
            );

            context.setVariable(
                    "totalAmount",
                    safeTotalAmount
            );

            context.setVariable(
                    "items",
                    safeItems
            );

            context.setVariable(
                    "itemsSummary",
                    safeItems
            );

            context.setVariable(
                    "paymentMethod",
                    normalizedPaymentMethod
            );

            context.setVariable(
                    "paymentStatus",
                    normalizedPaymentStatus
            );

            context.setVariable(
                    "isPaymentSuccessful",
                    isPaymentSuccessful
            );

            context.setVariable(
                    "isCashOnDelivery",
                    isCashOnDelivery
            );

            context.setVariable(
                    "paymentTitle",
                    paymentTitle
            );

            // -------------------------------------------------
            // PROCESS TEMPLATE
            // -------------------------------------------------

            String htmlContent =
                    templateEngine.process(
                            "order-confirmation",
                            context
                    );

            // -------------------------------------------------
            // MIME MESSAGE
            // -------------------------------------------------

            MimeMessage message =
                    mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(
                            message,
                            true,
                            "UTF-8"
                    );

            helper.setFrom(
                    senderEmail,
                    "TechStore"
            );

            helper.setTo(
                    customerEmail.trim()
            );

            if (adminEmail != null &&
                    !adminEmail.isBlank()) {

                helper.setReplyTo(
                        adminEmail
                );
            }

            // -------------------------------------------------
            // SUBJECT
            // -------------------------------------------------

            String subject;

            if (isPaymentSuccessful) {

                subject =
                        "🛍️ Order Confirmed - Payment Successful #"
                                + safeOrderId;

            } else if (isCashOnDelivery) {

                subject =
                        "🛍️ Order Confirmed - Cash on Delivery #"
                                + safeOrderId;

            } else {

                subject =
                        "🛍️ Order Confirmed #"
                                + safeOrderId;
            }

            helper.setSubject(subject);

            // -------------------------------------------------
            // HTML
            // -------------------------------------------------

            helper.setText(
                    htmlContent,
                    true
            );

            // -------------------------------------------------
            // SEND
            // -------------------------------------------------

            mailSender.send(message);

            System.out.println(
                    "✅ Customer order email sent successfully"
                            + " | Email: " + customerEmail
                            + " | Order: #" + safeOrderId
                            + " | Subtotal: ₹" + safeSubtotalAmount
                            + " | Discount: ₹" + safeDiscountAmount
                            + " | Coupon: " + safeCouponCode
                            + " | Total: ₹" + safeTotalAmount
                            + " | Method: "
                            + normalizedPaymentMethod
                            + " | Status: "
                            + normalizedPaymentStatus
            );

        } catch (Exception e) {

            System.err.println(
                    "❌ Failed to send customer order email"
                            + " | Email: " + customerEmail
                            + " | Error: " + e.getMessage()
            );

            e.printStackTrace();
        }
    }


    // =========================================================
    // 2. ADMIN NEW ORDER EMAIL
    // =========================================================
    //
    // THIS IS THE MAIN METHOD.
    //
    // OrderService calls:
    //
    // sendAdminNewOrderAlert(
    //      orderId,
    //      totalAmount,
    //      customerName,
    //      paymentMethod,
    //      paymentStatus
    // )
    //
    // =========================================================

    @Async
    public void sendAdminNewOrderAlert(
            String orderId,
            BigDecimal totalAmount,
            String customerName,
            String paymentMethod,
            String paymentStatus
    ) {

        try {

            System.out.println(
                    "📩 Sending admin new-order email..."
            );

            // -------------------------------------------------
            // SAFE CUSTOMER NAME
            // -------------------------------------------------

            String safeCustomerName =
                    customerName != null &&
                            !customerName.isBlank()
                            ? customerName.trim()
                            : "Customer";

            // -------------------------------------------------
            // SAFE ORDER ID
            // -------------------------------------------------

            String safeOrderId =
                    orderId != null &&
                            !orderId.isBlank()
                            ? orderId.trim()
                            : "N/A";

            // -------------------------------------------------
            // SAFE TOTAL
            // -------------------------------------------------

            BigDecimal safeTotalAmount =
                    totalAmount != null
                            ? totalAmount.setScale(
                            2,
                            RoundingMode.HALF_UP
                    )
                            : BigDecimal.ZERO.setScale(
                            2,
                            RoundingMode.HALF_UP
                    );

            // -------------------------------------------------
            // PAYMENT METHOD
            // -------------------------------------------------

            String normalizedPaymentMethod =
                    normalizePaymentMethod(
                            paymentMethod
                    );

            // -------------------------------------------------
            // PAYMENT STATUS
            // -------------------------------------------------

            String normalizedPaymentStatus =
                    normalizePaymentStatus(
                            paymentStatus
                    );

            // -------------------------------------------------
            // PAYMENT SUCCESS
            // -------------------------------------------------

            boolean isPaymentSuccessful =
                    "SUCCESS".equalsIgnoreCase(
                            normalizedPaymentStatus
                    );

            // -------------------------------------------------
            // THYMELEAF CONTEXT
            // -------------------------------------------------

            Context context =
                    new Context();

            context.setVariable(
                    "orderId",
                    safeOrderId
            );

            context.setVariable(
                    "customerName",
                    safeCustomerName
            );

            context.setVariable(
                    "totalAmount",
                    safeTotalAmount
            );

            context.setVariable(
                    "paymentMethod",
                    normalizedPaymentMethod
            );

            context.setVariable(
                    "paymentStatus",
                    normalizedPaymentStatus
            );

            context.setVariable(
                    "isPaymentSuccessful",
                    isPaymentSuccessful
            );

            // -------------------------------------------------
            // PROCESS ADMIN TEMPLATE
            // -------------------------------------------------

            String htmlContent =
                    templateEngine.process(
                            "admin-new-order",
                            context
                    );

            // -------------------------------------------------
            // CREATE MIME MESSAGE
            // -------------------------------------------------

            MimeMessage message =
                    mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(
                            message,
                            true,
                            "UTF-8"
                    );

            // -------------------------------------------------
            // FROM
            // -------------------------------------------------

            helper.setFrom(
                    senderEmail,
                    "TechStore"
            );

            // -------------------------------------------------
            // TO ADMIN
            // -------------------------------------------------

            helper.setTo(
                    adminEmail
            );

            // -------------------------------------------------
            // SUBJECT
            // -------------------------------------------------

            String subject;

            if (isPaymentSuccessful) {

                subject =
                        "🛍️ New Order Received - Payment Successful #"
                                + safeOrderId;

            } else {

                subject =
                        "🛍️ New Order Received: #"
                                + safeOrderId;
            }

            helper.setSubject(subject);

            // -------------------------------------------------
            // HTML BODY
            // -------------------------------------------------

            helper.setText(
                    htmlContent,
                    true
            );

            // -------------------------------------------------
            // SEND
            // -------------------------------------------------

            mailSender.send(message);

            System.out.println(
                    "✅ Admin new-order email sent successfully"
                            + " | Order: #" + safeOrderId
                            + " | Customer: "
                            + safeCustomerName
                            + " | Payment Method: "
                            + normalizedPaymentMethod
                            + " | Payment Status: "
                            + normalizedPaymentStatus
            );

        } catch (Exception e) {

            System.err.println(
                    "❌ Admin HTML Email Failed"
                            + " | Order: #" + orderId
                            + " | Error: "
                            + e.getMessage()
            );

            e.printStackTrace();
        }
    }


    // =========================================================
    // 2B. ADMIN NEW ORDER EMAIL - SIMPLE OVERLOAD
    // =========================================================
    //
    // This keeps your existing EmailTestController working.
    //
    // =========================================================

    @Async
    public void sendAdminNewOrderAlert(
            String orderId,
            BigDecimal totalAmount,
            String customerName
    ) {

        sendAdminNewOrderAlert(
                orderId,
                totalAmount,
                customerName,
                "Cash on Delivery",
                "PENDING"
        );
    }


    // =========================================================
    // 3. PAYMENT METHOD NORMALIZER
    // =========================================================

    private String normalizePaymentMethod(
            String paymentMethod
    ) {

        if (paymentMethod == null ||
                paymentMethod.isBlank()) {

            return "Cash on Delivery";
        }

        String value =
                paymentMethod
                        .trim()
                        .toLowerCase()
                        .replace("_", " ")
                        .replace("-", " ")
                        .replaceAll(
                                "\\s+",
                                " "
                        );

        // COD

        if (value.equals("cod") ||
                value.equals("cash on delivery") ||
                value.equals("cash delivery") ||
                value.equals("cash")) {

            return "Cash on Delivery";
        }

        // CARD

        if (value.equals("card") ||
                value.equals("credit card") ||
                value.equals("debit card")) {

            return "Card";
        }

        // UPI

        if (value.equals("upi")) {

            return "UPI";
        }

        // PAYPAL

        if (value.equals("paypal")) {

            return "PayPal";
        }

        // RAZORPAY

        if (value.equals("razorpay")) {

            return "Razorpay";
        }

        return paymentMethod.trim();
    }


    // =========================================================
    // 4. PAYMENT STATUS NORMALIZER
    // =========================================================

    private String normalizePaymentStatus(
            String paymentStatus
    ) {

        if (paymentStatus == null ||
                paymentStatus.isBlank()) {

            return "PENDING";
        }

        String value =
                paymentStatus
                        .trim()
                        .toUpperCase();

        // SUCCESS

        if (value.equals("SUCCESS") ||
                value.equals("PAID") ||
                value.equals("COMPLETED")) {

            return "SUCCESS";
        }

        // PENDING

        if (value.contains("PENDING")) {

            return "PENDING";
        }

        // FAILED

        if (value.equals("FAILED") ||
                value.equals("FAILURE")) {

            return "FAILED";
        }

        return value;
    }


    // =========================================================
    // 5. CHECK COD
    // =========================================================

    private boolean isCashOnDelivery(
            String paymentMethod
    ) {

        return paymentMethod != null &&
                paymentMethod.equalsIgnoreCase(
                        "Cash on Delivery"
                );
    }


    // =========================================================
    // 6. ADMIN LOW STOCK ALERT
    // =========================================================

    @Async
    public void sendLowStockAlert(
            String productName,
            int currentStock,
            int threshold
    ) {

        try {

            System.out.println(
                    "📩 Sending low-stock alert..."
            );

            String safeProductName =
                    productName != null &&
                            !productName.isBlank()
                            ? productName.trim()
                            : "Unknown Product";

            SimpleMailMessage message =
                    new SimpleMailMessage();

            message.setFrom(
                    senderEmail
            );

            message.setTo(
                    adminEmail
            );

            message.setSubject(
                    "⚠️ Low Stock Alert: "
                            + safeProductName
            );

            message.setText(
                    "Attention Admin,\n\n"
                            + "Stock for '"
                            + safeProductName
                            + "' has dropped below the safety threshold.\n\n"

                            + "----------------------------------------\n"
                            + "LOW STOCK DETAILS\n"
                            + "----------------------------------------\n\n"

                            + "Product: "
                            + safeProductName
                            + "\n"

                            + "Current Stock: "
                            + currentStock
                            + "\n"

                            + "Threshold: "
                            + threshold
                            + "\n\n"

                            + "Please restock this product soon via the Admin Inventory panel.\n\n"

                            + "Regards,\n"
                            + "TechStore"
            );

            mailSender.send(message);

            System.out.println(
                    "✅ Low Stock Alert Email Sent Successfully"
            );

        } catch (Exception e) {

            System.err.println(
                    "❌ Low Stock Alert Email Failed: "
                            + e.getMessage()
            );

            e.printStackTrace();
        }
    }


    // =========================================================
    // 7. ADMIN SUPPORT TICKET NOTIFICATION
   // =========================================================

    @Async
    public void sendAdminSupportTicketAlert(
            Long ticketId,
            String customerEmail,
            String category,
            String subject,
            String ticketMessage,
            String priority
    ) {

        try {

            System.out.println(
                    "📩 Sending HTML support ticket notification..."
            );

            // -----------------------------------------------------
            // SAFE CUSTOMER EMAIL
            // -----------------------------------------------------

            String safeCustomerEmail =
                    customerEmail != null &&
                            !customerEmail.isBlank()
                            ? customerEmail.trim()
                            : "Not provided";

            // -----------------------------------------------------
            // SAFE CATEGORY
            // -----------------------------------------------------

            String safeCategory =
                    category != null &&
                            !category.isBlank()
                            ? category.trim()
                            : "General";

            // -----------------------------------------------------
            // SAFE SUBJECT
            // -----------------------------------------------------

            String safeSubject =
                    subject != null &&
                            !subject.isBlank()
                            ? subject.trim()
                            : "Support Request";

            // -----------------------------------------------------
            // SAFE MESSAGE
            // -----------------------------------------------------

            String safeTicketMessage =
                    ticketMessage != null &&
                            !ticketMessage.isBlank()
                            ? ticketMessage.trim()
                            : "No message provided";

            // -----------------------------------------------------
            // SAFE PRIORITY
            // -----------------------------------------------------

            String safePriority =
                    priority != null &&
                            !priority.isBlank()
                            ? priority.trim().toUpperCase()
                            : "NORMAL";

            // -----------------------------------------------------
            // PRIORITY FLAGS
            // -----------------------------------------------------

            boolean isUrgent =
                    "URGENT".equalsIgnoreCase(
                            safePriority
                    );

            boolean isHigh =
                    "HIGH".equalsIgnoreCase(
                            safePriority
                    );

            // -----------------------------------------------------
            // THYMELEAF CONTEXT
            // -----------------------------------------------------

            Context context =
                    new Context();

            context.setVariable(
                    "ticketId",
                    ticketId
            );

            context.setVariable(
                    "customerEmail",
                    safeCustomerEmail
            );

            context.setVariable(
                    "category",
                    safeCategory
            );

            context.setVariable(
                    "subject",
                    safeSubject
            );

            context.setVariable(
                    "ticketMessage",
                    safeTicketMessage
            );

            context.setVariable(
                    "priority",
                    safePriority
            );

            context.setVariable(
                    "isUrgent",
                    isUrgent
            );

            context.setVariable(
                    "isHigh",
                    isHigh
            );

            // -----------------------------------------------------
            // PROCESS THYMELEAF HTML
            // -----------------------------------------------------

            String htmlContent =
                    templateEngine.process(
                            "support-ticket",
                            context
                    );

            // -----------------------------------------------------
            // CREATE MIME MESSAGE
            // -----------------------------------------------------

            MimeMessage message =
                    mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(
                            message,
                            true,
                            "UTF-8"
                    );

            // -----------------------------------------------------
            // FROM
            // -----------------------------------------------------

            helper.setFrom(
                    senderEmail,
                    "TechStore"
            );

            // -----------------------------------------------------
            // TO ADMIN
            // -----------------------------------------------------

            helper.setTo(
                    adminEmail
            );

            // -----------------------------------------------------
            // REPLY TO CUSTOMER
            // -----------------------------------------------------

            if (!safeCustomerEmail.equals(
                    "Not provided"
            )) {

                helper.setReplyTo(
                        safeCustomerEmail
                );
            }

            // -----------------------------------------------------
            // SUBJECT
            // -----------------------------------------------------

            String emailSubject;

            if (isUrgent) {

                emailSubject =
                        "🚨 URGENT Support Ticket #"
                                + ticketId;

            } else if (isHigh) {

                emailSubject =
                        "⚠️ HIGH Priority Support Ticket #"
                                + ticketId;

            } else {

                emailSubject =
                        "🎫 New Support Ticket #"
                                + ticketId;
            }

            helper.setSubject(
                    emailSubject
            );

            // -----------------------------------------------------
            // HTML BODY
            // -----------------------------------------------------

            helper.setText(
                    htmlContent,
                    true
            );

            // -----------------------------------------------------
            // SEND
            // -----------------------------------------------------

            mailSender.send(message);

            System.out.println(
                    "✅ HTML Support Ticket Email Sent Successfully"
                            + " | Ticket: #" + ticketId
                            + " | Customer: "
                            + safeCustomerEmail
                            + " | Category: "
                            + safeCategory
                            + " | Priority: "
                            + safePriority
            );

        } catch (Exception e) {

            System.err.println(
                    "❌ HTML Support Ticket Email Failed"
                            + " | Ticket: #" + ticketId
                            + " | Error: "
                            + e.getMessage()
            );

            e.printStackTrace();
        }
    }



    // =========================================================
    // 8. ORDER STATUS & SHIPPING UPDATE EMAIL
    // =========================================================

    @Async
    public void sendOrderStatusUpdateEmail(
            String customerEmail,
            String customerName,
            String orderNumber,
            String newStatus,
            String courierName,
            String trackingNumber,
            String trackingUrl
    ) {
        try {
            if (customerEmail == null || customerEmail.isBlank()) {
                return;
            }

            String safeName = (customerName != null && !customerName.isBlank()) ? customerName.trim() : "Valued Customer";
            String safeOrderNo = (orderNumber != null && !orderNumber.isBlank()) ? orderNumber : "Order";

            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setFrom(senderEmail);
            mail.setTo(customerEmail);
            mail.setSubject("🚚 Order Update: #" + safeOrderNo + " is now " + newStatus);

            StringBuilder msg = new StringBuilder();
            msg.append("Hello ").append(safeName).append(",\n\n")
               .append("The status of your order #").append(safeOrderNo).append(" has been updated to: ")
               .append(newStatus).append("\n\n");

            if (courierName != null && !courierName.isBlank()) {
                msg.append("Courier: ").append(courierName).append("\n");
            }
            if (trackingNumber != null && !trackingNumber.isBlank()) {
                msg.append("Tracking Number: ").append(trackingNumber).append("\n");
            }
            if (trackingUrl != null && !trackingUrl.isBlank()) {
                msg.append("Track your shipment here: ").append(trackingUrl).append("\n");
            }

            msg.append("\nThank you for shopping with TechStore!\n\nRegards,\nTechStore Logistics Team");

            mail.setText(msg.toString());
            mailSender.send(mail);
            System.out.println("✅ Order Status Update Email sent to " + customerEmail);
        } catch (Exception e) {
            System.err.println("❌ Order Status Email Failed: " + e.getMessage());
        }
    }


    // =========================================================
    // 9. ORDER CANCELLATION & REFUND EMAIL
    // =========================================================

    @Async
    public void sendOrderCancelledEmail(
            String customerEmail,
            String customerName,
            String orderNumber,
            String refundInfo
    ) {
        try {
            if (customerEmail == null || customerEmail.isBlank()) {
                return;
            }

            String safeName = (customerName != null && !customerName.isBlank()) ? customerName.trim() : "Valued Customer";
            String safeOrderNo = (orderNumber != null && !orderNumber.isBlank()) ? orderNumber : "Order";

            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setFrom(senderEmail);
            mail.setTo(customerEmail);
            mail.setSubject("❌ Order Cancelled: #" + safeOrderNo);

            StringBuilder msg = new StringBuilder();
            msg.append("Hello ").append(safeName).append(",\n\n")
               .append("Your order #").append(safeOrderNo).append(" has been successfully cancelled.\n\n");

            if (refundInfo != null && !refundInfo.isBlank()) {
                msg.append("Refund Status: ").append(refundInfo).append("\n\n");
            }

            msg.append("If you have any questions, please feel free to reach out to our support team.\n\n")
               .append("Regards,\nTechStore Customer Care");

            mail.setText(msg.toString());
            mailSender.send(mail);
            System.out.println("✅ Order Cancellation Email sent to " + customerEmail);
        } catch (Exception e) {
            System.err.println("❌ Order Cancellation Email Failed: " + e.getMessage());
        }
    }
}