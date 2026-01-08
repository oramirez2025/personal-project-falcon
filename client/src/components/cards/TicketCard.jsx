import { Heading, Text, VStack, Input } from "@chakra-ui/react";
import { MotionBox } from "../Motion";
import BaseCard from "./BaseCard";

export default function TicketCard({
  title,
  price,
  setTicketQty,
  description,
}) {
  return (
    <MotionBox
      h="100%"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      spacing={6}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <BaseCard hoverable={false}>
        <VStack align="stretch" spacing={4}>
          {/* Title + description */}
          <VStack align="start" spacing={2} minH="72px">
            <Heading size="md">{title}</Heading>
            <Text color="gray.400" fontSize="sm">
              {description}
            </Text>
          </VStack>

          {/* Price + quantity */}
          <VStack align="start" spacing={1}>
            <Heading size="sm" color="red.600">
              {price}
            </Heading>

            <Input
              type="number"
              min={0}
              max={10}
              size="sm"
              bg="gray.700"
              borderColor="gray.600"
              _focus={{ borderColor: "red.400" }}
              onChange={(e) => setTicketQty(Number(e.target.value))}
            />
          </VStack>
        </VStack>
      </BaseCard>
    </MotionBox>
  );
}