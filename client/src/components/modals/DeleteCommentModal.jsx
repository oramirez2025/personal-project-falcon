import { VStack, Box, Text } from "@chakra-ui/react";
import { HStack } from "@chakra-ui/react";
import { Trash2 } from "lucide-react";
import ForumModalBase from "../forum/ForumModalBase";
import ForumButton from "../forum/ForumButton";

/**
 * Delete Comment Modal - Danger variant
 */
export default function DeleteCommentModal({ 
  show, 
  handleClose, 
  handleDelete,
  commentId = null,
}) {
  const onDelete = () => {
    handleDelete(commentId);
    handleClose();
  };

  return (
    <ForumModalBase
      show={show}
      onClose={handleClose}
      variant="danger"
      maxW="sm"
      footer={
        <HStack gap={3}>
          <ForumButton variant="secondary" onClick={handleClose}>
            Keep It
          </ForumButton>
          <ForumButton variant="danger" icon={Trash2} onClick={onDelete}>
            Delete Forever
          </ForumButton>
        </HStack>
      }
    >
      <VStack gap={4} pb={4}>
        {/* Warning Icon */}
        <Box
          w={14}
          h={14}
          bg="forge.red.700"
          border="2px solid"
          borderColor="forge.ember.400"
          borderRadius="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="forge.ember.400"
        >
          <Trash2 size={24} />
        </Box>

        {/* Title */}
        <Text fontFamily="heading" fontSize="xl" color="forge.tan.100">
          Delete Comment?
        </Text>

        {/* Description */}
        <Text fontSize="sm" color="forge.tan.400" lineHeight="1.6" textAlign="center">
          This action cannot be undone. Your words will be lost to the void forever.
        </Text>
      </VStack>
    </ForumModalBase>
  );
}
