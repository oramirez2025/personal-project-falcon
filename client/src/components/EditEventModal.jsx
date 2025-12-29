import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function EditEventModal({
  show,
  handleClose,
  handleUpdate,
  event, 
}) {
  const [title, setTitle] = useState("");
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (event) {
      setTitle(event.title || "");
      setDay(event.day || "");
      setStartTime(event.start_time || "");
      setEndTime(event.end_time || "");
      setLocation(event.location || "");
      setDescription(event.description || "");
    }
  }, [event]);

  const onUpdate = () => {
    handleUpdate(event.id, {
      title,
      day,
      start_time: startTime,
      end_time: endTime,
      location,
      description,
    });

    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Event</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="eventTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="eventDay">
            <Form.Label>Day</Form.Label>
            <Form.Control
              type="date"
              value={day}
              onChange={(e) => setDay(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="eventStartTime">
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="eventEndTime">
            <Form.Label>End Time</Form.Label>
            <Form.Control
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="eventLocation">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="eventDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onUpdate}>
          Update Event
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
