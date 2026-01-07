import { Button } from "react-bootstrap";
import {useState,useEffect} from "react"
import CreateCommentModal from "./CreateCommentModal";
import "axios"
import { createComments, deleteComment, fetchComments, updateComment } from "../utilities";
import CommentCard from "./CommentCard";
import EditCommentModal from "./EditCommentModal";

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
  user
}) {
  const [showComments, setShowComments] = useState(false)
  const [showCreateCommentModal, setCreateCommentModal] = useState(false)
  const [editingComment, setEditingComment] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [comments, setComments] = useState([])
  console.log(user)

  const handleClose = () => setCreateCommentModal(false);
  const handleShow = () => setCreateCommentModal(true);

  
  useEffect(() => {
    fetchComments(setComments,id);
    console.log("here are the comments: ", comments)
  },[]);

  
  
  const handleSave = async (data) => {
    await createComments(setComments, id, data);
  };

  const handleUpdate = async (comment_id, data) => {
    await updateComment(setComments, id, comment_id, data);
  };

  const handleDelete = async (id) => {
    await deleteComment(setComments, id);
  };

  // =============== COMMENTS ===============

  const onClickLike = async (comment_id, prev_likes) => {
    console.log(prev_likes)
    if (prev_likes.includes(user.id)) {
      prev_likes = prev_likes.filter(p => p !== user.id)
      console.log("PREVLIKES", prev_likes)
      await updateComment(setComments, id, comment_id, {"likes" : prev_likes})
    } else {
      prev_likes = [...prev_likes, user.id]
      console.log("what: ", prev_likes)
      await updateComment(setComments, id, comment_id, {"likes" : prev_likes})
    }


  }

  // console.log(`HERE ARE MY COMMENTS ${comments[1].likes.length}`)
  return (
    <div className="card" style={{ width: "18rem" }}>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>

        <h6 className="card-subtitle mb-2 text-muted">
          Day: {day} | {start_time} to {end_time}
        </h6>

        <h6 className="card-subtitle mb-2 text-muted">
          @ {location}
        </h6>

        <p className="card-text">{description}</p>
        {
          user?.isAdmin ? (
                            <>
                              <Button variant="secondary" onClick={onClickDelete}>
                                  Delete Event
                              </Button>
                              <Button variant="primary" onClick={onClickUpdate}>
                                  Edit Event
                              </Button>
                            </>) : <></>
        }
        <>

          <Button onClick={() => setShowComments(prev => !prev)}>Open Comment Section</Button>
          
          <EditCommentModal
            show={showEdit}
            handleClose={() => setShowEdit(false)}
            comment={editingComment}
            handleUpdate={handleUpdate}
          
          />
          {
            showComments ?  
            <div>
              <h1>Comment Section: </h1>
              {comments.map((comment) => 
                <CommentCard
                  key={comment.id}
                  id={comment.id}
                  author={comment.author}
                  time={comment.time}
                  likes={comment.likes.length} 
                  text={comment.text}
                  onClickDelete={() => handleDelete(comment.id)}
                  onClickUpdate={() => {
                    setEditingComment(comment)
                    setShowEdit(true)
                  }}
                  onClickLike={() => onClickLike(comment.id, comment.likes)}
                  isOP={user?.id === comment.author}
                  isAdmin={user?.is_admin}
                  isLoggedIn={!!user}
                />
                  
                )
              }
              {
                user ? <Button onClick={handleShow}> Add a comment!</Button> : <></>
              }
              <CreateCommentModal
                show={showCreateCommentModal}
                handleClose={handleClose}
                handleSave={handleSave}
              />
            </div>
            : <></>
      
          }
        </>
      </div>
    </div>
  );
}
