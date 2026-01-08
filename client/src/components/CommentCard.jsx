import { Button } from "react-bootstrap";
import { useState } from "react";
import CreateCommentModal from "./CreateCommentModal";
import EditCommentModal from "./EditCommentModal";

export default function CommentCard({
  id,
  author,
  time,
  text,
  likes = [],
  replies = [],
  depth = 0,
  user,

  onDelete,
  onUpdate,
  onReply,
  onLike,
}) {
  const [showReply, setShowReply] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const isLoggedIn = !!user;
  const isOP = user?.id === author;
  const isAdmin = user?.is_admin;

  const indent = Math.min(depth, 6) * 1.25;

  return (
    <div
      style={{
        paddingLeft: `${indent}em`,
        marginTop: "1em",
        overflowWrap: "anywhere",
        wordBreak: "break-word",
      }}
    >
      <p>
        <strong>{author}</strong> · {time}
      </p>

      <p>{text}</p>

      {/* ACTION BUTTONS */}
      <div style={{ display: "flex", gap: "0.5em", flexWrap: "wrap" }}>
        {isLoggedIn && (
          <Button size="sm" variant="outline-secondary" onClick={() => onLike(id, likes)}>
            Like ({likes.length})
          </Button>
        )}

        {isLoggedIn && !isOP && (
          <Button size="sm" variant="outline-primary" onClick={() => setShowReply(true)}>
            Reply
          </Button>
        )}

        {isOP && (
          <Button size="sm" variant="outline-warning" onClick={() => setShowEdit(true)}>
            Edit
          </Button>
        )}

        {(isOP || isAdmin) && (
          <Button size="sm" variant="outline-danger" onClick={() => onDelete(id)}>
            Delete
          </Button>
        )}
      </div>

      {/* MODALS */}
      <CreateCommentModal
        show={showReply}
        handleClose={() => setShowReply(false)}
        handleSave={(data) => {
          onReply(id, data);
          setShowReply(false);
        }}
      />

      <EditCommentModal
        show={showEdit}
        handleClose={() => setShowEdit(false)}
        comment={{ id, text }}
        handleUpdate={(data) => {
          onUpdate(id, data);
          setShowEdit(false);
        }}
      />

      {/* REPLIES */}
      {replies.map((reply) => (
        <CommentCard
          key={reply.id}
          {...reply}
          depth={depth + 1}
          user={user}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onReply={onReply}
          onLike={onLike}
        />
      ))}
    </div>
  );
}
