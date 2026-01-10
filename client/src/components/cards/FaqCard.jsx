import { Box, Text } from "@chakra-ui/react"
import { MotionBox } from "../Motion"
import { cardHover } from "../animations/fffAnimations"

/*
  Uses MotionBox wrapper for animation + Box for Chakra styling
  This separation ensures theme tokens resolve correctly
*/
export default function FAQCard({ question, answer }) {
  return (
    <MotionBox {...cardHover}>
      <Box 
        bg="forge.tan.50"
        borderRadius="lg"
        border="2px solid"
        borderColor="border.accent"
        boxShadow="md"
        p={6}
        cursor="pointer"
      >
        <Text 
          color="forge.stone.900" 
          fontWeight="600" 
          textDecoration="underline"
          mb={2}
        >
          {question}
        </Text>
        <Text color="forge.stone.800">
          {answer}
        </Text>
      </Box>
    </MotionBox>
  )
}