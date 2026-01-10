import { Heading, Grid, VStack } from "@chakra-ui/react"
import { MotionBox } from "../Motion"
import { staggerContainer, staggerItem } from "../animations/fffAnimations"
import EventCard from "../cards/EventCard"

// Added staggered entrance animations for event cards
export default function DaySection({ day, events }) {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading size="lg" color="text.primary">
        {day}
      </Heading>

      <MotionBox
        as={Grid}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        templateColumns={{
          base: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap={6}
      >
        {events.map((event) => (
          <MotionBox key={event.id} variants={staggerItem}>
            <EventCard {...event} />
          </MotionBox>
        ))}
      </MotionBox>
    </VStack>
  )
}