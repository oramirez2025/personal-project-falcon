/*
 FalconForge Fantasy - Reusable animation presets and variants
 
 To utilize: import { cardFloat, glowPulse, fadeInUp } from './animations/fffAnimations'
 Use example: <MotionBox {...cardFloat}>Content</MotionBox>
 */

// ============================================
// ENTRANCE ANIMATIONS
// ============================================

export const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" }
}

export const fadeInDown = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" }
}

export const scaleIn = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4, ease: "easeOut" }
}

export const slideInRight = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: "easeOut" }
}

export const slideInLeft = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: "easeOut" }
}

// ============================================
// HOVER/TAP INTERACTIONS
// ============================================

export const buttonPress = {
    whileHover: { scale: 1.05, y: -2 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 }
}

export const cardHover = {
    whileHover: { y: -4, scale: 1.01 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.25, ease: "easeOut" }
}

export const gentleHover = {
    whileHover: { scale: 1.02 },
    transition: { duration: 0.3 }
}

export const iconSpin = {
    whileHover: { rotate: [0, -5, 5, -5, 0] },
    transition: { duration: 0.5 }
}

// ============================================
// FLOAT/LEVITATION EFFECTS
// ============================================

export const floatAnimation = {
    animate: {
        y: [0, -8, 0],
    },
    transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
    }
}

export const gentleFloat = {
    animate: {
        y: [0, -4, 0],
    },
    transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
    }
}

export const bobAnimation = {
    animate: {
        y: [0, -6, 0],
        rotate: [0, 2, 0, -2, 0],
    },
    transition: {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut"
    }
}

// ============================================
// GLOW/PULSE EFFECTS
// ============================================

export const glowPulse = {
    animate: {
        boxShadow: [
            "0 0 20px rgba(245, 158, 11, 0.3)",
            "0 0 40px rgba(245, 158, 11, 0.5)",
            "0 0 20px rgba(245, 158, 11, 0.3)",
        ],
    },
    transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
    }
}

export const redGlowPulse = {
    animate: {
        boxShadow: [
            "0 0 20px rgba(185, 28, 28, 0.3)",
            "0 0 40px rgba(185, 28, 28, 0.5)",
            "0 0 20px rgba(185, 28, 28, 0.3)",
        ],
    },
    transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
    }
}

export const emberGlow = {
    animate: {
        boxShadow: [
            "0 0 15px rgba(255, 107, 53, 0.3)",
            "0 0 30px rgba(255, 107, 53, 0.5)",
            "0 0 15px rgba(255, 107, 53, 0.3)",
        ],
    },
    transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
    }
}

// ============================================
// COMBINED EFFECTS (PRESETS)
// ============================================

/*
Floating card with entrance animation
💭: auth forms, modals, feature cards
*/
export const cardFloat = {
    ...fadeInUp,
    ...gentleFloat,
    ...cardHover,
}

/*
Button with glow and hover
💭: primary CTAs
*/
export const mysticalButton = {
    ...fadeInUp,
    ...buttonPress,
    ...glowPulse,
}

/*
Input field with focus glow
💭: form fields
*/
export const glowInput = {
    whileFocus: {
        boxShadow: "0 0 20px rgba(245, 158, 11, 0.4)",
        borderColor: "#f59e0b",
    },
    transition: { duration: 0.3 }
}

// ============================================
// STAGGER ANIMATION VARIANTS
// ============================================

/*
Container variants for staggered children animations
❗Use with motion.div containing multiple children
*/
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      staggerDirection: -1,
    },
  },
};


export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: 20,
  },
};



// ============================================
// PAGE TRANSITIONS
// ============================================

export const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Combine multiple animation objects
 * @param  {...any} animations - Animation objects to merge
 * @returns {Object} Combined animation object
 */
export const combineAnimations = (...animations) => {
    return animations.reduce((acc, curr) => ({ ...acc, ...curr }), {})
}

/**
 * Create custom glow with specific color
 * @param {string} color - RGB color string (e.g., "245, 158, 11"). ❗Not RGBA
 * @param {number} duration - Animation duration in seconds
 * @returns {Object} Animation object
 */
export const customGlow = (color, duration = 2) => ({
    animate: {
        boxShadow: [
            `0 0 20px rgba(${color}, 0.3)`,
            `0 0 40px rgba(${color}, 0.5)`,
            `0 0 20px rgba(${color}, 0.3)`,
        ],
    },
    transition: {
        duration,
        repeat: Infinity,
        ease: "easeInOut"
    }
})

/**
 * Create delay for staggered animations
 * @param {number} index - Item index
 * @param {number} delay - Delay multiplier
 * @returns {Object} Animation with delay
 */
export const withDelay = (index, delay = 0.1) => ({
    ...fadeInUp,
    transition: {
        ...fadeInUp.transition,
        delay: index * delay
    }
})