import { SideBarLinks } from '@/features/SideBar';
import { Button, Flex } from '@/shared/ui';
import { useTheme } from '@emotion/react';
import type { ToPathOption } from '@tanstack/react-router';
import { Link, useLocation } from '@tanstack/react-router';

const BasicButton: React.FC = () => {
  return <Button variant="bigButton">CREATE</Button>;
};

export const SidebarDesktop: React.FC = () => {
  const theme = useTheme();
  const location = useLocation().pathname;

  let nextLocation: ToPathOption = '';

  switch (location) {
    case '/projects':
      nextLocation = '/projects/createProject';
      break;
    case '/invites':
      nextLocation = '/invites/createInvites';
      break;
    case '/teams':
      nextLocation = '/teams/createTeam';
      break;
    case '/users':
      nextLocation = '/users/userDetails';
      break;
  }
  return (
    <Flex
      flexDirection="column"
      bg={theme.primary.dark}
      maxW="443px"
      w="100%"
      h="100vh"
      p="48px"
    >
      <Button variant="bigButton">
        <Link to={nextLocation}>CREATE</Link>
      </Button>
      <Flex mt="42px">
        <SideBarLinks />
      </Flex>
    </Flex>
  );
};
