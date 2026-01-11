import {
  Box,
  Text,
  HStack,
  Button,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { MotionBox } from "../Motion";
import { cardHover } from "../animations/fffAnimations";
import CreateCommentModal from "../ui/CreateCommentModal";
import EditCommentModal from "../ui/EditCommentModal";
import {
  primaryButtonStyles,
  outlineButtonStyles,
} from "../../theme";

export default function CommentCard({
  comment,
  depth = 0,
  user,
  onDelete,
  onEdit,
  onReply,
  onLike,
}) {
  const { id, author, time, text, likes = [], replies = [] } = comment;

  const [showReply, setShowReply] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const isLoggedIn = !!user;
  const isOP = user?.id === author;
  const isAdmin = user?.is_admin;

  const indent = Math.min(depth, 6) * 1.25;
  const hasLiked = likes.includes(user?.id);
  console.log(user)
  return (
    <Box pl={`${indent}em`} mt={4}>
      {/* Animated Card */}
      <MotionBox {...cardHover}>
        <Box
          bg="forge.tan.50"
          borderRadius="lg"
          border="2px solid"
          borderColor="border.accent"
          boxShadow="md"
          p={4}
        >
          <VStack align="stretch" spacing={3}>
            {/* Author + Time */}
            <Text color="forge.stone.900" fontWeight="600">
              {author}
              <Text as="span" color="forge.stone.600" fontWeight="400">
                {" "}· {time}
              </Text>
            </Text>

            {/* Comment Text */}
            <Text color="forge.stone.800" whiteSpace="pre-wrap">
              {text}
            </Text>

            {/* Actions */}

            <HStack spacing={2} flexWrap="wrap">
              {isLoggedIn && (
                <Button
                  size="sm"
                  {...(hasLiked ? primaryButtonStyles : outlineButtonStyles)}
                  onClick={() => onLike(id)}
                >
                  {hasLiked ? "Liked" : "Like"} ({likes.length})
                </Button>
              )}

              {isLoggedIn && !isOP && (
                <Button
                  size="sm"
                  {...primaryButtonStyles}
                  onClick={() => setShowReply(true)}
                >
                  Reply
                </Button>
              )}

              {isOP && (
                <Button
                  size="sm"
                  bg="forge.stone.100"
                  color="forge.stone.900"
                  border="1px solid"
                  borderColor="forge.stone.300"
                  _hover={{ bg: "forge.stone.200" }}
                  onClick={() => setShowEdit(true)}
                >
                  Edit
                </Button>
              )}

              {(isOP || isAdmin) && (
                <Button
                  size="sm"
                  variant="outline"
                  borderColor="forge.red.600"
                  color="forge.red.600"
                  _hover={{
                    bg: "forge.red.50",
                    borderColor: "forge.red.700",
                  }}
                  onClick={() => onDelete(id)}
                >
                  Delete
                </Button>
              )}
            </HStack>

          </VStack>
        </Box>
      </MotionBox>

      {/* Reply Modal */}
      <CreateCommentModal
        show={showReply}
        handleClose={() => setShowReply(false)}
        handleSave={(data) => {
          onReply(id, data);
          setShowReply(false);
        }}
      />

      {/* Edit Modal */}
      <EditCommentModal
        show={showEdit}
        handleClose={() => setShowEdit(false)}
        comment={{ id, text }}
        handleUpdate={(newText) => {
          onEdit(id, newText);
          setShowEdit(false);
        }}
      />

      {/* Recursive Replies */}
      <VStack align="stretch" spacing={4} mt={4}>
        {replies.map((reply) => (
          <CommentCard
            key={reply.id}
            comment={reply}
            depth={depth + 1}
            user={user}
            onDelete={onDelete}
            onEdit={onEdit}
            onReply={onReply}
            onLike={onLike}
          />
        ))}
      </VStack>
    </Box>
  );
}
