import Link from "next/link";
import { Box, Flex, Link as ChakraLink, VStack, IconButton, useDisclosure, Text, CloseButton } from "@chakra-ui/react";
import { Menu } from "lucide-react";
import { useRouter } from "next/router";

const Sidebar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Tables", href: "/tables" },
    { name: "Feasibility", href: "/feasibility" },
    { name: "Settings", href: "/settings" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <Box
          position="fixed"
          inset="0"
          zIndex="40"
          display={{ base: "block", md: "none" }}
          onClick={onClose}
          bg="blackAlpha.600"
        />
      )}

      <Box
        position="fixed"
        left="0"
        top="0"
        h="full"
        zIndex="50"
        w="64"
        transition="transform 0.3s"
        transform={{
          base: isOpen ? "translateX(0)" : "translateX(-100%)",
          md: "translateX(0)",
        }}
        bg="bg.sidebar"
        borderRight="1px solid"
        borderColor="border.subtle"
      >
        <Flex
          align="center"
          justify="space-between"
          px="4"
          h="16"
          borderBottom="1px solid"
          borderColor="border.subtle"
        >
          <Text fontSize="xl" fontWeight="bold" color="text.primary">
            <ChakraLink as={Link} href="/" _hover={{ textDecoration: "none" }}>
              SnapFab
            </ChakraLink>
          </Text>
          <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
        </Flex>

        <VStack as="nav" mt="4" spacing="1" px="2" align="stretch">
          {navItems.map((item) => {
            const isActive = router.pathname === item.href;
            return (
              <ChakraLink
                key={item.href}
                as={Link}
                href={item.href}
                display="block"
                px="4"
                py="2"
                rounded="md"
                bg={isActive ? "bg.active" : "transparent"}
                color={isActive ? "accent.primary" : "text.secondary"}
                fontWeight={isActive ? "semibold" : "medium"}
                _hover={{ bg: "bg.hover", color: isActive ? "accent.primary" : "text.primary" }}
                transition="all 0.2s"
                onClick={onClose}
              >
                {item.name}
              </ChakraLink>
            );
          })}
        </VStack>
      </Box>

      {/* Hamburger button for mobile */}
      {!isOpen && (
        <IconButton
          aria-label="Open menu"
          icon={<Menu size={20} />}
          position="fixed"
          top="4"
          left="4"
          display={{ base: "flex", md: "none" }}
          zIndex="50"
          variant="outline"
          bg="bg.sidebar"
          borderColor="border.subtle"
          onClick={onOpen}
        />
      )}
    </>
  );
};

export default Sidebar;