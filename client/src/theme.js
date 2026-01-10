import { defineConfig, defaultConfig } from "@chakra-ui/react"

// Load Google Fonts
const fontLink = document.createElement('link')
fontLink.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Lato:wght@400;700&display=swap'
fontLink.rel = 'stylesheet'
document.head.appendChild(fontLink)

// ============================================
// SHARED STYLE OBJECTS (for spreading into components)
// ============================================

// Standard input styling - use with {...inputStyles}
export const inputStyles = {
    bg: "bg.input",
    borderColor: "border.default",
    color: "text.primary",
    _placeholder: { color: "text.muted" },
    _hover: { borderColor: "border.focus" },
    _focus: {
        borderColor: "border.focus",
        boxShadow: "0 0 0 1px var(--chakra-colors-forge-gold-500)",
    },
}

// Modal/Dialog input styling (uses direct forge tokens)
export const modalInputStyles = {
    bg: "forge.stone.900",
    borderColor: "forge.stone.700",
    color: "forge.tan.100",
    _placeholder: { color: "forge.stone.500" },
    _hover: { borderColor: "forge.gold.500" },
    _focus: {
        borderColor: "forge.gold.500",
        boxShadow: "0 0 0 1px var(--chakra-colors-forge-gold-500)",
    },
}

// Primary button styling - use with {...primaryButtonStyles}
export const primaryButtonStyles = {
    bg: "button.primary.bg",
    color: "button.primary.text",
    _hover: {
        bg: "button.primary.hover",
        boxShadow: "0 0 20px rgba(245, 158, 11, 0.3)",
    },
}

// Outline button for modals/dialogs
export const outlineButtonStyles = {
    variant: "outline",
    borderColor: "forge.stone.700",
    color: "forge.tan.300",
    _hover: {
        bg: "forge.stone.700",
        borderColor: "forge.tan.400",
    },
}

// This extends the default theme from Chakra
export const theme = defineConfig({
    ...defaultConfig,
    theme: {
        ...defaultConfig.theme,
        tokens: {
            ...defaultConfig.theme?.tokens,
            fonts: {
                ...defaultConfig.theme?.tokens?.fonts,
                heading: { value: "'Cinzel', serif" },
                body: { value: "'Lato', sans-serif" },
            },
            // extension of default for brand colors
            // ie <Box bg="forge.red.500">Stuff goes here</Box>
            colors: {
                ...defaultConfig.theme?.tokens?.colors,
                // Deep reds - shield background
                forge: {
                    red: {
                        50: { value: "#fdf2f2" },
                        100: { value: "#f9d9d9" },
                        200: { value: "#e8a3a3" },
                        300: { value: "#c96b6b" },
                        400: { value: "#a33a3a" },
                        500: { value: "#7a1f1f" },  
                        600: { value: "#5c1515" },
                        700: { value: "#4a1111" },
                        800: { value: "#380d0d" },
                        900: { value: "#260808" },
                    },
                    // Tan/beige - falcon feathers
                    tan: {
                        50: { value: "#faf8f5" },
                        100: { value: "#f0ebe3" },
                        200: { value: "#e5d5b8" },
                        300: { value: "#d4b896" },
                        400: { value: "#c4a574" },  
                        500: { value: "#a8885a" },
                        600: { value: "#8c6d45" },
                        700: { value: "#6b5335" },
                        800: { value: "#4a3a25" },
                        900: { value: "#2e2418" },
                    },
                    // Gold/yellow - beak accent
                    gold: {
                        50: { value: "#fffbeb" },
                        100: { value: "#fef3c7" },
                        200: { value: "#fde68a" },
                        300: { value: "#fcd34d" },
                        400: { value: "#f5a623" },  
                        500: { value: "#d97706" },
                        600: { value: "#b45309" },
                        700: { value: "#92400e" },
                        800: { value: "#78350f" },
                        900: { value: "#5c2a0a" },
                    },
                    // Orange - forge ember/sparks
                    ember: {
                        50: { value: "#fff7ed" },
                        100: { value: "#ffedd5" },
                        200: { value: "#fed7aa" },
                        300: { value: "#fdba74" },
                        400: { value: "#ff6b35" },  
                        500: { value: "#f04a00" },
                        600: { value: "#c93c00" },
                        700: { value: "#9a2e00" },
                        800: { value: "#6b2000" },
                        900: { value: "#3d1200" },
                    },
                    // Dark grays - shield, hammer, anvil
                    stone: {
                        50: { value: "#f5f5f5" },
                        100: { value: "#e5e5e5" },
                        200: { value: "#cccccc" },
                        300: { value: "#a3a3a3" },
                        400: { value: "#737373" },
                        500: { value: "#4a4a4a" },  
                        600: { value: "#3d3d3d" },
                        700: { value: "#2d2d2d" },
                        800: { value: "#1f1f1f" },
                        900: { value: "#0f0f0f" },
                    },
                },
            },
        },
        semanticTokens: {
            colors: {
                // Background colors
                'bg.primary': { value: '{colors.forge.stone.900}' },
                'bg.secondary': { value: '{colors.forge.stone.800}' },
                'bg.tertiary': { value: '{colors.forge.stone.700}' },
                'bg.card': { value: '{colors.forge.stone.800}' },
                'bg.input': { value: '{colors.forge.stone.900}' },
                
                // Text colors
                'text.primary': { value: '{colors.forge.tan.100}' },
                'text.secondary': { value: '{colors.forge.tan.300}' },
                'text.muted': { value: '{colors.forge.stone.400}' },
                'text.accent': { value: '{colors.forge.gold.400}' },
                
                // Border colors
                'border.default': { value: '{colors.forge.stone.700}' },
                'border.accent': { value: '{colors.forge.red.700}' },
                'border.focus': { value: '{colors.forge.gold.500}' },
                
                // Button/Interactive colors
                'button.primary.bg': { value: '{colors.forge.red.700}' },
                'button.primary.hover': { value: '{colors.forge.gold.600}' },
                'button.primary.text': { value: '{colors.forge.tan.50}' },
                
                // Secondary button colors
                'button.secondary.bg': { value: 'transparent' },
                'button.secondary.border': { value: '{colors.forge.stone.700}' },
                'button.secondary.text': { value: '{colors.forge.tan.300}' },
                'button.secondary.hoverBg': { value: '{colors.forge.stone.700}' },
                'button.secondary.hoverBorder': { value: '{colors.forge.tan.400}' },
                
                // Modal colors
                'modal.bg': { value: '{colors.forge.stone.800}' },
                'modal.border': { value: '{colors.forge.red.700}' },
                'modal.title': { value: '{colors.forge.tan.100}' },
                'modal.label': { value: '{colors.forge.tan.300}' },
                'modal.closeTrigger': { value: '{colors.forge.tan.400}' },
            },
            shadows: {
                // Focus ring shadow
                'focus.ring': { value: '0 0 0 1px {colors.forge.gold.500}' },
                // Button glow on hover
                'button.glow': { value: '0 0 20px rgba(245, 158, 11, 0.3)' },
            },
        },
    },
    globalCss: {
        ...defaultConfig.globalCss,
        body: {
            fontFamily: "body",
        },
        "h1, h2, h3, h4, h5, h6": {
            fontFamily: "heading",
        },
    },
})