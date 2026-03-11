import { useTheme } from '@emotion/react';
import type { FormikHelpers } from 'formik';
import { useState } from 'react';
import { Outlet } from '@tanstack/react-router';
import { NavBar } from '@/widgets/NavBar';
import { SideBarWidget } from '@/widgets/SideBarWidget';
import { ThemeSwitcher } from '@/features/NavBar';

// eslint-disable-next-line @conarti/feature-sliced/public-api
import { useUserDetailsQuery } from '@/entities/User/details/model/useUserDetailsQuery';
import {
  ArrowRightIcon,
  Button,
  CallIcon,
  DropdownIcon,
  Flex,
  Input,
  MessageIcon,
  PlusIcon,
  Select,
  Typography,
  UserForm,
} from '@/shared/ui';
import { DataTable } from '@/shared/ui/DataTable';
import { columns, data, filters } from '@/shared/ui/DataTable/model/exampleData';
import { StyledMainLayout } from './styled';
import { useMediaQuery } from 'react-responsive';

export const MainLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);

  const [selectedValue, setSelectedValue] = useState('');

  const userId = '5';
  const { data: userDetailsData, isPending } = useUserDetailsQuery(userId);
  // console.log('111 ~ data:', userDetailsData);

  return (
    <StyledMainLayout>
      <NavBar
        isOpenSidebar={isOpenSidebar}
        setIsOpenSidebar={setIsOpenSidebar}
      />
      <Flex>
        <SideBarWidget
          isOpenSidebar={isOpenSidebar}
          setIsOpenSidebar={setIsOpenSidebar}
        />
        <Flex
          flexDirection="column"
          h="calc(100vh - 80px)"
          overflowY="scroll"
          w="100%"
        >
          <Outlet />
        </Flex>
      </Flex>
    </StyledMainLayout>
  );
};
