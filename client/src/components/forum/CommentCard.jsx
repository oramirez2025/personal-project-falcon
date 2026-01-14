import { useState } from "react";
import { Box, HStack, VStack, Text, Button } from "@chakra-ui/react";
import { 
  Heart, 
  Reply, 
  Pencil, 
  Trash2, 
  Shield, 
  ChevronDown,
  ChevronUp,
  User
} from "lucide-react";
import { MotionBox } from "../Motion";

// Supports nested replies with recursive rendering
export default function CommentCard({
  comment,
  currentUserId = null,
  onReply,
  onEdit,
  onDelete,
  onLike,
  depth = 0,
  maxDepth = 3,
}) {
  const [showReplies, setShowReplies] = useState(depth < 2);
  const hasReplies = comment.replies && comment.replies.length > 0;
  const isOwner = currentUserId && comment.authorId === currentUserId;
  const isLiked = currentUserId && comment.likes?.includes(currentUserId);
  const likeCount = comment.likes?.length || 0;

  // Limit nesting depth for readability
  const canNest = depth < maxDepth;

  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        bg={depth === 0 ? "forge.stone.800" : "transparent"}
        border={depth === 0 ? "1px solid" : "none"}
        borderColor="forge.stone.700"
        borderRadius={depth === 0 ? "lg" : "none"}
        p={depth === 0 ? 5 : 0}
        pl={depth > 0 ? 5 : 5}
        borderLeft={depth > 0 ? "2px solid" : "none"}
        borderLeftColor={depth > 0 ? "forge.stone.700" : "transparent"}
        ml={depth > 0 ? 4 : 0}
        mt={depth > 0 ? 4 : 0}
        _hover={depth === 0 ? { borderColor: "forge.stone.600" } : {}}
        transition="all 0.2s"
      >
        {/* Header Row */}
        <HStack gap={3} mb={3}>
          {/* Avatar */}
          <Box
            w={depth === 0 ? 10 : 8}
            h={depth === 0 ? 10 : 8}
            bg={comment.isAdmin 
              ? "radial-gradient(circle, #7a1f1f 0%, #4a1111 100%)" 
              : "forge.stone.700"
            }
            border="1px solid"
            borderColor={comment.isAdmin ? "forge.gold.500" : "forge.stone.600"}
            borderRadius="lg"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color={comment.isAdmin ? "forge.gold.400" : "forge.tan.400"}
            flexShrink={0}
          >
            {comment.isAdmin ? (
              <Shield size={depth === 0 ? 18 : 14} />
            ) : (
              <User size={depth === 0 ? 18 : 14} />
            )}
          </Box>

          {/* Author & Time */}
          <VStack align="start" gap={0} flex={1}>
            <HStack gap={2}>
              <Text
                fontFamily={comment.isAdmin ? "heading" : "body"}
                fontSize={depth === 0 ? "sm" : "xs"}
                fontWeight="600"
                color={comment.isAdmin ? "forge.gold.400" : "forge.tan.100"}
              >
                {comment.author}
              </Text>
              {comment.isAdmin && (
                <Box
                  bg="forge.red.700"
                  color="forge.tan.100"
                  px={2}
                  py={0.5}
                  borderRadius="sm"
                  fontSize="10px"
                  textTransform="uppercase"
                  letterSpacing="0.5px"
                >
                  Admin
                </Box>
              )}
            </HStack>
            <Text fontSize="xs" color="forge.tan.500">
              {comment.time}
            </Text>
          </VStack>
        </HStack>

        {/* Comment Body */}
        <Text
          fontSize="sm"
          color="forge.tan.200"
          lineHeight="1.7"
          mb={4}
          pl={depth === 0 ? 13 : 11}
        >
          {comment.text}
        </Text>

        {/* Action Bar */}
        <HStack gap={1} pl={depth === 0 ? 13 : 11}>
          {/* Like Button */}
          <Button
            variant="ghost"
            size="xs"
            color={isLiked ? "forge.red.400" : "forge.tan.500"}
            _hover={{ 
              color: "forge.red.400",
              bg: "rgba(185, 28, 28, 0.1)",
            }}
            onClick={() => onLike?.(comment.id)}
          >
            <HStack gap={1.5}>
              <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
              {likeCount > 0 && <Text fontSize="xs">{likeCount}</Text>}
            </HStack>
          </Button>

          {/* Reply Button */}
          <Button
            variant="ghost"
            size="xs"
            color="forge.tan.500"
            _hover={{ 
              color: "forge.gold.400",
              bg: "rgba(245, 158, 11, 0.1)",
            }}
            onClick={() => onReply?.(comment)}
          >
            <HStack gap={1.5}>
              <Reply size={14} />
              <Text fontSize="xs">Reply</Text>
            </HStack>
          </Button>

          {/* Edit Button (owner only) */}
          {isOwner && (
            <Button
              variant="ghost"
              size="xs"
              color="forge.tan.500"
              _hover={{ 
                color: "forge.tan.100",
                bg: "rgba(255, 255, 255, 0.05)",
              }}
              onClick={() => onEdit?.(comment)}
            >
              <HStack gap={1.5}>
                <Pencil size={12} />
                <Text fontSize="xs">Edit</Text>
              </HStack>
            </Button>
          )}

          {/* Delete Button (owner only) */}
          {isOwner && (
            <Button
              variant="ghost"
              size="xs"
              color="forge.tan.500"
              _hover={{ 
                color: "forge.ember.400",
                bg: "rgba(255, 107, 53, 0.1)",
              }}
              onClick={() => onDelete?.(comment.id)}
            >
              <HStack gap={1.5}>
                <Trash2 size={12} />
                <Text fontSize="xs">Delete</Text>
              </HStack>
            </Button>
          )}

          {/* Toggle Replies */}
          {hasReplies && (
            <Button
              variant="ghost"
              size="xs"
              color="forge.gold.400"
              ml="auto"
              _hover={{ 
                bg: "rgba(245, 158, 11, 0.1)",
              }}
              onClick={() => setShowReplies(!showReplies)}
            >
              <HStack gap={1}>
                {showReplies ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                <Text fontSize="xs">
                  {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
                </Text>
              </HStack>
            </Button>
          )}
        </HStack>

        {/* Nested Replies */}
        {hasReplies && showReplies && canNest && (
          <VStack align="stretch" gap={0} mt={2}>
            {comment.replies.map((reply) => (
              <CommentCard
                key={reply.id}
                comment={reply}
                currentUserId={currentUserId}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
                onLike={onLike}
                depth={depth + 1}
                maxDepth={maxDepth}
              />
            ))}
          </VStack>
        )}

        {/* Max depth message */}
        {hasReplies && showReplies && !canNest && (
          <Box
            mt={3}
            ml={4}
            pl={4}
            borderLeft="2px solid"
            borderLeftColor="forge.stone.700"
          >
            <Text fontSize="xs" color="forge.tan.500" fontStyle="italic">
              {comment.replies.length} more {comment.replies.length === 1 ? "reply" : "replies"} — 
              <Text as="span" color="forge.gold.400" cursor="pointer" ml={1}>
                View full thread
              </Text>
            </Text>
          </Box>
        )}
      </Box>
    </MotionBox>
  );
}