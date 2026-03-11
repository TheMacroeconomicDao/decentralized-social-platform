import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';

export const BurgerButton = styled.button<{ isOpen: boolean }>`
  position: relative;
  z-index: 100;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 32px;
  height: 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.5s;
  &:hover {
    opacity: 0.8;
  }

  span {
    width: 100%;
    height: 3px;
    background: ${({ theme }) => theme.primary.main};
    border-radius: 2px;
    transition: all 0.3s ease;

    &:nth-of-type(1) {
      transform: ${({ isOpen }) => (isOpen ? 'rotate(45deg) translate(7px, 8px)' : 'none')};
    }

    &:nth-of-type(2) {
      opacity: ${({ isOpen }) => (isOpen ? 0 : 1)};
    }

    &:nth-of-type(3) {
      transform: ${({ isOpen }) => (isOpen ? 'rotate(-45deg) translate(7px, -8px)' : 'none')};
    }
  }
`;

export const MenuOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 90;
  pointer-events: ${({ isOpen }) => (isOpen ? 'auto' : 'none')};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

export const MobileMenu = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 75%;
  max-width: 300px;
  background: ${({ theme }) => theme.primary.dark};
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  padding: 20px 30px;
  transform: translateX(${({ isOpen }) => (isOpen ? '0%' : '-100%')});
  transition: transform 1s ease-in-out;
  z-index: 100;
`;
