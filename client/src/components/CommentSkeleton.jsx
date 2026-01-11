import {
  Box,
  Stack,
  Skeleton,
  SkeletonText,
  HStack,
} from "@chakra-ui/react";

export default function CommentSkeleton({ depth = 0 }) {
  const indent = Math.min(depth, 6) * 1.25;

  return (
    <Box pl={`${indent}em`} mt={8}>
      <Box
        bg="forge.tan.50"
        borderRadius="lg"
        border="2px solid"
        borderColor="border.accent"
        boxShadow="md"
        p={4}
      >
        <Stack spacing={3}>
          <HStack spacing={2}>
            <Skeleton height="14px" width="120px" />
            <Skeleton height="12px" width="80px" />
          </HStack>

          <SkeletonText noOfLines={2} spacing="2" />

          <HStack spacing={2}>
            <Skeleton height="28px" width="60px" />
            <Skeleton height="28px" width="60px" />
          </HStack>
        </Stack>
      </Box>
    </Box>
  );
}
