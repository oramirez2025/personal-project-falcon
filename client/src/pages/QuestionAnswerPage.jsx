import { Container, Heading, Stack, Separator } from "@chakra-ui/react"
import { MotionBox } from "../components/Motion"
import { staggerContainer, staggerItem } from "../components/animations/fffAnimations"
import FAQCard from "../components/cards/FaqCard"

/*
FAQ Page - Now uses reusable FAQCard component
Added staggered entrance animations
*/
export default function QuestionsAnswersPage() {
    const faqs = [
        {
            question: "Question:",
            answer: "Answer: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis ex dolorem porro ratione distinctio culpa alias quasi harum, sed obcaecati aut nostrum quam voluptates suscipit veritatis ab, odio molestias at."
        },
        {
            question: "Question:",
            answer: "Answer: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis ex dolorem porro ratione distinctio culpa alias quasi harum, sed obcaecati aut nostrum quam voluptates suscipit veritatis ab, odio molestias at."
        },
        {
            question: "Question:",
            answer: "Answer: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis ex dolorem porro ratione distinctio culpa alias quasi harum, sed obcaecati aut nostrum quam voluptates suscipit veritatis ab, odio molestias at."
        },
        {
            question: "Question:",
            answer: "Answer: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis ex dolorem porro ratione distinctio culpa alias quasi harum, sed obcaecati aut nostrum quam voluptates suscipit veritatis ab, odio molestias at."
        },
    ]

    return (
        <Container maxW="container.lg" py={10}>
            <Heading
                color="forge.red.500"
                textDecoration="underline"
                mb={8}
                textAlign="center"
            >
                Frequently Asked Questions
            </Heading>

            <MotionBox
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
            >
                <Stack spacing={6} divider={<Separator />}>
                    {faqs.map((faq, index) => (
                        <MotionBox key={index} variants={staggerItem}>
                            <FAQCard question={faq.question} answer={faq.answer} />
                        </MotionBox>
                    ))}
                </Stack>
            </MotionBox>
        </Container>
    )
}