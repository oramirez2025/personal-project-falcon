import {
  Dialog,
  Button,
  HStack,
  Box,
} from "@chakra-ui/react";
import { X } from "lucide-react";

/**
 * Base modal component for all D&D themed forum modals
 * Provides: leather gradient, corner brackets, accent bar, header layout
 * 
 * Usage:
 * <ForumModalBase
 *   show={isOpen}
 *   onClose={handleClose}
 *   icon={Feather}
 *   title="Scribe Your Words"
 *   footer={<Button>Submit</Button>}
 * >
 *   <Textarea />
 * </ForumModalBase>
 */
export default function ForumModalBase({
  show,
  onClose,
  icon: Icon,
  title,
  children,
  footer,
  maxW = "lg",
  // For delete modal variant
  variant = "default", // "default" | "danger"
}) {
  const isDanger = variant === "danger";

  return (
    <Dialog.Root
      open={show}
      onOpenChange={(e) => {
        if (!e.open) onClose();
      }}
    >
      <Dialog.Backdrop bg="blackAlpha.800" />
      <Dialog.Positioner>
        <Dialog.Content
          maxW={maxW}
          bg={isDanger 
            ? "linear-gradient(135deg, #4a1111 0%, #0d0a08 100%)"
            : "linear-gradient(135deg, #2a1f15 0%, #1a1410 50%, #0d0a08 100%)"
          }
          border="2px solid"
          borderColor={isDanger ? "forge.red.700" : "forge.tan.500"}
          borderRadius="xl"
          overflow="hidden"
          position="relative"
          boxShadow="0 20px 60px rgba(0, 0, 0, 0.5)"
          textAlign={isDanger ? "center" : "left"}
        >
          {/* Top Accent Bar */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            h="3px"
            bg={isDanger
              ? "linear-gradient(90deg, #ff6b35, #7a1f1f, #ff6b35)"
              : "linear-gradient(90deg, #f59e0b, #ff6b35, #f59e0b)"
            }
          />

          {/* Corner Brackets (not for danger variant) */}
          {!isDanger && (
            <>
              <Box position="absolute" top={3} left={3} w={6} h={6} borderTop="2px solid" borderLeft="2px solid" borderColor="forge.tan.500" opacity={0.5} />
              <Box position="absolute" top={3} right={3} w={6} h={6} borderTop="2px solid" borderRight="2px solid" borderColor="forge.tan.500" opacity={0.5} />
              <Box position="absolute" bottom={3} left={3} w={6} h={6} borderBottom="2px solid" borderLeft="2px solid" borderColor="forge.tan.500" opacity={0.5} />
              <Box position="absolute" bottom={3} right={3} w={6} h={6} borderBottom="2px solid" borderRight="2px solid" borderColor="forge.tan.500" opacity={0.5} />
            </>
          )}

          {/* Header (not for danger variant - it has its own layout) */}
          {!isDanger && (
            <Dialog.Header pt={5} px={6} pb={4}>
              <HStack justify="space-between" w="100%">
                <HStack gap={3}>
                  {Icon && (
                    <Box
                      w={10}
                      h={10}
                      bg="radial-gradient(circle, #7a1f1f 0%, #4a1111 100%)"
                      border="1px solid"
                      borderColor="forge.tan.500"
                      borderRadius="lg"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      color="forge.gold.400"
                    >
                      <Icon size={20} />
                    </Box>
                  )}
                  <Dialog.Title
                    fontFamily="heading"
                    fontSize="xl"
                    color="forge.tan.100"
                  >
                    {title}
                  </Dialog.Title>
                </HStack>
                <Dialog.CloseTrigger
                  asChild
                  position="relative"
                  top="auto"
                  right="auto"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    color="forge.tan.400"
                    p={2}
                    borderRadius="md"
                    _hover={{
                      color: "forge.gold.400",
                      bg: "rgba(245, 158, 11, 0.1)",
                    }}
                  >
                    <X size={18} />
                  </Button>
                </Dialog.CloseTrigger>
              </HStack>
            </Dialog.Header>
          )}

          {/* Body */}
          <Dialog.Body px={6} pb={isDanger ? 0 : 6} pt={isDanger ? 8 : 0}>
            {children}
          </Dialog.Body>

          {/* Footer */}
          {footer && (
            <Dialog.Footer
              px={6}
              py={4}
              borderTop={isDanger ? "none" : "1px solid"}
              borderTopColor="forge.stone.700"
              bg="rgba(0, 0, 0, 0.2)"
              justifyContent={isDanger ? "center" : "flex-end"}
            >
              {footer}
            </Dialog.Footer>
          )}
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
