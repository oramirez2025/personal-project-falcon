import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { payForOrder } from "../utilities";
import StripeCheckoutForm from "./StripeCheckoutForm"
import { Dialog, Button } from '@chakra-ui/react'
import { showSuccessToast } from "./ui/showSuccessToast";
import { showErrorToast } from "./ui/showErrorToast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
export default function PaymentModal({ show, onClose, order }) {
    const [loading, setLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    

    const initializePayment = async () => {
        if (!order.id) return;
        setLoading(true);
        try {
            const paymentData = await payForOrder(order.id);
            setClientSecret(paymentData.client_secret);
        } catch (err) {
            console.error(err);
            alert("Failed to initialize payment.");
            onClose();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (show && order.id) {
            initializePayment();
        }
    }, [show, order.id]);

  
    return (
    <Dialog.Root
      open={show}
      onOpenChange={(e) => {
        if (!e.open) onClose();
      }}
      preventScroll={false}
    >
      <Dialog.Content
        maxH='90vh'
        overflowY="auto"
        mt="-8vh"
        mb="auto"
      >
        <Dialog.Header>
          <Dialog.Title>Pay for Order #{order?.id}</Dialog.Title>
          <Dialog.CloseTrigger />
        </Dialog.Header>

        <Dialog.Body>
          <p>
            <strong>Tickets:</strong>
          </p>
          <ul>
            {(order?.items ?? []).map((item) => (
              <li key={item.id}>
                {item.title_at_purchase} × {item.quantity}
              </li>
            ))}
          </ul>

          <p style={{ marginTop: "0.5rem" }}>
            <strong>Total:</strong> ${order?.total}
          </p>

          {loading && <p>Loading payment form...</p>}

          {clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{ clientSecret }}
            >
              <StripeCheckoutForm order={order} onSuccess={onClose} />
            </Elements>
          )}
        </Dialog.Body>

        <Dialog.Footer>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}
