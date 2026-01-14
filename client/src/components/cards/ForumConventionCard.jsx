import { HStack, Text, Box } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Sword, MessageCircle, Flame } from "lucide-react";
import ForumCardBase from "../forum/ForumCardBase";

/**
 * Convention card for the forum Quest Board
 * Uses ForumCardBase for consistent styling
 */
export default function ForumConventionCard({
  year,
  name,
  startDate,
  endDate,
  location,
  isActive = false,
  eventCount = 0,
  discussionCount = 0,
  isPast = false,
}) {
  return (
    <Link to={`/forum/convention/${year}`} style={{ textDecoration: "none" }}>
      <ForumCardBase
        hoverable
        accentBar
        corners
        padding={isPast ? 4 : 6}
        mb={4}
        opacity={isPast ? 0.7 : 1}
        _hover={{ opacity: 1 }}
      >
        {/* Header Row */}
        <HStack gap={4} mb={isPast ? 2 : 3} flexWrap="wrap">
          <Text
            fontFamily="heading"
            fontSize={isPast ? "2xl" : "3xl"}
            color="forge.gold.400"
            textShadow="0 2px 8px rgba(0,0,0,0.5)"
          >
            {year}
          </Text>
          <Text
            fontFamily="heading"
            fontSize={isPast ? "lg" : "2xl"}
            color="forge.tan.100"
          >
            {name}
          </Text>
          
          {isActive && (
            <HStack
              ml="auto"
              bg="forge.red.700"
              color="forge.tan.100"
              px={3}
              py={1}
              borderRadius="md"
              fontSize="xs"
              textTransform="uppercase"
              letterSpacing="1px"
              gap={1.5}
            >
              <Flame size={12} />
              <Text>Active</Text>
            </HStack>
          )}
        </HStack>

        {/* Meta Row */}
        <HStack gap={6} color="forge.tan.400" fontSize="sm" flexWrap="wrap">
          <HStack gap={1.5}>
            <Calendar size={14} color="var(--chakra-colors-forge-gold-400)" />
            <Text>{startDate} - {endDate.split(", ")[0]}</Text>
          </HStack>
          
          {!isPast && (
            <HStack gap={1.5}>
              <MapPin size={14} color="var(--chakra-colors-forge-gold-400)" />
              <Text>{location}</Text>
            </HStack>
          )}
          
          <HStack gap={1.5}>
            <Sword size={14} color="var(--chakra-colors-forge-gold-400)" />
            <Text>{eventCount} Events</Text>
          </HStack>
          
          <HStack gap={1.5}>
            <MessageCircle size={14} color="var(--chakra-colors-forge-gold-400)" />
            <Text>{discussionCount} Discussions</Text>
          </HStack>
        </HStack>
      </ForumCardBase>
    </Link>
  );
}
