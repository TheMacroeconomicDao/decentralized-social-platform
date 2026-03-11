import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';
import { Form, Field, ErrorMessage } from 'formik';

export const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 560px;
  width: 100%;
  padding: 24px 37px;
  border-radius: 11px;
  background-color: ${({ theme }) => theme.primary.dark};
`;

export const FormLink = styled(Link)`
  color: ${({ theme }) => theme.blue.main};
`;

export const InputField = styled(Field)`
  width: 100%;
  padding: 0 14px;
  height: 44px;
  border-radius: 11px;
  color: ${({ theme }) => theme.primary.darker};
  font-size: ${({ theme }) => theme.typography.body1.fontSize};
  font-weight: ${({ theme }) => theme.typography.body1.fontWeight};
  line-height: ${({ theme }) => theme.typography.body1.fontLineHeight};
  background-color: ${({ theme }) => theme.primary.main};
  outline: none;
  border: 2px solid ${({ theme }) => theme.primary.main};
  transition: 0.2s ease;

  &::placeholder {
    color: ${({ theme }) => theme.secondary.main};
    font-size: ${({ theme }) => theme.typography.body1.fontSize};
    font-weight: ${({ theme }) => theme.typography.body1.fontWeight};
    line-height: ${({ theme }) => theme.typography.body1.fontLineHeight};
  }
  &:focus {
    &:focus {
      border-color: ${({ theme }) => theme.primary.darker};
    }
  }
`;

export const ErrorText = styled(ErrorMessage)`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  color: ${({ theme }) => theme.red.main};
  font-size: ${({ theme }) => theme.typography.body2.fontSize};
  font-weight: ${({ theme }) => theme.typography.body2.fontWeight};
  line-height: ${({ theme }) => theme.typography.body2.fontLineHeight};
  margin-top: 5px;
  margin-left: 3px;
`;

export const SubmitButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 37px;
  color: ${({ theme }) => theme.primary.dark};
  font-size: ${({ theme }) => theme.typography.body1.fontSize};
  font-weight: ${({ theme }) => theme.typography.body1.fontWeight};
  line-height: ${({ theme }) => theme.typography.body1.fontLineHeight};
  background-color: ${({ theme }) => theme.primary.main};
  border: none;
  border-radius: 11px;
  cursor: pointer;
  transition: 0.2s ease;
  &:hover {
    filter: brightness(110%);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:active {
    filter: brightness(80%);
  }
`;

export const SignWithButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 33px;
  color: ${({ theme }) => theme.primary.main};
  font-size: ${({ theme }) => theme.typography.body1.fontSize};
  font-weight: ${({ theme }) => theme.typography.body1.fontWeight};
  line-height: ${({ theme }) => theme.typography.body1.fontLineHeight};
  background: none;
  border: 1px solid ${({ theme }) => theme.primary.main};
  border-radius: 11px;
  cursor: pointer;
  transition: 0.2s ease;
  &:hover {
    filter: brightness(110%);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:active {
    filter: brightness(80%);
  }
`;
