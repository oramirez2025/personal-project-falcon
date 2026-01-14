import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Box, Flex, Text, Image, VStack, HStack } from '@chakra-ui/react'
import { Drawer } from '@chakra-ui/react'
import { 
  BookOpen, 
  Ticket, 
  Scroll, 
  User, 
  LogIn, 
  UserPlus, 
  MessagesSquare,
  ExternalLink as ExternalLinkIcon,
  Menu,
  X
} from 'lucide-react'
import { motion } from 'framer-motion'
import { userLogOut } from '../utilities'
import logo from '../assets/FFF_Symbol_128.png'
import { showErrorToast } from './ui/showErrorToast'
import { showSuccessToast } from './ui/showSuccessToast'

// ============================================
// GRIMOIRE COLOR PALETTE
// TODO: Move to theme.js as forge.grimoire tokens
// ============================================
const grimoire = {
  leather: {
    dark: '#0d0a08',
    base: '#1a1410',
    light: '#2a1f15',
  },
  border: {
    dark: '#3d2a1a',
    base: '#5c4a3a',
    light: '#8b7355',
  },
  text: {
    primary: '#d4a574',
    secondary: '#9b8775',
    muted: '#6b5a4a',
  },
  glow: {
    gold: '#f59e0b',
    ember: '#fbbf24',
  },
}

// ============================================
// GRIMOIRE ANIMATIONS
// TODO: Move to fffAnimations.js
// ============================================
const particleFloat = {
  animate: (i) => ({
    y: [0, -30, 0],
    opacity: [0.4, 0.9, 0.4],
    scale: [1, 1.3, 1],
  }),
  transition: (i) => ({
    duration: 3 + Math.random() * 4,
    repeat: Infinity,
    ease: "easeInOut",
    delay: i * 0.2,
  }),
}

const glowPulse = {
  animate: {
    filter: [
      'drop-shadow(0 0 4px rgba(251, 191, 36, 0.4))',
      'drop-shadow(0 0 14px rgba(251, 191, 36, 0.9))',
      'drop-shadow(0 0 4px rgba(251, 191, 36, 0.4))',
    ],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  },
}

const runeGlow = {
  animate: {
    textShadow: [
      '0 0 4px rgba(251, 191, 36, 0.3)',
      '0 0 14px rgba(251, 191, 36, 0.8)',
      '0 0 4px rgba(251, 191, 36, 0.3)',
    ],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  },
}

// ============================================
// PARTICLE COMPONENT
// ============================================
const Particle = ({ index, style }) => (
  <motion.div
    custom={index}
    animate={particleFloat.animate(index)}
    transition={particleFloat.transition(index)}
    style={{
      position: 'absolute',
      width: `${2 + Math.random() * 2}px`,
      height: `${2 + Math.random() * 2}px`,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${grimoire.glow.ember} 0%, ${grimoire.glow.gold} 50%, transparent 100%)`,
      pointerEvents: 'none',
      ...style,
    }}
  />
)

// ============================================
// PARTICLE CONTAINER
// ============================================
const ParticlesContainer = () => {
  const [particles, setParticles] = useState([])
  const initialized = useRef(false)

  useEffect(() => {
    // Generate particles only once
    if (!initialized.current) {
      const newParticles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: `${10 + Math.random() * 80}%`,
        top: `${Math.random() * 100}%`,
      }))
      setParticles(newParticles)
      initialized.current = true
    }
  }, [])

  return (
    <Box position="absolute" inset="0" overflow="hidden" pointerEvents="none">
      {particles.map((p) => (
        <Particle key={p.id} index={p.id} style={{ left: p.left, top: p.top }} />
      ))}
    </Box>
  )
}

// ============================================
// DECORATIVE COMPONENTS
// ============================================
const CornerDecoration = ({ position }) => {
  const styles = {
    topLeft: { top: '8px', left: '8px', borderTop: '2px solid', borderLeft: '2px solid', borderTopLeftRadius: '4px' },
    topRight: { top: '8px', right: '8px', borderTop: '2px solid', borderRight: '2px solid', borderTopRightRadius: '4px' },
    bottomLeft: { bottom: '8px', left: '8px', borderBottom: '2px solid', borderLeft: '2px solid', borderBottomLeftRadius: '4px' },
    bottomRight: { bottom: '8px', right: '8px', borderBottom: '2px solid', borderRight: '2px solid', borderBottomRightRadius: '4px' },
  }

  return (
    <Box
      position="absolute"
      w="24px"
      h="24px"
      borderColor={`${grimoire.border.base}99`}
      pointerEvents="none"
      {...styles[position]}
    />
  )
}

const SectionDivider = ({ label }) => (
  <Flex align="center" gap={2} mb={3} px={2}>
    <Box flex="1" h="1px" bgGradient={`linear(to-r, ${grimoire.border.dark}00, ${grimoire.border.dark})`} />
    <Text
      fontSize="9px"
      color={grimoire.text.muted}
      letterSpacing="3px"
      textTransform="uppercase"
      fontFamily="heading"
    >
      {label}
    </Text>
    <Box flex="1" h="1px" bgGradient={`linear(to-l, ${grimoire.border.dark}00, ${grimoire.border.dark})`} />
  </Flex>
)

const Flourish = () => (
  <Flex justify="center" align="center" gap={1}>
    <Box h="1px" w="40px" bgGradient={`linear(to-r, transparent, ${grimoire.border.dark}90)`} />
    <Box w="6px" h="6px" transform="rotate(45deg)" border="1px solid" borderColor={`${grimoire.border.base}80`} />
    <Box h="1px" w="40px" bgGradient={`linear(to-l, transparent, ${grimoire.border.dark}90)`} />
  </Flex>
)

const BottomDecoration = () => (
  <Flex justify="center" align="center" gap="6px" mt={5}>
    {[0.3, 0.4, 0.6, 0.4, 0.3].map((opacity, i) => (
      <motion.div
        key={i}
        animate={i === 2 ? glowPulse.animate : {}}
        transition={i === 2 ? glowPulse.transition : {}}
      >
        <Box
          w={i === 2 ? '6px' : i === 1 || i === 3 ? '5px' : '4px'}
          h={i === 2 ? '6px' : i === 1 || i === 3 ? '5px' : '4px'}
          borderRadius="full"
          bg={`${grimoire.glow.gold}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`}
        />
      </motion.div>
    ))}
  </Flex>
)

// ============================================
// NAV ITEM COMPONENT
// ============================================
const navIcons = {
  Home: BookOpen,
  Tickets: Ticket,
  FAQ: Scroll,
  'User Profile': User,
  Forum: MessagesSquare
}


const navRunes = {
  Home: '⚔',
  Tickets: '✧',
  FAQ: '◈',
  'User Profile': '☽',
  Forum: 'ᚨ',
}

function GrimoireNavLink({ to, onClick, children }) {
  const Icon = navIcons[children] || BookOpen
  const rune = navRunes[children] || '✦'

  return (
    <NavLink to={to} onClick={onClick} style={{ textDecoration: 'none' }}>
      {({ isActive }) => (
        <Box
          display="flex"
          alignItems="center"
          gap={3}
          p="12px 16px"
          m="2px 0"
          borderRadius="6px"
          position="relative"
          cursor="pointer"
          borderLeft="2px solid"
          borderLeftColor={isActive ? grimoire.glow.gold : 'transparent'}
          bg={isActive 
            ? `linear-gradient(90deg, ${grimoire.glow.gold}30 0%, transparent 100%)`
            : 'transparent'
          }
          transition="all 0.3s ease"
          _hover={{
            bg: `linear-gradient(90deg, ${grimoire.border.dark}40 0%, transparent 100%)`,
          }}
        >
          {/* Rune */}
          <motion.span
            animate={isActive ? runeGlow.animate : {}}
            transition={isActive ? runeGlow.transition : {}}
            style={{
              position: 'absolute',
              right: '12px',
              fontSize: '16px',
              color: grimoire.glow.gold,
              opacity: isActive ? 0.6 : 0.1,
              transition: 'opacity 0.3s ease',
            }}
          >
            {rune}
          </motion.span>

          {/* Icon */}
          <Box
            as={Icon}
            size={18}
            color={isActive ? grimoire.glow.gold : grimoire.border.light}
            style={{
              filter: isActive ? `drop-shadow(0 0 8px ${grimoire.glow.gold}99)` : 'none',
              transition: 'all 0.3s ease',
            }}
          />

          {/* Text */}
          <Text
            fontSize="14px"
            fontFamily="heading"
            color={isActive ? '#f5d4a5' : grimoire.text.secondary}
            textShadow={isActive ? `0 0 12px ${grimoire.glow.gold}66` : 'none'}
            transition="all 0.3s ease"
          >
            {children}
          </Text>
        </Box>
      )}
    </NavLink>
  )
}

// ============================================
// EXTERNAL LINK COMPONENT
// ============================================
function GrimoireExternalLink({ href, children }) {
  return (
    <Box
      as="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      display="flex"
      alignItems="center"
      gap="6px"
      p="8px 16px"
      m="2px 0"
      fontSize="12px"
      color={grimoire.text.muted}
      transition="all 0.3s ease"
      _hover={{
        color: grimoire.text.primary,
        pl: '20px',
      }}
    >
      <Text fontFamily="body">{children}</Text>
      <ExternalLinkIcon size={10} style={{ opacity: 0.5 }} />
    </Box>
  )
}

// ============================================
// MAIN SIDEBAR COMPONENT
// ============================================
export default function Bookbar({ user, setUser }) {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await userLogOut()
      setUser(null)
      navigate("/")
      setIsOpen(false)
      showSuccessToast("Log Out", "Log out successful!")
    } catch (err) {
      showErrorToast("Log Out", err.response?.data.error || "Something went wrong :(")
    }
  }

  const closeSidebar = () => setIsOpen(false)

  return (
    <>
      {/* Bookmark Toggle Button */}
      <Box
        as="button"
        onClick={() => setIsOpen(!isOpen)}
        position="fixed"
        top="100px"
        left={isOpen ? "280px" : "0px"}
        zIndex={1500}
        transition="left 0.35s cubic-bezier(0.4, 0, 0.2, 1)"
        cursor="pointer"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <Box
          w="36px"
          h="80px"
          bg={`linear-gradient(180deg, ${grimoire.leather.light} 0%, ${grimoire.leather.base} 100%)`}
          border="2px solid"
          borderLeft="none"
          borderColor={grimoire.border.base}
          borderRightRadius="8px"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap="6px"
          boxShadow={`4px 0 15px rgba(0,0,0,0.5), inset -4px 0 10px rgba(0,0,0,0.3)`}
          transition="all 0.3s ease"
          _hover={{
            borderColor: grimoire.border.light,
            boxShadow: `4px 0 20px ${grimoire.glow.gold}33, inset -4px 0 10px rgba(0,0,0,0.3)`,
          }}
        >
          {/* Toggle Icon */}
          <Box color={grimoire.text.primary} fontSize="18px">
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </Box>

          {/* Decorative Dots */}
          <VStack gap="3px">
            <Box w="4px" h="4px" borderRadius="full" bg={`${grimoire.glow.gold}66`} />
            <motion.div
              animate={glowPulse.animate}
              transition={glowPulse.transition}
            >
              <Box w="4px" h="4px" borderRadius="full" bg={`${grimoire.glow.gold}99`} />
            </motion.div>
            <Box w="4px" h="4px" borderRadius="full" bg={`${grimoire.glow.gold}66`} />
          </VStack>
        </Box>
      </Box>

      {/* Drawer */}
      <Drawer.Root
        open={isOpen}
        onOpenChange={(e) => setIsOpen(e.open)}
        placement="left"
      >
        <Drawer.Backdrop bg="rgba(0, 0, 0, 0.7)" />
        <Drawer.Positioner>
          <Drawer.Content
            maxW="280px"
            bg={`linear-gradient(180deg, ${grimoire.leather.base} 0%, ${grimoire.leather.dark} 100%)`}
            borderRight="2px solid"
            borderColor={grimoire.border.dark}
            position="relative"
            overflow="hidden"
          >
            {/* Leather Texture Overlay */}
            <Box
              position="absolute"
              inset="0"
              opacity={0.15}
              backgroundImage="url('data:image/svg+xml,%3Csvg viewBox=%270 0 100 100%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.8%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%27 height=%27100%27 filter=%27url(%23noise)%27 opacity=%270.5%27/%3E%3C/svg%3E')"
              pointerEvents="none"
            />

            {/* Corner Decorations */}
            <CornerDecoration position="topLeft" />
            <CornerDecoration position="topRight" />
            <CornerDecoration position="bottomLeft" />
            <CornerDecoration position="bottomRight" />

            {/* Floating Particles */}
            <ParticlesContainer />

            {/* Header */}
            <Box py={6} px={5} position="relative" zIndex={10}>
              <Link to="/" onClick={closeSidebar} style={{ textDecoration: 'none' }}>
                <VStack gap={3}>
                  {/* Top Flourish */}
                  <HStack gap={2}>
                    <Box h="1px" w="32px" bgGradient={`linear(to-r, transparent, ${grimoire.border.base}80)`} />
                    <motion.span
                      animate={glowPulse.animate}
                      transition={glowPulse.transition}
                      style={{ color: grimoire.glow.gold, fontSize: '14px' }}
                    >
                      ✦
                    </motion.span>
                    <Box h="1px" w="32px" bgGradient={`linear(to-l, transparent, ${grimoire.border.base}80)`} />
                  </HStack>

                  {/* Logo */}
                  <Box
                    w="64px"
                    h="64px"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bg={`radial-gradient(circle, ${grimoire.leather.light} 0%, ${grimoire.leather.dark} 100%)`}
                    border="2px solid"
                    borderColor={grimoire.border.base}
                    boxShadow={`0 0 25px ${grimoire.glow.gold}33, inset 0 0 20px rgba(0,0,0,0.5)`}
                  >
                    <Image 
                      src={logo} 
                      alt="FalconForgeFantasy" 
                      w="48px" 
                      h="48px"
                      style={{ filter: `drop-shadow(0 0 8px ${grimoire.glow.gold}66)` }}
                    />
                  </Box>

                  {/* Title */}
                  <Text
                    fontSize="18px"
                    fontWeight="700"
                    fontFamily="heading"
                    color={grimoire.text.primary}
                    textShadow="0 2px 4px rgba(0,0,0,0.8)"
                    letterSpacing="1px"
                  >
                    FalconForgeFantasy
                  </Text>

                  {/* Bottom Flourish */}
                  <Flourish />
                </VStack>
              </Link>
            </Box>

            {/* Navigation */}
            <Drawer.Body px={3} position="relative" zIndex={10}>
              <Box mb={6}>
                <SectionDivider label="Navigate" />
                <nav>
                  <GrimoireNavLink to="/" onClick={closeSidebar}>Home</GrimoireNavLink>
                  <GrimoireNavLink to="/tickets" onClick={closeSidebar}>Tickets</GrimoireNavLink>
                  <GrimoireNavLink to="/questions" onClick={closeSidebar}>FAQ</GrimoireNavLink>
                  <GrimoireNavLink to="forum" onClick={closeSidebar}>Forum</GrimoireNavLink>
                  {user && <GrimoireNavLink to="/profile" onClick={closeSidebar}>User Profile</GrimoireNavLink>}
                </nav>
              </Box>

              <Box mb={6}>
                <SectionDivider label="Realms" />
                <GrimoireExternalLink href="https://falcons-forge-shop.fourthwall.com/">Merchandise</GrimoireExternalLink>
                <GrimoireExternalLink href="https://marketplace.roll20.net/browse/publisher/1785/falconforgefantasy">Roll20</GrimoireExternalLink>
                <GrimoireExternalLink href="https://startplaying.games/gm/falconforgefantasy">StartPlaying</GrimoireExternalLink>
              </Box>
            </Drawer.Body>

            {/* Footer */}
            <Drawer.Footer
              px={3}
              pt={4}
              borderTop="1px solid"
              borderColor={`${grimoire.border.dark}50`}
              flexDirection="column"
              gap={2}
              position="relative"
              zIndex={10}
            >
              {user ? (
                <Box
                  as="button"
                  onClick={handleLogout}
                  w="100%"
                  py={3}
                  px={4}
                  borderRadius="6px"
                  fontSize="13px"
                  fontFamily="heading"
                  color={grimoire.text.secondary}
                  bg="transparent"
                  border="1px solid"
                  borderColor={grimoire.border.dark}
                  cursor="pointer"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  gap={2}
                  transition="all 0.3s ease"
                  _hover={{
                    bg: `${grimoire.border.dark}66`,
                    borderColor: grimoire.border.base,
                    color: grimoire.text.primary,
                  }}
                >
                  <LogIn size={16} />
                  Logout
                </Box>
              ) : (
                <>
                  <Link to="/login" onClick={closeSidebar} style={{ textDecoration: 'none', width: '100%' }}>
                    <Box
                      w="100%"
                      py={3}
                      px={4}
                      borderRadius="6px"
                      fontSize="13px"
                      fontFamily="heading"
                      color={grimoire.text.secondary}
                      bg="transparent"
                      border="1px solid"
                      borderColor={grimoire.border.dark}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      gap={2}
                      transition="all 0.3s ease"
                      _hover={{
                        bg: `${grimoire.border.dark}66`,
                        borderColor: grimoire.border.base,
                        color: grimoire.text.primary,
                      }}
                    >
                      <LogIn size={16} />
                      Login
                    </Box>
                  </Link>
                  <Link to="/signup" onClick={closeSidebar} style={{ textDecoration: 'none', width: '100%' }}>
                    <Box
                      w="100%"
                      py={3}
                      px={4}
                      borderRadius="6px"
                      fontSize="13px"
                      fontWeight="600"
                      fontFamily="heading"
                      color={grimoire.leather.base}
                      bg={`linear-gradient(180deg, ${grimoire.text.primary} 0%, #a67c52 100%)`}
                      border="1px solid"
                      borderColor="#c4955a"
                      boxShadow="0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      gap={2}
                      transition="all 0.3s ease"
                      _hover={{
                        bg: `linear-gradient(180deg, #e4b584 0%, #b68c62 100%)`,
                        boxShadow: `0 4px 20px ${grimoire.text.primary}66, inset 0 1px 0 rgba(255,255,255,0.2)`,
                      }}
                    >
                      <UserPlus size={16} />
                      Join the Quest
                    </Box>
                  </Link>
                </>
              )}

              <BottomDecoration />
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </>
  )
}