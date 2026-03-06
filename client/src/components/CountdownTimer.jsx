import { useState, useEffect } from 'react';
import { Box, HStack, VStack, Text } from '@chakra-ui/react';
import { MotionBox, MotionHeading } from './Motion';
import { fadeInUp } from './animations/fffAnimations';
import { CONVENTION } from '../constants/Convention';

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
 * CountdownTimer component displays a countdown to convention start
 * Shows "So it begins" message during the event period
 * @param {boolean} compact - If true, renders a smaller version for embedding
 */
export default function CountdownTimer({ compact = false }) {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isEventTime, setIsEventTime] = useState(false);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      
      // Get event dates from constants
      // Create new Date objects for current year comparison
      const currentYear = now.getFullYear();
      const eventStartMonth = CONVENTION.startDate.getMonth();
      const eventStartDay = CONVENTION.startDate.getDate();
      const eventEndMonth = CONVENTION.endDate.getMonth();
      const eventEndDay = CONVENTION.endDate.getDate();
      
      // Build this year's event dates
      const eventStart = new Date(currentYear, eventStartMonth, eventStartDay);
      const eventEnd = new Date(currentYear, eventEndMonth, eventEndDay, 23, 59, 59);
      const resetDate = new Date(currentYear, eventEndMonth, eventEndDay + 1);

      // Check if we're currently within the event period
      if (now >= eventStart && now <= eventEnd) {
        setIsEventTime(true);
        setTimeRemaining(null);
        return;
      }

      setIsEventTime(false);

      // Determine target date: this year's event or next year's
      let targetDate;
      if (now >= resetDate) {
        // After event ends, countdown to next year
        targetDate = new Date(currentYear + 1, eventStartMonth, eventStartDay);
      } else {
        // Before event, countdown to this year
        targetDate = new Date(currentYear, eventStartMonth, eventStartDay);
      }

      // Calculate time difference
      const difference = targetDate - now;
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    // Calculate immediately
    calculateTimeRemaining();
    
    // Update every second
    const interval = setInterval(calculateTimeRemaining, 1000);
    
    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  // During event period
  if (isEventTime) {
    return (
      <Box 
        display="flex" 
        alignItems="center" 
        justifyContent="center" 
        p={compact ? 4 : 8} 
        textAlign="center"
        bg={compact ? "blackAlpha.600" : "transparent"}
        borderRadius={compact ? "lg" : "none"}
      >
        <MotionHeading 
          {...pulseAnimation}
          size={compact ? "xl" : "3xl"} 
          fontWeight="bold" 
          color="text.primary"
        >
          So it begins
        </MotionHeading>
      </Box>
    );
  }

  // Loading state
  if (!timeRemaining) {
    return (
      <Box 
        display="flex" 
        alignItems="center" 
        justifyContent="center" 
        p={compact ? 4 : 8}
        bg={compact ? "blackAlpha.600" : "transparent"}
        borderRadius={compact ? "lg" : "none"}
      >
        <Text color="text.secondary">Loading...</Text>
      </Box>
    );
  }

  // Compact version for embedding
  if (compact) {
    return (
      <Box 
        bg="blackAlpha.600" 
        borderRadius="lg" 
        p={4}
        backdropFilter="blur(8px)"
        border="1px solid"
        borderColor="whiteAlpha.100"
      >
        <Text 
          fontSize="sm" 
          color="forge.tan.300" 
          textAlign="center" 
          mb={2}
          fontFamily="heading"
          letterSpacing="1px"
        >
          COUNTDOWN
        </Text>
        <HStack justify="center" gap={4}>
          {[
            { value: timeRemaining.days, label: 'D' },
            { value: timeRemaining.hours, label: 'H' },
            { value: timeRemaining.minutes, label: 'M' },
            { value: timeRemaining.seconds, label: 'S' },
          ].map((item, i) => (
            <VStack key={i} gap={0}>
              <Text fontSize="2xl" fontWeight="bold" color="forge.gold.400">
                {item.value}
              </Text>
              <Text fontSize="xs" color="text.muted" textTransform="uppercase">
                {item.label}
              </Text>
            </VStack>
          ))}
        </HStack>
      </Box>
    );
  }

  // Full version - Hero centerpiece
  return (
    <MotionBox 
      {...fadeInUp} 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center"
    >
      <HStack gap={{ base: 4, md: 8 }} flexWrap="wrap" justifyContent="center">
        {[
          { value: timeRemaining.days, label: 'Days' },
          { value: timeRemaining.hours, label: 'Hours' },
          { value: timeRemaining.minutes, label: 'Minutes' },
          { value: timeRemaining.seconds, label: 'Seconds' },
        ].map((item, i) => (
          <VStack key={i} gap={1}>
            <Text 
              fontSize={{ base: "4xl", md: "6xl", lg: "7xl" }} 
              fontWeight="bold" 
              fontFamily="heading"
              color="forge.gold.400"
              textShadow="0 0 30px rgba(245, 158, 11, 0.5)"
              lineHeight={1}
            >
              {String(item.value).padStart(2, '0')}
            </Text>
            <Text 
              fontSize={{ base: "xs", md: "sm" }} 
              color="forge.stone.500" 
              textTransform="uppercase" 
              letterSpacing="2px"
            >
              {item.label}
            </Text>
          </VStack>
        ))}
      </HStack>
    </MotionBox>
  );
}