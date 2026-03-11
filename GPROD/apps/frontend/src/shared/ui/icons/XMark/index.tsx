export const XMarkIcon = ({ fill }: { fill: string }): JSX.Element => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="9"
      height="9"
      viewBox="0 0 9 9"
      fill="none"
    >
      <path
        d="M1.10938 1.32007L8.39982 8.48511"
        stroke={fill}
        strokeLinecap="round"
      />
      <path
        d="M8.40039 1.32007L1.10995 8.48511"
        stroke={fill}
        strokeLinecap="round"
      />
    </svg>
  );
};
