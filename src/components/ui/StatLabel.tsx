// ui
import { Text, type TextProps } from '@chakra-ui/react';

type Props = TextProps & {
  children: string;
};

export const StatLabel = ({ children, ...rest }: Props) => {
  return (
    <Text
      fontSize="0.6875rem"
      fontWeight="bold"
      letterSpacing="0.08em"
      textTransform="uppercase"
      color="brand.accent2"
      {...rest}
    >
      {children}
    </Text>
  );
};
