import '@emotion/react';

interface TypographyStyle {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  fontLetterSpacing?: string;
  fontLineHeight?: string;
  fontStyle?: string;
  fontTextTransform?: string;
}

declare module '@emotion/react' {
  export interface Theme {
    primary: {
      main: string;
      contrastText: string;
      dark: string;
      darker: string;
    };
    secondary: {
      main: string;
      dark: string;
    };
    blue: {
      main: string;
      dark: string;
    };
    yellow: {
      main: string;
      light: string;
    };
    green: {
      main: string;
      light: string;
    };
    purple: {
      main: string;
    };
    orange: {
      main: string;
    };
    red: {
      main: string;
    };
    typography: {
      fontFamily: string;
      h1: TypographyStyle;
      h2: TypographyStyle;
      h3: TypographyStyle;
      h4: TypographyStyle;
      h5: TypographyStyle;
      body1: TypographyStyle;
      body2: TypographyStyle;
      table_h1: TypographyStyle;
      table_body1: TypographyStyle;
      table_body2: TypographyStyle;
      menu_h1: TypographyStyle;
      menu_body1: TypographyStyle;
    };
  }
}
