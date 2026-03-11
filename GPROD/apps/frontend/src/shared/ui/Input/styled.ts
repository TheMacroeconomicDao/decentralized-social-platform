import styled from '@emotion/styled';

export const StyledInput = styled.input`
  display: flex;
  align-items: center;
  padding: 11px 14px;
  width: 100%;
  height: 42px;
  background-color: ${({ theme }) => theme.primary.dark};
  border-radius: 15px;
  font-size: ${({ theme }) => theme.typography.menu_body1.fontSize};
  font-weight: ${({ theme }) => theme.typography.menu_body1.fontWeight};
  line-height: ${({ theme }) => theme.typography.menu_body1.fontLineHeight};
  color: ${({ theme }) => theme.primary.contrastText};
  transition: 0.3s ease;
  border-top: 2px solid rgba(0, 0, 0, 0);
  border-left: 2px solid rgba(0, 0, 0, 0);
  border-bottom: 2px solid rgba(0, 0, 0, 0);
  border-right: 2px solid rgba(0, 0, 0, 0);
  &:focus {
    border-top: 2px solid ${({ theme }) => theme.primary.dark};
    border-left: 2px solid ${({ theme }) => theme.primary.dark};
    border-bottom: 2px solid ${({ theme }) => theme.primary.main};
    border-right: 2px solid ${({ theme }) => theme.primary.main};
  }
  &::placeholder {
    font-size: 1rem;
    font-weight: 400;
    color: ${({ theme }) => theme.secondary.main};
    font-size: ${({ theme }) => theme.typography.menu_body1.fontSize};
    font-weight: ${({ theme }) => theme.typography.menu_body1.fontWeight};
    line-height: ${({ theme }) => theme.typography.menu_body1.fontLineHeight};
  }
`;

export const StyledTextArea = styled.textarea`
  display: flex;
  align-items: center;
  padding: 15px;
  width: 100%;
  height: 42px;
  background-color: ${({ theme }) => theme.primary.dark};
  border-radius: 15px;
  font-size: ${({ theme }) => theme.typography.table_h1.fontSize};
  font-weight: ${({ theme }) => theme.typography.table_h1.fontWeight};
  line-height: ${({ theme }) => theme.typography.table_h1.fontLineHeight};
  color: ${({ theme }) => theme.primary.main};
  transition: 0.3s ease;
  height: 163px;
  outline: none;
  resize: none;
  border-top: 2px solid rgba(0, 0, 0, 0);
  border-left: 2px solid rgba(0, 0, 0, 0);
  border-bottom: 2px solid rgba(0, 0, 0, 0);
  border-right: 2px solid rgba(0, 0, 0, 0);
  &:focus {
    border-top: 2px solid ${({ theme }) => theme.primary.dark};
    border-left: 2px solid ${({ theme }) => theme.primary.dark};
    border-bottom: 2px solid ${({ theme }) => theme.primary.main};
    border-right: 2px solid ${({ theme }) => theme.primary.main};
  }
  &::placeholder {
    font-size: 0.875rem;
    font-weight: 700;
    color: ${({ theme }) => theme.secondary.main};
    font-size: ${({ theme }) => theme.typography.table_h1.fontSize};
    font-weight: ${({ theme }) => theme.typography.table_h1.fontWeight};
    line-height: ${({ theme }) => theme.typography.table_h1.fontLineHeight};
  }
`;
