import { Box, Heading, Text, Separator, Container, } from "@chakra-ui/react"
import { MotionBox } from "../components/Motion";

export default function QuestionsAnswersPage() {
    return (
        <Container>

            <Heading color='#b91c1c' textDecoration={'underline'}>Frequently Asked Questions</Heading>

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
                        <Text color='blackAlpha.800' textDecoration={'underline'}>Question:</Text>
                        <Text color='blackAlpha.800'>Answer: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis ex dolorem porro ratione distinctio culpa alias quasi harum, sed obcaecati aut nostrum quam voluptates suscipit veritatis ab, odio molestias at.</Text>
                    </Box>
                </MotionBox>

                <Separator/>


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
                        <Text color='blackAlpha.800' textDecoration={'underline'}>Question:</Text>
                        <Text color='blackAlpha.800'>Answer: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis ex dolorem porro ratione distinctio culpa alias quasi harum, sed obcaecati aut nostrum quam voluptates suscipit veritatis ab, odio molestias at.</Text>
                    </Box>
                </MotionBox>

                <Separator/>

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
                        <Text color='blackAlpha.800' textDecoration={'underline'}>Question:</Text>
                        <Text color='blackAlpha.800'>Answer: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis ex dolorem porro ratione distinctio culpa alias quasi harum, sed obcaecati aut nostrum quam voluptates suscipit veritatis ab, odio molestias at.</Text>
                    </Box>
                </MotionBox>

                <Separator/>


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
                        <Text color='blackAlpha.800' textDecoration={'underline'}>Question:</Text>
                        <Text color='blackAlpha.800'>Answer: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis ex dolorem porro ratione distinctio culpa alias quasi harum, sed obcaecati aut nostrum quam voluptates suscipit veritatis ab, odio molestias at.</Text>
                    </Box>
                </MotionBox>

                <Separator/>
        </Container>
    )
};