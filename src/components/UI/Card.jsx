import React from 'react';

export const Card = ({ children, className = '', hover = true }) => {
  const hoverClass = hover ? 'card-hover' : '';
  return (
    <div className={`p-6 rounded-lg bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm ${hoverClass} ${className}`}>
      {children}
    </div>
  );
};

export const GlassCard = ({ children, className = '' }) => {
  return (
    <div className={`p-6 rounded-xl bg-slate-900/50 border border-slate-700/50 backdrop-blur-md ${className}`}>
      {children}
    </div>
  );
};

export const GradientCard = ({ children, className = '' }) => {
  return (
    <div className={`p-6 rounded-lg bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 card-hover ${className}`}>
      {children}
    </div>
  );
};