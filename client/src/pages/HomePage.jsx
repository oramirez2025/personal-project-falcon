import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Grid,
  GridItem,
  Image,
} from "@chakra-ui/react";
import { Ticket, Users, Crown, MapPin, ChevronDown } from "lucide-react";
import { MotionBox } from "../components/Motion";
import { staggerContainer, staggerItem, fadeInUp } from "../components/animations/fffAnimations";
import VideoAnimations from "../components/VideoAnimations";
import CountdownTimer from "../components/CountdownTimer";
import TicketCard from "../components/cards/TicketCard";
import WeatherCard from "../components/cards/WeatherCard";
import EventCarousel from "../components/EventCarousel";
import PaymentDrawer from "../components/PaymentDrawer";
import { fetchEvents, createOrder, reserveTickets } from "../utilities";
import { showErrorToast } from "../components/ui/showErrorToast";
import { CONVENTION, CONVENTION_DATES } from "../constants/Convention";
import FAQ_Animations from "../assets/FAQ_Animations.mp4";
import logo from "../assets/FFF_Symbol_Black.png";

// Page margins to clear sidebar toggle
const PAGE_MARGIN = { base: "16px", md: "50px" };

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [showPaymentDrawer, setShowPaymentDrawer] = useState(false);
  const [order, setOrder] = useState(null);
  const [ticketA, setTicketA] = useState(0);
  const [ticketB, setTicketB] = useState(0);
  const [ticketC, setTicketC] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchEvents(setEvents);
  }, []);

  const handleCheckout = async () => {
    if (ticketA === 0 && ticketB === 0 && ticketC === 0) {
      showErrorToast("Checkout", "Please select at least one ticket.");
      return;
    }

    const cart = { typeA: ticketA, typeB: ticketB, typeC: ticketC };
    setIsLoading(true);

    try {
      const createdOrder = await createOrder(cart);
      if (createdOrder && createdOrder.id) {
        const reserved = await reserveTickets(createdOrder.id);
        const mergedOrder = { ...createdOrder, ...reserved };
        setOrder(mergedOrder);
        setShowPaymentDrawer(true);
      } else {
        showErrorToast("Checkout", "Failed to create order - invalid response.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      showErrorToast(
        "Checkout",
        err.response?.data?.error || "Something went wrong with checkout."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseDrawer = () => {
    setShowPaymentDrawer(false);
    setOrder(null);
  };

  const fullAddress = `${CONVENTION.address}, ${CONVENTION.city}, ${CONVENTION.state} ${CONVENTION.zip}`;

  return (
    <Box>
      {/* ============================================
          HERO SECTION - Full Viewport
          ============================================ */}
      <Box position="relative" minH="100vh" overflow="hidden">
        <VideoAnimations src={FAQ_Animations} overlay={true} />

        {/* Vignette Effect */}
        <Box
          position="absolute"
          inset={0}
          boxShadow="inset 0 0 200px rgba(0, 0, 0, 0.8)"
          pointerEvents="none"
          zIndex={1}
        />

        {/* Hero Content */}
        <Box
          position="relative"
          zIndex={2}
          minH="100vh"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          px={PAGE_MARGIN}
          py={6}
          textAlign="center"
        >
          <MotionBox {...fadeInUp} maxW="900px">
            {/* Logo */}
            <Box mb={1} display="flex" justifyContent="center">
              <Image
                src={logo}
                alt="FalconForgeFantasy"
                w={{ base: "150px", md: "200px", lg: "240px" }}
                h="auto"
                css={{
                  filter: "drop-shadow(0 0 20px rgba(251, 191, 36, 0.4))",
                }}
              />
            </Box>

            {/* Convention Name */}
            <Heading
              as="h1"
              fontSize={{ base: "5xl", md: "7xl", lg: "8xl" }}
              fontWeight="700"
              color="forge.tan.100"
              textShadow="0 0 40px rgba(245, 158, 11, 0.4), 0 4px 20px rgba(0, 0, 0, 0.8)"
              letterSpacing="8px"
              mb={3}
              textAlign="center"
            >
              {CONVENTION.name}
            </Heading>

            {/* Date Range */}
            <HStack justify="center" gap={3} mb={2}>
              <Text
                fontFamily="heading"
                fontSize={{ base: "xl", md: "2xl" }}
                color="forge.tan.300"
                letterSpacing="3px"
              >
                {CONVENTION_DATES.startDisplay}
              </Text>
              <Box
                w="6px"
                h="6px"
                transform="rotate(45deg)"
                bg="forge.gold.400"
                opacity={0.6}
              />
              <Text
                fontFamily="heading"
                fontSize={{ base: "xl", md: "2xl" }}
                color="forge.tan.300"
                letterSpacing="3px"
              >
                {CONVENTION_DATES.endDisplay}
              </Text>
            </HStack>

            {/* Year */}
            <Text
              fontFamily="heading"
              fontSize={{ base: "xl", md: "2xl" }}
              color="forge.gold.400"
              letterSpacing="4px"
              textAlign="center"
              mb={6}
            >
              {CONVENTION.year}
            </Text>

            {/* Countdown - THE CENTERPIECE */}
            <Box mb={6}>
              <Text
                fontSize="12px"
                color="forge.stone.500"
                letterSpacing="4px"
                textTransform="uppercase"
                mb={4}
              >
                The Quest Begins In
              </Text>
              <CountdownTimer />
            </Box>

            {/* CTA Button */}
            <Button
              as="a"
              href="#tickets"
              size="lg"
              px={12}
              py={7}
              fontSize="md"
              fontFamily="heading"
              letterSpacing="2px"
              bg="linear-gradient(180deg, #f5d4a5 0%, #c4955a 100%)"
              color="forge.stone.900"
              border="2px solid"
              borderColor="forge.gold.500"
              borderRadius="4px"
              boxShadow="0 4px 20px rgba(245, 158, 11, 0.3)"
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 8px 40px rgba(245, 158, 11, 0.5)",
                bg: "linear-gradient(180deg, #ffe4b5 0%, #d4a56a 100%)",
              }}
              transition="all 0.3s ease"
              leftIcon={<Ticket size={20} />}
            >
              Secure Your Passage
            </Button>
          </MotionBox>

          {/* Scroll Indicator */}
          <VStack
            position="absolute"
            bottom={8}
            left="50%"
            transform="translateX(-50%)"
            gap={2}
            color="forge.stone.600"
            css={{
              animation: "bounce 2s ease-in-out infinite",
              "@keyframes bounce": {
                "0%, 100%": { transform: "translateX(-50%) translateY(0)" },
                "50%": { transform: "translateX(-50%) translateY(8px)" },
              },
            }}
          >
            <Text fontSize="11px" letterSpacing="2px">
              SCROLL
            </Text>
            <ChevronDown size={16} />
          </VStack>
        </Box>
      </Box>

      {/* ============================================
          TICKETS SECTION
          ============================================ */}
      <Box id="tickets" bg="bg.primary" py={20} px={PAGE_MARGIN}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            {/* Section Header */}
            <VStack spacing={4}>
              <Heading
                size="xl"
                color="forge.tan.300"
                letterSpacing="3px"
                textAlign="center"
              >
                Choose Your Path
              </Heading>
              <HStack gap={3}>
                <Box
                  h="1px"
                  w="60px"
                  bgGradient="linear(to-r, transparent, forge.stone.600, transparent)"
                />
                <Box
                  w="6px"
                  h="6px"
                  transform="rotate(45deg)"
                  border="1px solid"
                  borderColor="forge.stone.600"
                />
                <Box
                  h="1px"
                  w="60px"
                  bgGradient="linear(to-r, transparent, forge.stone.600, transparent)"
                />
              </HStack>
            </VStack>

            {/* Ticket Cards */}
            <MotionBox
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              w="100%"
            >
              <Grid
                templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                gap={6}
                maxW="1050px"
                mx="auto"
              >
                <MotionBox variants={staggerItem}>
                  <TicketCard
                    title="General Admission"
                    icon={<Ticket size={24} />}
                    price="$250.00"
                    setTicketQty={setTicketA}
                    description="3 Days of TTRPGs, Tavern Feasts, Mixed Potions, Rare Merch, and Heroic Gift Bags."
                  />
                </MotionBox>

                <MotionBox variants={staggerItem}>
                  <TicketCard
                    title="Community Ticket"
                    icon={<Users size={24} />}
                    price="$400.00"
                    setTicketQty={setTicketB}
                    description="All General Admission perks + Shared On-Site Stay."
                    featured
                  />
                </MotionBox>

                <MotionBox variants={staggerItem}>
                  <TicketCard
                    title="Master Upgrade"
                    icon={<Crown size={24} />}
                    price="$600.00"
                    setTicketQty={setTicketC}
                    description="All General Admission perks + Private chamber on-site."
                  />
                </MotionBox>
              </Grid>
            </MotionBox>

            {/* Checkout Button - Epic Gold Style */}
            <Box
              as="button"
              onClick={handleCheckout}
              disabled={isLoading}
              position="relative"
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              gap={3}
              px={12}
              py={5}
              fontFamily="heading"
              fontSize="16px"
              fontWeight="600"
              letterSpacing="2px"
              color="forge.stone.900"
              bg="linear-gradient(180deg, #f5d4a5 0%, #d4a56a 50%, #c4955a 100%)"
              border="2px solid"
              borderColor="forge.gold.400"
              borderRadius="4px"
              cursor={isLoading ? "not-allowed" : "pointer"}
              opacity={isLoading ? 0.6 : 1}
              overflow="hidden"
              transition="all 0.4s cubic-bezier(0.32, 0.72, 0, 1)"
              boxShadow="0 4px 20px rgba(245, 158, 11, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -2px 0 rgba(0, 0, 0, 0.1)"
              _hover={{
                transform: isLoading ? "none" : "translateY(-3px)",
                boxShadow: isLoading 
                  ? "0 4px 20px rgba(245, 158, 11, 0.3)"
                  : "0 8px 40px rgba(245, 158, 11, 0.5), 0 0 60px rgba(245, 158, 11, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
                bg: isLoading 
                  ? "linear-gradient(180deg, #f5d4a5 0%, #d4a56a 50%, #c4955a 100%)"
                  : "linear-gradient(180deg, #ffe4c4 0%, #e4b57a 50%, #d4a56a 100%)",
              }}
              _active={{
                transform: "translateY(-1px)",
              }}
              css={{
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
                  transition: "left 0.6s ease",
                },
                "&:hover::before": {
                  left: isLoading ? "-100%" : "100%",
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  inset: "4px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "2px",
                  pointerEvents: "none",
                },
              }}
            >
              <Text as="span" color="rgba(26, 20, 16, 0.4)" fontSize="14px">⚔</Text>
              <Text as="span" position="relative" zIndex={1}>
                {isLoading ? "Creating Order..." : "Continue to Payment"}
              </Text>
              <Text as="span" color="rgba(26, 20, 16, 0.4)" fontSize="14px">⚔</Text>
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* ============================================
          LOCATION SECTION
          ============================================ */}
      <Box
        bg="linear-gradient(180deg, #0c0a09 0%, #1a1410 100%)"
        py={20}
        px={PAGE_MARGIN}
      >
        <Container maxW="container.lg">
          <VStack spacing={12}>
            {/* Section Header */}
            <VStack spacing={4}>
              <Heading
                size="xl"
                color="forge.tan.300"
                letterSpacing="3px"
                textAlign="center"
              >
                The Gathering Place
              </Heading>
              <HStack gap={3}>
                <Box
                  h="1px"
                  w="60px"
                  bgGradient="linear(to-r, transparent, forge.stone.600, transparent)"
                />
                <Box
                  w="6px"
                  h="6px"
                  transform="rotate(45deg)"
                  border="1px solid"
                  borderColor="forge.stone.600"
                />
                <Box
                  h="1px"
                  w="60px"
                  bgGradient="linear(to-r, transparent, forge.stone.600, transparent)"
                />
              </HStack>
            </VStack>

            {/* Map + Details Grid */}
            <Grid
              templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
              gap={8}
              w="100%"
              alignItems="start"
            >
              {/* Map */}
              <GridItem>
                <Box
                  borderRadius="lg"
                  overflow="hidden"
                  border="2px solid"
                  borderColor="forge.stone.700"
                  boxShadow="0 8px 32px rgba(0, 0, 0, 0.5)"
                  aspectRatio="4/3"
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

              {/* Location Details + Weather */}
              <GridItem>
                <VStack align="stretch" spacing={6}>
                  {/* Address */}
                  <Box>
                    <Heading
                      size="md"
                      color="forge.tan.300"
                      fontFamily="heading"
                      mb={4}
                    >
                      Wolf Hollow Lodge
                    </Heading>
                    <HStack align="flex-start" gap={3} color="forge.stone.400">
                      <MapPin size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                      <Text fontSize="sm" lineHeight={1.6}>
                        {CONVENTION.address}
                        <br />
                        {CONVENTION.city}, {CONVENTION.state} {CONVENTION.zip}
                      </Text>
                    </HStack>
                  </Box>

                  {/* Weather Widget - Constrained Width */}
                  <Box maxW="280px">
                    <WeatherCard />
                  </Box>
                </VStack>
              </GridItem>
            </Grid>
          </VStack>
        </Container>
      </Box>

      {/* ============================================
          EVENTS SECTION
          ============================================ */}
      <Box bg="bg.primary" py={20} px={PAGE_MARGIN}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            {/* Section Header */}
            <VStack spacing={4}>
              <Heading
                size="xl"
                color="forge.tan.300"
                letterSpacing="3px"
                textAlign="center"
              >
                Scheduled Quests
              </Heading>
              <HStack gap={3}>
                <Box
                  h="1px"
                  w="60px"
                  bgGradient="linear(to-r, transparent, forge.stone.600, transparent)"
                />
                <Box
                  w="6px"
                  h="6px"
                  transform="rotate(45deg)"
                  border="1px solid"
                  borderColor="forge.stone.600"
                />
                <Box
                  h="1px"
                  w="60px"
                  bgGradient="linear(to-r, transparent, forge.stone.600, transparent)"
                />
              </HStack>
            </VStack>

            {/* Event Carousel */}
            <Box w="100%">
              <EventCarousel events={events} />
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* ============================================
          FOOTER FLOURISH
          ============================================ */}
      <Box bg="bg.primary" py={10}>
        <HStack justify="center" gap={2}>
          <Box w="4px" h="4px" borderRadius="full" bg="forge.stone.600" opacity={0.4} />
          <Box w="4px" h="4px" borderRadius="full" bg="forge.stone.600" opacity={0.4} />
          <Box
            w="6px"
            h="6px"
            borderRadius="full"
            bg="forge.gold.400"
            opacity={0.6}
            css={{
              animation: "glow 3s ease-in-out infinite",
            }}
          />
          <Box w="4px" h="4px" borderRadius="full" bg="forge.stone.600" opacity={0.4} />
          <Box w="4px" h="4px" borderRadius="full" bg="forge.stone.600" opacity={0.4} />
        </HStack>
      </Box>

      {/* Payment Drawer */}
      {showPaymentDrawer && order && (
        <PaymentDrawer
          show={showPaymentDrawer}
          onClose={handleCloseDrawer}
          order={order}
        />
      )}
    </Box>
  );
}