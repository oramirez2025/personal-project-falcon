import { useState } from "react";
import { SimpleGrid, VStack, Button, Heading } from "@chakra-ui/react";
import TicketCard from "../components/cards/TicketCard";
import PaymentDrawer from "../components/PaymentDrawer";
import { createOrder } from "../utilities";


export default function TicketsPage() {
  const [showPaymentDrawer, setShowPaymentDrawer] = useState(false);
  const [order, setOrder] = useState(null);
  const [ticketA, setTicketA] = useState(0);
  const [ticketB, setTicketB] = useState(0);
  const [ticketC, setTicketC] = useState(0);

  const handleCheckout = async () => {
    const cart = { typeA: ticketA, typeB: ticketB, typeC: ticketC };

    try {
      const createdOrder = await createOrder(cart);
      setOrder(createdOrder);
      setShowPaymentDrawer(true);
    } catch {
      alert("Something went wrong with the payment.");
    }
  };

  return (
    <VStack align="stretch" spacing={6}>
      <Heading size="lg" color="white">
        Tickets
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} alignItems={"stretch"}>
        <TicketCard
          title="General Admission 🎟️"
          price="$250.00"
          setTicketQty={setTicketA}
          description="3 Days of TTRPGs, Tavern Feasts, Mixed Potions, Rare Merch, and Heroic Gift Bags."
        />
        <TicketCard
          title="Community Ticket 📜"
          price="$400.00"
          setTicketQty={setTicketB}
          description="All General Admission perks + Shared On-Site Stay."
        />
        <TicketCard
          title="Master Upgrade    🎫"
          price="$600.00"
          setTicketQty={setTicketC}
          description="All General Admission perks + Private chamber on-site."
        />
      </SimpleGrid>

      <Button
        size="lg"
        colorScheme="red"
        alignSelf="flex-start"
        onClick={handleCheckout}
      >
        Continue to Payment
      </Button>

      {showPaymentDrawer && order && (
        <PaymentDrawer
          show={showPaymentDrawer}
          onClose={() => {
            setShowPaymentDrawer(false);
            setOrder(null);
          }}
          order={order}
        />
      )}
    </VStack>
  );
}
