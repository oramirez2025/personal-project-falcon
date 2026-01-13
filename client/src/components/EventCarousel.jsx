import { useState, useEffect, useRef } from "react";
import { Box, HStack, IconButton, Flex } from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import EventCard from "./cards/EventCard";

const AUTO_SCROLL_INTERVAL = 4000; // 4 seconds

export default function EventCarousel({ events = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const intervalRef = useRef(null);

  // responsive visible count
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    if (isPaused || events.length <= visibleCount) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(intervalRef.current);
  }, [isPaused, events.length, visibleCount]);

  // Get visible events (infinite loop)
  const getVisibleEvents = () => {
    if (events.length === 0) return [];
    
    const visible = [];
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % events.length;
      visible.push({ ...events[index], originalIndex: index });
    }
    return visible;
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  if (events.length === 0) {
    return (
      <Box textAlign="center" py={10} color="text.muted">
        Events coming soon...
      </Box>
    );
  }

  return (
    <Box
      position="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Carousel Container */}
      <Flex align="center" gap={4}>
        {/* Left Arrow */}
        <IconButton
          aria-label="Previous event"
          onClick={handlePrev}
          variant="ghost"
          color="forge.tan.300"
          bg="blackAlpha.400"
          borderRadius="full"
          size="lg"
          _hover={{ 
            bg: "blackAlpha.600", 
            color: "forge.gold.400",
            transform: "scale(1.1)",
          }}
          transition="all 0.2s"
          display={{ base: "none", md: "flex" }}
        >
          <ChevronLeft size={24} />
        </IconButton>

        {/* Events */}
        <Box flex="1" overflow="hidden" px={2}>
          <HStack
            justify="center"
            align="stretch"
            spacing={{ base: 4, md: 6 }}
          >
            <AnimatePresence mode="popLayout">
              {getVisibleEvents().map((event, idx) => (
                <motion.div
                  key={`${event.id}-${currentIndex}-${idx}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    flex: `0 0 calc(${100 / visibleCount}% - ${(visibleCount - 1) * 8}px)`,
                    maxWidth: `calc(${100 / visibleCount}% - ${(visibleCount - 1) * 8}px)`,
                  }}
                >
                  <EventCard
                    {...event}
                    forumLink={`/forum/event/${event.id}`}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </HStack>
        </Box>

        {/* Right Arrow */}
        <IconButton
          aria-label="Next event"
          onClick={handleNext}
          variant="ghost"
          color="forge.tan.300"
          bg="blackAlpha.400"
          borderRadius="full"
          size="lg"
          _hover={{ 
            bg: "blackAlpha.600", 
            color: "forge.gold.400",
            transform: "scale(1.1)",
          }}
          transition="all 0.2s"
          display={{ base: "none", md: "flex" }}
        >
          <ChevronRight size={24} />
        </IconButton>
      </Flex>

      {/* Mobile Navigation Arrows */}
      <HStack 
        justify="center" 
        mt={4} 
        gap={4}
        display={{ base: "flex", md: "none" }}
      >
        <IconButton
          aria-label="Previous event"
          onClick={handlePrev}
          variant="ghost"
          color="forge.tan.300"
          bg="blackAlpha.400"
          borderRadius="full"
          size="md"
          _hover={{ bg: "blackAlpha.600", color: "forge.gold.400" }}
        >
          <ChevronLeft size={20} />
        </IconButton>
        <IconButton
          aria-label="Next event"
          onClick={handleNext}
          variant="ghost"
          color="forge.tan.300"
          bg="blackAlpha.400"
          borderRadius="full"
          size="md"
          _hover={{ bg: "blackAlpha.600", color: "forge.gold.400" }}
        >
          <ChevronRight size={20} />
        </IconButton>
      </HStack>

      {/* Dot Navigation */}
      <HStack justify="center" mt={4} gap={2}>
        {events.map((_, index) => (
          <Box
            key={index}
            as="button"
            w={currentIndex === index ? "24px" : "8px"}
            h="8px"
            borderRadius="full"
            bg={currentIndex === index ? "forge.gold.400" : "whiteAlpha.400"}
            transition="all 0.3s"
            onClick={() => handleDotClick(index)}
            _hover={{ bg: currentIndex === index ? "forge.gold.300" : "whiteAlpha.600" }}
            aria-label={`Go to event ${index + 1}`}
          />
        ))}
      </HStack>
    </Box>
  );
}