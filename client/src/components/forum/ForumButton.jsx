import { Button, HStack, Text } from "@chakra-ui/react";

/**
 * Styled buttons for forum modals and components
 * 
 * Variants:
 * - primary: red gradient with gold border (main actions)
 * - secondary: outline style (cancel buttons)
 * - danger: ember colored (delete actions)
 * 
 * Usage:
 * <ForumButton variant="primary" icon={Send}>Post Comment</ForumButton>
 * <ForumButton variant="secondary" icon={X}>Cancel</ForumButton>
 * <ForumButton variant="danger" icon={Trash2}>Delete</ForumButton>
 */
export default function ForumButton({
  children,
  variant = "primary", // "primary" | "secondary" | "danger"
  icon: Icon,
  disabled = false,
  onClick,
  ...props
}) {
  const styles = {
    primary: {
      bg: "linear-gradient(180deg, #7a1f1f 0%, #4a1111 100%)",
      border: "1px solid",
      borderColor: "forge.gold.600",
      color: "forge.tan.100",
      _hover: {
        bg: "linear-gradient(180deg, #b45309 0%, #b45309 100%)",
        boxShadow: "0 0 20px rgba(245, 158, 11, 0.3)",
      },
    },
    secondary: {
      bg: "transparent",
      border: "1px solid",
      borderColor: "forge.stone.700",
      color: "forge.tan.300",
      _hover: {
        bg: "forge.stone.700",
        borderColor: "forge.tan.400",
        color: "forge.tan.100",
      },
    },
    danger: {
      bg: "forge.ember.400",
      border: "1px solid",
      borderColor: "forge.ember.400",
      color: "forge.stone.900",
      fontWeight: "600",
      _hover: {
        bg: "forge.ember.300",
      },
    },
  };

  const currentStyle = styles[variant] || styles.primary;

  return (
    <Button
      onClick={onClick}
      fontFamily="heading"
      fontSize="sm"
      px={6}
      py={3}
      disabled={disabled}
      _disabled={{
        opacity: 0.5,
        cursor: "not-allowed",
      }}
      {...currentStyle}
      {...props}
    >
      <HStack gap={2}>
        {Icon && <Icon size={14} />}
        <Text>{children}</Text>
      </HStack>
    </Button>
  );
}
