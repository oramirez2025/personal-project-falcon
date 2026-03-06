import { Box, Heading, Text, VStack, Input } from "@chakra-ui/react"
import { MotionBox } from "../Motion"
import { inputStyles } from "../../theme"


export default function TicketCard({
  title,
  icon,
  price,
  setTicketQty,
  description,
  featured = false,
}) {
  // Parse price for display (e.g., "$250.00" -> "250")
  const priceNumber = price.replace(/[^0-9]/g, '').replace(/00$/, '')

  return (
    <MotionBox
      h="100%"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
    >
      <Box
        position="relative"
        h="100%"
        bg="linear-gradient(180deg, rgba(42, 32, 24, 0.95) 0%, rgba(26, 20, 16, 0.98) 100%)"
        border="1px solid"
        borderColor={featured ? "rgba(245, 158, 11, 0.4)" : "forge.stone.700"}
        borderRadius="12px"
        overflow="hidden"
        transition="all 0.4s cubic-bezier(0.32, 0.72, 0, 1)"
        boxShadow={featured ? "0 0 40px rgba(245, 158, 11, 0.1)" : "none"}
        _hover={{
          borderColor: featured ? "rgba(245, 158, 11, 0.6)" : "forge.stone.600",
          boxShadow: featured 
            ? "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 80px rgba(245, 158, 11, 0.2)"
            : "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 60px rgba(245, 158, 11, 0.1)",
        }}
      >
        {/* Popular Badge */}
        {featured && (
          <Box
            position="absolute"
            top="-1px"
            left="50%"
            transform="translateX(-50%)"
            bg="linear-gradient(180deg, #f5a623 0%, #c4955a 100%)"
            color="forge.stone.900"
            fontFamily="heading"
            fontSize="9px"
            fontWeight="700"
            letterSpacing="2px"
            px={4}
            py={1.5}
            borderBottomRadius="8px"
            boxShadow="0 4px 12px rgba(245, 158, 11, 0.3)"
            zIndex={2}
          >
            MOST POPULAR
          </Box>
        )}

        {/* Banner Header */}
        <Box
          position="relative"
          bg="linear-gradient(180deg, rgba(61, 42, 26, 0.8) 0%, rgba(42, 32, 24, 0.6) 100%)"
          px={6}
          pt={5}
          pb={4}
          borderBottom="1px solid"
          borderColor="rgba(92, 74, 58, 0.3)"
          _before={{
            content: '"◆"',
            position: "absolute",
            top: "8px",
            left: "12px",
            fontSize: "8px",
            color: "forge.stone.600",
            opacity: 0.6,
          }}
          _after={{
            content: '"◆"',
            position: "absolute",
            top: "8px",
            right: "12px",
            fontSize: "8px",
            color: "forge.stone.600",
            opacity: 0.6,
          }}
        >
          {/* Tier Icon */}
          <Box
            w="48px"
            h="48px"
            mx="auto"
            mb={3}
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%)"
            border="1px solid"
            borderColor="rgba(245, 158, 11, 0.3)"
            borderRadius="full"
            color="forge.gold.400"
            transition="all 0.3s ease"
            _groupHover={{
              bg: "radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%)",
              boxShadow: "0 0 20px rgba(245, 158, 11, 0.3)",
              borderColor: "rgba(245, 158, 11, 0.5)",
            }}
            css={{
              "& svg": { width: "24px", height: "24px" }
            }}
          >
            {icon}
          </Box>

          {/* Tier Name */}
          <Heading
            size="md"
            color="forge.tan.200"
            textAlign="center"
            letterSpacing="1px"
            textShadow="0 2px 4px rgba(0, 0, 0, 0.5)"
          >
            {title}
          </Heading>
        </Box>

        {/* Card Body */}
        <VStack px={6} pt={5} pb={6} spacing={4} align="stretch">
          {/* Price Display */}
          <Box
            textAlign="center"
            pb={4}
            borderBottom="1px solid"
            borderColor="rgba(61, 42, 26, 0.5)"
          >
            <Text
              fontSize="10px"
              color="forge.stone.500"
              letterSpacing="2px"
              textTransform="uppercase"
              mb={1}
            >
              Starting At
            </Text>
            <Text
              fontFamily="heading"
              fontSize="32px"
              fontWeight="700"
              color="forge.gold.400"
              textShadow="0 0 20px rgba(245, 158, 11, 0.3)"
              lineHeight={1}
            >
              <Text as="span" fontSize="18px" color="forge.tan.500">$</Text>
              {priceNumber}
            </Text>
          </Box>

          {/* Description */}
          <Text
            fontSize="13px"
            lineHeight={1.7}
            color="forge.stone.400"
            textAlign="center"
            minH="66px"
          >
            {description}
          </Text>

          {/* Quantity Selector */}
          <Box
            bg="rgba(13, 10, 8, 0.6)"
            border="1px solid"
            borderColor="rgba(61, 42, 26, 0.5)"
            borderRadius="8px"
            p={3}
          >
            <Text
              fontSize="10px"
              color="forge.stone.500"
              letterSpacing="1px"
              textTransform="uppercase"
              textAlign="center"
              mb={2}
            >
              Quantity
            </Text>
            <Input
              type="number"
              min={0}
              max={10}
              defaultValue={0}
              textAlign="center"
              fontFamily="heading"
              fontSize="16px"
              {...inputStyles}
              onChange={(e) => setTicketQty(Number(e.target.value))}
            />
          </Box>
        </VStack>
      </Box>
    </MotionBox>
  )
}