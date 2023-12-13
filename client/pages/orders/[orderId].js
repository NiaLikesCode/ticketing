import { useEffect, useState } from "react";
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51OLE4FGDLlDbvZJlUWpE1H4hXkLbPn3GxINLdQzPs3SG6PVWc1UApWMhzOeEQgE6C45wd3WNztPt72OwrCRnubwt00PLEFeO3K');

const OrderShow = ({ order, currentUser, clientSecret }) => {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect( () => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000));
        };

        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000);

        return () => {
            clearInterval(timerId);
        }
    }, [order]);

    if (timeLeft < 0) {
        return <div>Order Expired</div>
    }

    const stripeOptions = {
        clientSecret,
    };

    return <div>
        Time left to pay: {timeLeft} seconds
        <Elements stripe={stripePromise} options={stripeOptions}>
            <Checkout />
        </Elements>
    </div>;
};

const Checkout = () => {
    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setErrorMessage] = useState(null);

    const handlePaymentSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const {error} = await stripe.confirmPayment({
            elements,
            confirmParams: {
              return_url: 'https://ticketing.dev/orders',
            },
          });

        if (error) {
            setErrorMessage(error.message);
        }
    }

    return (
        <form onSubmit={handlePaymentSubmit}>
            <PaymentElement />
            <button className="btn btn-primary">Submit</button>
            {errorMessage && <div>{errorMessage}</div>}
        </form>
    )
};

OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    const { data: order } = await client.get(`/api/orders/${orderId}`);
    const { data: paymentIntent } = await client.post('/api/payments', {
        orderId
    });
    console.log(paymentIntent);

    return { order, clientSecret: paymentIntent.clientSecret };
}

export default OrderShow;