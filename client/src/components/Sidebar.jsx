import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Box, Flex, Text, Image } from '@chakra-ui/react'
import { userLogOut } from '../utilities'
import logo from '../assets/FFF_Symbol_128.png'

export default function Sidebar({ user, setUser }) {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(true)

  const handleLogout = async () => {
    await userLogOut()
    setUser(null)
    navigate("/")
    setIsOpen(false)
  }

  const closeSidebar = () => setIsOpen(false)

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.700"
          zIndex={40}
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar + Toggle (slide together) */}
      <motion.nav
        initial={false}
        animate={{ x: isOpen ? 0 : -260 }}
        transition={{ type: "tween", duration: 0.3 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '260px',
          background: 'linear-gradient(180deg, #1c1917 0%, #0c0a09 100%)',
          borderRight: '2px solid #b91c1c',
          zIndex: "50",
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 0',
        }}
      >
        {/* Toggle Button */}
        <Box
          as="button"
          onClick={() => setIsOpen(!isOpen)}
          position="absolute"
          top="100px"
          right="-32px"
          w="2rem"
          h="5rem"
          aspectRatio="portrait"
          bg="#1c1917"
          color="#d6d3d1"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderTop='2px solid #b91c1c'
          borderRight='2px solid #b91c1c'
          borderBottom='2px solid #b91c1c'
          roundedBottomRight="8px"
          roundedTopRight="8px"
          fontSize="20px"
          cursor="pointer"
          transform="translateY"
          _hover={{ bg: "#292524", color: "#fbbf24", borderColor: "#fbbf24" }}
        >
          {isOpen ? '✕' : '☰'}
        </Box>
        {/* Logo */}
        <Link to="/" onClick={closeSidebar} style={{ textDecoration: 'none' }}>
          <Flex align="center" gap="12px" px="20px" py="10px" mb="20px">
            <Image src={logo} alt="FalconForge" w="48px" h="48px" />
            <Text color="#d6d3d1" fontWeight="600" fontSize="16px">
              FalconForge Fantasy
            </Text>
          </Flex>
        </Link>

        {/* Divider */}
        <Box h="1px" bg="#44403c" mx="20px" mb="16px" />

        {/* Nav Section */}
        <Box px="12px" mb="16px">
          <Text fontSize="11px" color="#78716c" textTransform="uppercase" letterSpacing="2px" px="12px" mb="8px">
            Navigate
          </Text>
          
          <SidebarLink to="/" onClick={closeSidebar}>Home</SidebarLink>
          <SidebarLink to="/tickets" onClick={closeSidebar}>Tickets</SidebarLink>
          {user && <SidebarLink to="/profile" onClick={closeSidebar}>User Profile</SidebarLink>}
        </Box>

        {/* External Links */}
        <Box px="12px" mb="16px">
          <Text fontSize="11px" color="#78716c" textTransform="uppercase" letterSpacing="2px" px="12px" mb="8px">
            Realms
          </Text>
          
          <ExternalLink href="https://falcons-forge-shop.fourthwall.com/">Merchandise</ExternalLink>
          <ExternalLink href="https://marketplace.roll20.net/browse/publisher/1785/falconforgefantasy">Roll20</ExternalLink>
          <ExternalLink href="https://startplaying.games/gm/falconforgefantasy">StartPlaying</ExternalLink>
        </Box>

        {/* Spacer */}
        <Box flex="1" />

        {/* Auth Section */}
        <Box px="12px" pt="16px" borderTop="1px solid #292524">
          {user ? (
            <Box
              as="button"
              onClick={handleLogout}
              display="block"
              w="100%"
              p="12px 16px"
              bg="transparent"
              color="#d6d3d1"
              border="1px solid #44403c"
              borderRadius="8px"
              fontSize="14px"
              cursor="pointer"
              textAlign="center"
              _hover={{ bg: "#292524", color: "#fbbf24", borderColor: "#fbbf24" }}
            >
              Logout
            </Box>
          ) : (
            <Flex direction="column" gap="8px">
              <Link to="/login" onClick={closeSidebar} style={{ textDecoration: 'none' }}>
                <Box
                  p="12px 16px"
                  bg="transparent"
                  color="#d6d3d1"
                  border="1px solid #44403c"
                  borderRadius="8px"
                  fontSize="14px"
                  textAlign="center"
                  _hover={{ bg: "#292524", color: "#fbbf24", borderColor: "#fbbf24" }}
                >
                  Login
                </Box>
              </Link>
              <Link to="/signup" onClick={closeSidebar} style={{ textDecoration: 'none' }}>
                <Box
                  p="12px 16px"
                  bg="#b91c1c"
                  color="#fef2f2"
                  border="1px solid #991b1b"
                  borderRadius="8px"
                  fontSize="14px"
                  fontWeight="600"
                  textAlign="center"
                  _hover={{ bg: "#d97706", borderColor: "#b45309" }}
                >
                  Join the Quest
                </Box>
              </Link>
            </Flex>
          )}
        </Box>
      </motion.nav>
    </>
  )
}

// Simple nav link component
function SidebarLink({ to, onClick, children }) {
  return (
    <NavLink to={to} onClick={onClick} style={{ textDecoration: 'none' }}>
      {({ isActive }) => (
        <Box
          p="12px 16px"
          m="2px 0"
          borderRadius="8px"
          color={isActive ? "#fbbf24" : "#a8a29e"}
          bg={isActive ? "rgba(185, 28, 28, 0.2)" : "transparent"}
          borderLeft={isActive ? "3px solid #fbbf24" : "3px solid transparent"}
          fontSize="14px"
          _hover={{ bg: "#292524", color: "#fbbf24" }}
        >
          {children}
        </Box>
      )}
    </NavLink>
  )
}

// External link component
function ExternalLink({ href, children }) {
  return (
    <Box
      as="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      display="block"
      p="10px 16px"
      m="2px 0"
      borderRadius="8px"
      color="#78716c"
      fontSize="13px"
      _hover={{ bg: "#292524", color: "#fbbf24" }}
    >
      {children} ↗
    </Box>
  )
}