import React from 'react';

export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <label {...props} className={`block font-semibold mb-1 ${className}`}>
    {children}
  </label>
);
