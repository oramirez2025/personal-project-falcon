import { Box, Text, HStack } from "@chakra-ui/react"
import { ChevronDown } from "lucide-react"

/*
  Glowing active state
  expand/collapse animation and only 1 open at a time
*/
export default function FaqAccordionItem({ question, answer, isActive, onToggle }) {
  return (
    <Box
      bg="linear-gradient(180deg, rgba(26, 20, 16, 0.9) 0%, rgba(13, 10, 8, 0.9) 100%)"
      border="1px solid"
      borderColor={isActive ? "forge.stone.500" : "forge.stone.700"}
      borderRadius="lg"
      overflow="hidden"
      transition="all 0.3s ease"
      _hover={{
        borderColor: "forge.stone.600",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
      }}
      boxShadow={isActive ? "0 0 30px rgba(245, 158, 11, 0.15)" : "none"}
    >
      {/* Question Header - Clickable */}
      <HStack
        as="button"
        w="100%"
        p={5}
        gap={4}
        cursor="pointer"
        onClick={onToggle}
        bg={isActive ? "rgba(92, 74, 58, 0.2)" : "transparent"}
        borderBottom={isActive ? "1px solid" : "1px solid transparent"}
        borderColor="rgba(92, 74, 58, 0.3)"
        transition="all 0.3s ease"
        _hover={{
          bg: "rgba(92, 74, 58, 0.15)",
        }}
        textAlign="left"
      >
        {/* Question Mark Icon */}
        <Box
          flexShrink={0}
          w="32px"
          h="32px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="full"
          bg={isActive ? "rgba(245, 158, 11, 0.15)" : "rgba(61, 42, 26, 0.5)"}
          border="1px solid"
          borderColor={isActive ? "forge.gold.500" : "forge.stone.600"}
          color={isActive ? "forge.gold.400" : "forge.stone.500"}
          fontSize="14px"
          fontWeight="600"
          transition="all 0.3s ease"
          boxShadow={isActive ? "0 0 12px rgba(245, 158, 11, 0.3)" : "none"}
          _groupHover={{
            color: "forge.tan.400",
            borderColor: "forge.stone.500",
          }}
        >
          ?
        </Box>

        {/* Question Text */}
        <Text
          flex={1}
          fontSize="15px"
          fontWeight="500"
          color={isActive ? "forge.tan.300" : "forge.stone.400"}
          lineHeight={1.5}
          transition="color 0.3s ease"
          _groupHover={{
            color: "forge.tan.400",
          }}
        >
          {question}
        </Text>

        {/* Chevron Icon */}
        <Box
          flexShrink={0}
          color={isActive ? "forge.gold.400" : "forge.stone.600"}
          transition="all 0.3s ease"
          transform={isActive ? "rotate(180deg)" : "rotate(0deg)"}
          _groupHover={{
            color: "forge.stone.500",
          }}
        >
          <ChevronDown size={20} />
        </Box>
      </HStack>

      {/* Answer - Collapsible */}
      <Box
        maxH={isActive ? "300px" : "0px"}
        overflow="hidden"
        transition="max-height 0.4s cubic-bezier(0.32, 0.72, 0, 1)"
      >
        <Box p={5} pl="72px">
          <Text
            fontSize="14px"
            lineHeight={1.8}
            color="forge.ember.300"
          >
            {answer}
          </Text>
        </Box>
      </Box>
    </Box>
  )
}