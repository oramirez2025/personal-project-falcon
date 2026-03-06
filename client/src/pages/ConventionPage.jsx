import { Outlet, useParams } from "react-router-dom";
import { Box, Container, VStack, HStack, Text } from "@chakra-ui/react";
import { ScrollText, Calendar, MapPin, Flame } from "lucide-react";
import Particles from "../components/forum/Particles";
import Breadcrumb from "../components/forum/Breadcrumb";
import TavernCard from "../components/cards/TavernCard";
import ForumDaySection from "../components/sections/ForumDaySection";
import { MotionBox } from "../components/Motion";
import { fadeInUp } from "../components/animations/fffAnimations";
import { useState, useRef, useEffect } from "react";

// Sample data - replace with API calls
import { 
  getConventionByYear, 
  getEventsByYear,
  generalDiscussionData 
} from "../data/sampleForumData";

/**
 * Convention Page
 * Shows The Tavern (general discussion) and day sections with events
 */
export default function ConventionPage() {
  const { year, eventId } = useParams();
  
  // Get convention info and events
  const convention = getConventionByYear(year);
  const eventsByDay = getEventsByYear(parseInt(year));
  const dayLabels = Object.keys(eventsByDay);

  if (!convention) {
    return (
      <Box minH="100vh" bg="forge.stone.900" py={20}>
        <Container maxW="container.lg">
          <Text color="forge.tan.100" textAlign="center">
            Convention not found
          </Text>
        </Container>
      </Box>
    );
  }

  const [comments, setComments] = useState([]);
  const wsRef = useRef(null);

  // ======================
  // Tree helpers
  // ======================
  const addReply = (comments, parentId, reply) =>
    comments.map((c) =>
      c.id === parentId
        ? { ...c, replies: [...(c.replies || []), reply] }
        : { ...c, replies: addReply(c.replies || [], parentId, reply) }
    );

  const updateRecursive = (comments, updated) =>
    comments.map((c) =>
      c.id === updated.id
        ? { ...c, ...updated }
        : { ...c, replies: updateRecursive(c.replies || [], updated) }
    );

  const deleteRecursive = (comments, id) =>
    comments
      .filter((c) => c.id !== id)
      .map((c) => ({
        ...c,
        replies: deleteRecursive(c.replies || [], id),
      }));
  // ======================
  // Initial fetch
  // ======================
  useEffect(() => {
    if (!eventId) return;

    let mounted = true;
    setLoading(true);
    setHasFetched(false);

    fetchEvent(setEvent, eventId)

    fetchComments((data) => {
      if (!mounted) return;
      setComments(data);
      setLoading(false);
      setHasFetched(true);
    }, eventId);

    return () => {
      mounted = false;
    };
  }, [eventId]);

  // ======================
  // WebSocket
  // ======================
  useEffect(() => {
    if (!eventId) return;

    const socket = new WebSocket(
      `ws://localhost:8001/ws/comments/${eventId}/`
    );
    wsRef.current = socket;

    socket.onmessage = (e) => {
      const { type, comment } = JSON.parse(e.data);

      setComments((prev) => {
        switch (type) {
          case "new_comment":
            return comment.parent
              ? addReply(prev, comment.parent, comment)
              : [...prev, comment];

          case "update_comment":
            return updateRecursive(prev, comment);

          case "delete_comment":
            return deleteRecursive(prev, comment.id);

          default:
            return prev;
        }
      });
    };

    return () => socket.close();
  }, [eventId]);

  // ======================
  // Handler
  // ======================
  const handleCreate = (data) =>
    createComments(eventId, data);

  const handleReply = (parentId, data) =>
    createComments(eventId, { ...data, parent: parentId });

  const handleEdit = (id, text) =>
    updateComment(null, eventId, id, { text });

  const handleLike = (id) =>
    updateComment(null, eventId, id, { like: true });

  const handleDelete = (id) =>
    deleteComment(null, id);



  return (
    <Box minH="100vh" bg="forge.stone.900" position="relative">
      {/* Floating Particles */}
      <Particles count={25} />

      <Container maxW="container.lg" py={10} position="relative" zIndex={1}>
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Quest Board", to: "/forum", icon: ScrollText },
            { label: `FalCON ${year}` },
          ]}
        />

        {/* Convention Header */}
        <MotionBox {...fadeInUp} mb={10}>
          <Box
            bg="linear-gradient(135deg, #2a1f15 0%, #1a1410 50%, #0d0a08 100%)"
            border="2px solid"
            borderColor="forge.tan.500"
            borderRadius="xl"
            p={7}
            position="relative"
            overflow="hidden"
          >
            {/* Top Accent */}
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              h="3px"
              bg="linear-gradient(90deg, #f59e0b, #ff6b35, #f59e0b)"
            />

            {/* Corner Brackets */}
            <Box position="absolute" top={3} left={3} w={6} h={6} borderTop="2px solid" borderLeft="2px solid" borderColor="forge.tan.500" opacity={0.5} />
            <Box position="absolute" top={3} right={3} w={6} h={6} borderTop="2px solid" borderRight="2px solid" borderColor="forge.tan.500" opacity={0.5} />
            <Box position="absolute" bottom={3} left={3} w={6} h={6} borderBottom="2px solid" borderLeft="2px solid" borderColor="forge.tan.500" opacity={0.5} />
            <Box position="absolute" bottom={3} right={3} w={6} h={6} borderBottom="2px solid" borderRight="2px solid" borderColor="forge.tan.500" opacity={0.5} />

            <HStack gap={5} flexWrap="wrap">
              {/* Year Badge */}
              <Box
                w={20}
                h={20}
                bg="radial-gradient(circle, #7a1f1f 0%, #4a1111 100%)"
                border="2px solid"
                borderColor="forge.gold.500"
                borderRadius="xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
              >
                <Text
                  fontFamily="heading"
                  fontSize="2xl"
                  color="forge.gold.400"
                >
                  {year}
                </Text>
              </Box>

              {/* Info */}
              <VStack align="start" gap={2} flex={1}>
                <HStack gap={3}>
                  <Text
                    fontFamily="heading"
                    fontSize="2xl"
                    color="forge.tan.100"
                  >
                    FalCON {year}
                  </Text>
                  {convention.isActive && (
                    <HStack
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

                <HStack gap={6} color="forge.tan.400" fontSize="sm" flexWrap="wrap">
                  <HStack gap={1.5}>
                    <Calendar size={14} color="var(--chakra-colors-forge-gold-400)" />
                    <Text>{convention.startDate} - {convention.endDate.split(", ")[0]}</Text>
                  </HStack>
                  <HStack gap={1.5}>
                    <MapPin size={14} color="var(--chakra-colors-forge-gold-400)" />
                    <Text>{convention.location}</Text>
                  </HStack>
                </HStack>
              </VStack>
            </HStack>
          </Box>
        </MotionBox>

        {/* The Tavern - General Discussion */}
        <TavernCard
          conventionYear={year}
          discussionCount={generalDiscussionData.discussionCount}
        />

        {/* Day Sections */}
        <VStack align="stretch" gap={2}>
          {dayLabels.map((dayLabel, index) => (
            <ForumDaySection
              key={dayLabel}
              dayLabel={dayLabel}
              events={eventsByDay[dayLabel]}
              defaultExpanded={index === 0} // First day expanded by default
            />
          ))}
        </VStack>
      </Container>
    </Box>
  );
}
