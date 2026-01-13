import { Box, Heading, Text, VStack, HStack, Grid, GridItem } from "@chakra-ui/react";
import { MapPin, Calendar } from "lucide-react";
import WeatherCard from "./cards/WeatherCard";
import CountdownTimer from "./CountdownTimer";

// Convention Details
const CONVENTION = {
  name: "FalCON",
  startDate: "August 14",
  endDate: "August 16",
  year: "2026",
  address: "96 Wolf Hollow Rd",
  city: "Lake Harmony",
  state: "PA",
  zip: "18624",
  // Google Maps embed URL (using address)
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3016.678!2d-75.6077!3d41.0545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c5a6e1c1c1c1c1%3A0x1234567890abcdef!2s96%20Wolf%20Hollow%20Rd%2C%20Lake%20Harmony%2C%20PA%2018624!5e0!3m2!1sen!2sus!4v1234567890",
};

export default function ConventionInfo() {
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
            {CONVENTION.startDate} - {CONVENTION.endDate}, {CONVENTION.year}
          </Text>
        </HStack>

        <HStack
          gap={2}
          color="forge.tan.300"
          fontSize={{ base: "sm", md: "md" }}
        >
          <MapPin size={16} />
          <Text textShadow="0 2px 8px rgba(0,0,0,0.8)">
            {CONVENTION.address}, {CONVENTION.city}, {CONVENTION.state} {CONVENTION.zip}
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
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                `${CONVENTION.address}, ${CONVENTION.city}, ${CONVENTION.state} ${CONVENTION.zip}`
              )}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
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