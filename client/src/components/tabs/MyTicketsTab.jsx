import { VStack, Heading, Text } from "@chakra-ui/react";
import TicketsTable from "../tables/TicketsTable";

export default function MyTicketsTab({ activeOrders, historyOrders }) {
  return (
    <VStack align="stretch" gap={8}>
      {/* Active Tickets Section */}
      <VStack align="stretch" gap={4}>
        <Heading size="lg" color="forge.gold.400">
          Active Tickets
        </Heading>
        {activeOrders.length > 0 ? (
          <TicketsTable orders={activeOrders} />
        ) : (
          <Text color="gray.400">No active tickets</Text>
        )}
      </VStack>

      {/* History Section */}
      {historyOrders.length > 0 && (
        <VStack align="stretch" gap={4}>
          <Heading size="lg" color="forge.gold.400">
            History
          </Heading>
          <TicketsTable orders={historyOrders} />
        </VStack>
      )}
    </VStack>
  );
}
