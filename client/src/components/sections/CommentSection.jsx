import {
  Container,
  Heading,
  Stack,
  Separator,
  Text,
  Button,
} from "@chakra-ui/react";
import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import CommentCard from "../cards/CommentCard";
import CommentSkeleton from "../CommentSkeleton";
import CreateCommentModal from "../ui/CreateCommentModal";
import { MotionBox } from "../Motion";
import { staggerContainer, staggerItem } from "../animations/fffAnimations";
import { primaryButtonStyles } from "../../theme";

export default function CommentSection() {
  const {
    comments,
    loading,
    hasFetched,
    user,
    handlers,
  } = useOutletContext();

  const [showCreate, setShowCreate] = useState(false);

  return (
    <Container maxW="container.lg" py={10}>
      <Heading
        color="forge.red.500"
        textDecoration="underline"
        mb={8}
        textAlign="center"
      >
        Discussion
      </Heading>

      {loading && !hasFetched && (
        <Stack spacing={8} divider={<Separator />}>
          {[...Array(3)].map((_, i) => (
            <CommentSkeleton key={i} />
          ))}
        </Stack>
      )}

      {!loading && hasFetched && comments.length === 0 && (
        <Text textAlign="center" color="forge.stone.600">
          Be the first to start the discussion.
        </Text>
      )}

      {/* Loaded comments */}
      {!loading && comments.length > 0 && (
        <MotionBox
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <Stack spacing={8} divider={<Separator />}>
            {comments.map((comment) => (
              <MotionBox key={comment.id} variants={staggerItem}>
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  depth={0}
                  user={user}
                  {...handlers}
                />
              </MotionBox>
            ))}
          </Stack>
        </MotionBox>
      )}

      {!!user && (
        <Button
          mt={6}
          size="lg"
          {...primaryButtonStyles}
          onClick={() => setShowCreate(true)}
        >
          Add a Comment
        </Button>
      )}

      <CreateCommentModal
        show={showCreate}
        handleClose={() => setShowCreate(false)}
        handleSave={(data) => {
          handlers.onCreate(data);
          setShowCreate(false);
        }}
      />
    </Container>
  );
}
