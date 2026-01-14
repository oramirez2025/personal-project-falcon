import { useEffect, useRef, useState } from "react";
import { Outlet, useParams, useOutletContext } from "react-router-dom";
import {
  fetchComments,
  createComments,
  updateComment,
  deleteComment,
  fetchEvent,
} from "../utilities";
import EventCard from "../components/cards/EventCard";
import { useMatch } from "react-router-dom";
import { MotionBox } from "../components/Motion";
import { staggerContainer } from "../components/animations/fffAnimations";
import { Container } from "@chakra-ui/react";

export default function EventForumPage() {
  const { eventId, commentId } = useParams();
  const { user } = useOutletContext();
  const [event, setEvent] = useState(null)

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const wsRef = useRef(null);
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
  // Initial fetch
  // ======================
  useEffect(() => {
    if (!eventId) return;

    let mounted = true;
    setLoading(true);
    setHasFetched(false);

    fetchEvent(setEvent, eventId)

    fetchComments((data) => {
      if (!mounted) return;
      setComments(data);
      setLoading(false);
      setHasFetched(true);
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

    const socket = new WebSocket(
      `ws://localhost:8001/ws/comments/${eventId}/`
    );
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

    return () => socket.close();
  }, [eventId]);

  // ======================
  // Handler
  // ======================
  const handleCreate = (data) =>
    createComments(eventId, data);

  const handleReply = (parentId, data) =>
    createComments(eventId, { ...data, parent: parentId });

  const handleEdit = (id, text) =>
    updateComment(null, eventId, id, { text });

  const handleLike = (id) =>
    updateComment(null, eventId, id, { like: true });

  const handleDelete = (id) =>
    deleteComment(null, id);

  const isCommentRoute = useMatch("/forum/event/:eventId/comments/:commentId")
  console.log(event)
  return (
    <>
      {!isCommentRoute && event && 
                                  <Container maxW="container.lg" py={10}>
                                    <MotionBox
                                      variants={staggerContainer}
                                      initial="hidden"
                                      animate="visible"
                                    >
                                      <EventCard {...event}/>
                                    </MotionBox>
                                  </Container>
      }
      <Outlet
        context={{
          comments,
          loading,
          hasFetched,
          user,
          handlers: {
            onCreate: handleCreate,
            onReply: handleReply,
            onEdit: handleEdit,
            onLike: handleLike,
            onDelete: handleDelete,
          },
        }}
      />
    </>
  );
}
