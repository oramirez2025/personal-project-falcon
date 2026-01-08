import { Button } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";
import CommentCard from "./CommentCard";
import CreateCommentModal from "./CreateCommentModal";
import {
  fetchComments,
  createComments,
  deleteComment,
  updateComment,
} from "../utilities";

export default function EventCard({
  id,
  title,
  day,
  start_time,
  end_time,
  location,
  description,
  onClickDelete,
  onClickUpdate,
  user,
}) {
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const wsRef = useRef(null);

  const updateCommentRecursive = (comments, updated) =>
  comments.map((c) =>
    c.id === updated.id
      ? { ...c, ...updated }
      : { ...c, replies: updateCommentRecursive(c.replies || [], updated) }
  );

  // ======================
  // Initial fetch + socket
  // ======================
  useEffect(() => {
    if (!showComments) return;
    fetchComments(setComments, id);
  }, [showComments, id]);

useEffect(() => {
  if (!showComments) return;

  let socket;

  const connect = () => {
    socket = new WebSocket(`ws://localhost:8001/ws/comments/${id}/`);
    wsRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket connected to event", id);
    };

    socket.onmessage = (e) => {
      try {
        const { type, comment } = JSON.parse(e.data);

        setComments((prev) => {
          switch (type) {
            case "new_comment":
              return comment.parent
                ? addReply(prev, comment.parent, comment)
                : [...prev, comment];

            case "update_comment":
              return updateCommentRecursive(prev, comment);

            case "delete_comment":
              return deleteRecursive(prev, comment.id);

            default:
              return prev;
          }
        });
      } catch (err) {
        console.error("❌ WS parse error", err);
      }
    };

    socket.onclose = () => {
      console.warn("🔌 WS closed, reconnecting...");
      setTimeout(connect, 1000);
    };

    socket.onerror = () => socket.close();
  };

  connect();
  return () => socket?.close();
}, [showComments, id]);


  

  // ======================
  // Tree helpers
  // ======================
  const addReply = (comments, parentId, reply) =>
    comments.map((c) =>
      c.id === parentId
        ? { ...c, replies: [...(c.replies || []), reply] }
        : { ...c, replies: addReply(c.replies || [], parentId, reply) }
    );

  const updateCommentText = (comments, commentId, newText) =>
    comments.map((c) =>
      c.id === commentId
        ? { ...c, text: newText }
        : { ...c, replies: updateCommentText(c.replies || [], commentId, newText) }
    );

  const toggleLike = (comments, commentId, userId) =>
    comments.map((c) =>
      c.id === commentId
        ? {
            ...c,
            likes: c.likes.includes(userId)
              ? c.likes.filter((u) => u !== userId)
              : [...c.likes, userId],
          }
        : { ...c, replies: toggleLike(c.replies || [], commentId, userId) }
    );

  const deleteRecursive = (comments, commentId) =>
    comments
      .filter((c) => c.id !== commentId)
      .map((c) => ({
        ...c,
        replies: deleteRecursive(c.replies || [], commentId),
      }));

  // ======================
  // Handlers
  // ======================
  const handleCreate = async (data) => {
    await createComments(id, data);

  };

  const handleReply = async (parentId, data) => {
    await createComments(id, { ...data, parent: parentId });
  };

  const handleEdit = async (commentId, newText) => {
    await updateComment(null, id, commentId, { text: newText });
  };

  const handleLike = async (commentId) => {
    await updateComment(null, id, commentId, { like: true });
  };

  const handleDelete = async (commentId) => {
    await deleteComment(null, commentId);
  };

  // ======================
  // Render
  // ======================
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5>{title}</h5>
        <p>{day} · {start_time} – {end_time}</p>
        <p>@ {location}</p>
        <p>{description}</p>

        {user?.is_admin && (
          <div style={{ marginBottom: "1em" }}>
            <Button size="sm" variant="warning" onClick={onClickUpdate}>
              Edit Event
            </Button>{" "}
            <Button size="sm" variant="danger" onClick={onClickDelete}>
              Delete Event
            </Button>
          </div>
        )}

        <Button
          size="sm"
          variant="secondary"
          onClick={() => setShowComments((p) => !p)}
        >
          {showComments ? "Hide Comments" : "Show Comments"}
        </Button>

        {showComments && (
          <>
            <hr />
            <h5>Comments</h5>

            {comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                depth={0}
                user={user}
                onEdit={handleEdit}
                onLike={handleLike}
                onDelete={handleDelete}
                onReply={handleReply}
              />
            ))}

            {user && (
              <>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setShowCreate(true)}
                >
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
            )}
          </>
        )}
      </div>
    </div>
  );
}
