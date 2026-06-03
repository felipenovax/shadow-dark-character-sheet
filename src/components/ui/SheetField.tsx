// ui
import {
  Input,
  NativeSelect,
  NumberInput,
  Text,
  type TextProps,
} from '@chakra-ui/react';

type Option = { value: string; label: string };

type BaseProps = {
  isEditing: boolean;
  placeholder?: string;
  textProps?: TextProps;
};

type TextFieldProps = BaseProps & {
  type?: 'text';
  value: string;
  onChange: (value: string) => void;
};

type NumberFieldProps = BaseProps & {
  type: 'number';
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

type SelectFieldProps = BaseProps & {
  type: 'select';
  value: string;
  onChange: (value: string) => void;
  options: Option[];
};

type Props = TextFieldProps | NumberFieldProps | SelectFieldProps;

const EMPTY_PLACEHOLDER = '—';

const inputStyles = {
  bg: 'surface.raised',
  borderColor: 'surface.border',
  size: 'sm',
} as const;

const DisplayValue = ({
  label,
  textProps,
}: {
  label: string;
  textProps?: TextProps;
}) => (
  <Text
    fontSize="1.5rem"
    fontWeight="bold"
    color={label === EMPTY_PLACEHOLDER ? 'fg.muted' : 'fg'}
    {...textProps}
  >
    {label}
  </Text>
);

export const SheetField = (props: Props) => {
  const { isEditing, placeholder, textProps } = props;

  if (props.type === 'number') {
    if (!isEditing) {
      return <DisplayValue label={String(props.value)} textProps={textProps} />;
    }

    return (
      <NumberInput.Root
        value={String(props.value)}
        min={props.min}
        max={props.max}
        onValueChange={(details) =>
          props.onChange(
            Number.isNaN(details.valueAsNumber) ? 0 : details.valueAsNumber,
          )
        }
        {...inputStyles}
      >
        <NumberInput.Input />
      </NumberInput.Root>
    );
  }

  if (props.type === 'select') {
    const selected = props.options.find(
      (option) => option.value === props.value,
    );

    if (!isEditing) {
      return (
        <DisplayValue
          label={selected?.label ?? EMPTY_PLACEHOLDER}
          textProps={textProps}
        />
      );
    }

    return (
      <NativeSelect.Root size="sm">
        <NativeSelect.Field
          value={props.value}
          bg="surface.raised"
          borderColor="surface.border"
          onChange={(event) => props.onChange(event.currentTarget.value)}
        >
          {props.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
    );
  }

  if (!isEditing) {
    return (
      <DisplayValue
        label={props.value || EMPTY_PLACEHOLDER}
        textProps={textProps}
      />
    );
  }

  return (
    <Input
      value={props.value}
      placeholder={placeholder}
      onChange={(event) => props.onChange(event.currentTarget.value)}
      {...inputStyles}
    />
  );
};
