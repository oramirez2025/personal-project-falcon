import { useParams, useOutletContext, Link } from "react-router-dom";
import { Box, Heading, Button, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import CommentCard from "../components/cards/CommentCard";
import { fetchCommentThread } from "../utilities";
import { MotionBox } from "../components/Motion";
import { staggerContainer } from "../components/animations/fffAnimations";

const findCommentById = (comments, id) => {
  for (const c of comments) {
    if (c.id === Number(id)) return c;
    const found = findCommentById(c.replies || [], id);
    if (found) return found;
  }
  return null;
};


export default function CommentThreadPage() {
  const { eventId, commentId } = useParams();
  const { comments, user, handlers } = useOutletContext();

  const thread = findCommentById(comments, commentId);

  if (!thread) return null;

  return (
    <Box py={6}>
      <Button
        as={Link}
        to={`/events/${eventId}`}
        variant="ghost"
        mb={4}
      >
        ← Back to discussion
      </Button>

      <Heading size="md" mb={6}>
        Thread
      </Heading>

        <MotionBox
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <CommentCard          
            key={thread.id}
            comment={thread}
            depth={0}
            user={user}
            {...handlers}
          />

          {/* <Stack spacing={8} divider={<Separator />}>
            {comments.map((comment) => (
              <MotionBox key={comment.id} variants={staggerItem}>
                <CommentCard
                  key={thread.id}
                  comment={thread}
                  depth={0}
                  user={user}
                  {...handlers}
                />
              </MotionBox>
            ))}
          </Stack> */}
        </MotionBox>
    </Box>
  );
}