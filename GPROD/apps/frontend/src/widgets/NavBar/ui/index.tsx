import { useTheme } from '@emotion/react';
import { Link, useLocation } from '@tanstack/react-router';
import { Flex, Input, Typography } from '@/shared/ui';
import { GplanIcon, NotificationIcon, SettingsIcon, UserDefaultIcon, HomeIcon } from './icons';
import { BurgerButton } from '../../SideBarWidget/ui/SidebarMobile/ui/SidebarMobile.styled';
import { useMediaQuery } from 'react-responsive';

interface Props {
  isOpenSidebar: boolean;
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NavBar: React.FC<Props> = ({ isOpenSidebar, setIsOpenSidebar }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const openSidebar = () => setIsOpenSidebar(true);
  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      p="19px 46px"
      h="80px"
      bg={theme.primary.darker}
      gap="8px"
    >
      <Flex
        w="100%"
        gap="22%"
        h="100%"
        alignItems="center"
      >
        <Flex
          gap="15px"
          justifyContent="center"
          alignItems="center"
        >
          {isMobile ? (
            <>
              {!isOpenSidebar && (
                <BurgerButton
                  onClick={openSidebar}
                  aria-label={isOpenSidebar ? 'Close menu' : 'Open menu'}
                  isOpen={isOpenSidebar}
                >
                  <span />
                  <span />
                  <span />
                </BurgerButton>
              )}
            </>
          ) : (
            <>
              <GplanIcon fill={theme.primary.contrastText} />
              <Link to="/">
                <Typography variant="h3">Gyber Projects</Typography>
              </Link>
              <p style={{ fontSize: '1rem', fontWeight: '500', color: theme.primary.contrastText }}>
                Projects
              </p>
            </>
          )}
        </Flex>
      </Flex>
      <Flex
        w="100%"
        gap="7%"
        h="100%"
        alignItems="center"
        justifyContent="flex-end"
        minW="250px"
      >
        <Flex
          maxW="512px"
          w="100%"
          alignItems="center"
          gap="26px"
        >
          <Input placeholder="Search" />
          <Flex
            alignItems="center"
            gap="15px"
          >
            <Link to="/">
              <NotificationIcon fill={theme.primary.contrastText} />
            </Link>
            <Link to="/">
              <SettingsIcon fill={theme.primary.contrastText} />
            </Link>
          </Flex>
        </Flex>
        <Link to="/">
          <UserDefaultIcon fill={theme.primary.contrastText} />
        </Link>
      </Flex>
    </Flex>
  );
};
