import styled from '@emotion/styled';

interface StatusContainerProps {
  $bgColor: string;
  $textColor: string;
}

export const StatusContainer = styled.div<StatusContainerProps>`
  display: inline-flex;
  padding: 4px 12px;
  border-radius: 16px;
  color: ${({ $textColor }) => $textColor};
  background-color: ${({ $bgColor }) => $bgColor};
  font-size: ${({ theme }) => theme.typography.menu_body1.fontSize};
`;
