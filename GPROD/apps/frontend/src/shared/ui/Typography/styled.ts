import styled from '@emotion/styled';
import type { TypographyProps } from '.';

export const StyledTypography = styled('div')<TypographyProps>`
  color: ${({ color, theme }) => color || theme.primary.contrastText};

  ${({ variant, theme }) => {
    switch (variant) {
      case 'h1':
        return `
          font-size: ${theme.typography.h1.fontSize};
          font-weight: ${theme.typography.h1.fontWeight};
        `;
      case 'h2':
        return `
          font-size: ${theme.typography.h2.fontSize};
          font-weight: ${theme.typography.h2.fontWeight};
        `;
      case 'h3':
        return `
          font-size: ${theme.typography.h3.fontSize};
          font-weight: ${theme.typography.h3.fontWeight};
        `;
      case 'h4':
        return `
          font-size: ${theme.typography.h4.fontSize};
          font-weight: ${theme.typography.h4.fontWeight};
        `;
      case 'h5':
        return `
          font-size: ${theme.typography.h5.fontSize};
          font-weight: ${theme.typography.h5.fontWeight};
          font-style: ${theme.typography.h5.fontStyle};
          line-height: ${theme.typography.h5.fontLineHeight};
        `;
      case 'body1':
        return `
          font-size: ${theme.typography.body1.fontSize};
          font-weight: ${theme.typography.body1.fontWeight};
          line-height: ${theme.typography.body1.fontLineHeight};
        `;
      case 'body2':
        return `
          font-size: ${theme.typography.body2.fontSize};
          font-weight: ${theme.typography.body2.fontSize}     
          line-height: ${theme.typography.body2.fontLineHeight};   
      `;
      case 'table_h1':
        return `
          font-size: ${theme.typography.table_h1.fontSize};
          font-weight: ${theme.typography.table_h1.fontSize};
          line-height: ${theme.typography.table_h1.fontLineHeight};
        `;
      case 'table_body1':
        return `
          font-size: ${theme.typography.table_body1.fontSize};
          font-weight: ${theme.typography.table_body1.fontWeight};
          line-height: ${theme.typography.table_body1.fontLineHeight};
        `;
      case 'table_body2':
        return `
          font-size: ${theme.typography.table_body2.fontSize};
          font-weight: ${theme.typography.table_body2.fontWeight};
          line-height: ${theme.typography.table_body2.fontLineHeight};
          text-transform: ${theme.typography.table_body2.fontTextTransform};
        `;
      case 'menu_h1':
        return `
          font-size: ${theme.typography.menu_h1.fontSize};
          font-weight: ${theme.typography.menu_h1.fontWeight};
          line-height: ${theme.typography.menu_h1.fontLineHeight}
        `;
      case 'menu_body1':
        return `
          font-size: ${theme.typography.menu_body1.fontSize};
          font-weight: ${theme.typography.menu_body1.fontWeight};
          line-height: ${theme.typography.menu_body1.fontLineHeight};
        `;
      default:
        return `
          display: none;
        `;
    }
  }};
`;
