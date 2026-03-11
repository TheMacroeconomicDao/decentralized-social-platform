import React from 'react';
import type { IFlexProps } from './model/types';
import { StyledFlex } from './styled';

export const Flex: React.FC<IFlexProps> = ({ children, ...props }) => {
  return <StyledFlex {...props}>{children}</StyledFlex>;
};
