import { useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";

/**
 * Floating particles effect for D&D themed pages
 * Creates ember and gold particles that float upward
 */
export default function Particles({ count = 25 }) {
  const containerRef = useRef(null);
  const particlesCreated = useRef(false);

  useEffect(() => {
    if (particlesCreated.current || !containerRef.current) return;
    particlesCreated.current = true;

    const container = containerRef.current;
    const types = ["ember", "gold", "spark"];

    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div");
      const type = types[Math.floor(Math.random() * types.length)];

      // Base size varies by type
      const size = type === "spark" 
        ? 2 + Math.random() * 3 
        : 4 + Math.random() * 6;

      // Animation duration (slower = more visible)
      const duration = 8 + Math.random() * 12;

      // Random horizontal drift
      const drift = (Math.random() - 0.5) * 100;

      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${5 + Math.random() * 90}%;
        border-radius: 50%;
        animation: particle-float ${duration}s linear infinite;
        animation-delay: ${Math.random() * duration}s;
        --drift: ${drift}px;
        opacity: 0;
        pointer-events: none;
      `;

      // Apply type-specific styles
      if (type === "ember") {
        particle.style.background = "radial-gradient(circle, #ff6b35 0%, rgba(255, 107, 53, 0.6) 40%, transparent 70%)";
        particle.style.boxShadow = "0 0 6px #ff6b35, 0 0 12px rgba(255, 107, 53, 0.4)";
      } else if (type === "gold") {
        particle.style.background = "radial-gradient(circle, #f59e0b 0%, rgba(245, 158, 11, 0.6) 40%, transparent 70%)";
        particle.style.boxShadow = "0 0 6px #f59e0b, 0 0 12px rgba(245, 158, 11, 0.4)";
      } else {
        particle.style.background = "radial-gradient(circle, #fff 0%, #f59e0b 30%, transparent 60%)";
        particle.style.boxShadow = "0 0 4px #fff, 0 0 8px #f59e0b";
      }

      container.appendChild(particle);
    }

    return () => {
      // Cleanup particles on unmount
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      particlesCreated.current = false;
    };
  }, [count]);

  return (
    <>
      {/* Global keyframes */}
      <style>
        {`
          @keyframes particle-float {
            0% {
              transform: translateY(100vh) translateX(0) scale(0.5);
              opacity: 0;
            }
            10% {
              opacity: 0.8;
            }
            90% {
              opacity: 0.6;
            }
            100% {
              transform: translateY(-20vh) translateX(var(--drift)) scale(1.2);
              opacity: 0;
            }
          }
        `}
      </style>
      <Box
        ref={containerRef}
        position="fixed"
        top="0"
        left="0"
        w="100%"
        h="100%"
        pointerEvents="none"
        overflow="hidden"
        zIndex={0}
      />
    </>
  );
}
