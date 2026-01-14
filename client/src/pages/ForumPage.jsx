import { useState } from "react";
import { Box, Container, VStack, HStack, Text, Button } from "@chakra-ui/react";
import { ScrollText, ChevronDown, ChevronUp } from "lucide-react";
import Particles from "../components/forum/Particles";
import Breadcrumb from "../components/forum/Breadcrumb";
import ForumConventionCard from "../components/cards/ForumConventionCard";
import { MotionBox } from "../components/Motion";
import { staggerContainer, staggerItem } from "../components/animations/fffAnimations";

// Sample data - replace with API call
import { sampleConventions } from "../data/sampleForumData";

/**
 * Quest Board - Main Forum Page
 * Lists all conventions (active and past)
 */
export default function ForumPage() {
  const [showPast, setShowPast] = useState(false);

  // Separate active and past conventions
  const activeConventions = sampleConventions.filter((c) => c.isActive);
  const pastConventions = sampleConventions.filter((c) => !c.isActive);

  return (
    <Box minH="100vh" bg="forge.stone.900" position="relative">
      {/* Floating Particles */}
      <Particles count={25} />

      <Container maxW="container.lg" py={10} position="relative" zIndex={1}>
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Quest Board", icon: ScrollText },
          ]}
        />

        {/* Page Header */}
        <VStack align="start" gap={2} mb={10}>
          <HStack gap={4}>
            <Box
              w={14}
              h={14}
              bg="radial-gradient(circle, #7a1f1f 0%, #4a1111 100%)"
              border="2px solid"
              borderColor="forge.tan.500"
              borderRadius="xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="forge.gold.400"
            >
              <ScrollText size={28} />
            </Box>
            <Box>
              <Text
                fontFamily="heading"
                fontSize="3xl"
                color="forge.tan.100"
              >
                Quest Board
              </Text>
              <Text color="forge.tan.400" fontSize="sm">
                Discuss events, share tales, and connect with fellow adventurers
              </Text>
            </Box>
          </HStack>
        </VStack>

        {/* Active Conventions */}
        <MotionBox
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {activeConventions.map((convention) => (
            <MotionBox key={convention.id} variants={staggerItem}>
              <ForumConventionCard
                year={convention.year}
                name={convention.name}
                startDate={convention.startDate}
                endDate={convention.endDate}
                location={convention.location}
                isActive={convention.isActive}
                eventCount={convention.eventCount}
                discussionCount={convention.discussionCount}
              />
            </MotionBox>
          ))}
        </MotionBox>

        {/* Past Conventions Toggle */}
        {pastConventions.length > 0 && (
          <Box mt={10}>
            {/* Divider with toggle */}
            <HStack gap={4} mb={6}>
              <Box flex={1} h="1px" bg="forge.stone.700" />
              <Button
                variant="ghost"
                size="sm"
                color="forge.tan.400"
                fontFamily="heading"
                fontSize="xs"
                textTransform="uppercase"
                letterSpacing="2px"
                _hover={{
                  color: "forge.gold.400",
                  bg: "transparent",
                }}
                onClick={() => setShowPast(!showPast)}
              >
                <HStack gap={2}>
                  <Text>Past Conventions</Text>
                  {showPast ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </HStack>
              </Button>
              <Box flex={1} h="1px" bg="forge.stone.700" />
            </HStack>

            {/* Past Convention Cards */}
            {showPast && (
              <MotionBox
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <VStack align="stretch" gap={3}>
                  {pastConventions.map((convention) => (
                    <ForumConventionCard
                      key={convention.id}
                      year={convention.year}
                      name={convention.name}
                      startDate={convention.startDate}
                      endDate={convention.endDate}
                      location={convention.location}
                      isActive={false}
                      eventCount={convention.eventCount}
                      discussionCount={convention.discussionCount}
                      isPast
                    />
                  ))}
                </VStack>
              </MotionBox>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
}
