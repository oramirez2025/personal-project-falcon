import { Box } from "@chakra-ui/react";

/**
 * VideoAnimations
 * - Plays a video in the background
 * - Optional dark overlay for readability
 * - Content inside the parent container automatically appears above
 */
export default function VideoAnimations({ src, overlay = true }) {
  return (
    <Box position="fixed" inset={0} overflow="hidden" zIndex={0}>
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* Optional dark overlay */}
      {overlay && (
        <Box
          position="absolute"
          top={0}
          left={0}
          w="100%"
          h="100%"
          bg="blackAlpha.500"
        />
      )}
    </Box>
  );
}

