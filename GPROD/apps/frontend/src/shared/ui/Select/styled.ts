import styled from '@emotion/styled';
export const StyledContainer = styled.div`
  position: relative;
  width: auto;
  display: flex;
  justify-content: center;
  align-items: center;

  & > select:focus + svg {
    transform: rotate(180deg);
  }

  & > svg {
    position: absolute;
    right: 15px;
    transition: transform 0.3s ease;
    pointer-events: none;
  }
`;

export const StyledSelect = styled.select`
  display: inline-flex;
  align-items: center;
  padding: 11px 14px;
  width: auto;
  background-color: ${({ theme }) => theme.primary.dark};
  border-radius: 15px;
  font-size: ${({ theme }) => theme.typography.menu_body1.fontSize};
  font-weight: ${({ theme }) => theme.typography.menu_body1.fontWeight};
  color: ${({ theme }) => theme.primary.contrastText};
  transition: 0.3s ease;
  border-top: 2px solid rgba(0, 0, 0, 0);
  border-left: 2px solid rgba(0, 0, 0, 0);
  border-bottom: 2px solid rgba(0, 0, 0, 0);
  border-right: 2px solid rgba(0, 0, 0, 0);
  outline: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  position: relative;
  padding-right: 30px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  &:focus {
    border-top: 2px solid ${({ theme }) => theme.primary.main};
    border-left: 2px solid ${({ theme }) => theme.primary.main};
    border-bottom: 2px solid ${({ theme }) => theme.primary.dark};
    border-right: 2px solid ${({ theme }) => theme.primary.dark};
  }
`;
