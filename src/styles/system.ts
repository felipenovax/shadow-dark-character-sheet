// ui
import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        paper: {
          50: { value: '#faf8f2' },
          100: { value: '#f4f0e6' },
          200: { value: '#ece8dd' },
          300: { value: '#d8d2c2' },
        },
        ink: {
          500: { value: '#3f3a33' },
          900: { value: '#15130f' },
        },
        royal: {
          500: { value: '#6b4e9e' },
          600: { value: '#574080' },
        },
      },
    },
    semanticTokens: {
      colors: {
        'surface.bg': { value: '{colors.paper.200}' },
        'surface.panel': { value: '{colors.paper.50}' },
        'surface.raised': { value: '{colors.paper.100}' },
        'surface.border': { value: '{colors.paper.300}' },
        'brand.accent': { value: '{colors.royal.500}' },
        'brand.accent1': { value: '{colors.ink.500}' },
        'brand.accent2': { value: '{colors.ink.500}' },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
