import { useEffect, useState } from "react"
import {
    Dialog,
    Input,
    Textarea,
    Button,
    VStack,
    HStack,
} from "@chakra-ui/react"
import { Field } from "@chakra-ui/react"
import { modalInputStyles, primaryButtonStyles, outlineButtonStyles } from "../../theme"
    
// Uses shared style objects from theme.js
export default function EditCommentModal({
    show,
    handleClose,
    handleUpdate,
    comment,
}) {
    const [text, setText] = useState("")

    // Populate form when comment changes
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
        <Dialog.Root
            open={show}
            onOpenChange={(e) => {
                if (!e.open) handleClose()
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
                        <Dialog.Title color="text.primary">Edit Comment</Dialog.Title>
                        <Dialog.CloseTrigger color="text.secondary" />
                    </Dialog.Header>

                    <Dialog.Body>
                        <VStack spacing={4}>
                            {/* Text */}
                            <Field.Root w="100%">
                                <Field.Label color="text.secondary">Text</Field.Label>
                                <Textarea
                                    rows={3}
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
                                onClick={onUpdate}
                                {...primaryButtonStyles}
                            >
                                Update Comment
                            </Button>
                        </HStack>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}