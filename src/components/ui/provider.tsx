'use client';

// ui
import { ChakraProvider } from '@chakra-ui/react';

// components
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from './color-mode';

// styles
import { system } from '@/styles/system';

export const Provider = (props: ColorModeProviderProps) => {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider defaultTheme="dark" {...props} />
    </ChakraProvider>
  );
};
