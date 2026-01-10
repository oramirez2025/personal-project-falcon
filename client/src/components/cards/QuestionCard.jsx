import { Box, Text, } from "@chakra-ui/react"
import { MotionBox } from "../Motion"

export default function QuestionCard({
    question,
    answer,
}) {
    return (
        <MotionBox 
            className="rounded-xl"
            bg="white"
            borderRadius="lg"
            border = '2px solid #b91c1c'
            rounded ='10px'
            boxShadow="md"
            margin="10"
            p="6"
            whileHover={{y:-4}}
            whileTap={{scale:0.98}}
            initial={{opacity:0, y:12}}
            animate={{opacity:1, y:0}}
            transition={{duration:0.25, ease:"easeOut"}}
            >
                <Box>
                    <Text color='blackAlpha.800' textDecoration={'underline'}>{question}</Text>
                    <Text color='blackAlpha.800'>{answer}</Text>
                </Box>
            </MotionBox>
    )
}
    
