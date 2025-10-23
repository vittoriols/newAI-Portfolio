import React from 'react';
import { ExternalLink, Calendar, Rocket, Users, BookOpen } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '../UI/Button';
import { personalInfo } from '../../data/personalInfo';

function BioSection(props) {
  const onContactClick = props.onContactClick;
  
  const stats = [
    { number: '5+', label: 'Years Experience', icon: Calendar },
    { number: '15+', label: 'Projects Delivered', icon: Rocket },
    { number: '10+', label: 'Happy Clients', icon: Users },
    { number: '3', label: 'Authored Contents', icon: BookOpen }
  ];
  
  return React.createElement('section', { className: 'space-y-12' },
    React.createElement('div', { className: 'space-y-6' },
      React.createElement('div', null,
        React.createElement('h1', { className: 'text-5xl md:text-7xl font-bold mb-4 leading-tight' },
          React.createElement('span', { className: 'gradient-text' }, 'Electronic Engineer,'),
          React.createElement('br'),
          React.createElement('span', { className: 'gradient-text' }, 'SAP Architect &'),
          React.createElement('br'),
          React.createElement('span', { className: 'text-white' }, 'Solution Advisor')
        ),
        React.createElement('p', { className: 'text-xl text-slate-400 max-w-3xl' }, personalInfo.bio)
      ),
      React.createElement('div', { className: 'flex flex-wrap gap-4' },
        React.createElement(PrimaryButton, { href: personalInfo.cvLink, icon: ExternalLink }, 'Download CV'),
        React.createElement(SecondaryButton, { onClick: onContactClick }, 'Get in Touch')
      )
    ),
    React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-8' },
      stats.map(function(stat, i) {
        const delay = (i * 0.15).toString() + 's';
        const Icon = stat.icon;
        return React.createElement('div', {
          key: i,
          className: 'bio-stat-card relative p-6 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-sm group overflow-hidden',
          style: { animationDelay: delay }
        },
          React.createElement('div', { className: 'card-shine' }),
          React.createElement('div', { className: 'relative z-10' },
            React.createElement('div', { className: 'flex items-center justify-center mb-3' },
              React.createElement(Icon, { className: 'text-blue-400', size: 32 })
            ),
            React.createElement('div', { className: 'text-3xl font-bold gradient-text mb-2 text-center' }, stat.number),
            React.createElement('div', { className: 'text-sm text-slate-400 text-center' }, stat.label)
          )
        );
      })
    )
  );
}

export default BioSection;