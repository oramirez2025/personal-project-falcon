import { useState } from "react";
import { Box, Container, VStack, Grid, Button, Heading, Text } from "@chakra-ui/react";
import { Ticket, Users, Crown } from "lucide-react";
import { MotionBox } from "../components/Motion";
import { staggerContainer, staggerItem } from "../components/animations/fffAnimations";
import TicketCard from "../components/cards/TicketCard";
import PaymentDrawer from "../components/PaymentDrawer";
import { createOrder, reserveTickets } from "../utilities";
import { primaryButtonStyles } from "../theme";
import { showErrorToast } from "../components/ui/showErrorToast";
import HeroicHall from "../assets/HeroicHall.jpeg";

// Consistent page margins to clear sidebar toggle button
const PAGE_MARGIN = { base: "16px", md: "50px" };

export default function TicketsPage() {
  const [showPaymentDrawer, setShowPaymentDrawer] = useState(false);
  const [order, setOrder] = useState(null);
  const [ticketA, setTicketA] = useState(0);
  const [ticketB, setTicketB] = useState(0);
  const [ticketC, setTicketC] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    // Validate at least one ticket selected
    if (ticketA === 0 && ticketB === 0 && ticketC === 0) {
      showErrorToast("Checkout", "Please select at least one ticket.");
      return;
    }

    const cart = { typeA: ticketA, typeB: ticketB, typeC: ticketC };
    setIsLoading(true);

    try {
      console.log("Creating order with cart:", cart);
      const createdOrder = await createOrder(cart);
      await reserveTickets(createdOrder.id);
      console.log("Order created:", createdOrder);
      
      if (createdOrder && createdOrder.id) {
        setOrder(createdOrder);
        setShowPaymentDrawer(true);
      } else {
        showErrorToast("Checkout", "Failed to create order - invalid response.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      showErrorToast(
        "Checkout", 
        err.response?.data?.error || "Something went wrong with checkout."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseDrawer = () => {
    setShowPaymentDrawer(false);
    setOrder(null);
  };

  return (
    <Box position="relative" minH="100vh">
      {/* Fixed Full-Page Background */}
      <Box
        position="fixed"
        top="0"
        left="0"
        w="100vw"
        h="100vh"
        bgImage={`url(${HeroicHall})`}
        bgSize="cover"
        bgPosition="center"
        bgAttachment="fixed"
        zIndex={0}
      />

      {/* Dark Overlay */}
      <Box
        position="fixed"
        top="0"
        left="0"
        w="100vw"
        h="100vh"
        bg="blackAlpha.800"
        zIndex={1}
      />

      {/* Content */}
      <Box position="relative" zIndex={2} px={PAGE_MARGIN} py={10}>
        <Container maxW="container.xl">
          <VStack align="stretch" spacing={8}>
            {/* Header */}
            <VStack spacing={2}>
              <Heading 
                size="2xl" 
                color="text.primary"
                textAlign="center"
                fontFamily="heading"
              >
                Get Your Tickets
              </Heading>
              <Text color="text.muted" textAlign="center" maxW="600px">
                Join us for an unforgettable adventure at FalCON. Choose your experience below.
              </Text>
            </VStack>

            {/* Tickets in a row - equal width */}
            <MotionBox
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              py={8}
            >
              <Grid
                templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                gap={{ base: 4, md: 6 }}
                maxW="1050px"
                mx="auto"
              >
                <MotionBox variants={staggerItem}>
                  <TicketCard
                    title="General Admission"
                    icon={<Ticket size={20} />}
                    price="$250.00"
                    setTicketQty={setTicketA}
                    description="3 Days of TTRPGs, Tavern Feasts, Mixed Potions, Rare Merch, and Heroic Gift Bags."
                  />
                </MotionBox>

                <MotionBox variants={staggerItem}>
                  <TicketCard
                    title="Community Ticket"
                    icon={<Users size={20} />}
                    price="$400.00"
                    setTicketQty={setTicketB}
                    description="All General Admission perks + Shared On-Site Stay."
                  />
                </MotionBox>

                <MotionBox variants={staggerItem}>
                  <TicketCard
                    title="Master Upgrade"
                    icon={<Crown size={20} />}
                    price="$600.00"
                    setTicketQty={setTicketC}
                    description="All General Admission perks + Private chamber on-site."
                  />
                </MotionBox>
              </Grid>
            </MotionBox>

            {/* Checkout Button */}
            <Box textAlign="center">
              <Button
                size="lg"
                {...primaryButtonStyles}
                onClick={handleCheckout}
                disabled={isLoading}
                _disabled={{ opacity: 0.6, cursor: "not-allowed" }}
                px={10}
                py={6}
                fontSize="lg"
              >
                {isLoading ? "Creating Order..." : "Continue to Payment"}
              </Button>
            </Box>
          </VStack>
        </Container>
      </Box>

      {showPaymentDrawer && order && (
        <PaymentDrawer
          show={showPaymentDrawer}
          onClose={handleCloseDrawer}
          order={order}
        />
      )}
    </Box>
  );
}