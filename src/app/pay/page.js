'use client';
import { useRouter } from 'next/navigation';
import CheckoutPage from '../../../components/CheckoutPage';
import convertToSubcurrency from '../../../lib/convertToSubcurrency';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

if(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
    throw new Error('Missing Stripe public key');
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function QuizPage() {

    const amount = 47; // Amount in cents ($47.00)

//   const handleSubmit = async () => {
//     const res = await fetch('/api/create-checkout-session', {
//       method: 'POST',
//     });
//     const data = await res.json();
//     router.push(data.url); // Redirect to Stripe Checkout
//   };

  return (
    <div>
      <h1>Quiz Completed</h1>
      {/* <button onClick={handleSubmit}>Submit and Pay $47</button> */}

      <Elements 
      stripe={stripePromise}
      options={{
        mode: 'payment',
        amount: convertToSubcurrency(amount),
        currency: 'usd',
      }}
      >
        <CheckoutPage amount={amount} />
        </Elements>
    </div>
  );
}
