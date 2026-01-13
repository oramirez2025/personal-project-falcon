import { useState, useEffect, useRef } from 'react';
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
 * @param {boolean} compact - If true, renders a smaller version for embedding
 */
export default function CountdownTimer({ compact = false }) {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isEventTime, setIsEventTime] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Prevent StrictMode double-init
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const calculateTimeRemaining = () => {
      const now = new Date();
      const currentYear = now.getFullYear();

      const eventStart = new Date(currentYear, 7, 14); // August 14th
      const eventEnd = new Date(currentYear, 7, 16, 23, 59, 59); // August 16th end of day
      const resetDate = new Date(currentYear, 7, 17); // August 17th

      if (now >= eventStart && now <= eventEnd) {
        setIsEventTime(true);
        setTimeRemaining(null);
        return;
      }

      setIsEventTime(false);

      let targetDate;
      if (now >= resetDate) {
        targetDate = new Date(currentYear + 1, 7, 14);
      } else {
        targetDate = new Date(currentYear, 7, 14);
      }

      const difference = targetDate - now;
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
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

  // Full version
  return (
    <MotionBox 
      {...fadeInUp} 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      p={8} 
      textAlign="center"
    >
      <Heading size="xl" mb={8} fontWeight="bold" color="text.primary">
        Countdown to August 14th
      </Heading>
      
      <HStack spacing={8} flexWrap="wrap" justifyContent="center">
        {[
          { value: timeRemaining.days, label: 'Days' },
          { value: timeRemaining.hours, label: 'Hours' },
          { value: timeRemaining.minutes, label: 'Minutes' },
          { value: timeRemaining.seconds, label: 'Seconds' },
        ].map((item, i) => (
          <VStack key={i} minW="80px">
            <Text fontSize="5xl" fontWeight="bold" color="forge.gold.500">
              {item.value}
            </Text>
            <Text fontSize="md" color="text.muted" textTransform="uppercase" mt={2}>
              {item.label}
            </Text>
          </VStack>
        ))}
      </HStack>
    </MotionBox>
  );
}