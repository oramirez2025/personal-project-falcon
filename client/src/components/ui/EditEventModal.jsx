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
export default function EditEventModal({
    show,
    handleClose,
    handleUpdate,
    event,
}) {
    const [title, setTitle] = useState("")
    const [day, setDay] = useState("")
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")
    const [location, setLocation] = useState("")
    const [description, setDescription] = useState("")

    // Populate form when event changes
    useEffect(() => {
        if (event) {
            setTitle(event.title || "")
            setDay(event.day || "")
            setStartTime(event.start_time || "")
            setEndTime(event.end_time || "")
            setLocation(event.location || "")
            setDescription(event.description || "")
        }
    }, [event])

    const onUpdate = () => {
        handleUpdate(event.id, {
            title,
            day,
            start_time: startTime,
            end_time: endTime,
            location,
            description,
        })

        handleClose()
    }

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
                        <Dialog.Title color="text.primary">Edit Event</Dialog.Title>
                        <Dialog.CloseTrigger color="text.secondary" />
                    </Dialog.Header>

                    <Dialog.Body>
                        <VStack spacing={4}>
                            {/* Title */}
                            <Field.Root w="100%">
                                <Field.Label color="text.secondary">Title</Field.Label>
                                <Input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    {...modalInputStyles}
                                    autoFocus
                                />
                            </Field.Root>

                            {/* Day */}
                            <Field.Root w="100%">
                                <Field.Label color="text.secondary">Day</Field.Label>
                                <Input
                                    type="date"
                                    value={day}
                                    onChange={(e) => setDay(e.target.value)}
                                    {...modalInputStyles}
                                />
                            </Field.Root>

                            {/* Time Fields Row */}
                            <HStack w="100%" spacing={4}>
                                {/* Start Time */}
                                <Field.Root flex="1">
                                    <Field.Label color="text.secondary">Start Time</Field.Label>
                                    <Input
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        {...modalInputStyles}
                                    />
                                </Field.Root>

                                {/* End Time */}
                                <Field.Root flex="1">
                                    <Field.Label color="text.secondary">End Time</Field.Label>
                                    <Input
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        {...modalInputStyles}
                                    />
                                </Field.Root>
                            </HStack>

                            {/* Location */}
                            <Field.Root w="100%">
                                <Field.Label color="text.secondary">Location</Field.Label>
                                <Input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    {...modalInputStyles}
                                />
                            </Field.Root>

                            {/* Description */}
                            <Field.Root w="100%">
                                <Field.Label color="text.secondary">Description</Field.Label>
                                <Textarea
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
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
                                Update Event
                            </Button>
                        </HStack>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}