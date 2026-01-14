import { useState, useEffect } from "react";
import { HStack } from "@chakra-ui/react";
import { Pencil, Check, X } from "lucide-react";
import ForumModalBase from "../forum/ForumModalBase";
import ForumTextarea from "../forum/ForumTextarea";
import ForumButton from "../forum/ForumButton";

/**
 * Edit Comment Modal - "Edit Your Words"
 */
export default function EditCommentModal({ 
  show, 
  handleClose, 
  handleSave,
  comment = null,
}) {
  const [text, setText] = useState("");

  // Populate with existing text when modal opens
  useEffect(() => {
    if (comment?.text) {
      setText(comment.text);
    }
  }, [comment]);

  const onSave = () => {
    if (!text.trim()) return;
    handleSave({ id: comment?.id, text });
    handleClose();
  };

  return (
    <ForumModalBase
      show={show}
      onClose={handleClose}
      icon={Pencil}
      title="Edit Your Words"
      footer={
        <HStack gap={3}>
          <ForumButton variant="secondary" icon={X} onClick={handleClose}>
            Cancel
          </ForumButton>
          <ForumButton 
            variant="primary" 
            icon={Check} 
            onClick={onSave}
            disabled={!text.trim()}
          >
            Save Changes
          </ForumButton>
        </HStack>
      }
    >
      <ForumTextarea
        label="Your Message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
      />
    </ForumModalBase>
  );
}
