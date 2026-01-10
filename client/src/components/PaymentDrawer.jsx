import { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { payForOrder } from "../utilities";
import StripeCheckoutForm from "./StripeCheckoutForm";
import { Drawer, Button, Text, Box, VStack } from "@chakra-ui/react";
import { showErrorToast } from "./ui/showErrorToast";
import { outlineButtonStyles } from "../theme";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function PaymentDrawer({ show, onClose, order }) {
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState(null);
  
  const appearance = { 
    theme: "night", 
    variables: {
      colorPrimary: '#b91c1c',
    }
  };

  const initializePayment = async () => {
    if (!order?.id) {
      setError("Invalid order - missing order ID");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log("Initializing payment for order:", order.id);
      const paymentData = await payForOrder(order.id);
      console.log("Payment data received:", paymentData);
      
      if (paymentData?.client_secret) {
        setClientSecret(paymentData.client_secret);
      } else {
        setError("No client secret received from server");
        showErrorToast("Payment", "Failed to initialize payment - no client secret.");
      }
    } catch (err) {
      console.error("Payment initialization error:", err);
      const errorMessage = err.response?.data?.error || err.message || "Failed to initialize payment.";
      setError(errorMessage);
      showErrorToast("Payment", errorMessage);
      // Don't close drawer on error - let user see the error and retry or cancel
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show && order?.id) {
      // Reset state when drawer opens
      setClientSecret("");
      setError(null);
      initializePayment();
    }
  }, [show, order?.id]);

  return (
    <Drawer.Root
      open={show}
      onOpenChange={(e) => {
        if (!e.open) onClose();
      }}
      placement={{ base: "bottom", md: "right" }}
    >
      <Drawer.Backdrop bg="rgba(0, 0, 0, 0.7)" />

      <Drawer.Positioner
        position="fixed"
        inset="0"
        display="flex"
        justifyContent={{ base: "center", md: "flex-end" }}
        alignItems={{ base: "flex-end", md: "stretch" }}
      >
        <Drawer.Content
          borderLeft="1px solid"
          borderColor="border.accent"
          bg="bg.secondary"
          overflowY="auto"
          h={{ base: "92vh", md: "100vh" }}
          maxH={{ base: "92vh", md: "100vh" }}
          w={{ base: "100vw", md: "480px" }}
          maxW={{ base: "100vw", md: "480px" }}
          borderTopRadius={{ base: "16px", md: "0" }}
          m="0"
        >
          <Drawer.Header>
            <Drawer.Title size="lg" color="text.primary">
              Pay for Order #{order?.id}
            </Drawer.Title>
            <Drawer.CloseTrigger color="text.secondary" />
          </Drawer.Header>

          <Drawer.Body>
            <VStack align="stretch" spacing={4}>
              <Box>
                <Text fontWeight="bold" color="text.primary" mb={2}>
                  Tickets:
                </Text>
                <VStack align="stretch" spacing={1} pl={2}>
                  {(order?.items ?? []).map((item) => (
                    <Text key={item.id} color="text.secondary" fontSize="sm">
                      {item.title_at_purchase} x {item.quantity}
                    </Text>
                  ))}
                </VStack>
              </Box>

              <Text color="text.primary">
                <Text as="span" fontWeight="bold">Total: </Text>
                <Text as="span" color="forge.red.400" fontWeight="bold">
                  ${order?.total}
                </Text>
              </Text>

              {loading && (
                <Text color="text.muted">Loading payment form...</Text>
              )}

              {error && (
                <Box 
                  bg="forge.red.900" 
                  border="1px solid" 
                  borderColor="forge.red.700" 
                  borderRadius="md" 
                  p={3}
                >
                  <Text color="forge.red.200" fontSize="sm">
                    Error: {error}
                  </Text>
                  <Button 
                    size="sm" 
                    mt={2} 
                    onClick={initializePayment}
                    bg="forge.red.700"
                    color="forge.tan.50"
                    _hover={{ bg: "forge.red.600" }}
                  >
                    Retry
                  </Button>
                </Box>
              )}

              {clientSecret && (
                <Box mt={4}>
                  <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                    <StripeCheckoutForm order={order} onSuccess={onClose} />
                  </Elements>
                </Box>
              )}
            </VStack>
          </Drawer.Body>

          <Drawer.Footer borderTop="1px solid" borderColor="border.default">
            <Button onClick={onClose} {...outlineButtonStyles}>
              Cancel
            </Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
}