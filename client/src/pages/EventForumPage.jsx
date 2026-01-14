import { useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Container, VStack, HStack, Text, Button } from "@chakra-ui/react";
import { ScrollText, Feather, MessageCircle } from "lucide-react";
import Particles from "../components/forum/Particles";
import Breadcrumb from "../components/forum/Breadcrumb";
import ForumEventBanner from "../components/cards/ForumEventBanner";
import CommentCard from "../components/forum/CommentCard";
import CreateCommentModal from "../components/modals/CreateCommentModal";
import ReplyCommentModal from "../components/modals/ReplyCommentModal";
import EditCommentModal from "../components/modals/EditCommentModal";
import DeleteCommentModal from "../components/modals/DeleteCommentModal";
import { MotionBox } from "../components/Motion";
import { staggerContainer, staggerItem } from "../components/animations/fffAnimations";

// Sample data - replace with API calls
import { getEventById, sampleComments } from "../data/sampleForumData";

/**
 * Event Forum Page
 * Shows event info banner and comment thread
 */
export default function EventForumPage() {
  const { eventId } = useParams();
  
  // Get event data
  const event = getEventById(eventId);
  
  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Selected comment for actions
  const [selectedComment, setSelectedComment] = useState(null);
  
  // Mock current user (replace with auth context)
  const currentUserId = 104; // ElfWizard_Luna for testing

  // Comment handlers
  const handleCreateComment = (data) => {
    console.log("Create comment:", data);
    // API call to create comment
  };

  const handleReply = (comment) => {
    setSelectedComment(comment);
    setShowReplyModal(true);
  };

  const handleReplySubmit = (data) => {
    console.log("Reply to:", selectedComment?.id, data);
    // API call to create reply
  };

  const handleEdit = (comment) => {
    setSelectedComment(comment);
    setShowEditModal(true);
  };

  const handleEditSubmit = (data) => {
    console.log("Edit comment:", data);
    // API call to update comment
  };

  const handleDelete = (commentId) => {
    setSelectedComment({ id: commentId });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = (commentId) => {
    console.log("Delete comment:", commentId);
    // API call to delete comment
  };

  const handleLike = (commentId) => {
    console.log("Like comment:", commentId);
    // API call to toggle like
  };

  if (!event) {
    return (
      <Box minH="100vh" bg="forge.stone.900" py={20}>
        <Container maxW="container.lg">
          <Text color="forge.tan.100" textAlign="center">
            Event not found
          </Text>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="forge.stone.900" position="relative">
      {/* Floating Particles */}
      <Particles count={25} />

      <Container maxW="container.lg" py={10} position="relative" zIndex={1}>
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Quest Board", to: "/forum", icon: ScrollText },
            { label: `FalCON ${event.conventionYear}`, to: `/forum/convention/${event.conventionYear}` },
            { label: event.title },
          ]}
        />

        {/* Event Banner */}
        <ForumEventBanner
          title={event.title}
          day={event.day}
          start_time={event.start_time}
          end_time={event.end_time}
          location={event.location}
          description={event.description}
        />

        {/* Comments Section Header */}
        <HStack justify="space-between" mb={6}>
          <HStack gap={2}>
            <MessageCircle size={20} color="var(--chakra-colors-forge-gold-400)" />
            <Text
              fontFamily="heading"
              fontSize="lg"
              color="forge.tan.100"
            >
              Discussion
            </Text>
            <Text
              fontSize="sm"
              color="forge.tan.500"
            >
              ({sampleComments.length} comments)
            </Text>
          </HStack>

          <Button
            size="sm"
            fontFamily="heading"
            fontSize="sm"
            bg="linear-gradient(180deg, #7a1f1f 0%, #4a1111 100%)"
            border="1px solid"
            borderColor="forge.gold.600"
            color="forge.tan.100"
            _hover={{
              bg: "linear-gradient(180deg, #b45309 0%, #b45309 100%)",
              boxShadow: "0 0 20px rgba(245, 158, 11, 0.3)",
            }}
            onClick={() => setShowCreateModal(true)}
          >
            <HStack gap={2}>
              <Feather size={14} />
              <Text>Add Comment</Text>
            </HStack>
          </Button>
        </HStack>

        {/* Comments List */}
        <MotionBox
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <VStack align="stretch" gap={4}>
            {sampleComments.map((comment) => (
              <MotionBox key={comment.id} variants={staggerItem}>
                <CommentCard
                  comment={comment}
                  currentUserId={currentUserId}
                  onReply={handleReply}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onLike={handleLike}
                />
              </MotionBox>
            ))}
          </VStack>
        </MotionBox>

        {/* Empty State */}
        {sampleComments.length === 0 && (
          <Box
            bg="forge.stone.800"
            border="1px solid"
            borderColor="forge.stone.700"
            borderRadius="lg"
            py={12}
            textAlign="center"
          >
            <MessageCircle 
              size={48} 
              color="var(--chakra-colors-forge-stone-600)" 
              style={{ margin: "0 auto 16px" }}
            />
            <Text color="forge.tan.400" mb={2}>
              No comments yet
            </Text>
            <Text color="forge.tan.500" fontSize="sm">
              Be the first to share your thoughts!
            </Text>
          </Box>
        )}
      </Container>

      {/* Modals */}
      <CreateCommentModal
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
        handleSave={handleCreateComment}
      />

      <ReplyCommentModal
        show={showReplyModal}
        handleClose={() => {
          setShowReplyModal(false);
          setSelectedComment(null);
        }}
        handleSave={handleReplySubmit}
        parentComment={selectedComment}
      />

      <EditCommentModal
        show={showEditModal}
        handleClose={() => {
          setShowEditModal(false);
          setSelectedComment(null);
        }}
        handleSave={handleEditSubmit}
        comment={selectedComment}
      />

      <DeleteCommentModal
        show={showDeleteModal}
        handleClose={() => {
          setShowDeleteModal(false);
          setSelectedComment(null);
        }}
        handleDelete={handleDeleteConfirm}
        commentId={selectedComment?.id}
      />
    </Box>
  );
}
