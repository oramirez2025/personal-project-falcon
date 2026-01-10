<<<<<<< HEAD
import { useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { Box, Button, Heading, Container, Flex, Grid } from "@chakra-ui/react";
import CreateEventModal from "../components/CreateEventModal";
import EditEventModal from "../components/EditEventModal";
import EventCard from "../components/EventCard";
import { fetchEvents, createEvents, deleteEvent, updateEvent, userConfirmation } from "../utilities";
import HeroicHall from "../assets/HeroicHall.jpeg";
import WeatherCard from "../components/WeatherCard";
import CountdownTimer from "../components/CountdownTimer";
import { Outlet } from "react-router-dom";
=======
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

import DaySection from "../components/sections/DaySection";
import WeatherCard from "../components/cards/WeatherCard";
import CountdownTimer from "../components/CountdownTimer";
import TicketsPage from "./TicketsPage";

import {
  fetchEvents,
  userConfirmation,
} from "../utilities";

import HeroicHall from "../assets/HeroicHall.jpeg";
>>>>>>> main

export default function EventsPage() {
  const [events, setEvents] = useState([]);
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

<<<<<<< HEAD
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async (data) => {
    await createEvents(setEvents, data);
  };

  const handleUpdate = async (id, data) => {
    await updateEvent(setEvents, id, data);
  };

  const handleDelete = async (id) => {
    await deleteEvent(setEvents, id);
  };
  const {eventId} = useParams()
  return (
    <Box>
      {
        !eventId && (
          <>

            <Box
              bgImage={`url(${HeroicHall})`}
              bgSize="cover"
              bgPosition="center"
              bgRepeat="no-repeat"
              minH="45vh"
              display="flex"
              alignItems="center"
              justifyContent="center"
              px={4}
            >
              <Grid
                templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                gap={6}
                w="100%"
                maxW="1200px"
                alignItems="center"
              >
                <Box display="flex" justifyContent={{ base: "center", md: "flex-start" }}>
                  <WeatherCard />
                </Box>
                <Box display="flex" justifyContent={{ base: "center", md: "flex-end" }}>
                  <CountdownTimer />
                </Box>
              </Grid>
            </Box>

            <Container maxW="container.xl" py={8}>
              <Heading as="h2" size="xl" mb={6} color="white">
                Events
              </Heading>

            {
              user?.is_staff && <Button bg="gray.500" size="lg" onClick={handleShow} mb={6}> Add an Event </Button>
            }

              <CreateEventModal
                show={show}
                handleClose={handleClose}
                handleSave={handleSave}
              />

              <EditEventModal
                show={showEdit}
                handleClose={() => setShowEdit(false)}
                event={editingEvent}
                handleUpdate={handleUpdate}
              />

              <Flex wrap="wrap" gap={6}>
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    id={event.id}
                    title={event.title}
                    day={event.day}
                    start_time={event.start_time}
                    end_time={event.end_time}
                    location={event.location}
                    description={event.description}
                    onClickDelete={() => handleDelete(event.id)}
                    onClickUpdate={() => {
                      setEditingEvent(event);
                      setShowEdit(true);
                    }}
                    user={user}
                  />
                ))}
              </Flex>
            </Container>
          </>
        )
      }
      <Outlet context={{user}}/>
=======
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
>>>>>>> main
    </Box>
  );
}
