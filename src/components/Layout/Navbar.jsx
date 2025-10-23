import React, { useState } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';

function Navbar(props) {
  const currentSection = props.currentSection;
  const onSectionChange = props.onSectionChange;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'bio', label: 'Bio' },
    { id: 'askme', label: 'AskMe', isAI: true },
    { id: 'experience', label: 'Experience' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'authored', label: 'Authored' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = function(sectionId) {
    onSectionChange(sectionId);
    setMobileMenuOpen(false);
  };

  return React.createElement('nav', { 
    className: 'fixed top-0 w-full z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/50 navbar-fade-in' 
  },
    React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
      React.createElement('div', { className: 'flex justify-between items-center h-16' },
        // Logo con immagine
        React.createElement('button', {
          onClick: function() { handleNavClick('bio'); },
          className: 'signature-logo'
        },
          React.createElement('img', {
            src: '/images/signature.png', 
            alt: 'Vittorio Signature',
            className: 'signature-image',
            style: {
              height: '100px',
              width: 'auto',
              filter: 'brightness(0) invert(1)'
            }
          })


        ),
        
        // Desktop Menu
        React.createElement('div', { className: 'hidden md:flex gap-1 items-center' },
          navItems.map(function(item) {
            if (item.isAI) {
              return React.createElement('button', {
                key: item.id,
                onClick: function() { handleNavClick(item.id); },
                className: 'askme-ai-button group relative px-4 py-2 rounded-lg transition-all duration-300 overflow-hidden ' + (
                  currentSection === item.id
                    ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-white border border-cyan-500/50'
                    : ''
                )
              },
                React.createElement('span', { className: 'relative z-10 flex items-center gap-2 font-semibold' },
                  React.createElement(Sparkles, { 
                    size: 16,
                    className: 'sparkle-icon'
                  }),
                  item.label
                ),
                React.createElement('div', { className: 'ai-glow' }),
                React.createElement('div', { className: 'ai-shimmer' })
              );
            }
            
            return React.createElement('button', {
              key: item.id,
              onClick: function() { handleNavClick(item.id); },
              className: 'px-4 py-2 rounded-lg transition-all duration-300 ' + (
                currentSection === item.id
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              )
            }, item.label);
          })
        ),
        
        // Mobile menu button
        React.createElement('button', {
          onClick: function() { setMobileMenuOpen(!mobileMenuOpen); },
          className: 'md:hidden p-2 rounded-lg hover:bg-slate-800/50 transition-colors'
        },
          mobileMenuOpen 
            ? React.createElement(X, { size: 24 })
            : React.createElement(Menu, { size: 24 })
        )
      ),
      
      // Mobile Menu
      mobileMenuOpen && React.createElement('div', { className: 'md:hidden pb-4 flex flex-col gap-2' },
        navItems.map(function(item) {
          if (item.isAI) {
            return React.createElement('button', {
              key: item.id,
              onClick: function() { handleNavClick(item.id); },
              className: 'askme-ai-button-mobile group relative w-full px-4 py-2 rounded-lg transition-all overflow-hidden text-center ' + (
                currentSection === item.id
                  ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-white border border-cyan-500/50'
                  : ''
              )
            },
              React.createElement('span', { className: 'relative z-10 flex items-center justify-center gap-2 font-semibold' },
                React.createElement(Sparkles, { size: 16, className: 'sparkle-icon' }),
                item.label
              ),
              React.createElement('div', { className: 'ai-glow' })
            );
          }
          
          return React.createElement('button', {
            key: item.id,
            onClick: function() { handleNavClick(item.id); },
            className: 'w-full text-center px-4 py-2 rounded-lg transition-all ' + (
              currentSection === item.id
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            )
          }, item.label);
        })
      )
    )
    ,
    
    // Styles
    React.createElement('style', null, `
      /* Signature Logo - SOLO GLOW INTENSO, NO TRANSFORM */
      .signature-logo {
        background: none !important;
        border: none !important;
        cursor: pointer;
        padding: 0 !important;
        display: flex;
        align-items: center;
        outline: none !important;
        box-shadow: none !important;
      }
      
      .signature-image {
        height: 100px !important;
        width: auto;
        filter: brightness(0) invert(1);
        transition: filter 0.3s ease;
        display: block;
        transform: none !important;
      }
      
      .signature-logo:hover .signature-image {
        filter: brightness(0) invert(1) 
                drop-shadow(0 0 12px rgba(59, 130, 246, 0.9)) 
                drop-shadow(0 0 24px rgba(6, 182, 212, 0.7))
                drop-shadow(0 0 32px rgba(59, 130, 246, 0.5));
        transform: none !important;
      }
      
      /* AskMe AI Button Effects */
      .askme-ai-button,
      .askme-ai-button-mobile {
        background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.1));
        border: 1px solid rgba(6, 182, 212, 0.3);
        color: #67e8f9;
      }
      
      .askme-ai-button:hover,
      .askme-ai-button-mobile:hover {
        background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2));
        border-color: rgba(6, 182, 212, 0.5);
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(6, 182, 212, 0.3);
      }
      
      .ai-glow {
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at center, rgba(6, 182, 212, 0.2), transparent 70%);
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .askme-ai-button:hover .ai-glow,
      .askme-ai-button-mobile:hover .ai-glow {
        opacity: 1;
        animation: pulse 2s ease-in-out infinite;
      }
      
      .ai-shimmer {
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.3), transparent);
        animation: shimmer 3s infinite;
      }
      
      @keyframes shimmer {
        0% { left: -100%; }
        100% { left: 100%; }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 1; }
      }
      
      .sparkle-icon {
        animation: sparkle 2s ease-in-out infinite;
      }
      
      @keyframes sparkle {
        0%, 100% { 
          transform: rotate(0deg) scale(1);
          filter: brightness(1);
        }
        50% { 
          transform: rotate(180deg) scale(1.2);
          filter: brightness(1.5);
        }
      }
      
      /* Navbar fade in */
      .navbar-fade-in {
        animation: fadeInDown 0.5s ease-out;
      }
      
      @keyframes fadeInDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `)
  );
}

export default Navbar;