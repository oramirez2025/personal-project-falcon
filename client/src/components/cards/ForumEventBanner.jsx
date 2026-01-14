import { Box, HStack, VStack, Text } from "@chakra-ui/react";
import { Calendar, Clock, MapPin, Megaphone } from "lucide-react";
import ForumCardBase from "../forum/ForumCardBase";

/**
 * Event info banner displayed above comments on event thread pages
 * Uses ForumCardBase for consistent styling
 */
export default function ForumEventBanner({
  title,
  day,
  start_time,
  end_time,
  location,
  description,
  icon: Icon = Megaphone,
}) {
  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <ForumCardBase
      hoverable={false}
      accentBar
      corners
      padding={7}
      mb={8}
      borderRadius="xl"
    >
      {/* Header Row */}
      <HStack align="flex-start" gap={5} mb={4}>
        {/* Icon */}
        <Box
          w={14}
          h={14}
          bg="radial-gradient(circle, #7a1f1f 0%, #4a1111 100%)"
          border="2px solid"
          borderColor="forge.tan.500"
          borderRadius="lg"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="forge.gold.400"
          flexShrink={0}
        >
          <Icon size={24} />
        </Box>

        {/* Title & Meta */}
        <VStack align="start" gap={2} flex={1}>
          <Text fontFamily="heading" fontSize="2xl" color="forge.tan.100">
            {title}
          </Text>

          <HStack gap={5} flexWrap="wrap">
            <HStack gap={1.5} color="forge.tan.400" fontSize="sm">
              <Calendar size={14} color="var(--chakra-colors-forge-gold-400)" />
              <Text>{formatDate(day)}</Text>
            </HStack>

            <HStack gap={1.5} color="forge.tan.400" fontSize="sm">
              <Clock size={14} color="var(--chakra-colors-forge-gold-400)" />
              <Text>{start_time} - {end_time}</Text>
            </HStack>

            <HStack gap={1.5} color="forge.tan.400" fontSize="sm">
              <MapPin size={14} color="var(--chakra-colors-forge-gold-400)" />
              <Text>{location}</Text>
            </HStack>
          </HStack>
        </VStack>
      </HStack>

      {/* Description */}
      {description && (
        <Text
          color="forge.tan.300"
          fontSize="sm"
          lineHeight="1.7"
          pt={4}
          borderTop="1px solid"
          borderTopColor="forge.stone.700"
        >
          {description}
        </Text>
      )}
    </ForumCardBase>
  );
}
