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
import { AnimatePresence } from "framer-motion";
import BaseCard from "./BaseCard";
import {
  primaryButtonStyles,
  outlineButtonStyles,
} from "../../theme";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { staggerContainer, staggerItem } from "../animations/fffAnimations";

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
  const [showReplies, setShowReplies] = useState(false);

  const { eventId } = useParams();
  const {setThread} = useOutletContext();

  const isLoggedIn = !!user;
  const isOP = user?.id === author;
  const isAdmin = user?.is_admin;

  const INLINE_DEPTH_LIMIT = 3; // Can be changed but for now 1 
  const canExpandInline = depth < INLINE_DEPTH_LIMIT;
  const replyCount = replies.length;

  const indent = Math.min(depth, 6) * 1.25;
  const hasLiked = likes.includes(user?.id);
  return (
    <Box pl={`${indent}em`} mt={4}>
      <MotionBox {...cardHover}>
        <BaseCard>
          <VStack align="stretch" spacing={3}>
            {/* Author + Time */}
            <Text fontWeight="600">
              {author}
              <Text as="span" fontWeight="400">
                {" "}· {time}
              </Text>
            </Text>

            {/* Text */}
            <Text whiteSpace="pre-wrap">
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
                  bg="forge.stone.300"
                  color="forge.stone.900"
                  border="1px solid"
                  borderColor="forge.stone.800"
                  _hover={{ bg: "forge.stone.200" }}
                  onClick={() => setShowEdit(true)}
                >
                  Edit
                </Button>
              )}

              {(isOP || isAdmin) && (
                <Button
                  size="sm"
                  bg="forge.gold.600"
                  color="black"
                  border="1px solid"
                  borderColor="forge.gold.600"
                  _hover={{
                    bg: "forge.gold.50",
                    borderColor: "forge.gold.700",
                  }}
                  onClick={() => onDelete(id)}
                >
                  Delete
                </Button>
              )}
            </HStack>

            {/* Toggle OR Navigate */}
            {replyCount > 0 && (
              canExpandInline ? (
                <Button
                  size="xs"
                  variant="ghost"
                  alignSelf="flex-start"
                  onClick={() => setShowReplies((prev) => !prev)}
                  _hover={{
                    color: "forge.gold.500",
                  }}
                >
                  {showReplies
                    ? `Hide (${replyCount}) replies`
                    : `Show (${replyCount}) replies`}
                </Button>
              ) : (
                <Button
                  as={Link}
                  to={`/forum/event/${eventId}/comments/${id}`}
                  size="xs"
                  variant="ghost"
                  alignSelf="flex-start"
                  onClick={() => setThread(comment)}
                  _hover={{
                    color: "forge.gold.500",
                  }}
                >
                  View {replyCount} replies →
                </Button>
              )
            )}
          </VStack>
        </BaseCard>
      </MotionBox>

      {/* Inline replies */}
      <AnimatePresence initial={false}>
        {canExpandInline && showReplies && (
          <MotionBox
            key="replies"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <VStack align="stretch" spacing={4} mt={4}>
              {replies.map((reply) => (
                  <MotionBox
                    key={reply.id}
                    variants={staggerItem}
                    initial="hidden"
                    animate="visible"
                    layout
                  >
                  <CommentCard
                    comment={reply}
                    depth={depth + 1}
                    user={user}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onReply={onReply}
                    onLike={onLike}
                  />
                </MotionBox>
              ))}
            </VStack>
          </MotionBox>
        )}
      </AnimatePresence>




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
    </Box>
  );
}
