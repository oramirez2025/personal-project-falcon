import { useParams, useOutletContext, Link } from "react-router-dom";
import { Container, Heading, Button} from "@chakra-ui/react";
import CommentCard from "../components/cards/CommentCard";
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
  <Container maxW="container.lg" py={10}></Container>
  return (
    <Container maxW="container.lg" py={10}>
      <Button
        as={Link}
        to={`/forum/event/${eventId}`}
        variant="ghost"
        mb={4}
        color="forge.gold.500"
      >
        ← Back to discussion
      </Button>

      <Heading 
        size="lg"
        color="text.primary"
        fontFamily="heading"
      >
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
            styling={{
              border:"1px solid",
              boxShadow:"0 8px 30px rgba(245, 158, 11, 0.2)",
              borderColor:"forge.gold.600",
            }}
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
    </Container>
  );
}