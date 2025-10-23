import React from 'react';

export const PrimaryButton = ({ children, onClick, href, icon: Icon, className = '' }) => {
  const baseClasses = "px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex items-center gap-2 text-white";
  
  if (href) {
    return React.createElement(
      'a',
      {
        href: href,
        target: '_blank',
        rel: 'noopener noreferrer',
        className: baseClasses + ' ' + className
      },
      Icon && React.createElement(Icon, { size: 20 }),
      children
    );
  }

  return React.createElement(
    'button',
    {
      onClick: onClick,
      className: baseClasses + ' ' + className
    },
    Icon && React.createElement(Icon, { size: 20 }),
    children
  );
};

export const SecondaryButton = ({ children, onClick, className = '' }) => {
  return React.createElement(
    'button',
    {
      onClick: onClick,
      className: 'px-8 py-3 border border-blue-500/50 rounded-lg font-semibold text-blue-300 hover:bg-blue-500/10 transition-all duration-300 ' + className
    },
    children
  );
};

export const IconButton = ({ icon: Icon, onClick, className = '' }) => {
  return React.createElement(
    'button',
    {
      onClick: onClick,
      className: 'p-2 rounded-lg hover:bg-slate-800/50 transition-colors ' + className
    },
    React.createElement(Icon, { size: 24 })
  );
};