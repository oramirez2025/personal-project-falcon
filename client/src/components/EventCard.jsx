import { Button } from "react-bootstrap";
import {useState,useEffect} from "react"
import CreateCommentModal from "./CreateCommentModal";
import "axios"

export default function EventCard({
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
  const handleSave = async (data) => {
    await createEvents(setEvents, data);
  };


  const handleClose = () => setCreateCommentModal(false);
  const handleShow = () => setCreateCommentModal(true);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const response = await axios.get("", {})
        setComments(response.data)
      } catch (e) {
        console.log(e)
      }
    }

    loadComments()
  }, [comments])
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
              {comments.map((id,author, time, likes, text) => {
              <CommentCard
                key={id}
                author={author}
                time={time}
                likes={likes}
                text={text}
              />
            }
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
