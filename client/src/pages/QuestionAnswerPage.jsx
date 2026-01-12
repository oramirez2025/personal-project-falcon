import { Container, Heading, Stack, Separator } from "@chakra-ui/react"
import { MotionBox } from "../components/Motion"
import { staggerContainer, staggerItem } from "../components/animations/fffAnimations"
import VideoAnimations from "../components/VideoAnimations"
import FAQCard from "../components/cards/FaqCard"
import FAQ_Animations from "../assets/FAQ_Animations.mp4"

/*
FAQ Page - Now uses reusable FAQCard component
Added staggered entrance animations
*/
export default function QuestionsAnswersPage() {
    const faqs = [
        {
            question: "I purchased a ticket and changed my mind. Can I get a refund?",
            answer: "All tickets are non-refundable. Once purchased, their magic is immediately woven into the convention: securing halls, summoning gifts, and fueling games and wonders for all."
        },
        {
            question: "How long does the event last?",
            answer: "The gathering spans three full days, with an optional fourth morning for breakfast, farewells, and parting tales."
        },
        {
            question: "Is the schedule all day?",
            answer: "Official events are listed on this site. Midday hours are left open for free adventures—board games, social deduction (like Werewolf), and spontaneous TTRPGs await those who wander the halls."
        },
        {
            question: "Will there be food on-site?",
            answer: "Yes. Every ticket includes the evening feast, plus provisions of chips, fresh water, and a rotating bounty of sweet desserts."
        },
        {
            question: "Are alcohol and/or edibles allowed?",
            answer: "Mild spirits and enchanted edibles are permitted when enjoyed with restraint. Overindulgence that disturbs the peace is forbidden by house law. Simple drinks are usually provided."
        },
        {
            question: "Can I smoke or vape on-site?",
            answer: "No. By order of the realm's keepers, smoking and vaping are forbidden within the grounds to keep the halls clear and welcoming."
        },
        {
            question: "I have pets. May I bring them along?",
            answer: "Alas, no. While beloved, pets and familiars must remain at home and cannot enter the grounds."
        },
        {
            question: "Is it okay to run games or bring board games?",
            answer: "Yes! Guests are encouraged to run TTRPGs and bring board games, provided they do not interfere with officially scheduled events."
        },
        {
            question: "Will the event only be for D&D?",
            answer: "Not at all. While D&D is honored, many realms will be explored: Shadowdark, Fabula, and many more systems await you mi'lord."
        },
    ]

    return (
        <Container minH="100vh" maxW="100vw" py={0} position="relative" overflow="hidden">
            <VideoAnimations src={FAQ_Animations} />

            <Heading
                color="forge.red.500"
                textDecoration="underline"
                mb={8}
                textAlign="center"
                position="relative"
                zIndex={2} // above video + overlay
            >
                Frequently Asked Questions
            </Heading>

            <MotionBox
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                position="relative"
                zIndex={2} // above video + overlay
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