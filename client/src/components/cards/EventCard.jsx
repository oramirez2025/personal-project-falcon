import { Link } from "react-router-dom";
import {
  Heading,
  Text,
  Stack,
  Separator,
  Box,
  HStack,
} from "@chakra-ui/react";
import { Clock, MapPin, MessageCircle } from "lucide-react";
import BaseCard from "./BaseCard";

export default function EventCard({
  id,
  title,
  day,
  start_time,
  end_time,
  location,
  description,
  forumLink,
}) {
  // Auto-generate forum link if not provided
  const link = forumLink || `/forum/event/${id}`;

  return (
    <Link to={link} style={{ textDecoration: "none", display: "block", height: "100%" }}>
      <BaseCard
        h="100%"
        cursor="pointer"
        transition="all 0.3s ease"
        _hover={{
          transform: "translateY(-4px)",
          boxShadow: "0 8px 30px rgba(245, 158, 11, 0.2)",
          borderColor: "forge.gold.600",
        }}
        border="1px solid"
        borderColor="forge.stone.700"
      >
        <Stack spacing={3} h="100%">
          {/* Title */}
          <Heading size="md" color="text.primary" noOfLines={2}>
            {title}
          </Heading>

          {/* Date & Time */}
          <HStack gap={2} color="text.muted" fontSize="sm">
            <Clock size={14} />
            <Text>
              {day} · {start_time} - {end_time}
            </Text>
          </HStack>

          {/* Location */}
          <HStack gap={2} color="text.muted" fontSize="sm">
            <MapPin size={14} />
            <Text>{location}</Text>
          </HStack>

          <Separator borderColor="forge.stone.700" />

          {/* Description */}
          <Text fontSize="sm" color="text.secondary" noOfLines={3} flex="1">
            {description}
          </Text>

          {/* Forum Link Indicator */}
          <HStack 
            gap={2} 
            color="forge.gold.500" 
            fontSize="xs"
            mt="auto"
            pt={2}
          >
            <MessageCircle size={12} />
            <Text fontFamily="heading" letterSpacing="0.5px">
              DISCUSS EVENT
            </Text>
          </HStack>
        </Stack>
      </BaseCard>
    </Link>
  );
}