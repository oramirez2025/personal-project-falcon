import { useState } from "react";
import { SimpleGrid, VStack, Button, Heading } from "@chakra-ui/react";
import { Ticket, Users, Crown } from "lucide-react";
import { MotionBox } from "../components/Motion";
import { staggerContainer, staggerItem } from "../components/animations/fffAnimations";
import TicketCard from "../components/cards/TicketCard";
import PaymentDrawer from "../components/PaymentDrawer";
import { createOrder, reserveTickets } from "../utilities";
import { primaryButtonStyles } from "../theme";
import { showErrorToast } from "../components/ui/showErrorToast";

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
      await reserveTickets(createdOrder.id)
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
        err.response?.data?.error || "Login to purchase tickets."
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
    <VStack align="stretch" spacing={6}>
      <Heading size="lg" color="text.primary">
        Tickets
      </Heading>

      <MotionBox
        as={SimpleGrid}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        columns={{ base: 1, md: 3 }}
        spacing={10}
        alignItems="stretch"
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
      </MotionBox>

      <Button
        size="lg"
        {...primaryButtonStyles}
        alignSelf="flex-start"
        onClick={handleCheckout}
        disabled={isLoading}
        _disabled={{ opacity: 0.6, cursor: "not-allowed" }}
      >
        {isLoading ? "Creating Order..." : "Continue to Payment"}
      </Button>

      {showPaymentDrawer && order && (
        <PaymentDrawer
          show={showPaymentDrawer}
          onClose={handleCloseDrawer}
          order={order}
        />
      )}
    </VStack>
  );
}