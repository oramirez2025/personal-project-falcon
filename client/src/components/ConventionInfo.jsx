import { Box, Heading, Text, VStack, HStack, Grid, GridItem } from "@chakra-ui/react";
import { MapPin, Calendar } from "lucide-react";
import WeatherCard from "./cards/WeatherCard";
import CountdownTimer from "./CountdownTimer";
import { CONVENTION, CONVENTION_DATES } from "../constants/Convention";

export default function ConventionInfo() {
  const fullAddress = `${CONVENTION.address}, ${CONVENTION.city}, ${CONVENTION.state} ${CONVENTION.zip}`;
  
  return (
    <VStack align="stretch" spacing={8} w="100%">
      {/* Convention Title & Date */}
      <VStack align="center" spacing={4}>
        <Heading
          as="h1"
          fontSize={{ base: "4xl", md: "6xl", lg: "7xl" }}
          fontFamily="heading"
          color="forge.gold.400"
          textShadow="0 4px 20px rgba(0,0,0,0.8)"
          letterSpacing="4px"
          textAlign="center"
        >
          {CONVENTION.name}
        </Heading>

        <HStack
          gap={2}
          color="forge.tan.200"
          fontSize={{ base: "lg", md: "xl" }}
          fontFamily="heading"
        >
          <Calendar size={20} />
          <Text textShadow="0 2px 8px rgba(0,0,0,0.8)">
            {CONVENTION_DATES.startDisplay} - {CONVENTION_DATES.endDisplay}, {CONVENTION.year}
          </Text>
        </HStack>

        <HStack
          gap={2}
          color="forge.tan.300"
          fontSize={{ base: "sm", md: "md" }}
        >
          <MapPin size={16} />
          <Text textShadow="0 2px 8px rgba(0,0,0,0.8)">
            {fullAddress}
          </Text>
        </HStack>
      </VStack>

      {/* Map + Weather/Countdown Grid */}
      <Grid
        templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
        gap={6}
        w="100%"
      >
        {/* Map */}
        <GridItem>
          <Box
            borderRadius="lg"
            overflow="hidden"
            border="2px solid"
            borderColor="forge.stone.700"
            boxShadow="0 8px 32px rgba(0,0,0,0.5)"
            h={{ base: "250px", md: "300px" }}
          >
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Convention Location"
            />
          </Box>
        </GridItem>

        {/* Weather & Countdown */}
        <GridItem>
          <VStack align="stretch" spacing={4} h="100%">
            <Box flex="1">
              <WeatherCard />
            </Box>
            <Box>
              <CountdownTimer compact />
            </Box>
          </VStack>
        </GridItem>
      </Grid>
    </VStack>
  );
}