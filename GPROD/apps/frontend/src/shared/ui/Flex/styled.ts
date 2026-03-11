import styled from '@emotion/styled';
import type { IFlexProps } from './model/types';

// const getResponsiveValue = (value?: string): string => {
//   if (!value) return '';

//   return value.replace(/calc\((.*?)\)|(\d+\.?\d*)px/g, (match, calcContent, num) => {
//     if (calcContent) {
//       return `calc(${calcContent.replace(/(\d+\.?\d*)px/g, (_: string, n: string) => `${parseFloat(n) * 0.85}px`)})`;
//     }
//     if (num) {
//       return `${parseFloat(num) * 0.85}px`;
//     }
//     return match;
//   });
// };

export const StyledFlex = styled.div<IFlexProps>`
  display: flex;
  flex-wrap: ${({ flexWrap }) => flexWrap};
  align-content: ${({ alignContent }) => alignContent};
  flex-direction: ${({ flexDirection }) => flexDirection};
  justify-content: ${({ justifyContent }) => justifyContent};
  align-items: ${({ alignItems }) => alignItems};
  gap: ${({ gap }) => gap};
  padding: ${({ p }) => p};

  width: ${({ w }) => w};
  max-width: ${({ maxW }) => maxW};
  min-width: ${({ minW }) => minW};
  height: ${({ h }) => h};
  max-height: ${({ maxH }) => maxH};
  min-height: ${({ minH }) => minH};

  background-color: ${({ bg }) => bg};
  margin: ${({ m }) => m};
  margin-right: ${({ mr }) => mr};
  margin-left: ${({ ml }) => ml};
  margin-top: ${({ mt }) => mt};
  margin-bottom: ${({ mb }) => mb};

  border: ${({ border }) => border};
  border-radius: ${({ rounded }) => rounded};
  border-bottom: ${({ borderB }) => borderB};

  overflow: ${({ overflow }) => overflow};
  overflow-y: ${({ overflowY }) => overflowY};
  overflow-x: ${({ overflowX }) => overflowX};

  position: ${({ position }) => position};
`;
