import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

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

        <Button as={Link} to={`/events/${id}`}>
          Find Out More
        </Button>
      </div>
    </div>
  );
}
