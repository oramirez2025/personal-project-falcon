import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function CreateCommentModal({ show, handleClose, handleSave }) {
  // const [image, setImage] = useState("");
  const [text, setText] = useState("");
  // const [parent, setParent] = useState(null)

  const onSave = () => {
    handleSave({
      text,
    });

    // setImage("");
    setText("");

    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Comment</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="eventText">
            <Form.Label>Text</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={onSave}>
          Save Comment
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
