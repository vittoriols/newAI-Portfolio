import React, { useState } from 'react';
import { Cpu, Database, Cloud, Code, Brain, Users } from 'lucide-react';
import ParticlesBackground from '../UI/ParticlesBackground';
import { skills } from '../../data/skills';

// Mapping icone Lucide per categorie
const categoryIcons = {
  'Architecture & Design': Cpu,
  'SAP Technologies': Database,
  'Cloud & DevOps': Cloud,
  'Programming': Code,
  'AI & Data Science': Brain,
  'Leadership & Methodology': Users
};

function SkillsSection() {
  const [hoveredCard, setHoveredCard] = useState(null);

  // Funzione per creare il grafico circolare SVG
  function createCircularProgress(percentage, color, size = 48) {
    const radius = (size - 4) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return React.createElement('svg', {
      width: size,
      height: size,
      style: {
        transform: 'rotate(-90deg)',
        flexShrink: 0
      }
    },
      // Cerchio background
      React.createElement('circle', {
        cx: size / 2,
        cy: size / 2,
        r: radius,
        fill: 'none',
        stroke: `${color}20`,
        strokeWidth: 3
      }),
      // Cerchio progresso
      React.createElement('circle', {
        cx: size / 2,
        cy: size / 2,
        r: radius,
        fill: 'none',
        stroke: color,
        strokeWidth: 3,
        strokeDasharray: circumference,
        strokeDashoffset: offset,
        strokeLinecap: 'round',
        style: {
          transition: 'stroke-dashoffset 1s ease-out'
        }
      })
    );
  }

  function renderSkillCard(category, index) {
    const Icon = categoryIcons[category.name] || Cpu;
    const isHovered = hoveredCard === `skill-${index}`;
    const color = category.color;
    const glowColor = `${color}26`; // 15% opacity in hex

    return React.createElement('div', {
      key: index,
      style: {
        opacity: 0,
        animation: `fadeInUp 0.6s ease-out ${index * 0.08}s forwards`,
        height: '100%'
      },
      onMouseEnter: () => setHoveredCard(`skill-${index}`),
      onMouseLeave: () => setHoveredCard(null)
    },
      React.createElement('div', {
        style: {
          position: 'relative',
          height: '100%',
          minHeight: '400px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          border: `2px solid ${color}40`,
          boxShadow: isHovered 
            ? `0 20px 60px ${glowColor}, 0 0 40px ${glowColor}` 
            : `0 10px 40px ${glowColor}`,
          transition: 'all 0.3s ease',
          transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
          overflow: 'hidden'
        }
      },
        // Subtle shine
        React.createElement('div', {
          style: {
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)',
            pointerEvents: 'none'
          }
        }),

        // Glow on hover
        React.createElement('div', {
          style: {
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at center, ${glowColor}, transparent 70%)`,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s',
            pointerEvents: 'none'
          }
        }),

        // Content
        React.createElement('div', {
          style: {
            position: 'relative',
            zIndex: 10,
            padding: '32px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }
        },
          // Header con icona e titolo
          React.createElement('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '32px'
            }
          },
            // Icona
            React.createElement('div', {
              style: {
                width: '64px',
                height: '64px',
                minWidth: '64px',
                minHeight: '64px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `${color}15`,
                border: `2px solid ${color}40`,
                transition: 'transform 0.3s',
                transform: isHovered ? 'scale(1.1) rotate(-6deg)' : 'scale(1) rotate(0deg)'
              }
            },
              React.createElement(Icon, {
                size: 28,
                style: { color: color }
              })
            ),
            // Titolo
            React.createElement('h3', {
              style: {
                fontSize: '22px',
                fontWeight: 'bold',
                color: '#fff',
                lineHeight: '1.2',
                flex: 1
              }
            }, category.name)
          ),

          // Lista skills con grafici circolari
          React.createElement('div', {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              flexGrow: 1
            }
          },
            category.skills.map((skill, i) => 
              React.createElement('div', {
                key: i,
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  transition: 'transform 0.2s',
                  transform: isHovered ? 'translateX(4px)' : 'translateX(0)'
                }
              },
                // Grafico circolare
                React.createElement('div', {
                  style: {
                    position: 'relative',
                    width: '48px',
                    height: '48px',
                    flexShrink: 0
                  }
                },
                  createCircularProgress(skill.level, color, 48),
                  // Percentuale al centro
                  React.createElement('div', {
                    style: {
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      color: color
                    }
                  }, `${skill.level}%`)
                ),

                // Info skill
                React.createElement('div', {
                  style: {
                    flex: 1,
                    minWidth: 0
                  }
                },
                  React.createElement('div', {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px'
                    }
                  },
                    React.createElement('span', {
                      style: {
                        fontSize: '20px',
                        lineHeight: 1
                      }
                    }, skill.icon),
                    React.createElement('span', {
                      style: {
                        fontSize: '15px',
                        fontWeight: '600',
                        color: '#e2e8f0',
                        lineHeight: '1.4'
                      }
                    }, skill.name)
                  ),
                  // Barra progresso lineare (opzionale, più sottile)
                  React.createElement('div', {
                    style: {
                      width: '100%',
                      height: '4px',
                      background: `${color}20`,
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }
                  },
                    React.createElement('div', {
                      style: {
                        width: `${skill.level}%`,
                        height: '100%',
                        background: color,
                        borderRadius: '2px',
                        transition: 'width 1s ease-out'
                      }
                    })
                  )
                )
              )
            )
          )
        )
      )
    );
  }

  return React.createElement('section', {
    id: 'skills',
    className: 'relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 overflow-hidden'
  },
    React.createElement(ParticlesBackground),

    React.createElement('div', {
      className: 'max-w-7xl mx-auto relative z-10'
    },
      // Header
      React.createElement('div', { 
        className: 'mb-12'
      },
        React.createElement('h2', {
          className: 'text-5xl md:text-6xl font-bold mb-4',
          style: {
            background: 'linear-gradient(to right, #60a5fa, #06b6d4, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }
        }, 'Skills & Expertise'),
        React.createElement('p', {
          className: 'text-xl text-slate-400 max-w-2xl'
        }, 'Technical and leadership competencies with proficiency levels across enterprise solutions')
      ),

      // Grid skills
      React.createElement('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px',
          alignItems: 'stretch'
        }
      },
        skills.categories.map((category, index) => renderSkillCard(category, index))
      )
    ),

    // CSS Animations
    React.createElement('style', null, `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `)
  );
}

export default SkillsSection;