import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Container,
  Grid,
  VStack,
  HStack,
} from "@chakra-ui/react";

import CreateEventModal from "../components/CreateEventModal";
import EditEventModal from "../components/EditEventModal";
import DaySection from "../components/DaySection";
import WeatherCard from "../components/WeatherCard";
import CountdownTimer from "../components/CountdownTimer";
import TicketsPage from "./TicketsPage";

import {
  fetchEvents,
  userConfirmation,
} from "../utilities";

import HeroicHall from "../assets/HeroicHall.jpeg";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [show, setShow] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchEvents(setEvents);
  }, []);

  useEffect(() => {
    const restoreUser = async () => {
      const confirmedUser = await userConfirmation();
      setUser(confirmedUser);
    };
    restoreUser();
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
      <TicketsPage/>
      {/* Events */}
      <Container maxW="container.xl" py={10}>
        <VStack align="stretch" spacing={10}>
          {/* Header */}
          <HStack justify="space-between">
            <Heading size="xl" color="white">
              Events
            </Heading>

            {user?.is_staff && (
              <Button bg="gray.500" size="lg" onClick={() => setShow(true)}>
                Add an Event
              </Button>
            )}
          </HStack>

          {/* Modals */}
          <CreateEventModal
            show={show}
            handleClose={() => setShow(false)}
            handleSave={(data) => createEvents(setEvents, data)}
          />

          <EditEventModal
            show={showEdit}
            handleClose={() => setShowEdit(false)}
            event={editingEvent}
            handleUpdate={(id, data) => updateEvent(setEvents, id, data)}
          />

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
