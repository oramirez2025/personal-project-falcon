import { Button } from "react-bootstrap";

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
      </div>
    </div>
  );
}
