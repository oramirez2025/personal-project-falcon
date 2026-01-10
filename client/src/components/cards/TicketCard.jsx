import { Heading, Text, VStack, Input, HStack, Box } from "@chakra-ui/react"
import { MotionBox } from "../Motion"
import { cardHover } from "../animations/fffAnimations"
import BaseCard from "./BaseCard"
import { inputStyles } from "../../theme"

/*
  Uses cardHover animation from fffAnimations
  Uses shared inputStyles from theme.js
  Accepts optional icon prop (lucide-react component)
 */
export default function TicketCard({
  title,
  icon,
  price,
  setTicketQty,
  description,
}) {
  return (
    <MotionBox
      {...cardHover}
      h="100%"
    >
      <BaseCard hoverable={false}>
        <VStack align="stretch" spacing={4}>
          {/* Title + icon + description */}
          <VStack align="start" spacing={2} minH="72px">
            <HStack spacing={2}>
              {icon && (
                <Box color="forge.gold.400">
                  {icon}
                </Box>
              )}
              <Heading size="md">{title}</Heading>
            </HStack>
            <Text color="text.muted" fontSize="sm">
              {description}
            </Text>
          </VStack>

          {/* Price + quantity */}
          <VStack align="start" spacing={1}>
            <Heading size="sm" color="forge.red.400">
              {price}
            </Heading>

            <Input
              type="number"
              min={0}
              max={10}
              size="sm"
              {...inputStyles}
              onChange={(e) => setTicketQty(Number(e.target.value))}
            />
          </VStack>
        </VStack>
      </BaseCard>
    </MotionBox>
  )
}