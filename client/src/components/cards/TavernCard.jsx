import { Box, HStack, VStack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Beer } from "lucide-react";
import ForumCardBase from "../forum/ForumCardBase";

/**
 * The Tavern - General Discussion card
 * Uses ForumCardBase with "tavern" variant for red styling
 */
export default function TavernCard({ 
  conventionYear, 
  discussionCount = 0,
  title = "The Tavern",
  description = "General discussion, questions & announcements"
}) {
  return (
    <Link to={`/forum/convention/${conventionYear}/general`} style={{ textDecoration: "none" }}>
      <ForumCardBase
        variant="tavern"
        hoverable
        accentBar
        corners
        padding={5}
        mb={8}
      >
        <HStack gap={4}>
          {/* Icon */}
          <Box
            w={12}
            h={12}
            bg="forge.red.700"
            borderRadius="lg"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="forge.gold.400"
            flexShrink={0}
          >
            <Beer size={24} />
          </Box>

          {/* Content */}
          <VStack align="start" gap={0.5} flex={1}>
            <Text fontFamily="heading" fontSize="lg" color="forge.tan.100">
              {title}
            </Text>
            <Text fontSize="sm" color="forge.tan.400">
              {description}
            </Text>
          </VStack>

          {/* Count */}
          <VStack align="end" gap={0}>
            <Text fontFamily="heading" fontSize="xl" color="forge.gold.400">
              {discussionCount}
            </Text>
            <Text
              fontSize="xs"
              color="forge.tan.400"
              textTransform="uppercase"
              letterSpacing="1px"
            >
              discussions
            </Text>
          </VStack>
        </HStack>
      </ForumCardBase>
    </Link>
  );
}
