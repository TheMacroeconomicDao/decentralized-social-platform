export const ThemeIcon = ({ fill }: { fill: string }): JSX.Element => {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.18201 10.1966C2.18201 14.9601 6.04355 18.8216 10.807 18.8216C14.4364 18.8216 17.5422 16.5799 18.8153 13.4056C17.8219 13.8049 16.7349 14.0299 15.5987 14.0299C10.8352 14.0299 6.97367 10.1684 6.97367 5.40489C6.97367 4.27402 7.19537 3.18077 7.59105 2.19116C4.42042 3.46605 2.18201 6.56994 2.18201 10.1966Z"
        stroke={fill}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
