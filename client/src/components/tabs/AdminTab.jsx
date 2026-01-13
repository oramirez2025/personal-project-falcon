import { useState, useEffect } from "react";
import {
  VStack,
  HStack,
  Heading,
  Input,
  Button,
  Text,
  Separator,
  Box,
  Spinner,
  Center,
  Badge,
  Dialog,
} from "@chakra-ui/react";
import { Field } from "@chakra-ui/react";
import CreateEventModal from "../ui/CreateEventModal";
import EditEventModal from "../ui/EditEventModal";
import BaseCard from "../cards/BaseCard";
import {
  api,
  searchUsers,
  promoteUser,
  demoteUser,
} from "../../utilities";
import { showSuccessToast } from "../ui/showSuccessToast";
import { showErrorToast } from "../ui/showErrorToast";
import { inputStyles, primaryButtonStyles, outlineButtonStyles } from "../../theme";

export default function AdminTab({ isActive }) {
  // Event management state
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteConfirmEvent, setDeleteConfirmEvent] = useState(null);

  // User search state
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isUpdatingAdmin, setIsUpdatingAdmin] = useState(false);

  // Fetch events when tab becomes active
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoadingEvents(true);
        const response = await api.get("event/");
        setEvents(response.data);
      } catch (error) {
        console.error("Failed to load events:", error);
        showErrorToast("Error", "Failed to load events");
      } finally {
        setLoadingEvents(false);
      }
    };

    if (isActive) {
      loadEvents();
    }
  }, [isActive]);

  // Debounced user search - skip if user already selected
  useEffect(() => {
    // Don't search if a user is already selected
    if (selectedUser) {
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        try {
          const results = await searchUsers(searchQuery);
          setUsers(results);
          setShowDropdown(true);
        } catch (error) {
          showErrorToast("Error", "Failed to search users");
        } finally {
          setIsSearching(false);
        }
      } else {
        setUsers([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedUser]);

  // Helper to refresh events
  const refreshEvents = async () => {
    try {
      const response = await api.get("event/");
      setEvents(response.data);
    } catch (error) {
      console.error("Failed to refresh events:", error);
    }
  };

  // Event handlers
  const handleCreateEvent = async (eventData) => {
    try {
      await api.post("event/", eventData);
      await refreshEvents();
      showSuccessToast("Success", "Event created successfully");
      setShowCreateModal(false);
    } catch (error) {
      console.error("Failed to create event:", error);
      const errors = error.response?.data;
      let errorMsg = "Failed to create event";
      if (errors) {
        // Get first validation error
        const firstError = Object.entries(errors)[0];
        if (firstError) {
          errorMsg = `${firstError[0]}: ${firstError[1]}`;
        }
      }
      showErrorToast("Error", errorMsg);
    }
  };

  const handleEditClick = (event) => {
    setEditingEvent(event);
    setShowEditModal(true);
  };

  const handleUpdateEvent = async (eventId, eventData) => {
    try {
      await api.put(`event/${eventId}/`, eventData);
      await refreshEvents();
      showSuccessToast("Success", "Event updated successfully");
      setShowEditModal(false);
      setEditingEvent(null);
    } catch (error) {
      console.error("Failed to update event:", error);
      showErrorToast("Error", "Failed to update event");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmEvent) return;

    try {
      await api.delete(`event/${deleteConfirmEvent.id}/`);
      setEvents(prev => prev.filter(e => e.id !== deleteConfirmEvent.id));
      showSuccessToast("Success", "Event deleted successfully");
      setDeleteConfirmEvent(null);
    } catch (error) {
      console.error("Failed to delete event:", error);
      showErrorToast("Error", "Failed to delete event");
    }
  };

  // User selection handler
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSearchQuery(user.email);
    setShowDropdown(false);
  };

  // Promote/Demote handlers
  const handlePromote = async () => {
    if (!selectedUser) return;

    try {
      setIsUpdatingAdmin(true);
      const result = await promoteUser(selectedUser.email);
      showSuccessToast("Success", result.message);
      setSelectedUser({ ...selectedUser, is_admin: true });
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to promote user";
      showErrorToast("Error", errorMsg);
    } finally {
      setIsUpdatingAdmin(false);
    }
  };

  const handleDemote = async () => {
    if (!selectedUser) return;

    try {
      setIsUpdatingAdmin(true);
      const result = await demoteUser(selectedUser.email);
      showSuccessToast("Success", result.message);
      setSelectedUser({ ...selectedUser, is_admin: false });
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to demote user";
      showErrorToast("Error", errorMsg);
    } finally {
      setIsUpdatingAdmin(false);
    }
  };

  const clearUserSelection = () => {
    setSelectedUser(null);
    setSearchQuery("");
    setUsers([]);
    setShowDropdown(false);
  };

  return (
    <VStack align="stretch" gap={8}>
      {/* Event Management Section */}
      <VStack align="stretch" gap={4}>
        <HStack justify="space-between" align="center">
          <Heading size="lg" color="forge.gold.400">
            Event Management
          </Heading>
          <Button
            onClick={() => setShowCreateModal(true)}
            {...primaryButtonStyles}
          >
            Create New Event
          </Button>
        </HStack>

        {/* Event List */}
        {loadingEvents ? (
          <Center py={4}>
            <Spinner size="md" color="forge.gold.400" />
          </Center>
        ) : events.length === 0 ? (
          <Text color="text.muted">No events created yet</Text>
        ) : (
          <VStack align="stretch" gap={3}>
            {events.map((event) => (
              <BaseCard key={event.id}>
                <HStack justify="space-between" align="flex-start">
                  <VStack align="start" gap={1} flex={1}>
                    <Text fontWeight="bold" color="text.primary">
                      {event.title}
                    </Text>
                    <Text fontSize="sm" color="text.muted">
                      {event.day} | {event.start_time} - {event.end_time}
                    </Text>
                    <Text fontSize="sm" color="text.muted">
                      {event.location}
                    </Text>
                  </VStack>
                  <HStack gap={2}>
                    <Button
                      size="sm"
                      onClick={() => handleEditClick(event)}
                      {...outlineButtonStyles}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      borderColor="forge.red.500"
                      color="forge.red.400"
                      _hover={{ bg: "forge.red.900", borderColor: "forge.red.400" }}
                      onClick={() => setDeleteConfirmEvent(event)}
                    >
                      Delete
                    </Button>
                  </HStack>
                </HStack>
              </BaseCard>
            ))}
          </VStack>
        )}
      </VStack>

      <Separator borderColor="forge.stone.700" />

      {/* User Promotion Section */}
      <VStack align="stretch" gap={4}>
        <Heading size="lg" color="forge.gold.400">
          Admin Management
        </Heading>
        <Text color="text.secondary" fontSize="sm">
          Search for a user to promote or demote their admin status.
        </Text>

        {/* User Search */}
        <Box position="relative">
          <HStack gap={4}>
            <Field.Root flex={1}>
              <Input
                type="text"
                placeholder="Search by email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedUser(null);
                }}
                autoComplete="off"
                {...inputStyles}
              />
            </Field.Root>
            {selectedUser && (
              <Button
                onClick={clearUserSelection}
                {...outlineButtonStyles}
                size="sm"
              >
                Clear
              </Button>
            )}
          </HStack>

          {/* Search Dropdown */}
          {showDropdown && (
            <Box
              position="absolute"
              top="100%"
              left={0}
              right={0}
              mt={1}
              bg="bg.secondary"
              borderWidth="1px"
              borderColor="border.default"
              borderRadius="md"
              maxH="200px"
              overflowY="auto"
              zIndex={10}
              boxShadow="lg"
            >
              {isSearching ? (
                <Center py={3}>
                  <Spinner size="sm" color="forge.gold.400" />
                </Center>
              ) : users.length === 0 ? (
                <Text color="text.muted" p={3} fontSize="sm">
                  No users found
                </Text>
              ) : (
                users.map((user) => (
                  <Box
                    key={user.email}
                    p={3}
                    cursor="pointer"
                    _hover={{ bg: "bg.tertiary" }}
                    onClick={() => handleSelectUser(user)}
                    borderBottomWidth="1px"
                    borderColor="border.default"
                    _last={{ borderBottomWidth: 0 }}
                  >
                    <HStack justify="space-between">
                      <VStack align="start" gap={0}>
                        <Text color="text.primary" fontSize="sm">
                          {user.email}
                        </Text>
                        <Text color="text.muted" fontSize="xs">
                          {user.full_name}
                        </Text>
                      </VStack>
                      <HStack gap={1}>
                        {user.is_superuser && (
                          <Badge colorPalette="purple" size="sm">
                            Superuser
                          </Badge>
                        )}
                        {user.is_admin && !user.is_superuser && (
                          <Badge colorPalette="yellow" size="sm">
                            Admin
                          </Badge>
                        )}
                      </HStack>
                    </HStack>
                  </Box>
                ))
              )}
            </Box>
          )}
        </Box>

        {/* Selected User Actions */}
        {selectedUser && (
          <BaseCard>
            <HStack justify="space-between" align="center">
              <VStack align="start" gap={1}>
                <HStack gap={2}>
                  <Text color="text.primary" fontWeight="bold">
                    {selectedUser.email}
                  </Text>
                  {selectedUser.is_superuser && (
                    <Badge colorPalette="purple" size="sm">
                      Superuser
                    </Badge>
                  )}
                  {selectedUser.is_admin && !selectedUser.is_superuser && (
                    <Badge colorPalette="yellow" size="sm">
                      Admin
                    </Badge>
                  )}
                </HStack>
                <Text color="text.muted" fontSize="sm">
                  {selectedUser.full_name}
                </Text>
              </VStack>
              <HStack gap={2}>
                {selectedUser.is_superuser ? (
                  <Text color="text.muted" fontSize="sm">
                    Cannot modify superuser
                  </Text>
                ) : selectedUser.is_admin ? (
                  <Button
                    onClick={handleDemote}
                    disabled={isUpdatingAdmin}
                    variant="outline"
                    borderColor="forge.red.500"
                    color="forge.red.400"
                    _hover={{ bg: "forge.red.900", borderColor: "forge.red.400" }}
                  >
                    {isUpdatingAdmin ? "Demoting..." : "Demote"}
                  </Button>
                ) : (
                  <Button
                    onClick={handlePromote}
                    disabled={isUpdatingAdmin}
                    {...primaryButtonStyles}
                  >
                    {isUpdatingAdmin ? "Promoting..." : "Promote"}
                  </Button>
                )}
              </HStack>
            </HStack>
          </BaseCard>
        )}
      </VStack>

      {/* Create Event Modal */}
      <CreateEventModal
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
        handleSave={handleCreateEvent}
      />

      {/* Edit Event Modal */}
      <EditEventModal
        show={showEditModal}
        handleClose={() => {
          setShowEditModal(false);
          setEditingEvent(null);
        }}
        handleUpdate={handleUpdateEvent}
        event={editingEvent}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog.Root
        open={!!deleteConfirmEvent}
        onOpenChange={(e) => {
          if (!e.open) setDeleteConfirmEvent(null);
        }}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            maxW="md"
            bg="bg.secondary"
            borderColor="border.accent"
            borderWidth="2px"
          >
            <Dialog.Header>
              <Dialog.Title color="text.primary">Confirm Delete</Dialog.Title>
              <Dialog.CloseTrigger color="text.secondary" />
            </Dialog.Header>

            <Dialog.Body>
              <Text color="text.secondary">
                Are you sure you want to delete "{deleteConfirmEvent?.title}"?
                This action cannot be undone.
              </Text>
            </Dialog.Body>

            <Dialog.Footer>
              <HStack gap={3}>
                <Button
                  onClick={() => setDeleteConfirmEvent(null)}
                  {...outlineButtonStyles}
                >
                  Cancel
                </Button>
                <Button
                  bg="forge.red.700"
                  color="white"
                  _hover={{ bg: "forge.red.600" }}
                  onClick={handleDeleteConfirm}
                >
                  Delete
                </Button>
              </HStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </VStack>
  );
}
