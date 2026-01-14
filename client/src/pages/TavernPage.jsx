import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Container, VStack, HStack, Text, Button } from "@chakra-ui/react";
import { ScrollText, Beer, Feather, MessageCircle } from "lucide-react";
import Particles from "../components/forum/Particles";
import Breadcrumb from "../components/forum/Breadcrumb";
import CommentCard from "../components/forum/CommentCard";
import CreateCommentModal from "../components/modals/CreateCommentModal";
import ReplyCommentModal from "../components/modals/ReplyCommentModal";
import EditCommentModal from "../components/modals/EditCommentModal";
import DeleteCommentModal from "../components/modals/DeleteCommentModal";
import { MotionBox } from "../components/Motion";
import { staggerContainer, staggerItem, fadeInUp } from "../components/animations/fffAnimations";
import { addReply, updateRecursive, deleteRecursive, useEventComments} from "../components/forum/ForumHelpers";

// Sample general discussion comments
const tavernComments = [
  {
    id: 101,
    author: "DungeonMaster_Mike",
    authorId: 101,
    isAdmin: true,
    time: "1 day ago",
    text: "Welcome to The Tavern! This is the place for general questions, announcements, and chatting with fellow FalCON attendees. Feel free to introduce yourself!",
    likes: [102, 103, 104, 105],
    replies: [],
  },
  {
    id: 102,
    author: "NewAdventurer_Sam",
    authorId: 110,
    isAdmin: false,
    time: "12 hours ago",
    text: "Hey everyone! First time at FalCON and super excited. Anyone else coming from the NYC area? Maybe we can carpool!",
    likes: [101, 103],
    replies: [
      {
        id: 103,
        author: "VeteranPaladin",
        authorId: 105,
        isAdmin: false,
        time: "10 hours ago",
        text: "Welcome! I'm actually driving up from Jersey. DM me if you want to coordinate!",
        likes: [110],
        replies: [],
      },
    ],
  },
];

/**
 * The Tavern - General Discussion Page
 */
export default function TavernPage() {
  const { year } = useParams();

  const wsRef = useRef()
  const EC = useEventComments()
  
  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  
  // Mock current user
  const currentUserId = 110;

  const [comments, setComments] = useState([])

  useEffect(() => {
    const socket = new WebSocket(
      `ws://localhost:8001/ws/comments/general/${year}/`
    );
    wsRef.current = socket;

    socket.onmessage = (e) => {
      const { type, comment } = JSON.parse(e.data);

      setComments((prev) => {
        switch (type) {
          case "new_comment":
            return comment.parent
              ? addReply(prev, comment.parent, comment)
              : [...prev, comment];

          case "update_comment":
            return updateRecursive(prev, comment);

          case "delete_comment":
            return deleteRecursive(prev, comment.id);

          default:
            return prev;
        }
      });
    };

    return () => socket.close();
  }, [year]);

  const handleReply = (comment) => {
    setSelectedComment(comment);
    setShowReplyModal(true);
  };

  const handleEdit = (comment) => {
    setSelectedComment(comment);
    setShowEditModal(true);
  };

  const handleDelete = (commentId) => {
    setSelectedComment({ id: commentId });
    setShowDeleteModal(true);
  };

  return (
    <Box minH="100vh" bg="forge.stone.900" position="relative">
      <Particles count={25} />

      <Container maxW="container.lg" py={10} position="relative" zIndex={1}>
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Quest Board", to: "/forum", icon: ScrollText },
            { label: `FalCON ${year}`, to: `/forum/convention/${year}` },
            { label: "The Tavern" },
          ]}
        />

        {/* Tavern Header */}
        <MotionBox {...fadeInUp} mb={8}>
          <Box
            bg="linear-gradient(135deg, #4a1111 0%, #0d0a08 100%)"
            border="2px solid"
            borderColor="forge.red.700"
            borderRadius="xl"
            p={7}
            position="relative"
            overflow="hidden"
          >
            {/* Top Accent */}
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              h="3px"
              bg="linear-gradient(90deg, #f59e0b, #ff6b35, #f59e0b)"
            />

            <HStack gap={5}>
              <Box
                w={16}
                h={16}
                bg="forge.red.700"
                borderRadius="xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="forge.gold.400"
              >
                <Beer size={32} />
              </Box>

              <VStack align="start" gap={1}>
                <Text
                  fontFamily="heading"
                  fontSize="2xl"
                  color="forge.tan.100"
                >
                  The Tavern
                </Text>
                <Text color="forge.tan.400" fontSize="sm">
                  General discussion, questions & announcements for FalCON {year}
                </Text>
              </VStack>
            </HStack>
          </Box>
        </MotionBox>

        {/* Comments Section Header */}
        <HStack justify="space-between" mb={6}>
          <HStack gap={2}>
            <MessageCircle size={20} color="var(--chakra-colors-forge-gold-400)" />
            <Text fontFamily="heading" fontSize="lg" color="forge.tan.100">
              Discussions
            </Text>
            <Text fontSize="sm" color="forge.tan.500">
              ({tavernComments.length})
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
              <Text>Start Discussion</Text>
            </HStack>
          </Button>
        </HStack>

        {/* Comments */}
        <MotionBox
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <VStack align="stretch" gap={4}>
            {tavernComments.map((comment) => (
              <MotionBox key={comment.id} variants={staggerItem}>
                <CommentCard
                  comment={comment}
                  currentUserId={currentUserId}
                  onReply={handleReply}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onLike={EC.like}
                />
              </MotionBox>
            ))}
          </VStack>
        </MotionBox>
      </Container>

      {/* Modals */}
      <CreateCommentModal
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
        handleSave={EC.create}
      />

      <ReplyCommentModal
        show={showReplyModal}
        handleClose={() => {
          setShowReplyModal(false);
          setSelectedComment(null);
        }}
        handleSave={EC.reply}
        parentComment={selectedComment}
      />

      <EditCommentModal
        show={showEditModal}
        handleClose={() => {
          setShowEditModal(false);
          setSelectedComment(null);
        }}
        handleSave={EC.edit}
        comment={selectedComment}
      />

      <DeleteCommentModal
        show={showDeleteModal}
        handleClose={() => {
          setShowDeleteModal(false);
          setSelectedComment(null);
        }}
        handleDelete={EC.remove}
        commentId={selectedComment?.id}
      />
    </Box>
  );
}
