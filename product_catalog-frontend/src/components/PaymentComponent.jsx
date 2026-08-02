// import React, { useState } from 'react';
// import axios from 'axios';
// import Swal from 'sweetalert2';

// // FIX 1: Corrected the default live Render backend URL (Removed -13)
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://full-stack-ecommerce-catalog.onrender.com/api';

// // FIX 2: Changed process.env to import.meta.env and prefix to VITE_ for Vite compatibility
// const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key_id';

// const PaymentComponent = ({ orderId, amount, userEmail, onPaymentSuccess }) => {
//   const [loading, setLoading] = useState(false);

//   const initiatePayment = async () => {
//     setLoading(true);
//     try {
//       // Step 1: Create order on backend
//       const paymentRequest = {
//         orderId: orderId,
//         amount: amount,
//         currency: 'INR',
//         userEmail: userEmail,
//         description: `Order #${orderId}`,
//       };

//       const orderResponse = await axios.post(
//         `${API_BASE_URL}/payment/create-order`,
//         paymentRequest
//       );

//       const { razorpayOrderId } = orderResponse.data;

//       // Step 2: Open Razorpay payment gateway
//       const options = {
//         key: RAZORPAY_KEY_ID,
//         amount: amount * 100, // Amount in paise
//         currency: 'INR',
//         name: 'eCommerce Store',
//         description: `Order #${orderId}`,
//         order_id: razorpayOrderId,
//         handler: async (response) => {
//           // Step 3: Verify payment on backend
//           try {
//             const verifyResponse = await axios.post(
//               `${API_BASE_URL}/payment/verify`,
//               {
//                 razorpayOrderId: razorpayOrderId,
//                 razorpayPaymentId: response.razorpay_payment_id,
//                 razorpaySignature: response.razorpay_signature,
//               }
//             );

//             if (verifyResponse.status === 200) {
//               Swal.fire({
//                 icon: 'success',
//                 title: 'Payment Successful!',
//                 text: `Payment of ₹${amount} has been processed successfully.`,
//                 timer: 3000,
//               });

//               if (onPaymentSuccess) {
//                 onPaymentSuccess(response.razorpay_payment_id);
//               }
//             }
//           } catch (error) {
//             Swal.fire({
//               icon: 'error',
//               title: 'Payment Verification Failed',
//               text: 'Payment could not be verified. Please contact support.',
//             });
//             console.error('Payment verification error:', error);
//           }
//         },
//         prefill: {
//           email: userEmail,
//         },
//         theme: {
//           color: '#3399cc',
//         },
//         modal: {
//           ondismiss: () => {
//             Swal.fire({
//               icon: 'warning',
//               title: 'Payment Cancelled',
//               text: 'You have cancelled the payment.',
//             });
//             setLoading(false);
//           },
//         },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (error) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: error.response?.data || 'Failed to initiate payment',
//       });
//       console.error('Payment initiation error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="payment-container">
//       <button
//         onClick={initiatePayment}
//         disabled={loading}
//         className="btn btn-success btn-lg w-100"
//       >
//         {loading ? 'Processing...' : `Pay ₹${amount}`}
//       </button>
//     </div>
//   );
// };

// export default PaymentComponent;





import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://full-stack-ecommerce-catalog.onrender.com/api';
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key_id';

const normalizeDbOrderId = (value) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : null;
};

const PaymentComponent = ({ orderId, dbOrderId: incomingDbOrderId, amount, userEmail, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const initiatePayment = async () => {
    setLoading(true);
    try {
      const existingDbOrderId = normalizeDbOrderId(incomingDbOrderId ?? orderId);

      let dbOrderId = existingDbOrderId;

      if (!dbOrderId) {
        const orderCreateResponse = await axios.post(
          `${API_BASE_URL}/orders/place`,
          {
            userEmail: userEmail || 'guest@ecommerce.com',
            totalAmount: Number(amount),
            orderDate: new Date().toISOString(),
            paymentStatus: 'PENDING',
            paymentMethod: 'RAZORPAY',
          },
          {
            headers: getAuthHeaders(),
          }
        );

        dbOrderId = normalizeDbOrderId(
          orderCreateResponse.data?.id ??
          orderCreateResponse.data?.data?.id ??
          orderCreateResponse.data?.orderId
        );
      }

      if (!dbOrderId) {
        throw new Error('Unable to create or resolve the database order id for Razorpay verification.');
      }

      // Step 1: Create Razorpay order on backend using the real DB order ID
      const paymentRequest = {
        orderId: dbOrderId,
        amount: Number(amount),
        currency: 'INR',
        userEmail: userEmail || 'guest@ecommerce.com',
        description: `Order #${dbOrderId}`,
      };

      const orderResponse = await axios.post(
        `${API_BASE_URL}/payment/create-order`,
        paymentRequest
      );

      const razorpayOrderId = orderResponse.data?.razorpayOrderId || orderResponse.data?.order_id;

      // Step 2: Open Razorpay payment gateway
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: Number(amount) * 100,
        currency: 'INR',
        name: 'eCommerce Store',
        description: `Order #${dbOrderId}`,
        order_id: razorpayOrderId,
        handler: async (response) => {
          // Step 3: Verify payment on backend
          try {
            const verificationPayload = {
              dbOrderId,
              orderId: dbOrderId,
              razorpayOrderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            };

            const verifyResponse = await axios.post(
              `${API_BASE_URL}/payment/verify`,
              verificationPayload
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
              text: error.response?.data?.error || error.message || 'Payment could not be verified. Please contact support.',
            });
            console.error('Payment verification error:', error);
          }
        },
        prefill: {
          email: userEmail || 'guest@ecommerce.com',
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
        text: error.response?.data?.error || error.response?.data || error.message || 'Failed to initiate payment',
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