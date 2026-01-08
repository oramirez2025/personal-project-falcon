import { Heading, Grid, VStack } from "@chakra-ui/react";
import EventCard from "../cards/EventCard";

export default function DaySection({ day, events }) {
  return (
    <VStack align="stretch" spacing={4}>
      <Heading size="lg" color="white">
        {day}
      </Heading>

      <Grid
        templateColumns={{
          base: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap={6}
      >
        {events.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </Grid>
    </VStack>
  );
}
