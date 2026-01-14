import { useState } from "react";
import { HStack, Box, Text, VStack } from "@chakra-ui/react";
import { Reply, Send, X, Quote } from "lucide-react";
import ForumModalBase from "../forum/ForumModalBase";
import ForumTextarea from "../forum/ForumTextarea";
import ForumButton from "../forum/ForumButton";

/**
 * Reply Comment Modal - "Reply to Adventurer"
 * Shows quoted context of parent comment
 */
export default function ReplyCommentModal({ 
  show, 
  handleClose, 
  handleSave,
  parentComment = null,
}) {
  const [text, setText] = useState("");

  const onSave = () => {
    if (!text.trim()) return;
    handleSave({ text });
    setText("");
    handleClose();
  };

  // Truncate long quotes
  const truncateText = (str, maxLen = 120) => {
    if (!str || str.length <= maxLen) return str;
    return str.slice(0, maxLen) + "...";
  };

  return (
    <ForumModalBase
      show={show}
      onClose={handleClose}
      icon={Reply}
      title="Reply to Adventurer"
      footer={
        <HStack gap={3}>
          <ForumButton variant="secondary" icon={X} onClick={handleClose}>
            Cancel
          </ForumButton>
          <ForumButton 
            variant="primary" 
            icon={Send} 
            onClick={onSave}
            disabled={!text.trim()}
          >
            Send Reply
          </ForumButton>
        </HStack>
      }
    >
      <VStack align="stretch" gap={4}>
        {/* Quote Block */}
        {parentComment && (
          <Box
            bg="forge.stone.900"
            borderLeft="3px solid"
            borderLeftColor="forge.gold.400"
            borderRadius="0 lg lg 0"
            p={4}
          >
            <HStack gap={1.5} mb={2}>
              <Quote size={12} color="var(--chakra-colors-forge-gold-400)" />
              <Text fontSize="xs" fontWeight="600" color="forge.gold.400">
                {parentComment.author} wrote:
              </Text>
            </HStack>
            <Text fontSize="sm" color="forge.tan.400" fontStyle="italic" lineHeight="1.5">
              "{truncateText(parentComment.text)}"
            </Text>
          </Box>
        )}

        <ForumTextarea
          label="Your Reply"
          placeholder="Write your reply..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
        />
      </VStack>
    </ForumModalBase>
  );
}
