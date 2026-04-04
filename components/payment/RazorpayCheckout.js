'use client';

import { useEffect, useCallback } from 'react';

export default function RazorpayCheckout({ order, onSuccess, onFailure, userData }) {
  const loadScript = useCallback(() => {
    return new Promise((resolve) => {
      if (document.getElementById('razorpay-script')) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  useEffect(() => {
    if (!order) return;

    const openCheckout = async () => {
      const loaded = await loadScript();
      if (!loaded) {
        alert('Razorpay SDK failed to load. Please check your internet connection.');
        onFailure?.('SDK failed to load');
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'CelebrationApp',
        description: 'Wedding Invitation Template',
        order_id: order.id,
        handler: function (response) {
          onSuccess?.({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
        },
        prefill: {
          name: userData?.username || '',
          email: userData?.email || '',
          contact: userData?.mobile || '',
        },
        theme: {
          color: '#D4AF37',
          backdrop_color: 'rgba(0, 0, 0, 0.7)',
        },
        modal: {
          ondismiss: function () {
            onFailure?.('Payment cancelled');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        onFailure?.(response.error?.description || 'Payment failed');
      });
      rzp.open();
    };

    openCheckout();
  }, [order, loadScript, onSuccess, onFailure, userData]);

  return null; // Razorpay opens its own modal
}
