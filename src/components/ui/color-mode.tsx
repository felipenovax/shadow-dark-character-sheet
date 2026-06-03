'use client';

// libs
import type { IconButtonProps, SpanProps } from '@chakra-ui/react';
import { ClientOnly, IconButton, Skeleton, Span } from '@chakra-ui/react';
import { ThemeProvider, useTheme } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes';
import { forwardRef } from 'react';
import { LuMoon, LuSun } from 'react-icons/lu';

export type ColorModeProviderProps = ThemeProviderProps;

export const ColorModeProvider = (props: ColorModeProviderProps) => {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange {...props} />
  );
};

export type ColorMode = 'light' | 'dark';

type UseColorModeReturn = {
  colorMode: ColorMode;
  setColorMode: (colorMode: ColorMode) => void;
  toggleColorMode: () => void;
};

export const useColorMode = (): UseColorModeReturn => {
  const { resolvedTheme, setTheme, forcedTheme } = useTheme();
  const colorMode = forcedTheme || resolvedTheme;

  const toggleColorMode = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return {
    colorMode: colorMode as ColorMode,
    setColorMode: setTheme,
    toggleColorMode,
  };
};

export const useColorModeValue = <T,>(light: T, dark: T): T => {
  const { colorMode } = useColorMode();
  return colorMode === 'dark' ? dark : light;
};

export const ColorModeIcon = () => {
  const { colorMode } = useColorMode();
  return colorMode === 'dark' ? <LuMoon /> : <LuSun />;
};

type ColorModeButtonProps = Omit<IconButtonProps, 'aria-label'>;

export const ColorModeButton = forwardRef<
  HTMLButtonElement,
  ColorModeButtonProps
>((props, ref) => {
  const { toggleColorMode } = useColorMode();

  return (
    <ClientOnly fallback={<Skeleton boxSize="2rem" />}>
      <IconButton
        onClick={toggleColorMode}
        variant="ghost"
        aria-label="Alternar tema"
        size="sm"
        ref={ref}
        {...props}
        css={{
          _icon: {
            width: '1.25rem',
            height: '1.25rem',
          },
        }}
      >
        <ColorModeIcon />
      </IconButton>
    </ClientOnly>
  );
});

ColorModeButton.displayName = 'ColorModeButton';

export const LightMode = forwardRef<HTMLSpanElement, SpanProps>(
  (props, ref) => {
    return (
      <Span
        color="fg"
        display="contents"
        className="chakra-theme light"
        colorPalette="gray"
        colorScheme="light"
        ref={ref}
        {...props}
      />
    );
  },
);

LightMode.displayName = 'LightMode';

export const DarkMode = forwardRef<HTMLSpanElement, SpanProps>((props, ref) => {
  return (
    <Span
      color="fg"
      display="contents"
      className="chakra-theme dark"
      colorPalette="gray"
      colorScheme="dark"
      ref={ref}
      {...props}
    />
  );
});

DarkMode.displayName = 'DarkMode';
