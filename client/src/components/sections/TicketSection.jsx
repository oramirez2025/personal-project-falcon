import { VStack, Heading, Grid, Text } from "@chakra-ui/react";
import PurchasedTicketCard from "../cards/PurchasedTicketCard";

export default function TicketSection({ title, orders }) {
  // Empty state
  if (!orders || orders.length === 0) {
    return (
      <VStack align="start" gap={4}>
        <Heading size="lg" color="forge.gold.400">
          {title}
        </Heading>
        <Text color="gray.400">No tickets found</Text>
      </VStack>
    );
  }

  return (
    <VStack align="stretch" gap={6}>
      <Heading size="lg" color="forge.gold.400">
        {title}
      </Heading>
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
        gap={4}
      >
        {orders.flatMap(order =>
          order.items.map(item => (
            <PurchasedTicketCard
              key={item.id}
              ticketType={item.ticket_type}
              title={item.title_at_purchase}
              quantity={item.quantity}
              price={item.line_total}
              purchaseDate={order.created_at}
            />
          ))
        )}
      </Grid>
    </VStack>
  );
}
