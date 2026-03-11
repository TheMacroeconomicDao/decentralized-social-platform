import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';

export const StyledLink = styled(Link)`
  font-size: 1.25rem;
  font-weight: 400;
  position: relative;
  color: ${({ theme }) => theme.primary.main};
  align-self: flex-start;
  &::after {
    content: '';
    position: absolute;
    border-radius: 15px;
    height: 5px;
    width: 0%;
    transition: 0.2s ease;
    left: 0;
    bottom: -7px;
    background-color: ${({ theme }) => theme.primary.main};
  }
  &:hover::after {
    width: 100%;
  }
`;
