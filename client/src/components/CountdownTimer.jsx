import { useState, useEffect } from 'react';
import { Box, Heading, HStack, VStack, Text } from '@chakra-ui/react';
import { MotionBox, MotionHeading } from './Motion';
import { fadeInUp } from './animations/fffAnimations';

// Pulse animation for event-time heading
const pulseAnimation = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

/**
 * CountdownTimer component displays a countdown to August 14th
 * Shows "So it begins" message during the event period (Aug 14-16)
 */
export default function CountdownTimer() {
  // State to store the calculated time remaining (days, hours, minutes, seconds)
  const [timeRemaining, setTimeRemaining] = useState(null);
  // State to track if we're currently within the event period
  const [isEventTime, setIsEventTime] = useState(false);

  useEffect(() => {
    /**
     * Calculates the time remaining until August 14th
     * Handles different states: before event, during event, and after event
     */
    const calculateTimeRemaining = () => {
      const now = new Date();
      const currentYear = now.getFullYear();

      // Define event dates (month is 0-indexed, so 7 = August)
      const eventStart = new Date(currentYear, 7, 14); // August 14th
      const eventEnd = new Date(currentYear, 7, 16, 23, 59, 59); // August 16th end of day
      const resetDate = new Date(currentYear, 7, 17); // August 17th (day after event ends)

      // Check if we're currently within the event period
      if (now >= eventStart && now <= eventEnd) {
        setIsEventTime(true);
        setTimeRemaining(null);
        return;
      }

      setIsEventTime(false);

      // Determine target date: this year's Aug 14 or next year's Aug 14
      let targetDate;
      if (now >= resetDate) {
        // After Aug 16, countdown to next year's event
        targetDate = new Date(currentYear + 1, 7, 14);
      } else {
        // Before Aug 14, countdown to this year's event
        targetDate = new Date(currentYear, 7, 14);
      }

      // Calculate the time difference in milliseconds
      const difference = targetDate - now;

      // Convert milliseconds to days, hours, minutes, and seconds
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // Update state with calculated time
      setTimeRemaining({ days, hours, minutes, seconds });
    };

    // Calculate immediately on mount
    calculateTimeRemaining();
    // Update every second to keep countdown current
    const interval = setInterval(calculateTimeRemaining, 1000);

    // Cleanup: clear interval when component unmounts
    return () => clearInterval(interval);
  }, []);

  // During event period: show event message with pulse animation
  if (isEventTime) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={8} textAlign="center">
        <MotionHeading 
          {...pulseAnimation}
          size="3xl" 
          fontWeight="bold" 
          color="text.primary"
        >
          So it begins
        </MotionHeading>
      </Box>
    );
  }

  // Before calculation completes: show loading state
  if (!timeRemaining) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={8}>
        <Text color="text.secondary">Loading...</Text>
      </Box>
    );
  }

  // Main countdown display: show days, hours, minutes, seconds
  return (
    <MotionBox {...fadeInUp} display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={8} textAlign="center">
      <Heading size="xl" mb={8} fontWeight="bold" color="text.primary">
        Countdown to August 14th
      </Heading>
      
      <HStack spacing={8} flexWrap="wrap" justifyContent="center">
        {/* Days */}
        <VStack minW="80px">
          <Text fontSize="5xl" fontWeight="bold" color="forge.gold.500">
            {timeRemaining.days}
          </Text>
          <Text fontSize="md" color="text.muted" textTransform="uppercase" mt={2}>
            Days
          </Text>
        </VStack>

        {/* Hours */}
        <VStack minW="80px">
          <Text fontSize="5xl" fontWeight="bold" color="forge.gold.500">
            {timeRemaining.hours}
          </Text>
          <Text fontSize="md" color="text.muted" textTransform="uppercase" mt={2}>
            Hours
          </Text>
        </VStack>

        {/* Minutes */}
        <VStack minW="80px">
          <Text fontSize="5xl" fontWeight="bold" color="forge.gold.500">
            {timeRemaining.minutes}
          </Text>
          <Text fontSize="md" color="text.muted" textTransform="uppercase" mt={2}>
            Minutes
          </Text>
        </VStack>

        {/* Seconds */}
        <VStack minW="80px">
          <Text fontSize="5xl" fontWeight="bold" color="forge.gold.500">
            {timeRemaining.seconds}
          </Text>
          <Text fontSize="md" color="text.muted" textTransform="uppercase" mt={2}>
            Seconds
          </Text>
        </VStack>
      </HStack>
    </MotionBox>
  );
}