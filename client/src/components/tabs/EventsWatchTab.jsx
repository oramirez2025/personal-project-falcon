import { useState, useEffect } from "react";
import {
  VStack,
  HStack,
  Text,
  Spinner,
  Center,
  Box
} from "@chakra-ui/react";
import { Checkbox } from "@chakra-ui/react";
import BaseCard from "../cards/BaseCard";
import { addToWishlist, removeFromWishlist } from "../../utilities";
import { showSuccessToast } from "../ui/showSuccessToast";
import { showErrorToast } from "../ui/showErrorToast";
import { api } from "../../utilities";

export default function EventsWatchTab({ userWishlists, isActive }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistedIds, setWishlistedIds] = useState(new Set());

  // Initialize wishlisted IDs from user profile data
  useEffect(() => {
    if (userWishlists) {
      const ids = new Set(userWishlists.map(w => w.event.id));
      setWishlistedIds(ids);
    }
  }, [userWishlists]);

  // Fetch all events (on mount and when tab becomes active)
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const response = await api.get("event/");
        setEvents(response.data);
      } catch (error) {
        console.error("Failed to load events:", error);
        showErrorToast("Error", "Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    if (isActive) {
      loadEvents();
    }
  }, [isActive]);

  const handleToggleWishlist = async (eventId, isCurrentlyWishlisted) => {
    try {
      if (isCurrentlyWishlisted) {
        await removeFromWishlist(eventId);
        setWishlistedIds(prev => {
          const next = new Set(prev);
          next.delete(eventId);
          return next;
        });
        showSuccessToast("Removed", "Event removed from watchlist");
      } else {
        await addToWishlist(eventId);
        setWishlistedIds(prev => new Set(prev).add(eventId));
        showSuccessToast("Added", "Event added to watchlist");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error ||
                       error.response?.data?.message ||
                       error.message ||
                       "Failed to update watchlist";
      showErrorToast("Error", errorMsg);
    }
  };

  if (loading) {
    return (
      <Center py={8}>
        <Spinner size="lg" color="forge.gold.400" />
      </Center>
    );
  }

  return (
    <VStack align="stretch" gap={4}>
      {events.length === 0 ? (
        <Text color="gray.400">No scheduled events</Text>
      ) : (
        events.map(event => {
          const isWishlisted = wishlistedIds.has(event.id);
          return (
            <BaseCard
              key={event.id}
              borderColor={isWishlisted ? "forge.gold.500" : "transparent"}
              borderWidth="2px"
            >
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
                <Checkbox.Root
                  checked={isWishlisted}
                  onCheckedChange={() => handleToggleWishlist(event.id, isWishlisted)}
                  colorPalette="yellow"
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control
                    borderColor="forge.gold.500"
                    _checked={{ bg: "forge.gold.500", borderColor: "forge.gold.500" }}
                  >
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                  <Checkbox.Label color="text.secondary">
                    Watch
                  </Checkbox.Label>
                </Checkbox.Root>
              </HStack>
            </BaseCard>
          );
        })
      )}
    </VStack>
  );
}