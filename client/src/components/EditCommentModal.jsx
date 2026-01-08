import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";


export default function EditCommentModal({ 
  show,
  handleClose,
  handleUpdate,
  comment, 
}) {
  // const [image, setImage] = useState("");
  const [text, setText] = useState("");
  // const [parent, setParent] = useState(null)

  useEffect(() => {
    if (comment) {
      setText(comment.text || "");
    }
  }, [comment]);


  const onUpdate = () => {
    handleUpdate(text);

    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Comment</Modal.Title>
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
          Cancel
        </Button>
        <Button variant="primary" onClick={onUpdate}>
          Update Comment
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
