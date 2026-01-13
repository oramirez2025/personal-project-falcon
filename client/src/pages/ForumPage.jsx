import {
  Button,
  SimpleGrid,
  Heading,
  Container,
  Stack,
  Box,
} from "@chakra-ui/react";
import {
  Outlet,
  useOutletContext,
  useMatch,
} from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import EventCarousel from "../components/EventCarousel";
import { fetchEvents } from "../utilities";
export default function ForumPage() {
  const [showPreviousYears, setShowPreviousYears] = useState(false);
  const { user } = useOutletContext();
  const [events, setEvents] = useState([]);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchEvents(setEvents);
  }, []);

  const isEventRoute = useMatch("/forum/event/:eventId");

  return (
    <>
      {!isEventRoute && (
        <Container maxW="container.xl" py={10}>
          <Stack spacing={8}>
            <Heading textAlign="center" color="forge.red.500">
              Forum
            </Heading>

            <Box>
              <Heading size="md" mb={4}>
                Current Year
              </Heading>
              <EventCarousel events={events}/>
            </Box>

            <Button
              alignSelf="center"
              variant="outline"
              onClick={() =>
                setShowPreviousYears((prev) => !prev)
              }
            >
              {showPreviousYears ? "Hide" : "Show"} Previous Years
            </Button>

            {showPreviousYears && (
              <Box>
                <Heading size="md" mb={4}>
                  Previous Years
                </Heading>

                {/* Replace with a carousel or grid later */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <Box p={6} borderWidth="1px" rounded="md">
                    2023 Events
                  </Box>
                  <Box p={6} borderWidth="1px" rounded="md">
                    2022 Events
                  </Box>
                </SimpleGrid>
              </Box>
            )}
          </Stack>
        </Container>
      )}

      <Outlet context={{ user }} />
    </>
  );
}
