import React, { useState } from 'react';
import { publications } from '../../data/projects';
import { ExternalLink, Book, Award, FileText, Sparkles, Clock } from 'lucide-react';
import ParticlesBackground from '../UI/ParticlesBackground';

function AuthoredSection() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [flippedCard, setFlippedCard] = useState(null); // Per mobile touch

  const books = publications.filter(p => p.type === 'Book');
  const patents = publications.filter(p => p.type === 'Patent');
  const defensivePublications = publications.filter(p => p.type === 'Defensive Publication');

  const allPublications = [...books, ...patents, ...defensivePublications];
  const totalCount = allPublications.length;
  const patentCount = patents.length;
  const bookCount = books.length;

  // Color schemes SOBRI E PROFESSIONALI
  const typeColors = {
    'Book': {
      accent: '#f59e0b',
      glow: 'rgba(245, 158, 11, 0.15)',
      icon: Book
    },
    'Patent': {
      accent: '#a855f7',
      glow: 'rgba(168, 85, 247, 0.15)',
      icon: Award
    },
    'Defensive Publication': {
      accent: '#06b6d4',
      glow: 'rgba(6, 182, 212, 0.15)',
      icon: FileText
    }
  };

  function renderCard(pub, index) {
    const colors = typeColors[pub.type];
    const Icon = colors.icon;
    const isHovered = hoveredCard === `pub-${index}`;
    const isFlipped = flippedCard === `pub-${index}`; // Mobile

    return React.createElement('div', {
      key: index,
      className: 'publication-card-wrapper',
      style: {
        opacity: 0,
        animation: `fadeInUp 0.6s ease-out ${index * 0.05}s forwards`,
        height: '320px',
        position: 'relative'
      },
      onMouseEnter: () => {
        if (window.innerWidth > 768) setHoveredCard(`pub-${index}`);
      },
      onMouseLeave: () => {
        if (window.innerWidth > 768) setHoveredCard(null);
      },
      onClick: () => {
        // Toggle flip su mobile (touch)
        if (window.innerWidth <= 768) {
          setFlippedCard(isFlipped ? null : `pub-${index}`);
        }
      }
    },
      // Flip container
      React.createElement('div', {
        className: 'card-flip-perspective',
        style: {
          perspective: '1000px',
          height: '100%',
          width: '100%',
          position: 'relative'
        }
      },
        React.createElement('div', {
          className: `card-flip-inner ${(isHovered || isFlipped) ? 'flipped' : ''}`,
          style: {
            position: 'relative',
            width: '100%',
            height: '100%'
          }
        },
          // ========== FRONT FACE ==========
          React.createElement('div', {
            className: 'card-face card-front',
            style: {
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              border: `2px solid ${colors.accent}40`,
              borderRadius: '16px',
              boxShadow: `0 10px 40px ${colors.glow}`,
              overflow: 'hidden'
            }
          },
            // Subtle shine
            React.createElement('div', {
              style: {
                position: 'absolute',
                inset: '0',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)',
                pointerEvents: 'none'
              }
            }),

            // Badge tipo in alto a destra
            React.createElement('div', {
              style: {
                position: 'absolute',
                top: '24px',
                right: '24px',
                zIndex: 10
              }
            },
              React.createElement('div', {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  background: `${colors.accent}15`,
                  border: `1px solid ${colors.accent}40`,
                  color: colors.accent,
                  fontSize: '12px',
                  fontWeight: '600'
                }
              },
                React.createElement(Sparkles, { size: 12 }),
                React.createElement('span', null, pub.type)
              )
            ),

            // Contenuto FRONT
            React.createElement('div', {
              style: {
                position: 'relative',
                zIndex: 5,
                padding: '32px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }
            },
              // 1. ICONA (in alto a sinistra)
              React.createElement('div', {
                style: {
                  marginBottom: '20px'
                }
              },
                React.createElement('div', {
                  style: {
                    width: '64px',
                    height: '64px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `${colors.accent}15`,
                    border: `2px solid ${colors.accent}40`
                  }
                },
                  React.createElement(Icon, { 
                    size: 28, 
                    style: { color: colors.accent }
                  })
                )
              ),

              // 2. TITOLO
              React.createElement('div', {
                style: {
                  marginBottom: '16px',
                  flexGrow: 1
                }
              },
                React.createElement('h3', {
                  style: {
                    fontSize: '20px',
                    fontWeight: 'bold',
                    lineHeight: '1.3',
                    color: '#fff',
                    marginBottom: '12px',
                    display: '-webkit-box',
                    WebkitLineClamp: '3',
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }
                }, pub.title),
                React.createElement('p', {
                  style: {
                    fontSize: '14px',
                    color: '#94a3b8',
                    lineHeight: '1.5',
                    display: '-webkit-box',
                    WebkitLineClamp: '2',
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }
                }, pub.publisher)
              ),

              // 3. DATA (in basso)
              React.createElement('div', {
                style: {
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: `${colors.accent}15`,
                  color: colors.accent,
                  fontSize: '14px',
                  fontWeight: 'bold',
                  alignSelf: 'flex-start'
                }
              },
                React.createElement(Clock, { size: 14 }),
                React.createElement('span', null, pub.year)
              )
            )
          ),

          // ========== BACK FACE ==========
          React.createElement('div', {
            className: 'card-face card-back',
            style: {
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              border: `2px solid ${colors.accent}`,
              borderRadius: '16px',
              boxShadow: `0 20px 60px ${colors.glow}`,
              overflow: 'hidden'
            }
          },
            // Contenuto BACK
            React.createElement('div', {
              style: {
                padding: '32px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }
            },
              // Titolo sezione
              React.createElement('h4', {
                style: {
                  fontSize: '14px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: colors.accent,
                  marginBottom: '16px'
                }
              }, 'Details'),

              // Abstract/Description
              React.createElement('div', {
                style: {
                  flexGrow: 1,
                  marginBottom: '16px',
                  overflowY: 'auto'
                }
              },
                React.createElement('p', {
                  style: {
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: '#e2e8f0'
                  }
                }, pub.description || pub.abstract || 'Innovative contribution to the field.')
              ),

              // Link se disponibile
              pub.link && React.createElement('a', {
                href: pub.link,
                target: '_blank',
                rel: 'noopener noreferrer',
                onClick: (e) => {
                  e.stopPropagation(); // Previene il flip quando si clicca il link
                },
                style: {
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  background: `${colors.accent}`,
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  alignSelf: 'flex-start',
                  transition: 'all 0.3s'
                },
                onMouseEnter: (e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = `0 8px 20px ${colors.glow}`;
                },
                onMouseLeave: (e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }
              },
                React.createElement(ExternalLink, { size: 16 }),
                React.createElement('span', null, 'View Publication')
              )
            )
          )
        )
      )
    );
  }

  return React.createElement('section', {
    id: 'publications',
    className: 'relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 overflow-hidden'
  },
    React.createElement(ParticlesBackground),

    React.createElement('div', { 
      className: 'max-w-7xl mx-auto relative z-10'
    },
      // Header
      React.createElement('div', { className: 'mb-12' },
        React.createElement('h2', {
          className: 'text-5xl md:text-6xl font-bold mb-4',
          style: {
            background: 'linear-gradient(to right, #60a5fa, #06b6d4, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }
        }, 'Publications & Patents'),
        React.createElement('p', { 
          className: 'text-xl text-slate-400 max-w-2xl'
        }, 'International contributions to knowledge: Books, patents, and research that shape the industry')
      ),

      // Stats compatte
      React.createElement('div', { 
        className: 'grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'
      },
        // Total
        React.createElement('div', {
          style: {
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(37, 99, 235, 0.08))',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '12px',
            padding: '20px'
          }
        },
          React.createElement('div', { 
            style: { 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between'
            }
          },
            React.createElement('div', null,
              React.createElement('div', {
                style: {
                  color: '#94a3b8',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '8px'
                }
              }, 'Total Publications'),
              React.createElement('div', {
                style: {
                  fontSize: '32px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #60a5fa, #06b6d4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }
              }, totalCount)
            ),
            React.createElement('div', {
              style: {
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.15))'
              }
            },
              React.createElement(FileText, { 
                style: { width: '24px', height: '24px', color: '#60a5fa' }
              })
            )
          )
        ),

        // Patents
        React.createElement('div', {
          style: {
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08), rgba(147, 51, 234, 0.08))',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            borderRadius: '12px',
            padding: '20px'
          }
        },
          React.createElement('div', { 
            style: { 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between'
            }
          },
            React.createElement('div', null,
              React.createElement('div', {
                style: {
                  color: '#94a3b8',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '8px'
                }
              }, 'Patents'),
              React.createElement('div', {
                style: {
                  fontSize: '32px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }
              }, patentCount)
            ),
            React.createElement('div', {
              style: {
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(147, 51, 234, 0.15))'
              }
            },
              React.createElement(Award, { 
                style: { width: '24px', height: '24px', color: '#a855f7' }
              })
            )
          )
        ),

        // Books
        React.createElement('div', {
          style: {
            background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.08), rgba(245, 158, 11, 0.08))',
            border: '1px solid rgba(251, 191, 36, 0.2)',
            borderRadius: '12px',
            padding: '20px'
          }
        },
          React.createElement('div', { 
            style: { 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between'
            }
          },
            React.createElement('div', null,
              React.createElement('div', {
                style: {
                  color: '#94a3b8',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '8px'
                }
              }, 'Books'),
              React.createElement('div', {
                style: {
                  fontSize: '32px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }
              }, bookCount)
            ),
            React.createElement('div', {
              style: {
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.15))'
              }
            },
              React.createElement(Book, { 
                style: { width: '24px', height: '24px', color: '#fbbf24' }
              })
            )
          )
        )
      ),

      // Grid pubblicazioni - ALTEZZA FISSA
      React.createElement('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px'
        }
      },
        allPublications.map((pub, index) => renderCard(pub, index))
      )
    ),

    // CSS Animations + MOBILE FIX
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

      @keyframes pulse {
        0%, 100% {
          opacity: 1;
          transform: scale(1);
        }
        50% {
          opacity: 0.7;
          transform: scale(1.2);
        }
      }

      /* CRITICAL FIX: Backface visibility per mobile */
      .card-face {
        transition: transform 0.4s ease-in-out, opacity 0.4s ease-in-out;
      }

      .card-front {
        z-index: 2;
      }

      .card-back {
        z-index: 1;
      }

      /* Animazione SLIDE per tutte le risoluzioni */
      .card-front,
      .card-back {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }

      /* Stato iniziale: front visibile */
      .card-flip-inner:not(.flipped) .card-front {
        transform: translateX(0);
        opacity: 1;
        z-index: 2;
      }

      .card-flip-inner:not(.flipped) .card-back {
        transform: translateX(100%);
        opacity: 0;
        z-index: 1;
      }

      /* Stato flipped: back visibile */
      .card-flip-inner.flipped .card-front {
        transform: translateX(-100%);
        opacity: 0;
        z-index: 1;
      }

      .card-flip-inner.flipped .card-back {
        transform: translateX(0);
        opacity: 1;
        z-index: 2;
      }

      /* Mobile: touch friendly */
      @media (max-width: 768px) {
        .publication-card-wrapper {
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }
      }

      /* Desktop: hover */
      @media (min-width: 769px) {
        .publication-card-wrapper {
          cursor: default;
        }
      }
    `)
  );
}


export default AuthoredSection;