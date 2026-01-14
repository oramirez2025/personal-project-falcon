import { VStack, HStack, Text, Button, Input, Box, Heading, Textarea, Separator } from "@chakra-ui/react";
import { Field } from "@chakra-ui/react";
import BaseCard from "./BaseCard";
import { useRef, useState, useEffect } from "react";
import { showSuccessToast } from "../ui/showSuccessToast";
import { showErrorToast } from "../ui/showErrorToast";
import { updateUserProfile } from "../../utilities";
import { inputStyles, primaryButtonStyles, outlineButtonStyles } from "../../theme";

export default function ProfileCard({ user, profilePicUrl, onProfilePicChange, onProfileUpdate, isUploading }) {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setPhoneNumber(user.phone_number || "");
      setBio(user.bio || "");
    }
  }, [user]);

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

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const updatedProfile = await updateUserProfile({
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        bio: bio,
      });

      if (onProfileUpdate) {
        onProfileUpdate(updatedProfile);
      }

      showSuccessToast("Success", "Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to update profile";
      showErrorToast("Error", errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset form to original values
    setFirstName(user?.first_name || "");
    setLastName(user?.last_name || "");
    setPhoneNumber(user?.phone_number || "");
    setBio(user?.bio || "");
    setIsEditing(false);
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
      <VStack gap={4} align="stretch">
        {/* Profile Picture */}
        <VStack gap={2}>
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
            mx="auto"
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
            size="sm"
            {...outlineButtonStyles}
          >
            {isUploading ? "Uploading..." : "Change Photo"}
          </Button>
        </VStack>

        <Separator borderColor="forge.stone.700" />

        {/* Profile Info */}
        {isEditing ? (
          // Edit Mode
          <VStack gap={3} align="stretch">
            <HStack gap={2}>
              <Field.Root flex={1}>
                <Field.Label color="text.muted" fontSize="xs">First Name</Field.Label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  size="sm"
                  {...inputStyles}
                />
              </Field.Root>
              <Field.Root flex={1}>
                <Field.Label color="text.muted" fontSize="xs">Last Name</Field.Label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  size="sm"
                  {...inputStyles}
                />
              </Field.Root>
            </HStack>

            <Field.Root>
              <Field.Label color="text.muted" fontSize="xs">Email (cannot be changed)</Field.Label>
              <Input
                value={user?.email || ""}
                disabled
                size="sm"
                bg="forge.stone.800"
                color="text.muted"
                borderColor="forge.stone.700"
              />
            </Field.Root>

            <Field.Root>
              <Field.Label color="text.muted" fontSize="xs">Phone Number</Field.Label>
              <Input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone number"
                size="sm"
                {...inputStyles}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label color="text.muted" fontSize="xs">Bio</Field.Label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={3}
                size="sm"
                {...inputStyles}
              />
            </Field.Root>

            <HStack gap={2} mt={2}>
              <Button
                onClick={handleCancelEdit}
                flex={1}
                size="sm"
                {...outlineButtonStyles}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveProfile}
                disabled={isSaving}
                flex={1}
                size="sm"
                {...primaryButtonStyles}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </HStack>
          </VStack>
        ) : (
          // View Mode
          <VStack gap={3} align="stretch">
            <VStack gap={0} align="center">
              <Heading size="md" color="forge.gold.400">
                {user?.full_name || "User"}
              </Heading>
              <Text color="text.muted" fontSize="sm">
                {user?.email}
              </Text>
            </VStack>

            {user?.phone_number && (
              <HStack justify="space-between">
                <Text color="text.muted" fontSize="sm">Phone</Text>
                <Text color="text.primary" fontSize="sm">{user.phone_number}</Text>
              </HStack>
            )}

            {user?.bio && (
              <VStack align="stretch" gap={1}>
                <Text color="text.muted" fontSize="sm">Bio</Text>
                <Text color="text.secondary" fontSize="sm">{user.bio}</Text>
              </VStack>
            )}

            <Button
              onClick={() => setIsEditing(true)}
              mt={2}
              {...primaryButtonStyles}
              w="full"
            >
              Edit Profile
            </Button>
          </VStack>
        )}
      </VStack>
    </BaseCard>
  );
}
