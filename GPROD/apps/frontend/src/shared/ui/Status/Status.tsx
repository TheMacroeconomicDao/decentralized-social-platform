import { useTheme } from '@emotion/react';
import type { FC } from 'react';
import { type RoleType } from '../../../shared/types';
import { StatusContainer } from './Status.styled';

interface IStatusProps {
  variant: RoleType;
}

export const Status: FC<IStatusProps> = ({ variant }) => {
  const theme = useTheme();

  return (
    <StatusContainer
      $bgColor={theme.primary.main}
      $textColor={theme.primary.dark}
    >
      {variant}
    </StatusContainer>
  );
};
