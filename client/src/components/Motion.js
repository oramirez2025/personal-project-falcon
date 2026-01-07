import { chakra } from "@chakra-ui/system";
import { motion, isValidMotionProp } from "motion/react";

export const MotionBox = chakra(motion.div, {
    shouldForwardProp: (prop) => 
        isValidMotionProp(prop) || prop === "children",
});