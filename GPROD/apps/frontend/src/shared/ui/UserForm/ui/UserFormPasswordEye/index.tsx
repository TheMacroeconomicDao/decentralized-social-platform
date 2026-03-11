import { useTheme } from '@emotion/react';
import React from 'react';
import { PasswordEye } from './icons/PasswordEye/PasswordEye';
import { EyeButton } from './styled';

interface IUserFormPasswordEye {
  toggleVisibility: () => void;
  isVisible: boolean;
}

export const UserFormPasswordEye: React.FC<IUserFormPasswordEye> = ({ toggleVisibility }) => {
  const theme = useTheme();

  return (
    <EyeButton
      type="button"
      onMouseDown={toggleVisibility}
    >
      <PasswordEye fill={theme.primary.dark} />
    </EyeButton>
  );
};
