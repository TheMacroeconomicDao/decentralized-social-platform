import { useTheme } from '@emotion/react';
import { DropdownIcon } from './icon/Dropdown';
import type { ISelectProps } from './model/types';
import { StyledContainer, StyledSelect } from './styled';

export const Select: React.FC<ISelectProps> = ({
  value,
  onChange,
  placeholder,
  options = [],
  ariaLabel,
}) => {
  const theme = useTheme();

  return (
    <StyledContainer>
      <StyledSelect
        value={value ?? ''}
        onChange={e => onChange?.(e.target.value)}
        aria-label={ariaLabel || placeholder}
      >
        {placeholder && (
          <option
            value=""
            disabled
          >
            {placeholder}
          </option>
        )}
        {options.map(option => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </StyledSelect>
      <DropdownIcon fill={theme.primary.main} />
    </StyledContainer>
  );
};
