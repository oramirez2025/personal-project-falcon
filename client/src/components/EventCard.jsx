import { Button } from "react-bootstrap";
import {useState,useEffect} from "react"
import CreateCommentModal from "./CreateCommentModal";
import "axios"
import { createComments, deleteComment, fetchComments, updateComment } from "../utilities";
import CommentCard from "./CommentCard";

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
}) {
  const [showComments, setShowComments] = useState(false)
  const [showCreateCommentModal, setCreateCommentModal] = useState(false)
  const [comments, setComments] = useState([])


  const handleClose = () => setCreateCommentModal(false);
  const handleShow = () => setCreateCommentModal(true);

  
  useEffect(() => {
    fetchComments(setComments,id);
    console.log("here are the comments: ", comments)
  },[]);

  
  
  const handleSave = async (data) => {
    await createComments(setComments, id, data);
  };

  // const handleUpdate = async (id, data) => {
  //   await updateComment(setComments, id, data);
  // };

  // const handleDelete = async (id) => {
  //   await deleteComment(setComments, id);
  // };

  console.log(`AS OF NOW SHOW COMMENTS IS ${showComments}`)
  
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
        <>
            <Button variant="secondary" onClick={onClickDelete}>
                Delete Event
            </Button>
            <Button variant="primary" onClick={onClickUpdate}>
                Edit Event
            </Button>
        </>
        <>

          <Button onClick={() => setShowComments(prev => !prev)}>Open Comment Section</Button>
          {
            showComments ?  
            <div>
              <h1>Comment Section: </h1>
              {comments.map((comment) => 
                <CommentCard
                  key={comment.id}
                  author={comment.author}
                  time={comment.time}
                  likes={comment.likes} 
                  text={comment.text}
                />
                  
                )
              }
              <Button onClick={handleShow}> Add a comment!</Button>
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
