import { useState } from "react";
import {
    Dialog,
    Input,
    Textarea,
    Button,
    VStack,
    HStack,
} from "@chakra-ui/react";
import { Field } from "@chakra-ui/react";
import { modalInputStyles, primaryButtonStyles, outlineButtonStyles } from "../../theme";

 
// Uses shared style objects from theme.js
export default function CreateCommentModal({ show, handleClose, handleSave }) {
    const [text, setText] = useState("");

    const onSave = () => {
        handleSave({
            text
        });

        // Reset form
        setText("");

        handleClose();
    };

    return (
        <Dialog.Root
            open={show}
            onOpenChange={(e) => {
                if (!e.open) handleClose();
            }}
        >
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content
                    maxW="lg"
                    bg="bg.secondary"
                    borderColor="border.accent"
                    borderWidth="2px"
                >
                    <Dialog.Header>
                        <Dialog.Title color="text.primary">Create Comment</Dialog.Title>
                        <Dialog.CloseTrigger color="text.secondary" />
                    </Dialog.Header>

                    <Dialog.Body>
                        <VStack spacing={4}>
                            {/* Text */}
                            <Field.Root w="100%">
                                <Field.Label color="text.secondary">Text</Field.Label>
                                <Textarea
                                    rows={3}
                                    placeholder="Enter a comment"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    {...modalInputStyles}
                                />
                            </Field.Root>
                        </VStack>
                    </Dialog.Body>

                    <Dialog.Footer>
                        <HStack spacing={3}>
                            <Button
                                onClick={handleClose}
                                {...outlineButtonStyles}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={onSave}
                                {...primaryButtonStyles}
                            >
                                Save Comment
                            </Button>
                        </HStack>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
}