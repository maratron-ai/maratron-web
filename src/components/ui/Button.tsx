import React from 'react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <button
    {...props}
    className={
      `bg-primary text-white font-medium px-4 py-2 rounded hover:opacity-90 focus:outline-none focus:ring ${className}`
    }
  >
    {children}
  </button>
);
