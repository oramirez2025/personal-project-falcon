import { useEffect, useState, useRef } from "react";
import {
  Box,
  Heading,
  Container,
  VStack,
  Button,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { Ticket } from "lucide-react";

import ConventionInfo from "../components/ConventionInfo";
import EventCarousel from "../components/EventCarousel";
import { fetchEvents } from "../utilities";
import { primaryButtonStyles } from "../theme";
import HeroicHall from "../assets/HeroicHall.jpeg";

// Consistent page margins to clear sidebar toggle button
const PAGE_MARGIN = { base: "16px", md: "50px" };

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const { user } = useOutletContext();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchEvents(setEvents);
  }, []);

  return (
    <Box position="relative" minH="100vh">
      {/* Fixed Full-Page Background */}
      <Box
        position="fixed"
        top="0"
        left="0"
        w="100vw"
        h="100vh"
        bgImage={`url(${HeroicHall})`}
        bgSize="cover"
        bgPosition="center"
        bgAttachment="fixed"
        zIndex={0}
      />

      {/* Dark Overlay for Readability */}
      <Box
        position="fixed"
        top="0"
        left="0"
        w="100vw"
        h="100vh"
        bg="blackAlpha.700"
        zIndex={1}
      />

      {/* Scrollable Content */}
      <Box position="relative" zIndex={2}>
        {/* Convention Info Section */}
        <Box
          minH="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          px={PAGE_MARGIN}
          py={10}
        >
          <ConventionInfo />
        </Box>

        {/* Get Tickets CTA Section */}
        <Box
          py={16}
          px={PAGE_MARGIN}
          bg="blackAlpha.600"
          backdropFilter="blur(8px)"
          textAlign="center"
        >
          <Container maxW="container.md">
            <VStack spacing={6}>
              <Heading
                size="lg"
                color="text.primary"
                fontFamily="heading"
              >
                Ready to Join the Adventure?
              </Heading>
              
              <Link to="/tickets">
                <Button
                  size="lg"
                  {...primaryButtonStyles}
                  leftIcon={<Ticket size={20} />}
                  px={8}
                  py={6}
                  fontSize="lg"
                >
                  Get Your Tickets
                </Button>
              </Link>
            </VStack>
          </Container>
        </Box>

        {/* Events Section */}
        <Box
          py={16}
          px={PAGE_MARGIN}
        >
          <Container maxW="container.xl">
            <VStack align="stretch" spacing={8}>
              <Heading 
                size="xl" 
                color="text.primary"
                textAlign="center"
                fontFamily="heading"
              >
                Events
              </Heading>

              <EventCarousel events={events} />
            </VStack>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}