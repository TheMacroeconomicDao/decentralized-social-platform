export const BREAKPOINTS = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 960,
  xl: 1280,
  xxl: 1440,
} as const;

export const MEDIA_QUERIES = {
  xs: `(max-width: ${BREAKPOINTS.xs}px)`,
  sm: `(max-width: ${BREAKPOINTS.sm}px)`,
  md: `(max-width: ${BREAKPOINTS.md}px)`,
  lg: `(max-width: ${BREAKPOINTS.lg}px)`,
  xl: `(max-width: ${BREAKPOINTS.xl}px)`,
  xxl: `(max-width: ${BREAKPOINTS.xxl}px)`,
  
  // Min-width queries
  smUp: `(min-width: ${BREAKPOINTS.sm + 1}px)`,
  mdUp: `(min-width: ${BREAKPOINTS.md + 1}px)`,
  lgUp: `(min-width: ${BREAKPOINTS.lg + 1}px)`,
  xlUp: `(min-width: ${BREAKPOINTS.xl + 1}px)`,
  
  // Specific ranges
  mobile: `(max-width: ${BREAKPOINTS.md}px)`,
  tablet: `(min-width: ${BREAKPOINTS.md + 1}px) and (max-width: ${BREAKPOINTS.lg}px)`,
  desktop: `(min-width: ${BREAKPOINTS.lg + 1}px)`,
  
  // Device specific
  touch: '(hover: none) and (pointer: coarse)',
  mouse: '(hover: hover) and (pointer: fine)',
  
  // Accessibility
  reducedMotion: '(prefers-reduced-motion: reduce)',
  darkMode: '(prefers-color-scheme: dark)',
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;
export type MediaQueryKey = keyof typeof MEDIA_QUERIES; 