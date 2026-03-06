import { Textarea, VStack, HStack, Text } from "@chakra-ui/react";
import { Scroll, Info } from "lucide-react";

/**
 * Styled textarea for forum modals with optional label and hint
 * 
 * Usage:
 * <ForumTextarea
 *   label="Your Message"
 *   placeholder="Share your thoughts..."
 *   hint="Be respectful"
 *   value={text}
 *   onChange={(e) => setText(e.target.value)}
 * />
 */
export default function ForumTextarea({
  label,
  placeholder,
  hint,
  value,
  onChange,
  rows = 5,
  icon: Icon = Scroll,
  ...props
}) {
  return (
    <VStack align="stretch" gap={2}>
      {label && (
        <HStack gap={2} color="forge.tan.100">
          <Icon size={14} color="var(--chakra-colors-forge-gold-400)" />
          <Text
            fontFamily="heading"
            fontSize="xs"
            textTransform="uppercase"
            letterSpacing="1px"
          >
            {label}
          </Text>
        </HStack>
      )}

      <Textarea
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        bg="forge.stone.900"
        borderWidth="2px"
        borderColor="forge.stone.700"
        borderRadius="lg"
        color="forge.tan.100"
        fontFamily="body"
        fontSize="sm"
        lineHeight="1.6"
        resize="vertical"
        transition="all 0.3s"
        _hover={{
          borderColor: "forge.gold.500",
        }}
        _focus={{
          borderColor: "forge.gold.500",
          boxShadow: "0 0 0 3px rgba(245, 158, 11, 0.15), inset 0 0 20px rgba(245, 158, 11, 0.05)",
        }}
        _placeholder={{
          color: "forge.stone.600",
          fontStyle: "italic",
        }}
        {...props}
      />

      {hint && (
        <HStack gap={1.5} color="forge.tan.400" fontSize="xs">
          <Info size={12} color="var(--chakra-colors-forge-tan-500)" />
          <Text>{hint}</Text>
        </HStack>
      )}
    </VStack>
  );
}
