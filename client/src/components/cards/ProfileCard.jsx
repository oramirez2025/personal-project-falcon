import { VStack, Text, Button, Input, Box, Heading } from "@chakra-ui/react";
import BaseCard from "./BaseCard";
import { useRef, useState } from "react";
import { showSuccessToast } from "../ui/showSuccessToast";
import { showErrorToast } from "../ui/showErrorToast";

export default function ProfileCard({ user, profilePicUrl, onProfilePicChange, isUploading }) {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation - file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      showErrorToast("Invalid File", "Please upload a JPG, PNG, or GIF image");
      return;
    }

    // Validation - file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showErrorToast("File Too Large", "Please upload an image smaller than 5MB");
      return;
    }

    // Preview image
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);

    // Upload
    onProfilePicChange(file);
  };

  // Get user initials for fallback
  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    if (user?.full_name) {
      const parts = user.full_name.split(' ');
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return parts[0][0].toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  // Handle profile picture URL (prepend base URL if relative path)
  const getImageUrl = () => {
    if (previewUrl) return previewUrl;
    if (!profilePicUrl) return null;

    // If it's already a full URL, use it as is
    if (profilePicUrl.startsWith('http')) {
      return profilePicUrl;
    }

    // If it's a relative path, prepend the backend URL
    return `http://127.0.0.1:8000${profilePicUrl}`;
  };

  const imageUrl = getImageUrl();

  return (
    <BaseCard hoverable={false}>
      <VStack gap={4}>
        {/* Profile Picture or Initials */}
        <Box
          w="120px"
          h="120px"
          borderRadius="full"
          overflow="hidden"
          bg="forge.stone.600"
          display="flex"
          alignItems="center"
          justifyContent="center"
          border="3px solid"
          borderColor="forge.gold.400"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Profile"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <Text fontSize="3xl" fontWeight="bold" color="forge.gold.400">
              {getInitials()}
            </Text>
          )}
        </Box>

        <Heading size="md" color="forge.gold.400">
          {user?.full_name || "User"}
        </Heading>
        <Text color="gray.300" fontSize="sm">
          {user?.email}
        </Text>

        <Input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif"
          display="none"
          ref={fileInputRef}
          onChange={handleFileSelect}
        />

        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          bg="red.700"
          _hover={{ bg: "red.600" }}
          color="white"
          w="full"
          mt={2}
        >
          {isUploading ? "Uploading..." : "Upload Photo"}
        </Button>
      </VStack>
    </BaseCard>
  );
}
