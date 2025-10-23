import React, { useEffect, useRef, useState } from 'react';
import { experience } from '../../data/experience';
import ParticlesBackground from '../UI/ParticlesBackground';
import '../../styles/animations.css';

function ExperienceSection() {
  const [visibleItems, setVisibleItems] = useState([]);
  const itemRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleItems(function(prev) {
              if (!prev.includes(index)) {
                return prev.concat(index);
              }
              return prev;
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    itemRefs.current.forEach(function(ref) {
      if (ref) observer.observe(ref);
    });

    return function() {
      observer.disconnect();
    };
  }, []);

  return React.createElement('section', { className: 'relative space-y-8 min-h-screen py-20' },
    // Particles background
    React.createElement(ParticlesBackground),
    
    // Content
    React.createElement('div', { className: 'relative z-10' },
      // Title with gradient like other sections
      React.createElement('div', { className: 'mb-16' },
        React.createElement('h2', { 
          className: 'text-5xl md:text-6xl font-bold mb-4',
          style: {
            background: 'linear-gradient(to right, #60a5fa, #06b6d4, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }
        }, 'Experience'),
        React.createElement('p', { className: 'text-xl text-slate-400 max-w-2xl' },
          'Professional journey across enterprise architecture and digital transformation'
        )
      ),
      
      React.createElement('div', { className: 'experience-3d-container' },
        React.createElement('div', { className: 'experience-timeline-spine' }),
        experience.map(function(exp, i) {
          const isVisible = visibleItems.includes(i);
          const isLeft = i % 2 === 0;
          
          return React.createElement('div', {
            key: i,
            ref: function(el) { itemRefs.current[i] = el; },
            'data-index': i,
            className: 'experience-3d-item' + (isVisible ? ' animate-in' : '')
          },
            isLeft ? React.createElement(React.Fragment, null,
              React.createElement('div', { className: 'experience-card-wrapper left-side' },
                React.createElement('div', { className: 'experience-card experience-card-left' + (isVisible ? ' animate-in' : '') },
                  React.createElement('div', { className: 'card-inner' },
                    React.createElement('div', { className: 'period-badge' }, exp.period),
                    React.createElement('h3', null, exp.title),
                    React.createElement('div', { className: 'company-tag' }, exp.company),
                    React.createElement('p', null, exp.description),
                    React.createElement('div', { className: 'key-points' },
                      exp.keyPoints.map(function(point, j) {
                        return React.createElement('span', { key: j, className: 'key-point' }, point);
                      })
                    )
                  ),
                  React.createElement('div', { className: 'card-shine' })
                )
              ),
              React.createElement('div', { className: 'experience-dot-connector' + (isVisible ? ' animate-in' : '') },
                React.createElement('div', { className: 'dot-outer' },
                  React.createElement('div', { className: 'dot-inner' })
                ),
                React.createElement('div', { className: 'connector-line left' })
              ),
              React.createElement('div', { className: 'experience-card-wrapper right-side empty' })
            ) : React.createElement(React.Fragment, null,
              React.createElement('div', { className: 'experience-card-wrapper left-side empty' }),
              React.createElement('div', { className: 'experience-dot-connector' + (isVisible ? ' animate-in' : '') },
                React.createElement('div', { className: 'dot-outer' },
                  React.createElement('div', { className: 'dot-inner' })
                ),
                React.createElement('div', { className: 'connector-line right' })
              ),
              React.createElement('div', { className: 'experience-card-wrapper right-side' },
                React.createElement('div', { className: 'experience-card experience-card-right' + (isVisible ? ' animate-in' : '') },
                  React.createElement('div', { className: 'card-inner' },
                    React.createElement('div', { className: 'period-badge' }, exp.period),
                    React.createElement('h3', null, exp.title),
                    React.createElement('div', { className: 'company-tag' }, exp.company),
                    React.createElement('p', null, exp.description),
                    React.createElement('div', { className: 'key-points' },
                      exp.keyPoints.map(function(point, j) {
                        return React.createElement('span', { key: j, className: 'key-point' }, point);
                      })
                    )
                  ),
                  React.createElement('div', { className: 'card-shine' })
                )
              )
            )
          );
        })
      )
    )
  );
}

export default ExperienceSection;