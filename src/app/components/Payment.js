'use client';

import React, { useState } from 'react';
import { Button, useToast, Box } from '@chakra-ui/react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Initialize Stripe with your public key
const stripePromise = loadStripe(
  'pk_test_51Q2x5FE3fJXwSucfz8JdjyRuhEitcvxn6kdYxACk4sO1JdgOZwRS9D5iH09sbwwXiJLp83IQr851QUkUIbwdU4RN00oINkVKqZ'
);

const Payment = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const toast = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements) {
      return; // Stripe.js has not loaded yet.
    }

    setIsProcessing(true);

    try {
      // Create a payment intent on the server
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      const { clientSecret, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      // Confirm the payment with card details
      const cardElement = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        toast({
          title: 'Payment Error',
          description: result.error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } else if (result.paymentIntent.status === 'succeeded') {
        toast({
          title: 'Payment Successful',
          description: 'Your payment was successful!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Payment Failed',
        description: 'Unable to process payment, please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error('Payment error:', error);
    }

    setIsProcessing(false);
  };

  return (
    <Box>
      {/* Stripe's Card Element */}
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
      <Button
        mt={4}
        colorScheme="teal"
        width="full"
        onClick={handlePayment}
        isLoading={isProcessing}
        isDisabled={!stripe}
      >
        Pay ${amount}
      </Button>
    </Box>
  );
};

// Wrap Payment in Stripe Elements provider
const WrappedPayment = ({ amount }) => (
  <Elements stripe={stripePromise}>
    <Payment amount={amount} />
  </Elements>
);

export default WrappedPayment;
