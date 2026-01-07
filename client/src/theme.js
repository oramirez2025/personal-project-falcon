import { defineConfig, defaultConfig } from "@chakra-ui/react"

// Load Google Fonts
const fontLink = document.createElement('link')
fontLink.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Lato:wght@400;700&display=swap'
fontLink.rel = 'stylesheet'
document.head.appendChild(fontLink)

// This extends the default theme from Chakra
export const theme = defineConfig({
    ...defaultConfig,
    // defining custom brand colors can go here
    theme: {
        ...defaultConfig.theme,
        tokens: {
            ...defaultConfig.theme?.tokens,
            fonts: {
                ...defaultConfig.theme?.tokens?.fonts,
                heading: { value: "'Cinzel', serif" },
                body: { value: "'Lato', sans-serif" },
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