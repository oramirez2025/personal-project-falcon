import { Box, Heading, Text } from "@chakra-ui/react"
import { MotionBox } from "./Motion"
import { cardHover } from "../animations/fffAnimations"

/*
    Generic Card Component
    Note: Currently unused - consider using BaseCard instead
*/
export default function Card({ title, description, price }) {
    return (
        <MotionBox
            {...cardHover}
            bg="forge.tan.50"
            borderRadius="lg"
            boxShadow="md"
            p={6}
        >
            <Box bg="bg.secondary" borderRadius="xl" p={4}>
                <Heading size="md" mb={2} color="text.primary">
                    {title}
                </Heading>
                <Text color="text.secondary">{description}</Text>
            </Box>
        </MotionBox>
    )
}