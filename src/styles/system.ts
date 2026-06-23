// ui
import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        purple: {
          50: { value: '#faf5ff' },
          100: { value: '#e9d8fd' },
          200: { value: '#d6bcfa' },
          300: { value: '#b794f4' },
          400: { value: '#9f7aea' },
          500: { value: '#805ad5' },
          600: { value: '#6b46c1' },
          700: { value: '#553c9a' },
          800: { value: '#44337a' },
          900: { value: '#322659' },
          950: { value: '#1a1433' },
        },
        darkPurple: {
          900: { value: '#0e0b16' }, // Fundo principal super escuro com tom roxo
          800: { value: '#171224' }, // Fundo dos cards (panel)
          700: { value: '#231b36' }, // Fundo elevado (hover/modais)
          600: { value: '#33294d' }, // Bordas
        }
      },
    },
    semanticTokens: {
      colors: {
        'surface.bg': { value: { _light: '#ffffff', _dark: '{colors.darkPurple.900}' } },
        'surface.panel': { value: { _light: '{colors.purple.50}', _dark: '{colors.darkPurple.800}' } },
        'surface.raised': { value: { _light: '{colors.purple.100}', _dark: '{colors.darkPurple.700}' } },
        'surface.border': { value: { _light: '{colors.purple.200}', _dark: '{colors.darkPurple.600}' } },
        'brand.accent': { value: { _light: '{colors.purple.600}', _dark: '{colors.purple.400}' } },
        'brand.accent1': { value: { _light: '{colors.purple.700}', _dark: '{colors.purple.300}' } },
        'brand.accent2': { value: { _light: '{colors.purple.800}', _dark: '{colors.purple.200}' } },
        'fg': { value: { _light: '{colors.darkPurple.900}', _dark: '{colors.purple.50}' } },
        'fg.muted': { value: { _light: '{colors.purple.800}', _dark: '{colors.purple.200}' } },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
