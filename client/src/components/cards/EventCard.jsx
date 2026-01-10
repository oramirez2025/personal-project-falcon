import {
  Heading,
  Text,
  Stack,
  Separator,
} from "@chakra-ui/react";
import BaseCard from "./BaseCard";
import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function EventCard({
  id,
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

        <Text fontSize="sm" color="text.muted">
          {day} · {start_time} - {end_time}
        </Text>

        <Text fontSize="sm" color="text.muted">
          📍 {location}
        </Text>

        <Separator />

        <Text fontSize="sm" noOfLines={4}>
          {description}
        </Text>
        <Button as={Link} to={`/events/${id}`}>
          Find Out More
        </Button>
      </Stack>
    </BaseCard>
  );
}