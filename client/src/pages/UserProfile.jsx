import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  GridItem,
  VStack,
  Heading,
  Spinner,
  Text,
  Center,
  Tabs
} from "@chakra-ui/react";
import { useOutletContext } from "react-router-dom";
import ProfileCard from "../components/cards/ProfileCard";
import MyTicketsTab from "../components/tabs/MyTicketsTab";
import EventsWatchTab from "../components/tabs/EventsWatchTab";
import AdminTab from "../components/tabs/AdminTab";
import { fetchUserProfile, fetchUserTickets, uploadProfilePicture } from "../utilities";
import { showSuccessToast } from "../components/ui/showSuccessToast";
import { showErrorToast } from "../components/ui/showErrorToast";

export default function UserProfile() {
  const [profileData, setProfileData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("tickets");
  const { user } = useOutletContext();

  // Fetch data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Fetch profile and tickets in parallel
        const [profileResponse, ticketsResponse] = await Promise.all([
          fetchUserProfile(),
          fetchUserTickets()
        ]);

        setProfileData(profileResponse);
        setOrders(ticketsResponse || []);
      } catch (error) {
        console.error("Failed to load profile data:", error);
        showErrorToast(
          "Load Failed",
          error.response?.data?.error || "Failed to load profile data"
        );
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  // Handle profile picture upload
  const handleProfilePicUpload = async (file) => {
    try {
      setUploading(true);
      const updatedProfile = await uploadProfilePicture(file);

      setProfileData(updatedProfile);
      showSuccessToast("Success", "Profile picture updated successfully");
    } catch (error) {
      console.error("Failed to upload profile picture:", error);
      showErrorToast(
        "Upload Failed",
        error.response?.data?.error || error.response?.data?.profile_pic?.[0] || "Failed to upload profile picture"
      );
    } finally {
      setUploading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Center minH="50vh">
        <VStack gap={4}>
          <Spinner size="xl" color="forge.gold.400" />
          <Text color="gray.400">Loading profile...</Text>
        </VStack>
      </Center>
    );
  }

  // Error state
  if (!profileData) {
    return (
      <Center minH="50vh">
        <VStack gap={4}>
          <Text color="forge.red.400" fontSize="xl">
            Error loading profile
          </Text>
          <Text color="gray.400">Please try refreshing the page</Text>
        </VStack>
      </Center>
    );
  }

  // Filter orders by year
  const currentYear = new Date().getFullYear();
  const activeOrders = orders.filter(order => {
    const orderYear = new Date(order.created_at).getFullYear();
    return orderYear === currentYear;
  });
  const historyOrders = orders.filter(order => {
    const orderYear = new Date(order.created_at).getFullYear();
    return orderYear < currentYear;
  });

  // Check if user is admin
  const isAdmin = profileData?.is_admin === true;

  // Main content
  return (
    <Box
      position="relative"
      left="50%"
      right="50%"
      ml="-50vw"
      mr="-50vw"
      w="100vw"
      minH="100vh"
    >
      <Grid
        templateColumns={{ base: "1fr", lg: "1fr 400px" }}
        gap={0}
      >
        {/* LEFT COLUMN - Tabs */}
        <GridItem p={{ base: 4, md: 6 }} pl={{ base: 4, md: 8, lg: 12 }} pr={{ base: 4, lg: 8 }}>
          <VStack align="stretch" gap={6}>
            <Heading size="xl" color="white">
              My Profile
            </Heading>

            <Tabs.Root
              value={activeTab}
              onValueChange={(e) => setActiveTab(e.value)}
              variant="line"
            >
              {/* Tab List */}
              <Tabs.List
                borderBottomColor="forge.stone.700"
                mb={6}
              >
                <Tabs.Trigger
                  value="tickets"
                  color="text.secondary"
                  _selected={{
                    color: "forge.gold.400",
                    borderBottomColor: "forge.gold.400",
                    borderBottomWidth: "2px"
                  }}
                  _hover={{ color: "forge.gold.300" }}
                  fontWeight="medium"
                  pb={3}
                >
                  My Tickets
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="events"
                  color="text.secondary"
                  _selected={{
                    color: "forge.gold.400",
                    borderBottomColor: "forge.gold.400",
                    borderBottomWidth: "2px"
                  }}
                  _hover={{ color: "forge.gold.300" }}
                  fontWeight="medium"
                  pb={3}
                >
                  Events Watch
                </Tabs.Trigger>
                {isAdmin && (
                  <Tabs.Trigger
                    value="admin"
                    color="text.secondary"
                    _selected={{
                      color: "forge.gold.400",
                      borderBottomColor: "forge.gold.400",
                      borderBottomWidth: "2px"
                    }}
                    _hover={{ color: "forge.gold.300" }}
                    fontWeight="medium"
                    pb={3}
                  >
                    Admin
                  </Tabs.Trigger>
                )}
              </Tabs.List>

              {/* Tab Content */}
              <Tabs.Content value="tickets">
                <MyTicketsTab
                  activeOrders={activeOrders}
                  historyOrders={historyOrders}
                />
              </Tabs.Content>

              <Tabs.Content value="events">
                <EventsWatchTab
                  userWishlists={profileData?.event_wishlists || []}
                  isActive={activeTab === "events"}
                />
              </Tabs.Content>

              {isAdmin && (
                <Tabs.Content value="admin">
                  <AdminTab isActive={activeTab === "admin"} />
                </Tabs.Content>
              )}
            </Tabs.Root>
          </VStack>
        </GridItem>

        {/* RIGHT COLUMN - Profile Sidebar */}
        <GridItem
          bg="whiteAlpha.50"
          borderLeft={{ base: "none", lg: "1px solid" }}
          borderColor="whiteAlpha.200"
          p={{ base: 4, md: 6 }}
          position={{ base: "relative", lg: "sticky" }}
          top="0"
          height={{ base: "auto", lg: "100vh" }}
          overflowY="auto"
        >
          <ProfileCard
            user={profileData}
            profilePicUrl={profileData.profile_pic}
            onProfilePicChange={handleProfilePicUpload}
            onProfileUpdate={setProfileData}
            isUploading={uploading}
          />
        </GridItem>
      </Grid>
    </Box>
  );
}
