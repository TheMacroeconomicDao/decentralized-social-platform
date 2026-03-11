import styled from '@emotion/styled';
import type { IButtonProps } from './index';

export const StyledButton = styled.button<IButtonProps>`
  background: none;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: ${({ isRounded }) => (isRounded ? '50px' : '10px')};
  padding: ${({ isRounded }) => (isRounded ? '0px' : '15px')};
  width: ${({ isRounded }) => (isRounded ? '40px' : 'auto')};
  height: 40px;
  border: none;
  cursor: pointer;
  transition: 0.2s ease;

  ${({ variant, theme }) => {
    switch (variant) {
      case 'primaryDarker':
        return `
          background-color: ${theme.primary.dark};
        `;
      case 'blueDark':
        return `
          border: 1.5px solid ${theme.primary.main};
        `;
      case 'primaryMain':
        return `
          background: ${theme.primary.main};
        `;
      case 'green':
        return `
          background: ${theme.green.main};
          border-radius: 15px;
        `;
      case 'blue':
        return `
          background: ${theme.blue.main};
          border-radius: 15px;
        `;
      case 'bigButton':
        return `
          background-color: ${theme.primary.main};
          color: ${theme.blue.dark};
          font-size: ${theme.typography.h2.fontSize};
          font-weight: ${theme.typography.h2.fontWeight};
          height: 50px;
          min-width: 240px;
          align-self: flex-start;
        `;
      case 'transparent':
        return `
          padding: 0 2px;
          height: auto;
        `;
    }
  }};

  flex-direction: ${({ iconPosition }) => (iconPosition === 'right' ? 'row-reverse' : 'row')};

  &:hover {
    filter: brightness(110%);
  }

  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  &:active {
    filter: brightness(80%);
  }
`;
