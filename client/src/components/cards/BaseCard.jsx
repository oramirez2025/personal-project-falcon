import { Box } from "@chakra-ui/react";

export default function BaseCard({
  children,
  hoverable = true,
  ...props
}) {
  return (
    <Box
      h="100%"
      display="flex"
      flexDirection="column"
      bg="gray.800"
      color="white"
      borderRadius="lg"
      p={5}
      boxShadow="md"
      transition="all 0.2s ease"
      _hover={
        hoverable
          ? { boxShadow: "lg", transform: "translateY(-2px)" }
          : undefined
      }
      {...props}
    >
      {children}
    </Box>
  );
}
