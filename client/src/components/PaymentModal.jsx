import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { payForOrder } from "../utilities";
import StripeCheckoutForm from "./StripeCheckoutForm"
import { Dialog, Button, Text, List, Box } from '@chakra-ui/react'
import { showSuccessToast } from "./ui/showSuccessToast";
import { showErrorToast } from "./ui/showErrorToast";
import { outlineButtonStyles } from "../theme";

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
        bg="bg.secondary"
        borderColor="border.accent"
        borderWidth="2px"
      >
        <Dialog.Header>
          <Dialog.Title color="text.primary">Pay for Order #{order?.id}</Dialog.Title>
          <Dialog.CloseTrigger color="text.secondary" />
        </Dialog.Header>

        <Dialog.Body>
          <Text fontWeight="bold" color="text.primary" mb={2}>
            Tickets:
          </Text>
          <List.Root as="ul" pl={4} mb={4}>
            {(order?.items ?? []).map((item) => (
              <List.Item key={item.id} color="text.secondary">
                {item.title_at_purchase} x {item.quantity}
              </List.Item>
            ))}
          </List.Root>

          <Text color="text.primary" mt={2}>
            <Text as="span" fontWeight="bold">Total:</Text> ${order?.total}
          </Text>

          {loading && <Text color="text.muted" mt={4}>Loading payment form...</Text>}

          {clientSecret && (
            <Box mt={4}>
              <Elements
                stripe={stripePromise}
                options={{ clientSecret }}
              >
                <StripeCheckoutForm order={order} onSuccess={onClose} />
              </Elements>
            </Box>
          )}
        </Dialog.Body>

        <Dialog.Footer>
          <Button onClick={onClose} {...outlineButtonStyles}>
            Cancel
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}