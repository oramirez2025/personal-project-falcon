import { chakra } from "@chakra-ui/system";
import { motion, isValidMotionProp } from "framer-motion";

/*
 Allows use of Chakra styling with Framer Motion animations
 Moved to framer-motion for better Chakra compatibility 
 To utilize: import { MotionBox, MotionFlex, MotionButton } from './Motion'
 Use example: <MotionBox animate={{ scale: 1.1 }} bg="forge.red.500">Content</MotionBox>
 */

// Helper to create motion components that properly forward Chakra props
const createMotionComponent = (component) => {
  return chakra(component, {
    shouldForwardProp: (prop) => {
      // Forward motion props (animate, variants, initial, etc.)
      if (isValidMotionProp(prop)) return true;
      
      // Don't forward Chakra's internal props (start with _)
      if (prop.startsWith('_')) return false;
      
      // Forward everything else (Chakra style props)
      return true;
    },
  });
};

// ============================================
// COMPONENTS
// ============================================

// Core layout components
export const MotionBox = createMotionComponent(motion.div);
export const MotionFlex = createMotionComponent(motion.div);
export const MotionGrid = createMotionComponent(motion.div);
export const MotionStack = createMotionComponent(motion.div);

// Text components
export const MotionHeading = createMotionComponent(motion.h2);
export const MotionText = createMotionComponent(motion.p);

// Interactive components
export const MotionButton = createMotionComponent(motion.button);
export const MotionInput = createMotionComponent(motion.input);
export const MotionTextarea = createMotionComponent(motion.textarea);

// Image component
export const MotionImage = createMotionComponent(motion.img);

// Link component
export const MotionLink = createMotionComponent(motion.a);