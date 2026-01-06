import { Box, Heading, Text } from "@chakra-ui/react";
import { MotionBox } from "./Motion";

export default function Card({ title, description, price }) {
    return(
        <MotionBox 
            className="rounded-xl"
            bg="white"
            borderRadius="lg"
            boxShadow="md"
            p="6"
            whileHover={{y:-4}}
            whileTap={{scale:0.98}}
            initial={{opacity:0, y:12}}
            animate={{opacity:1, y:0}}
            transition={{duration:0.25, ease:"easeOut"}}
            >
            <Box className="bg-black rounded-xl">
                <Heading size="md" mb="2">
                    {title}
                </Heading>
                <Text color="gray.600">{description}</Text>
            </Box>
        </MotionBox>
    );
}