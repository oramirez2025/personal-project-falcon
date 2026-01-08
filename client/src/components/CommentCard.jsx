import { Button } from "react-bootstrap";
import { useState } from "react";
import CreateCommentModal from "./CreateCommentModal";
import EditCommentModal from "./EditCommentModal";

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

  return (
    <div
      style={{
        paddingLeft: `${indent}em`,
        marginTop: "1em",
        overflowWrap: "anywhere",
        wordBreak: "break-word",
      }}
    >
      {/* Author and Timestamp */}
      <p>
        <strong>{author}</strong> · {time}
      </p>

      {/* Comment Text */}
      <p>{text}</p>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "0.5em", flexWrap: "wrap" }}>
        {isLoggedIn && (
          <Button size="sm" variant="outline-secondary" onClick={() => onLike(id)}>
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
    </div>
  );
}
