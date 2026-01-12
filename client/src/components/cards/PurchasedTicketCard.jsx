import { Heading, Text, HStack, VStack, Box } from "@chakra-ui/react";
import BaseCard from "./BaseCard";

export default function PurchasedTicketCard({
  ticketType,
  title,
  quantity,
  price,
  purchaseDate
}) {
  // Badge colors based on ticket type
  const getTicketColor = (type) => {
    switch (type) {
      case "general":
        return { bg: "red.700", color: "white" };
      case "community":
        return { bg: "yellow.600", color: "black" };
      case "master":
        return { bg: "orange.600", color: "white" };
      default:
        return { bg: "gray.600", color: "white" };
    }
  };

  // Format ticket type for display
  const formatTicketType = (type) => {
    if (!type) return "Ticket";
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const badgeColors = getTicketColor(ticketType);

  return (
    <BaseCard>
      <VStack align="stretch" gap={3}>
        <HStack justify="space-between" align="start">
          <Heading size="md" color="white">
            {title}
          </Heading>
          <Box
            px={3}
            py={1}
            borderRadius="md"
            bg={badgeColors.bg}
            color={badgeColors.color}
            fontSize="sm"
            fontWeight="bold"
          >
            {formatTicketType(ticketType)}
          </Box>
        </HStack>

        <HStack justify="space-between">
          <Text color="gray.300">Quantity:</Text>
          <Text color="white" fontWeight="bold">
            {quantity}
          </Text>
        </HStack>

        <HStack justify="space-between">
          <Text color="gray.300">Total:</Text>
          <Text fontSize="lg" fontWeight="bold" color="forge.gold.400">
            ${parseFloat(price).toFixed(2)}
          </Text>
        </HStack>

        <Text fontSize="sm" color="gray.400" mt={2}>
          Purchased: {formatDate(purchaseDate)}
        </Text>
      </VStack>
    </BaseCard>
  );
}
