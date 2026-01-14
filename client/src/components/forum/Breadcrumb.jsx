import { HStack, Box } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { ChevronRight, ScrollText } from "lucide-react";

/**
 * Breadcrumb navigation for forum pages
 * 
 * Usage:
 * <Breadcrumb items={[
 *   { label: "Quest Board", to: "/forum", icon: ScrollText },
 *   { label: "FalCON 2026", to: "/forum/convention/2026" },
 *   { label: "Opening Ceremony" } // No 'to' = current page
 * ]} />
 */
export default function Breadcrumb({ items = [] }) {
  return (
    <HStack gap={2} mb={8} fontSize="14px" flexWrap="wrap">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const Icon = item.icon;

        return (
          <HStack key={index} gap={2}>
            {/* Separator (except for first item) */}
            {index > 0 && (
              <Box color="forge.stone.700">
                <ChevronRight size={14} />
              </Box>
            )}

            {/* Breadcrumb Item */}
            {isLast ? (
              // Current page (not clickable)
              <Box
                display="flex"
                alignItems="center"
                gap={2}
                px={3}
                py={1.5}
                borderRadius="md"
                bg="forge.stone.800"
                border="1px solid"
                borderColor="forge.stone.700"
                color="forge.tan.100"
              >
                {Icon && <Icon size={16} color="var(--chakra-colors-forge-gold-400)" />}
                {item.label}
              </Box>
            ) : (
              // Clickable link
              <Link to={item.to}>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={2}
                  px={3}
                  py={1.5}
                  borderRadius="md"
                  color="forge.tan.400"
                  transition="all 0.2s"
                  _hover={{
                    color: "forge.gold.400",
                    bg: "rgba(245, 158, 11, 0.1)",
                  }}
                >
                  {Icon && <Icon size={16} color="var(--chakra-colors-forge-gold-400)" />}
                  {item.label}
                </Box>
              </Link>
            )}
          </HStack>
        );
      })}
    </HStack>
  );
}
