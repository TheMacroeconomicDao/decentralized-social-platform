import { FC, useState } from "react";

interface BurgerIconProps {
  active: boolean;
}

const BurgerIcon: FC<BurgerIconProps> = ({ active = false }) => {
  return (
    <>
      {active ? (
        <svg
          width="24px"
          height="24px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z"
            fill="#E1E1E1"
          />
        </svg>
      ) : (
        <svg
          width="24px"
          height="24px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 12H20"
            stroke="#E1E1E1"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M5 17H20"
            stroke="#E1E1E1"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M5 7H20"
            stroke="#E1E1E1"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}
    </>
  );
};

export default BurgerIcon;
