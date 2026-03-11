import styled from '@emotion/styled';

export const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const DropdownContent = styled.div`
  position: fixed;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.primary.contrastText};
  border-radius: 12px;
  min-width: 130px;
  overflow: hidden;
  animation: dropdownFadeIn 0.15s ease;

  @keyframes dropdownFadeIn {
    from {
      opacity: 0;
      transform: translateY(-3px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  cursor: pointer;
  color: ${({ theme }) => theme.primary.dark};
  font-size: ${({ theme }) => theme.typography.table_h1.fontSize};
  transition: background-color 0.15s ease;

  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.primary.main};
    color: ${({ theme }) => theme.primary.darker};
    outline: none;
  }

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
`;
