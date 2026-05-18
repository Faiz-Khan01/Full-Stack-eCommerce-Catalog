import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const PaymentComponent = ({ orderId, amount, userEmail, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const RAZORPAY_KEY_ID = process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_your_key_id';

  const initiatePayment = async () => {
    setLoading(true);
    try {
      // Step 1: Create order on backend
      const paymentRequest = {
        orderId: orderId,
        amount: amount,
        currency: 'INR',
        userEmail: userEmail,
        description: `Order #${orderId}`,
      };

      const orderResponse = await axios.post(
        'https://full-stack-ecommerce-catalog-13.onrender.com/api/payment/create-order',
        paymentRequest
      );

      const { razorpayOrderId } = orderResponse.data;

      // Step 2: Open Razorpay payment gateway
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        name: 'eCommerce Store',
        description: `Order #${orderId}`,
        order_id: razorpayOrderId,
        handler: async (response) => {
          // Step 3: Verify payment on backend
          try {
            const verifyResponse = await axios.post(
              'https://full-stack-ecommerce-catalog-13.onrender.com/api/payment/verify',
              {
                razorpayOrderId: razorpayOrderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }
            );

            if (verifyResponse.status === 200) {
              Swal.fire({
                icon: 'success',
                title: 'Payment Successful!',
                text: `Payment of ₹${amount} has been processed successfully.`,
                timer: 3000,
              });

              if (onPaymentSuccess) {
                onPaymentSuccess(response.razorpay_payment_id);
              }
            }
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Payment Verification Failed',
              text: 'Payment could not be verified. Please contact support.',
            });
            console.error('Payment verification error:', error);
          }
        },
        prefill: {
          email: userEmail,
        },
        theme: {
          color: '#3399cc',
        },
        modal: {
          ondismiss: () => {
            Swal.fire({
              icon: 'warning',
              title: 'Payment Cancelled',
              text: 'You have cancelled the payment.',
            });
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data || 'Failed to initiate payment',
      });
      console.error('Payment initiation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <button
        onClick={initiatePayment}
        disabled={loading}
        className="btn btn-success btn-lg w-100"
      >
        {loading ? 'Processing...' : `Pay ₹${amount}`}
      </button>
    </div>
  );
};

export default PaymentComponent;

