import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { showErrorToast } from "./ui/showErrorToast";
import { showSuccessToast } from "./ui/showSuccessToast";

export default function StripeCheckoutForm({ clientSecret, userId, onSuccess }) {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setProcessing(true);

        try {

            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                redirect: "if_required"
            });

            if (error) {
                showErrorToast("Payment", error.message || "Payment failed.");
                return;
            }

            if (paymentIntent?.status === "succeeded") {
                showSuccessToast("Payment", "Payment successful!");
                onSuccess?.(paymentIntent);
            } else {
                showErrorToast("Payment", `Payment status: ${paymentIntent?.status ?? "unknown"}`);
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
