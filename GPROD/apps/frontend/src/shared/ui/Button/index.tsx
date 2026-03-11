import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react';
import { StyledButton } from './styled';

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primaryDarker'
    | 'blueDark'
    | 'primaryMain'
    | 'green'
    | 'blue'
    | 'bigButton'
    | 'transparent';
  icon?: ReactElement;
  children?: ReactNode;
  isRounded?: boolean;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
}

export const Button: React.FC<IButtonProps> = ({
  variant = 'primaryMain',
  icon,
  children,
  isRounded,
  iconPosition = 'left',
  disabled = false,
  ...props
}) => {
  return (
    <StyledButton
      disabled={disabled}
      variant={variant}
      isRounded={isRounded}
      iconPosition={iconPosition}
      {...props}
    >
      {icon && <>{icon}</>}
      {children}
    </StyledButton>
  );
};
