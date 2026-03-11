import { Flex } from '@/shared/ui';
import { StyledLink } from './styled';

interface Props {
  handleCloseSidebar: () => void;
}

export const SideBarLinks: React.FC<Props> = ({ handleCloseSidebar }) => {
  return (
    <Flex
      flexDirection="column"
      gap="41px"
    >
      <StyledLink
        to={'/projects'}
        onClick={handleCloseSidebar}
      >
        Projects
      </StyledLink>
      <StyledLink
        to={'/invites'}
        onClick={handleCloseSidebar}
      >
        Invites
      </StyledLink>
      <StyledLink
        to={'/teams'}
        onClick={handleCloseSidebar}
      >
        Teams
      </StyledLink>
      <StyledLink
        to={'/users'}
        onClick={handleCloseSidebar}
      >
        Users
      </StyledLink>
    </Flex>
  );
};
