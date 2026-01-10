import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { showErrorToast } from "./ui/showErrorToast";
import { showSuccessToast } from "./ui/showSuccessToast";
import { decrementTickets } from "../utilities";
import { Button } from "@chakra-ui/react"

export default function StripeCheckoutForm({ onSuccess, order }) {
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
                decrementTickets(order.id)
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

            <Button type="submit" disabled={!stripe || !elements || processing} style={{ marginTop: 12}} color="gray.400" fontSize="sm" variant="outline">
                {processing ? "Processing..." : "Pay"}
            </Button>
        </form>
    );
}
