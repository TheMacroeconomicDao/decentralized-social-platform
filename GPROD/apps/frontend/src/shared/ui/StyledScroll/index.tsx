import { Global, css, useTheme } from '@emotion/react';

export const StyledScroll: React.FC = () => {
  const theme = useTheme();
  return (
    <Global
      styles={css`
        ::-webkit-scrollbar {
          -webkit-appearance: none;
          width: 7px;
        }

        ::-webkit-scrollbar-thumb {
          border-radius: 5px;
          background-color: rgba(0, 0, 0, 0);
          -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0);
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0);
        }

        ::-webkit-scrollbar-thumb {
          background: ${theme.primary.contrastText};
        }
      `}
    />
  );
};
