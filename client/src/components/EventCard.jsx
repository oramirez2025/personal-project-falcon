import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import CommentCard from "./CommentCard";
import CreateCommentModal from "./CreateCommentModal";
import EditCommentModal from "./EditCommentModal";
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

  useEffect(() => {
    fetchComments(setComments, id);
  }, [id]);

  // =========================
  // Comment Handlers
  // =========================

  const handleCreate = async (data) => {
    await createComments(setComments, id, data);
  };

  const handleReply = async (parentId, data) => {
    await createComments(setComments, id, {
      ...data,
      parent: parentId,
    });
  };

  const handleUpdate = async (commentId, data) => {
    await updateComment(setComments, id, commentId, data);
  };

  const handleDelete = async (commentId) => {
    await deleteComment(setComments, commentId);
  };

  const handleLike = async (commentId, likes) => {
    const updatedLikes = likes.includes(user.id)
      ? likes.filter((u) => u !== user.id)
      : [...likes, user.id];

    await updateComment(setComments, id, commentId, { likes: updatedLikes });
  };


  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5>{title}</h5>

        <p>
          {day} · {start_time} – {end_time}
        </p>

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
          onClick={() => setShowComments((prev) => !prev)}
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
                {...comment}
                depth={0}
                user={user}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                onReply={handleReply}
                onLike={handleLike}
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
