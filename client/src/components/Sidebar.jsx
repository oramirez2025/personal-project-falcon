import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Box, Flex, Text, Image } from '@chakra-ui/react'
import { Drawer } from '@chakra-ui/react'
import { Menu, X, ExternalLink as ExternalLinkIcon } from 'lucide-react'
import { userLogOut } from '../utilities'
import logo from '../assets/FFF_Symbol_128.png'
import { showErrorToast } from './ui/showErrorToast'
import { showSuccessToast } from './ui/showSuccessToast'

export default function Sidebar({ user, setUser }) {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await userLogOut()
      setUser(null)
      navigate("/")
      setIsOpen(false)
      showSuccessToast("Log Out", "Log out successful!")
    }
    catch (err) {
      showErrorToast("Log Out", err.response?.data.error || "Something went wrong :(")
    }
  }

  const closeSidebar = () => setIsOpen(false)

  return (
    <>
      {/* Animated Toggle Button - Moves with drawer */}
      <Box
        as="button"
        onClick={() => setIsOpen(!isOpen)}
        position="fixed"
        top="100px"
        left={isOpen ? "260px" : "0px"}
        w="2rem"
        h="5rem"
        bg="forge.stone.800"
        color="forge.tan.200"
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderTop="2px solid"
        borderRight="2px solid"
        borderBottom="2px solid"
        borderColor="forge.red.700"
        roundedBottomRight="8px"
        roundedTopRight="8px"
        cursor="pointer"
        zIndex={1500}
        transition="left 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
        _hover={{ 
          bg: "forge.stone.700", 
          color: "forge.gold.400", 
          borderColor: "forge.gold.400" 
        }}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </Box>

      {/* Chakra Drawer for Sidebar */}
      <Drawer.Root 
        open={isOpen} 
        onOpenChange={(e) => setIsOpen(e.open)}
        placement="left"
      >
        <Drawer.Backdrop bg="rgba(0, 0, 0, 0.7)" />
        <Drawer.Positioner>
          <Drawer.Content
            maxW="260px"
            bg="linear-gradient(180deg, #1f1f1f 0%, #0f0f0f 100%)"
            borderRight="2px solid"
            borderColor="forge.red.700"
          >
            {/* Logo Header */}
            <Box py={4} px={5}>
              <Link to="/" onClick={closeSidebar} style={{ textDecoration: 'none' }}>
                <Flex align="center" gap="12px">
                  <Image src={logo} alt="FalconForge" w="48px" h="48px" />
                  <Text color="forge.tan.200" fontWeight="600" fontSize="16px">
                    FalconForgeFantasy
                  </Text>
                </Flex>
              </Link>
            </Box>

            {/* Divider */}
            <Box h="1px" bg="forge.stone.700" mx="20px" mb="16px" />

            <Drawer.Body px={3}>
              {/* Nav Section */}
              <Box mb="16px">
                <Text 
                  fontSize="11px" 
                  color="forge.stone.500" 
                  textTransform="uppercase" 
                  letterSpacing="2px" 
                  px="12px" 
                  mb="8px"
                >
                  Navigate
                </Text>

                <SidebarLink to="/" onClick={closeSidebar}>Home</SidebarLink>
                <SidebarLink to="/tickets" onClick={closeSidebar}>Tickets</SidebarLink>
                <SidebarLink to="/questions" onClick={closeSidebar}>FAQ</SidebarLink>
                {user && <SidebarLink to="/profile" onClick={closeSidebar}>User Profile</SidebarLink>}
              </Box>

              {/* External Links */}
              <Box mb="16px">
                <Text 
                  fontSize="11px" 
                  color="forge.stone.500" 
                  textTransform="uppercase" 
                  letterSpacing="2px" 
                  px="12px" 
                  mb="8px"
                >
                  Realms
                </Text>

                <ExternalLink href="https://falcons-forge-shop.fourthwall.com/">Merchandise</ExternalLink>
                <ExternalLink href="https://marketplace.roll20.net/browse/publisher/1785/falconforgefantasy">Roll20</ExternalLink>
                <ExternalLink href="https://startplaying.games/gm/falconforgefantasy">StartPlaying</ExternalLink>
              </Box>
            </Drawer.Body>

            <Drawer.Footer 
              px={3} 
              pt="16px" 
              borderTop="1px solid" 
              borderColor="forge.stone.700"
              flexDirection="column"
              gap="8px"
            >
              {user ? (
                <Box
                  as="button"
                  onClick={handleLogout}
                  w="100%"
                  p="12px 16px"
                  bg="transparent"
                  color="forge.tan.200"
                  border="1px solid"
                  borderColor="forge.stone.700"
                  borderRadius="8px"
                  fontSize="14px"
                  cursor="pointer"
                  textAlign="center"
                  transition="all 0.2s"
                  _hover={{ 
                    bg: "forge.stone.700", 
                    color: "forge.gold.400", 
                    borderColor: "forge.gold.400" 
                  }}
                >
                  Logout
                </Box>
              ) : (
                <>
                  <Link to="/login" onClick={closeSidebar} style={{ textDecoration: 'none', width: '100%' }}>
                    <Box
                      w="100%"
                      p="12px 16px"
                      bg="transparent"
                      color="forge.tan.200"
                      border="1px solid"
                      borderColor="forge.stone.700"
                      borderRadius="8px"
                      fontSize="14px"
                      textAlign="center"
                      transition="all 0.2s"
                      _hover={{ 
                        bg: "forge.stone.700", 
                        color: "forge.gold.400", 
                        borderColor: "forge.gold.400" 
                      }}
                    >
                      Login
                    </Box>
                  </Link>
                  <Link to="/signup" onClick={closeSidebar} style={{ textDecoration: 'none', width: '100%' }}>
                    <Box
                      w="100%"
                      p="12px 16px"
                      bg="forge.red.700"
                      color="forge.tan.50"
                      border="1px solid"
                      borderColor="forge.red.800"
                      borderRadius="8px"
                      fontSize="14px"
                      fontWeight="600"
                      textAlign="center"
                      transition="all 0.2s"
                      _hover={{ 
                        bg: "forge.gold.600", 
                        borderColor: "forge.gold.700" 
                      }}
                    >
                      Join the Quest
                    </Box>
                  </Link>
                </>
              )}
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </>
  )
}

function SidebarLink({ to, onClick, children }) {
  return (
    <NavLink to={to} onClick={onClick} style={{ textDecoration: 'none' }}>
      {({ isActive }) => (
        <Box
          p="12px 16px"
          m="2px 0"
          borderRadius="8px"
          color={isActive ? "forge.gold.400" : "forge.stone.400"}
          bg={isActive ? "rgba(185, 28, 28, 0.2)" : "transparent"}
          borderLeft={isActive ? "3px solid" : "3px solid transparent"}
          borderLeftColor={isActive ? "forge.gold.400" : "transparent"}
          fontSize="14px"
          transition="all 0.2s"
          _hover={{ 
            bg: "forge.stone.700", 
            color: "forge.gold.400" 
          }}
        >
          {children}
        </Box>
      )}
    </NavLink>
  )
}

function ExternalLink({ href, children }) {
  return (
    <Box
      as="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      display="flex"
      alignItems="center"
      gap="6px"
      p="10px 16px"
      m="2px 0"
      borderRadius="8px"
      color="forge.stone.500"
      fontSize="13px"
      transition="all 0.2s"
      _hover={{ 
        bg: "forge.stone.700", 
        color: "forge.gold.400" 
      }}
    >
      {children}
      <ExternalLinkIcon size={12} />
    </Box>
  )
}