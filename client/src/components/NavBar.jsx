import { motion } from 'motion/react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { userLogOut } from '../utilities'
import { useState } from 'react'
import logo from '../assets/FFF_Symbol_128.png'

export default function NavBar({ user, setUser }) {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await userLogOut()
    setUser(null)
    navigate("/")
  }

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/events", label: "Events" },
  ]

  const externalLinks = [
    { 
      href: "https://falcons-forge-shop.fourthwall.com/", 
      label: "Merchandise" 
    },
    { 
      href: "https://marketplace.roll20.net/browse/publisher/1785/falconforgefantasy", 
      label: "Roll20" 
    },
    { 
      href: "https://startplaying.games/gm/falconforgefantasy", 
      label: "StartPlaying" 
    },
  ]

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b-2 border-forge-red-700 bg-gradient-to-r from-forge-stone-950 via-forge-stone-900 to-forge-stone-950 shadow-lg backdrop-blur-md"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo Section */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 group"
            >
              <motion.img
                src={logo}
                alt="FalconForgeFantasy Logo"
                className="h-14 w-14 drop-shadow-lg"
                whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                transition={{ duration: 0.5 }}
              />
              <div className="hidden md:block">
                <motion.h1 
                  className="text-xl font-bold tracking-wider text-forge-tan-300 group-hover:text-forge-gold-400 transition-colors"
                  whileHover={{ 
                    textShadow: "0 0 20px rgba(245, 158, 11, 0.5)" 
                  }}
                >
                  FalconForge
                  <span className="block text-sm font-normal text-forge-tan-400 group-hover:text-forge-gold-500">
                    Fantasy
                  </span>
                </motion.h1>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Main Nav Links */}
            <motion.div 
              className="flex gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.2,
                  }
                }
              }}
            >
              {navLinks.map((link) => (
                <NavLinkItem key={link.to} to={link.to}>
                  {link.label}
                </NavLinkItem>
              ))}
              
              {/* Conditional User Links */}
              {user && (
                <NavLinkItem to="/tickets">Tickets</NavLinkItem>
              )}
            </motion.div>

            {/* Divider */}
            <div className="h-8 w-px bg-forge-red-700/50" />

            {/* External Links */}
            <div className="flex gap-4">
              {externalLinks.map((link) => (
                <ExternalLinkItem key={link.href} href={link.href}>
                  {link.label}
                </ExternalLinkItem>
              ))}
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-forge-red-700/50" />

            {/* Auth Buttons */}
            <div className="flex gap-4">
              {user ? (
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-md border border-forge-red-700 bg-forge-stone-900 px-4 py-2 text-sm font-medium text-forge-tan-300 transition-all hover:bg-forge-red-900/30 hover:text-forge-gold-400 hover:border-forge-gold-500"
                >
                  Logout
                </motion.button>
              ) : (
                <>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/login"
                      className="rounded-md border border-forge-stone-700 px-4 py-2 text-sm font-medium text-forge-tan-300 transition-all hover:border-forge-gold-500 hover:text-forge-gold-400"
                    >
                      Login
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/signup"
                      className="rounded-md bg-gradient-to-r from-forge-red-700 to-forge-red-800 px-4 py-2 text-sm font-bold text-forge-tan-50 shadow-lg transition-all hover:from-forge-gold-600 hover:to-forge-gold-700 hover:shadow-forge-gold-500/50"
                    >
                      Join the Quest
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden rounded-md p-2 text-forge-tan-300 hover:bg-forge-stone-800 hover:text-forge-gold-400"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={mobileMenuOpen ? "open" : "closed"}
          variants={{
            open: { 
              height: "auto", 
              opacity: 1,
              transition: { 
                height: { duration: 0.3 },
                opacity: { duration: 0.2, delay: 0.1 }
              }
            },
            closed: { 
              height: 0, 
              opacity: 0,
              transition: {
                height: { duration: 0.3, delay: 0.1 },
                opacity: { duration: 0.2 }
              }
            }
          }}
          className="lg:hidden overflow-hidden"
        >
          <div className="border-t border-forge-red-700/30 py-4 space-y-2">
            {navLinks.map((link) => (
              <MobileNavLink key={link.to} to={link.to} onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </MobileNavLink>
            ))}
            
            {user && (
              <MobileNavLink to="/tickets" onClick={() => setMobileMenuOpen(false)}>
                Tickets
              </MobileNavLink>
            )}

            <div className="my-2 border-t border-forge-stone-800" />

            {externalLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-md px-4 py-2 text-sm text-forge-tan-400 hover:bg-forge-stone-800 hover:text-forge-gold-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label} ↗
              </a>
            ))}

            <div className="my-2 border-t border-forge-stone-800" />

            {user ? (
              <button
                onClick={() => {
                  handleLogout()
                  setMobileMenuOpen(false)
                }}
                className="w-full rounded-md border border-forge-red-700 bg-forge-stone-900 px-4 py-2 text-left text-sm font-medium text-forge-tan-300 hover:bg-forge-red-900/30 hover:text-forge-gold-400"
              >
                Logout
              </button>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="block rounded-md border border-forge-stone-700 px-4 py-2 text-center text-sm font-medium text-forge-tan-300 hover:border-forge-gold-500 hover:text-forge-gold-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block rounded-md bg-gradient-to-r from-forge-red-700 to-forge-red-800 px-4 py-2 text-center text-sm font-bold text-forge-tan-50 hover:from-forge-gold-600 hover:to-forge-gold-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Join the Quest
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}

// Reusable animated nav link component
function NavLinkItem({ to, children }) {
  return (
    <motion.div
      variants={{
        hidden: { y: -20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      }}
    >
      <NavLink
        to={to}
        className={({ isActive }) =>
          `group relative px-3 py-2 text-sm font-medium transition-colors ${
            isActive
              ? 'text-forge-gold-400'
              : 'text-forge-tan-300 hover:text-forge-gold-400'
          }`
        }
      >
        {({ isActive }) => (
          <>
            {children}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-forge-gold-500 to-forge-red-600"
              initial={false}
              animate={{
                width: isActive ? '100%' : '0%',
              }}
              whileHover={{
                width: '100%',
              }}
              transition={{ duration: 0.3 }}
            />
          </>
        )}
      </NavLink>
    </motion.div>
  )
}

// External link component with subtle animation
function ExternalLinkItem({ href, children }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05, y: -2 }}
      className="text-sm text-forge-tan-400 hover:text-forge-gold-400 transition-colors"
    >
      {children}
    </motion.a>
  )
}

// Mobile nav link
function MobileNavLink({ to, onClick, children }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `block rounded-md px-4 py-2 text-sm font-medium ${
          isActive
            ? 'bg-forge-red-900/30 text-forge-gold-400 border-l-4 border-forge-gold-500'
            : 'text-forge-tan-300 hover:bg-forge-stone-800 hover:text-forge-gold-400'
        }`
      }
    >
      {children}
    </NavLink>
  )
}