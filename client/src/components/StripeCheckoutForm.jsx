import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button, VStack } from "@chakra-ui/react";
import { showErrorToast } from "./ui/showErrorToast";
import { showSuccessToast } from "./ui/showSuccessToast";
import { primaryButtonStyles } from "../theme";

export default function StripeCheckoutForm({ order, onSuccess }) {
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
                showErrorToast("Payment Failed", error.message || "Something went wrong.");
                setProcessing(false);
                return;
            }

            if (paymentIntent?.status === "succeeded") {
                showSuccessToast("Payment Successful", "Thank you for your purchase!");
                // Small delay to ensure toast renders before drawer closes
                setTimeout(() => {
                    onSuccess?.(paymentIntent);
                }, 500);
            } else {
                showErrorToast("Payment Issue", `Status: ${paymentIntent?.status ?? "unknown"}`);
                setProcessing(false);
            }
        } catch (err) {
            console.error("Payment error:", err);
            showErrorToast("Payment Error", "An unexpected error occurred.");
            setProcessing(false);
        }
    };

    return (
        <VStack as="form" onSubmit={handleSubmit} spacing={4} align="stretch">
            <PaymentElement />

            <Button 
                type="submit" 
                disabled={!stripe || !elements || processing}
                {...primaryButtonStyles}
                _disabled={{
                    opacity: 0.6,
                    cursor: "not-allowed",
                }}
            >
                {processing ? "Processing..." : "Pay"}
            </Button>
        </VStack>
    );
}