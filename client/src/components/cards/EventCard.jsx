import {
  Heading,
  Text,
  Stack,
  Separator,
  Center,
} from "@chakra-ui/react";
import BaseCard from "./BaseCard";
import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function EventCard({event, detailed}) {
  const {  id, title, day, start_time, end_time, location, description } = event
  return (
    <BaseCard>
      <Stack spacing={3}>
        <Center>
          <Heading size="md">{title}</Heading>
        </Center>
        <Center>
          <Text fontSize="sm" color="text.muted">
            {day} {detailed && `· ${start_time} - ${end_time}`}
          </Text>
        </Center>
        <Center>
          <Text fontSize="sm" color="text.muted">
            📍 {location}
          </Text>
        </Center>
        {
          detailed && 
          <Center>
            <Separator />

            <Text fontSize="sm" noOfLines={4}>
              {description}
            </Text>
          </Center>
        }
        {!detailed && 
          <Button as={Link} to={`/events/${id}`}>
            Find Out More
          </Button> 
        }

      </Stack>
    </BaseCard>
  );
}