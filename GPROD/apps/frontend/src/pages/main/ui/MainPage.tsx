import { useUserDetailsQuery } from '@/entities/User/details/model/useUserDetailsQuery';
import { ThemeSwitcher } from '@/features/NavBar';
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
import { useTheme } from '@emotion/react';
import type { FormikHelpers } from 'formik';

export const MainPage: React.FC = () => {
  const theme = useTheme();

  const userId = '5';
  const { data: userDetailsData, isPending } = useUserDetailsQuery(userId);
  // console.log('111 ~ data:', userDetailsData);

  return (
    <Flex
      flexDirection="column"
      h="calc(100vh - 80px)"
      overflowY="scroll"
      w="100%"
    >
      <Flex
        p="25px 40px"
        gap="10px"
        flexWrap="wrap"
        alignContent="flex-start"
        alignItems="flex-end"
      >
        <Typography variant="h1">Gyber Projects</Typography>
        <Typography variant="h2">Gyber Projects</Typography>
        <Typography variant="h3">Gyber Projects</Typography>
        <Typography variant="h4">Gyber Projects</Typography>
        <Typography variant="h5">Gyber Projects</Typography>
        <Typography variant="body1">Gyber Projects</Typography>
        <Typography variant="body2">Gyber Projects</Typography>
        <Typography variant="table_h1">Gyber Projects</Typography>
        <Typography variant="table_body1">Gyber Projects</Typography>
        <Typography variant="table_body2">Gyber Projects</Typography>
        <Typography variant="menu_h1">Gyber Projects</Typography>
        <Typography variant="menu_body1">Gyber Projects</Typography>
        <ThemeSwitcher />
        <Button variant="blueDark">
          <Typography variant={'menu_body1'}>Clear</Typography>
        </Button>
        <Button variant="primaryDarker">
          <Typography variant={'menu_body1'}>
            Priority <DropdownIcon fill={theme.primary.main} />
          </Typography>
        </Button>
        <Button variant="primaryMain">
          <Typography
            color={theme.primary.dark}
            variant={'menu_body1'}
          >
            Apply
          </Typography>
        </Button>
        <Button variant="green">
          <Typography variant="menu_body1">Green</Typography>
        </Button>
        <Button
          variant="blue"
          icon={<MessageIcon fill={theme.primary.main} />}
        />
        <Button
          variant="green"
          icon={<CallIcon fill={theme.primary.main} />}
        />
        <Button
          variant="primaryDarker"
          iconPosition="right"
          icon={<DropdownIcon fill={theme.primary.main} />}
        >
          <Typography variant={'menu_body1'}>Priority</Typography>
        </Button>
        <Button variant="blueDark">
          <Typography variant={'table_body1'}>Apply</Typography>
        </Button>
        <Button
          variant="primaryMain"
          isRounded
          icon={<ArrowRightIcon fill={theme.blue.dark} />}
        />
        <Button
          variant="primaryMain"
          isRounded
          icon={<PlusIcon fill={theme.blue.dark} />}
        />
      </Flex>
      <Flex
        flexDirection="column"
        alignItems="flex-end"
        p="25px 40px"
        gap="10px"
        flexWrap="wrap"
        alignContent="flex-start"
      >
        <Input placeholder="Title" />
        <Select placeholder="Select" />
        <Input
          type="date"
          placeholder="Target date"
        />
        <Input
          type="email"
          placeholder="Enter email"
        />
        <Input
          type="number"
          placeholder="Enter number"
        />
        <Input
          type="password"
          placeholder="Enter password"
        />
        <Input
          type="textarea"
          placeholder="Write description..."
        />
        <UserForm
          isSignInPage={true}
          titleText="Sign In"
          submitText="Sign In"
          // footerText="Don't have an account?"
          // footerLink="Sign Up"
          inputs={[
            { name: 'login', type: 'text', placeholder: 'Login' },
            { name: 'password', type: 'password', placeholder: 'Password' },
          ]}
          onSubmit={function (
            values: Record<string, string>,
            formikHelpers: FormikHelpers<Record<string, string>>
          ): void {
            throw new Error('Function not implemented.');
          }}
        />
      </Flex>
    </Flex>
  );
};
