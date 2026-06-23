import { Box, Center, Flex } from '@chakra-ui/react';
import { useState, useRef, useEffect } from 'react';

type Props = {
  children: React.ReactNode;
};

export const ActionBar = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(true);
  const barRef = useRef<HTMLDivElement>(null);

  // Auto-close after 5 seconds when first rendered
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Close the bar if clicking outside (useful for mobile)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        isOpen &&
        barRef.current &&
        !barRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <Box
      position="fixed"
      bottom="0"
      left="50%"
      zIndex="1000"
      transform={`translateX(-50%) translateY(${isOpen ? '0' : 'calc(100% - 1.5rem)'})`}
      transition="transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      ref={barRef}
    >
      <Box
        bg="rgba(23, 18, 36, 0.85)"
        backdropFilter="blur(16px)"
        borderColor="surface.border"
        borderWidth="1px"
        borderBottomWidth="0"
        borderTopRadius="0.5rem"
        p="1rem 1.5rem 0.75rem 1.5rem"
        w="90vw"
        maxW="30rem"
        boxShadow="0 -10px 40px rgba(0, 0, 0, 0.5)"
        position="relative"
      >
        {/* Handle for touch interactions */}
        <Center
          position="absolute"
          top="0"
          left="0"
          right="0"
          h="1.5rem"
          cursor="pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Box w="3rem" h="0.25rem" bg="surface.border" borderRadius="full" />
        </Center>

        <Flex gap="0.75rem" justify="center" wrap="wrap" mt="0.5rem">
          {children}
        </Flex>
      </Box>
    </Box>
  );
};
