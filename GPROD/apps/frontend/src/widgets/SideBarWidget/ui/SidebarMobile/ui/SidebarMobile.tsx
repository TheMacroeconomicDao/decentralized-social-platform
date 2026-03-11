import { SideBarLinks } from '@/features/SideBar';
import { Button, Flex, Typography } from '@/shared/ui';
import { Link, ToPathOption, useLocation } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { BurgerButton, MenuOverlay, MobileMenu } from './SidebarMobile.styled';
import { HomeIcon } from '../../../../NavBar/ui/icons';
import { useTheme } from '@emotion/react';

interface Props {
  isOpenSidebar: boolean;
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SideBarMobile: React.FC<Props> = ({ isOpenSidebar, setIsOpenSidebar }) => {
  const closeMenu = () => setIsOpenSidebar(false);
  const theme = useTheme();

  const location = useLocation().pathname;

  const handleCloseSidebar = () => setIsOpenSidebar(false);

  let nextLocation: ToPathOption = '';

  switch (location) {
    case '/projects':
      nextLocation = '/projects/create-project';
      break;
    case '/invites':
      nextLocation = '/invites/create-invites';
      break;
    case '/teams':
      nextLocation = '/teams/create-team';
      break;
    case '/users':
      nextLocation = '/users/user-details';
      break;
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };

    if (isOpenSidebar) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    } else {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpenSidebar]);

  return (
    <>
      {/* {isOpenSidebar && (

      )} */}

      {isOpenSidebar && (
        <MenuOverlay
          isOpen
          onClick={closeMenu}
        >
          <MobileMenu
            isOpen
            onClick={e => e.stopPropagation()}
          >
            <Flex
              flexDirection="row"
              justifyContent="space-between"
              mb="20px"
            >
              <Flex
                alignItems="center"
                gap="8px"
              >
                <Link
                  onClick={handleCloseSidebar}
                  to="/"
                >
                  <Typography variant="h4"> На главную</Typography>
                </Link>
              </Flex>

              <BurgerButton
                onClick={closeMenu}
                aria-label={isOpenSidebar ? 'Close menu' : 'Open menu'}
                isOpen={true}
              >
                <span />
                <span />
                <span />
              </BurgerButton>
            </Flex>

            <Button variant="bigButton">
              <Link
                to={nextLocation}
                onClick={handleCloseSidebar}
              >
                CREATE
              </Link>
            </Button>
            <Flex mt="42px">
              <SideBarLinks handleCloseSidebar={handleCloseSidebar} />
            </Flex>
          </MobileMenu>
        </MenuOverlay>
      )}
    </>
  );
};
