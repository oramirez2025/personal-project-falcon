import { Box } from "@chakra-ui/react";
import { MotionBox } from "../Motion";

/**
 * Base card component for D&D themed forum cards
 * Provides: leather gradient, corner brackets, accent bar, hover effects
 * 
 * Usage:
 * <ForumCardBase hoverable accentBar>
 *   <YourContent />
 * </ForumCardBase>
 * 
 * Variants:
 * - default: leather gradient with tan border
 * - tavern: darker red gradient for The Tavern card
 */
export default function ForumCardBase({
  children,
  variant = "default", // "default" | "tavern"
  hoverable = true,
  accentBar = true,
  corners = true,
  padding = 6,
  onClick,
  ...props
}) {
  const isTavern = variant === "tavern";

  const cardContent = (
    <Box
      position="relative"
      bg={isTavern
        ? "linear-gradient(135deg, #4a1111 0%, #0d0a08 100%)"
        : "linear-gradient(135deg, #2a1f15 0%, #1a1410 50%, #0d0a08 100%)"
      }
      border="2px solid"
      borderColor={isTavern ? "forge.red.700" : "forge.tan.500"}
      borderRadius="lg"
      p={padding}
      overflow="hidden"
      cursor={onClick ? "pointer" : "default"}
      transition="all 0.3s ease"
      _hover={hoverable ? {
        borderColor: "forge.gold.400",
        boxShadow: "0 8px 32px rgba(245, 158, 11, 0.2), inset 0 0 60px rgba(245, 158, 11, 0.05)",
      } : undefined}
      onClick={onClick}
      {...props}
    >
      {/* Top Accent Bar */}
      {accentBar && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          h="3px"
          bg="linear-gradient(90deg, #f59e0b, #ff6b35, #f59e0b)"
          opacity={hoverable ? 0 : 1}
          transition="opacity 0.3s"
          sx={hoverable ? {
            "[data-hover] &, :hover > &": {
              opacity: 1,
            },
          } : undefined}
        />
      )}

      {/* Corner Brackets */}
      {corners && (
        <>
          <Box position="absolute" top={2} left={2} w={5} h={5} borderTop="2px solid" borderLeft="2px solid" borderColor={isTavern ? "forge.red.600" : "forge.tan.500"} opacity={0.5} />
          <Box position="absolute" top={2} right={2} w={5} h={5} borderTop="2px solid" borderRight="2px solid" borderColor={isTavern ? "forge.red.600" : "forge.tan.500"} opacity={0.5} />
          <Box position="absolute" bottom={2} left={2} w={5} h={5} borderBottom="2px solid" borderLeft="2px solid" borderColor={isTavern ? "forge.red.600" : "forge.tan.500"} opacity={0.5} />
          <Box position="absolute" bottom={2} right={2} w={5} h={5} borderBottom="2px solid" borderRight="2px solid" borderColor={isTavern ? "forge.red.600" : "forge.tan.500"} opacity={0.5} />
        </>
      )}

      {/* Content */}
      <Box position="relative" zIndex={1}>
        {children}
      </Box>
    </Box>
  );

  // Wrap with motion if hoverable
  if (hoverable) {
    return (
      <MotionBox
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        data-hover
      >
        {cardContent}
      </MotionBox>
    );
  }

  return cardContent;
}
