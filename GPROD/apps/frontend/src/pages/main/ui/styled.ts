import styled from '@emotion/styled';

export const StyledMainLayout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background-color: ${({ theme }) => theme.blue.dark};
`;
