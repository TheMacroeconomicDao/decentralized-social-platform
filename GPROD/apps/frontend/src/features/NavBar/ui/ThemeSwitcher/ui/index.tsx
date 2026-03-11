import { useTheme } from '@emotion/react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTheme } from '../model/slice';
import { ThemeIcon } from './icons/ThemeIcon';
import { NavbarActionsThemeSwitcher } from './styled';

export const ThemeSwitcher: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [disableAnimations, setDisableAnimations] = useState(false);

  const handleClick = (): void => {
    setDisableAnimations(true);
    dispatch(toggleTheme());

    setTimeout(() => {
      setDisableAnimations(false);
    }, 1000);
  };

  return (
    <>
      <style>
        {disableAnimations &&
          `
          * {
            transition: 0.3s !important;
          }
        `}
      </style>
      <NavbarActionsThemeSwitcher onClick={handleClick}>
        <ThemeIcon fill={theme.primary.contrastText} />
      </NavbarActionsThemeSwitcher>
    </>
  );
};
