import styled from '@emotion/styled';

export const NavbarActionsThemeSwitcher = styled.button`
  height: 40px;
  width: 40px;
  border-radius: 15px;
  background-color: ${({ theme }) => theme.blue.dark};
  border: 0.6px solid ${({ theme }) => theme.secondary.dark};
  img {
    rect {
      fill: ${({ theme }) => theme.secondary.dark};
    }
  }
`;
