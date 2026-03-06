import { useState } from "react";
import { Box, HStack, VStack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { ChevronDown, Clock, MapPin, MessageCircle } from "lucide-react";
import { MotionBox } from "../Motion";
import { AnimatePresence } from "framer-motion";

/*
  Collapsible day section for convention forum page
  Shows day header with expandable event list
*/
export default function ForumDaySection({ 
  dayLabel, // e.g., "Day I - August 14th"
  events = [],
  defaultExpanded = false,
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Parse day number from label (e.g., "Day I" from "Day I - August 14th")
  const parts = dayLabel.split(" - ");
  const dayNumber = parts[0] || dayLabel;
  const dayDate = parts[1] || "";

  return (
    <Box mb={6}>
      {/* Day Header */}
      <Box
        display="flex"
        alignItems="center"
        gap={4}
        py={3.5}
        px={5}
        bg="linear-gradient(90deg, #2a1f15, transparent)"
        borderLeft="3px solid"
        borderLeftColor="forge.gold.400"
        borderRadius="0 lg lg 0"
        cursor="pointer"
        transition="all 0.3s"
        onClick={() => setIsExpanded(!isExpanded)}
        _hover={{
          bg: "linear-gradient(90deg, #1a1410, transparent)",
        }}
      >
        <Text
          fontFamily="heading"
          fontSize="xs"
          color="forge.gold.400"
          textTransform="uppercase"
          letterSpacing="2px"
        >
          {dayNumber}
        </Text>
        
        <Text
          fontFamily="heading"
          fontSize="lg"
          color="forge.tan.100"
        >
          {dayDate}
        </Text>
        
        <Text
          ml="auto"
          fontSize="sm"
          color="forge.tan.400"
        >
          {events.length} events
        </Text>
        
        <Box
          color="forge.tan.400"
          transition="transform 0.3s"
          transform={isExpanded ? "rotate(180deg)" : "rotate(0deg)"}
        >
          <ChevronDown size={18} />
        </Box>
      </Box>

      {/* Event List */}
      <AnimatePresence>
        {isExpanded && (
          <MotionBox
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            overflow="hidden"
          >
            <VStack
              align="stretch"
              gap={2.5}
              pl={5}
              borderLeft="1px solid"
              borderLeftColor="forge.stone.700"
              ml={2.5}
              mt={3}
            >
              {events.map((event) => (
                <ForumEventItem key={event.id} event={event} />
              ))}
            </VStack>
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  );
}

/**
 * Individual event item within a day section
 */
function ForumEventItem({ event }) {
  return (
    <Link to={`event/${event.id}`} style={{ textDecoration: "none" }}>
      <MotionBox
        bg="forge.stone.800"
        border="1px solid"
        borderColor="forge.stone.700"
        borderRadius="md"
        py={3.5}
        px={4}
        display="flex"
        alignItems="center"
        gap={4}
        cursor="pointer"
        whileHover={{ x: 4 }}
        transition="all 0.25s"
        _hover={{
          borderColor: "forge.gold.600",
          bg: "#1a1410",
        }}
      >
        {/* Time */}
        <HStack gap={1.5} minW="100px">
          <Clock size={12} color="var(--chakra-colors-forge-gold-400)" />
          <Text
            fontFamily="heading"
            fontSize="xs"
            color="forge.gold.400"
          >
            {event.start_time}
          </Text>
        </HStack>

        {/* Title */}
        <Text
          fontSize="sm"
          color="forge.tan.100"
          flex={1}
        >
          {event.title}
        </Text>

        {/* Location */}
        <HStack gap={1} display={{ base: "none", md: "flex" }}>
          <MapPin size={12} color="var(--chakra-colors-forge-tan-500)" />
          <Text fontSize="xs" color="forge.tan.400">
            {event.location}
          </Text>
        </HStack>

        {/* Comment Count */}
        <HStack gap={1}>
          <MessageCircle size={12} color="var(--chakra-colors-forge-tan-500)" />
          <Text fontSize="xs" color="forge.gold.400" fontWeight="bold">
            {event.commentCount || 0}
          </Text>
        </HStack>
      </MotionBox>
    </Link>
  );
}
