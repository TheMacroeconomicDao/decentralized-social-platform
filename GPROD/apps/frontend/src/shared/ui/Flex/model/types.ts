export interface IFlexProps extends React.HTMLAttributes<HTMLDivElement> {
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  alignItems?: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  alignContent?:
    | 'stretch'
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around';
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto' | 'clip';
  overflowY?: 'visible' | 'hidden' | 'scroll' | 'auto' | 'clip';
  overflowX?: 'visible' | 'hidden' | 'scroll' | 'auto' | 'clip';
  position?:
    | 'static'
    | 'relative'
    | 'absolute'
    | 'fixed'
    | 'sticky'
    | 'inherit'
    | 'initial'
    | 'unset';
  ml?: string;
  mr?: string;
  mt?: string;
  mb?: string;
  gap?: string;
  p?: string;
  w?: string;
  maxW?: string;
  minW?: string;
  minH?: string;
  maxH?: string;
  h?: string;
  bg?: string;
  m?: string;
  border?: string;
  rounded?: string;
  borderB?: string;
}
