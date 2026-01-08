import {
  Heading,
  Text,
  Stack,
  Separator,
} from "@chakra-ui/react";
import BaseCard from "./BaseCard";

export default function EventCard({
  title,
  day,
  start_time,
  end_time,
  location,
  description,
}) {
  return (
    <BaseCard>
      <Stack spacing={3}>
        <Heading size="md">{title}</Heading>

        <Text fontSize="sm" color="gray.400">
          {day} · {start_time} – {end_time}
        </Text>

        <Text fontSize="sm" color="gray.400">
          📍 {location}
        </Text>

        <Separator />

        <Text fontSize="sm" noOfLines={4}>
          {description}
        </Text>
      </Stack>
    </BaseCard>
  );
}
