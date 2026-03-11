export const DropdownIcon = ({ fill }: { fill: string }): JSX.Element => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="10"
      viewBox="0 0 12 10"
      fill="none"
    >
      <g clipPath="url(#clip0_385_7570)">
        <path
          d="M11.8125 2.38477C11.6328 2.23698 11.3412 2.23698 11.1615 2.38477L6.44752 6.61677L1.73311 2.38477C1.55338 2.23698 1.26178 2.23698 1.08206 2.38477C0.902335 2.53257 0.902335 2.77227 1.08206 2.92005L6.09861 7.42359C6.19443 7.50237 6.32188 7.53612 6.44705 7.53089C6.57266 7.53612 6.69968 7.50237 6.7955 7.42359L11.8125 2.91965C11.9922 2.77189 11.9922 2.53257 11.8125 2.38477Z"
          fill={fill}
        />
      </g>
      <defs>
        <clipPath id="clip0_385_7570">
          <rect
            width="11"
            height="9"
            fill="white"
            transform="translate(0.947266 0.402588)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};
