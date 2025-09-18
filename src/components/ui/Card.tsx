import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false 
}) => {
  const baseClasses = 'bg-gray-800 rounded-lg shadow-md border border-gray-700';
  const hoverClasses = hover ? 'hover:bg-gray-700 transition-colors duration-200 cursor-pointer' : '';
  
  const classes = `${baseClasses} ${hoverClasses} ${className}`;
  
  return (
    <div className={classes}>
      {children}
    </div>
  );
};

export default Card;
