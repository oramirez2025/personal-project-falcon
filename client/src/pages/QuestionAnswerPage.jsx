import { useState } from "react"
import { Container, Heading, VStack, Box, HStack } from "@chakra-ui/react"
import { MotionBox } from "../components/Motion"
import { staggerContainer, staggerItem } from "../components/animations/fffAnimations"
import VideoAnimations from "../components/VideoAnimations"
import FaqAccordionItem from "../components/cards/FaqCard"
import FAQ_Animations from "../assets/FAQ_Animations.mp4"

/*
  FAQ Page - Grimoire themed accordion style
  - Video background with overlay
  - True accordion behavior (one open at a time)
  - Reuses existing theme tokens and animations
*/
export default function QuestionsAnswersPage() {
  const [activeIndex, setActiveIndex] = useState(null)

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

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <Container minH="100vh" maxW="100vw" py={0} position="relative" overflow="hidden">
      <VideoAnimations src={FAQ_Animations} />

      <Box maxW="800px" mx="auto" py={16} px={6} position="relative" zIndex={2}>
        {/* Header */}
        <VStack mb={12} gap={5}>
          {/* Top Flourish */}
          <HStack gap={3}>
            <Box 
              h="1px" 
              w="60px" 
              bgGradient="linear(to-r, transparent, forge.tan.400)" 
              opacity={0.5}
            />
            <Box 
              as="span" 
              color="forge.gold.400" 
              fontSize="18px"
              css={{
                animation: 'glowPulse 3s ease-in-out infinite',
                '@keyframes glowPulse': {
                  '0%, 100%': { filter: 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.4))' },
                  '50%': { filter: 'drop-shadow(0 0 14px rgba(251, 191, 36, 0.9))' },
                },
              }}
            >
              ✦
            </Box>
            <Box 
              h="1px" 
              w="60px" 
              bgGradient="linear(to-l, transparent, forge.tan.400)" 
              opacity={0.5}
            />
          </HStack>

          {/* Title */}
          <Heading
            size="2xl"
            color="forge.tan.300"
            textShadow="0 2px 8px rgba(0, 0, 0, 0.8)"
            letterSpacing="2px"
            textAlign="center"
          >
            Frequently Asked Questions
          </Heading>

          {/* Bottom Flourish */}
          <HStack gap={2}>
            <Box 
              h="1px" 
              w="100px" 
              bgGradient="linear(to-r, transparent, forge.stone.600, transparent)" 
            />
            <Box
              w="8px"
              h="8px"
              transform="rotate(45deg)"
              border="1px solid"
              borderColor="forge.tan.400"
              opacity={0.4}
              bg="rgba(212, 165, 116, 0.1)"
            />
            <Box 
              h="1px" 
              w="100px" 
              bgGradient="linear(to-r, transparent, forge.stone.600, transparent)" 
            />
          </HStack>
        </VStack>

        {/* FAQ List */}
        <MotionBox
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <VStack gap={3} align="stretch">
            {faqs.map((faq, index) => (
              <MotionBox key={index} variants={staggerItem}>
                <FaqAccordionItem
                  question={faq.question}
                  answer={faq.answer}
                  isActive={activeIndex === index}
                  onToggle={() => handleToggle(index)}
                />
              </MotionBox>
            ))}
          </VStack>
        </MotionBox>

        {/* Footer */}
        <VStack mt={16} gap={4}>
          <HStack gap={2}>
            <Box w="4px" h="4px" borderRadius="full" bg="forge.stone.600" opacity={0.4} />
            <Box w="4px" h="4px" borderRadius="full" bg="forge.stone.600" opacity={0.4} />
            <Box 
              w="6px" 
              h="6px" 
              borderRadius="full" 
              bg="forge.gold.400" 
              opacity={0.6}
              css={{
                animation: 'glowPulse 3s ease-in-out infinite',
              }}
            />
            <Box w="4px" h="4px" borderRadius="full" bg="forge.stone.600" opacity={0.4} />
            <Box w="4px" h="4px" borderRadius="full" bg="forge.stone.600" opacity={0.4} />
          </HStack>
          <Box 
            fontSize="12px" 
            color="forge.stone.500" 
            letterSpacing="2px"
          >
            Still have questions? Seek us out.
          </Box>
        </VStack>
      </Box>
    </Container>
  )
}