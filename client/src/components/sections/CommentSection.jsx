// components/CommentSection.jsx
import { Button } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import CommentCard from "../CommentCard";
import CreateCommentModal from "../CreateCommentModal";



import {
  fetchComments,
  createComments,
  deleteComment,
  updateComment,
} from "../../utilities";

export default function CommentSection({eventId,user}) {
  const [comments, setComments] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const wsRef = useRef(null);

  // ======================
  // Initial fetch
  // ======================
  useEffect(() => {
    if (!eventId) return;
    fetchComments(setComments, eventId);
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
    <>
      <h5>Comments</h5>

      {comments.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment}
          depth={0}
          onEdit={handleEdit}
          onLike={handleLike}
          onDelete={handleDelete}
          onReply={handleReply}
          user={user}
        />
      ))}

      <Button size="sm" onClick={() => setShowCreate(true)}>
        Add Comment
      </Button>

      <CreateCommentModal
        show={showCreate}
        handleClose={() => setShowCreate(false)}
        handleSave={(data) => {
          handleCreate(data);
          setShowCreate(false);
        }}
      />
    </>
  );
}
