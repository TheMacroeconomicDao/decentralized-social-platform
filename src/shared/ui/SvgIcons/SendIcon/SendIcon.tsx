import React from 'react';

interface SendIconProps {
  className?: string;
  size?: number;
  color?: string;
}

export const SendIcon: React.FC<SendIconProps> = ({ 
  className = '', 
  size = 20, 
  color = 'currentColor' 
}) => {
  return (
    <svg 
      className={className}
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" 
        fill={color}
      />
    </svg>
  );
}; 