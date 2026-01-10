import { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { payForOrder } from "../utilities";
import StripeCheckoutForm from "./StripeCheckoutForm";
import { Drawer, Button, Text, Box } from "@chakra-ui/react";
import { showErrorToast } from "./ui/showErrorToast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function PaymentDrawer({ show, onClose, order }) {
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const appearance = { theme: "night" };

  const initializePayment = async () => {
    if (!order.id) return;
    setLoading(true);
    try {
      const paymentData = await payForOrder(order.id);
      setClientSecret(paymentData.client_secret);
    } catch (err) {
      console.error(err);
      showErrorToast("Payment", "Failed to initialize payment.");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show && order.id) initializePayment();
  }, [show, order.id]);

  return (
    <Drawer.Root
      open={show}
      onOpenChange={(e) => {
        if (!e.open) onClose();
      }}
      placement={{ base: "bottom", md: "right" }}
    >
      <Drawer.Backdrop />

        <Drawer.Positioner
          position="fixed"
          inset="0"
          display="flex"
          justifyContent={{ base: "center", md: "flex-end" }}
          alignItems={{ base: "flex-end", md: "stretch" }}
        >
        <Drawer.Content
          bg="gray.800"
          overflowY="auto"
          h={{ base: "92vh", md: "100vh" }}
          maxH={{ base: "92vh", md: "100vh" }}
          w={{ base: "100vw", md: "480px" }}
          maxW={{ base: "100vw", md: "480px" }}
          borderTopRadius={{ base: "16px", md: "0" }}
          m="0"
        >
          <Drawer.Header>
            <Drawer.Title size="lg" color="white">
              Pay for Order
            </Drawer.Title>
            <Drawer.CloseTrigger />
          </Drawer.Header>

          <Drawer.Body color="gray.400" fontSize="sm">
            <Text>
              <strong>Tickets:</strong>
            </Text>

            <Text>
              {(order?.items ?? []).map((item) => (
                <Text key={item.id}>
                  {item.title_at_purchase} × {item.quantity}
                </Text>
              ))}
            </Text>

            <Text mt="0.5rem">
              <Text as="strong" display="inline">
                Total:
              </Text>{" "}
              <Text as="span" color="red.600">
                ${order.total}
              </Text>
            </Text>


            {loading && <Text>Loading payment form...</Text>}

            {clientSecret && (
              <Box style={{ marginTop: "1rem" }}>
                <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                  <StripeCheckoutForm order={order} onSuccess={onClose} />
                </Elements>
              </Box>
            )}
          </Drawer.Body>

          <Drawer.Footer>
            <Button variant="outline" onClick={onClose} color="gray.400" fontSize="sm">
              Cancel
            </Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
}
