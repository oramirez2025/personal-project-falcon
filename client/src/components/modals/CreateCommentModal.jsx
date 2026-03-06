import { useState } from "react";
import { HStack } from "@chakra-ui/react";
import { Feather, Send, X } from "lucide-react";
import ForumModalBase from "../forum/ForumModalBase";
import ForumTextarea from "../forum/ForumTextarea";
import ForumButton from "../forum/ForumButton";

/**
 * Create Comment Modal - "Scribe Your Words"
 * Uses ForumModalBase for consistent styling
 */
export default function CreateCommentModal({ show, handleClose, handleSave }) {
  const [text, setText] = useState("");

  const onSave = () => {
    if (!text.trim()) return;
    handleSave({ text });
    setText("");
    handleClose();
  };

  return (
    <ForumModalBase
      show={show}
      onClose={handleClose}
      icon={Feather}
      title="Scribe Your Words"
      footer={
        <HStack gap={3}>
          <ForumButton variant="secondary" icon={X} onClick={handleClose}>
            Cancel
          </ForumButton>
          <ForumButton 
            variant="primary" 
            icon={Send} 
            onClick={onSave}
            disabled={!text.trim()}
          >
            Post Comment
          </ForumButton>
        </HStack>
      }
    >
      <ForumTextarea
        label="Your Message"
        placeholder="Share your thoughts with fellow adventurers..."
        hint="Be respectful and keep discussions on topic"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
      />
    </ForumModalBase>
  );
}
