// ui
import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        // Cores base customizadas
        brandLight: {
          bg: { value: '#F7F5FA' },
          panel: { value: '#FFFFFF' },
          raised: { value: '#EFEBF5' },
          border: { value: '#E2DCE8' },
          fg: { value: '#2D2338' },
          fgMuted: { value: '#685C77' },
          accent: { value: '#7048B6' },
          accentHover: { value: '#593694' },
        },
        brandDark: {
          bg: { value: '#120F1A' },
          panel: { value: '#1B1626' },
          raised: { value: '#261E35' },
          border: { value: '#362C4A' },
          fg: { value: '#EAE5F2' },
          fgMuted: { value: '#A096B0' },
          accent: { value: '#A378ED' },
          accentHover: { value: '#B692F5' },
        }
      },
    },
    semanticTokens: {
      colors: {
        'surface.bg': { value: { _light: '{colors.brandLight.bg}', _dark: '{colors.brandDark.bg}' } },
        'surface.panel': { value: { _light: '{colors.brandLight.panel}', _dark: '{colors.brandDark.panel}' } },
        'surface.raised': { value: { _light: '{colors.brandLight.raised}', _dark: '{colors.brandDark.raised}' } },
        'surface.border': { value: { _light: '{colors.brandLight.border}', _dark: '{colors.brandDark.border}' } },
        'brand.accent': { value: { _light: '{colors.brandLight.accent}', _dark: '{colors.brandDark.accent}' } },
        'brand.accent1': { value: { _light: '{colors.brandLight.accentHover}', _dark: '{colors.brandDark.accentHover}' } },
        'brand.accent2': { value: { _light: '{colors.brandLight.accent}', _dark: '{colors.brandDark.accent}' } },
        'fg': { value: { _light: '{colors.brandLight.fg}', _dark: '{colors.brandDark.fg}' } },
        'fg.default': { value: { _light: '{colors.brandLight.fg}', _dark: '{colors.brandDark.fg}' } },
        'fg.muted': { value: { _light: '{colors.brandLight.fgMuted}', _dark: '{colors.brandDark.fgMuted}' } },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
