import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { decrementTickets } from "../utilities";

export default function StripeCheckoutForm({ clientSecret, userId, onSuccess, order }) {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (processing) return;
        if (!stripe || !elements) return;
        setProcessing(true);

        try {

            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                redirect: "if_required"
            });

            if (error) {
                alert(error.message || "Payment failed.");
                return;
            }

            if (paymentIntent?.status === "succeeded") {
                alert("Payment successful!");
                decrementTickets(order.id)
                onSuccess?.(paymentIntent);
            } else {
                alert(`Payment status: ${paymentIntent?.status ?? "unknown"}`);
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />

            <button type="submit" disabled={!stripe || !elements || processing} style={{ marginTop: 12}}>
                {processing ? "Processing..." : "Pay"}
            </button>
        </form>
    );
}
