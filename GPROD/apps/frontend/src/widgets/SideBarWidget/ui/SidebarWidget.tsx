import { useMediaQuery } from 'react-responsive';
import { SidebarDesktop } from './SidebarDesktop';
import { SideBarMobile } from './SidebarMobile';

interface Props {
  isOpenSidebar: boolean;
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SideBarWidget: React.FC<Props> = ({ isOpenSidebar, setIsOpenSidebar }) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  return (
    <>
      {isMobile ? (
        <SideBarMobile
          isOpenSidebar={isOpenSidebar}
          setIsOpenSidebar={setIsOpenSidebar}
        />
      ) : (
        <SidebarDesktop />
      )}
    </>
  );
};
