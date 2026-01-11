import {
  Button,
  Container,
  Heading,
  Stack,
  Separator,
  Text,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import CommentCard from "../cards/CommentCard";
import CommentSkeleton from "../CommentSkeleton";
import CreateCommentModal from "../ui/CreateCommentModal";
import {
  fetchComments,
  createComments,
  deleteComment,
  updateComment,
} from "../../utilities";
import { MotionBox } from "../Motion";
import {
  staggerContainer,
  staggerItem,
} from "../animations/fffAnimations";
import { primaryButtonStyles } from "../../theme";

export default function CommentSection({ eventId, user }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const wsRef = useRef(null);

  // ======================
  // Initial fetch (with skeleton delay)
  // ======================
  useEffect(() => {
    if (!eventId) return;

    let mounted = true;
    const MIN_DELAY = 500;

    setLoading(true);
    setHasFetched(false);

    fetchComments((data) => {
      if (!mounted) return;

      setComments(data);

      setTimeout(() => {
        if (!mounted) return;
        setLoading(false);
        setHasFetched(true);
      }, MIN_DELAY);
    }, eventId);

    return () => {
      mounted = false;
    };
  }, [eventId]);

  // ======================
  // WebSocket
  // ======================
  useEffect(() => {
    if (!eventId) return;

    let socket;

    const connect = () => {
      socket = new WebSocket(`ws://localhost:8001/ws/comments/${eventId}/`);
      wsRef.current = socket;

      socket.onmessage = (e) => {
        const { type, comment } = JSON.parse(e.data);

        setComments((prev) => {
          switch (type) {
            case "new_comment":
              return comment.parent
                ? addReply(prev, comment.parent, comment)
                : [...prev, comment];

            case "update_comment":
              return updateRecursive(prev, comment);

            case "delete_comment":
              return deleteRecursive(prev, comment.id);

            default:
              return prev;
          }
        });
      };

      socket.onclose = () => setTimeout(connect, 1000);
      socket.onerror = () => socket.close();
    };

    connect();
    return () => socket?.close();
  }, [eventId]);

  // ======================
  // Tree helpers
  // ======================
  const addReply = (comments, parentId, reply) =>
    comments.map((c) =>
      c.id === parentId
        ? { ...c, replies: [...(c.replies || []), reply] }
        : { ...c, replies: addReply(c.replies || [], parentId, reply) }
    );

  const updateRecursive = (comments, updated) =>
    comments.map((c) =>
      c.id === updated.id
        ? { ...c, ...updated }
        : { ...c, replies: updateRecursive(c.replies || [], updated) }
    );

  const deleteRecursive = (comments, id) =>
    comments
      .filter((c) => c.id !== id)
      .map((c) => ({
        ...c,
        replies: deleteRecursive(c.replies || [], id),
      }));

  // ======================
  // Handlers
  // ======================
  const handleCreate = async (data) => {
    await createComments(eventId, data);
  };

  const handleReply = async (parentId, data) => {
    await createComments(eventId, { ...data, parent: parentId });
  };

  const handleEdit = async (commentId, text) => {
    await updateComment(null, eventId, commentId, { text });
  };

  const handleLike = async (commentId) => {
    await updateComment(null, eventId, commentId, { like: true });
  };

  const handleDelete = async (commentId) => {
    await deleteComment(null, commentId);
  };

  // ======================
  // Render
  // ======================
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

      {/* Skeletons (only before first load completes) */}
      {loading && !hasFetched && (
        <Stack spacing={8} divider={<Separator />}>
          {[...Array(3)].map((_, i) => (
            <CommentSkeleton key={i} />
          ))}
        </Stack>
      )}

      {/* Empty state */}
      {!loading && hasFetched && comments.length === 0 && (
        <Text color="forge.stone.600" textAlign="center" mt={6}>
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
                  comment={comment}
                  depth={0}
                  user={user}
                  onEdit={handleEdit}
                  onLike={handleLike}
                  onDelete={handleDelete}
                  onReply={handleReply}
                />
              </MotionBox>
            ))}
          </Stack>
        </MotionBox>
      )}

      {!!user && 
          <Button
            size="lg"
            {...primaryButtonStyles}
            alignSelf="flex-start"
            onClick={() =>  setShowCreate(true)}
          >
            Add a Comment
          </Button>
      }

      <CreateCommentModal
        show={showCreate}
        handleClose={() => setShowCreate(false)}
        handleSave={(data) => {
          handleCreate(data);
          setShowCreate(false);
        }}
      />
    </Container>
  );
}
