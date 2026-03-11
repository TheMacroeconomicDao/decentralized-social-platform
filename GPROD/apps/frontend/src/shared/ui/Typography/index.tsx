import { StyledTypography } from './styled';

export type TypographyVariantType = keyof typeof tagMapping;

export interface TypographyProps {
  variant: TypographyVariantType;
  color?: string;
  children: React.ReactNode;
}

const tagMapping = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  body1: 'p',
  body2: 'p',
  table_h1: 'p',
  table_body1: 'p',
  table_body2: 'p',
  menu_h1: 'p',
  menu_body1: 'p',
} as const;

export const Typography: React.FC<TypographyProps> = ({ variant, color, children }) => {
  const Tag = tagMapping[variant];

  return (
    <StyledTypography
      as={Tag}
      variant={variant}
      color={color}
    >
      {children}
    </StyledTypography>
  );
};
