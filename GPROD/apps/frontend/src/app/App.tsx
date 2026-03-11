import { ThemeProvider } from '@emotion/react';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { darkTheme, lightTheme, typography } from '@/shared/theme';
import { useAppSelector } from './model';
import { routeTree } from './routerTree.gen';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App(): JSX.Element {
  const theme = useAppSelector(state => state.themeReducer.theme);

  return (
    <ThemeProvider theme={{ ...(theme === 'light' ? lightTheme : darkTheme), typography }}>
        <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
