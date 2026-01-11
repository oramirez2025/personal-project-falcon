import { useEffect, useState, useRef } from "react";
import {
  Box,
  Heading,
  Container,
  Grid,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useOutletContext } from "react-router-dom";

import DaySection from "../components/sections/DaySection";
import WeatherCard from "../components/cards/WeatherCard";
import CountdownTimer from "../components/CountdownTimer";
import TicketsPage from "./TicketsPage";
import { fetchEvents } from "../utilities";
import HeroicHall from "../assets/HeroicHall.jpeg";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const { user } = useOutletContext(); // Get user from App.jsx instead of duplicate call
  const hasFetched = useRef(false);

  useEffect(() => {
    // Prevent StrictMode double-fetch
    if (hasFetched.current) return;
    hasFetched.current = true;
    
    fetchEvents(setEvents);
  }, []);

  const eventsByDay = events.reduce((acc, event) => {
    const day = event.day;
    if (!acc[day]) acc[day] = [];
    acc[day].push(event);
    return acc;
  }, {});

  return (
    <Box>
      {/* Hero */}
      <Box
        bgImage={`url(${HeroicHall})`}
        bgSize="cover"
        bgPosition="center"
        minH="45vh"
        display="flex"
        alignItems="center"
      >
        <Grid
          templateColumns={{ base: "1fr", md: "1fr 1fr" }}
          gap={6}
          w="100%"
          maxW="1200px"
          mx="auto"
          px={4}
        >
          <WeatherCard />
          <Box textAlign={{ base: "center", md: "right" }}>
            <CountdownTimer />
          </Box>
        </Grid>
      </Box>

      {/* Tickets */}
      <TicketsPage />
      
      {/* Events */}
      <Container maxW="container.xl" py={10}>
        <VStack align="stretch" spacing={10}>
          {/* Header */}
          <HStack justify="space-between">
            <Heading size="xl" color="text.primary">
              Events
            </Heading>
          </HStack>

          {/* Days */}
          {Object.entries(eventsByDay).map(([day, dayEvents]) => (
            <DaySection
              key={day}
              day={day}
              events={dayEvents}
            />
          ))}
        </VStack>
      </Container>
    </Box>
  );
}