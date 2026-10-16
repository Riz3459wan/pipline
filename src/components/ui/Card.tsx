import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`rounded-xl border border-slate-800 bg-slate-900/50 p-5 sm:p-6 ${className}`}>
    {children}
  </div>
);
