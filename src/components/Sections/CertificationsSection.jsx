import React, { useState } from 'react';
import { Award, Building, TrendingUp, ExternalLink } from 'lucide-react';
import { certifications } from '../../data/certifications';
import ParticlesBackground from '../UI/ParticlesBackground';

const CertificationsSection = () => {
  const [filter, setFilter] = useState('All');
  const [hoveredCard, setHoveredCard] = useState(null);
  
  const totalCerts = certifications.length;
  const providers = [...new Set(certifications.map(cert => cert.provider))];
  const latestYear = Math.max(...certifications.map(cert => parseInt(cert.date)));
  
  const filteredCerts = filter === 'All' 
    ? certifications 
    : certifications.filter(cert => cert.category === filter);

  const categories = ['All', 'SAP', 'IBM', 'Microsoft', 'Other'];

  // Color scheme per provider
  const providerColors = {
    SAP: { from: '#0070c5', to: '#005a9c', glow: 'rgba(0, 112, 197, 0.3)' },
    IBM: { from: '#6e5494', to: '#4b3675', glow: 'rgba(110, 84, 148, 0.3)' },
    Microsoft: { from: '#00A4EF', to: '#0078D4', glow: 'rgba(0, 164, 239, 0.3)' },
    Other: { from: '#10b981', to: '#059669', glow: 'rgba(16, 185, 129, 0.3)' }
  };

  const getProviderColor = (category) => {
    return providerColors[category] || providerColors.Other;
  };

  return (
    <section id="certifications" className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <ParticlesBackground />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12">
          <h2 
            className="text-5xl md:text-6xl font-bold mb-4"
            style={{
              background: 'linear-gradient(to right, #60a5fa, #06b6d4, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Certifications
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl">
            Professional certifications and credentials across enterprise architecture and emerging technologies
          </p>
        </div>

        {/* STATS CARDS COMPATTE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div 
            className="relative rounded-xl overflow-hidden transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(37, 99, 235, 0.08))',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              padding: '20px'
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Total Certifications
                </div>
                <div 
                  className="text-3xl font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #60a5fa, #06b6d4)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {totalCerts}
                </div>
              </div>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.15))'
                }}
              >
                <Award className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>
          
          <div 
            className="relative rounded-xl overflow-hidden transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(8, 145, 178, 0.08))',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              padding: '20px'
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Providers
                </div>
                <div 
                  className="text-3xl font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #06b6d4, #60a5fa)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {providers.length}
                </div>
              </div>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(8, 145, 178, 0.15))'
                }}
              >
                <Building className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
          </div>
          
          <div 
            className="relative rounded-xl overflow-hidden transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08), rgba(147, 51, 234, 0.08))',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              padding: '20px'
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Latest Year
                </div>
                <div 
                  className="text-3xl font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {latestYear}
                </div>
              </div>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(147, 51, 234, 0.15))'
                }}
              >
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* FILTRI - DESKTOP CENTERED, MOBILE SCROLLABLE */}
        <div className="filters-wrapper flex justify-center mb-16 mt-16">
          <div className="filters-container inline-flex rounded-full p-1.5" style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(71, 85, 105, 0.3)',
            backdropFilter: 'blur(10px)'
          }}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className="filter-btn relative px-8 py-3.5 rounded-full font-bold text-base transition-all duration-300 whitespace-nowrap"
                style={{
                  color: filter === category ? '#ffffff' : '#94a3b8',
                  background: filter === category 
                    ? 'linear-gradient(to right, #3b82f6, #06b6d4)' 
                    : 'transparent'
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Certificazioni - 6 PER RIGA CON PIU SPAZIO */}
        <div 
          className="grid"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '24px'
          }}
        >
          {filteredCerts.map((cert, index) => {
            const providerColor = getProviderColor(cert.category);
            const isHovered = hoveredCard === `cert-${cert.id}`;

            return (
              <a
                key={cert.id}
                href={cert.credlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHoveredCard(`cert-${cert.id}`)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative block"
                style={{
                  opacity: 0,
                  animation: `fadeInUp 0.6s ease-out ${index * 0.03}s forwards`
                }}
              >
                <div
                  className="relative rounded-xl overflow-hidden transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.8))',
                    border: `2px solid ${isHovered ? providerColor.from : 'rgba(71, 85, 105, 0.3)'}`,
                    boxShadow: isHovered ? `0 15px 50px ${providerColor.glow}` : '0 4px 12px rgba(0, 0, 0, 0.3)',
                    transform: isHovered ? 'scale(1.05) translateY(-6px)' : 'scale(1) translateY(0)',
                    height: '260px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {/* GLOW SFUMATO */}
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none"
                    style={{
                      opacity: isHovered ? 1 : 0,
                      background: `radial-gradient(circle at 50% 50%, ${providerColor.from}20, ${providerColor.from}10 40%, transparent 70%)`,
                      filter: 'blur(25px)'
                    }}
                  />

                  {/* IMMAGINE */}
                  <div 
                    className="relative flex-shrink-0 overflow-hidden"
                    style={{ height: '160px' }}
                  >
                    <div 
                      className="absolute inset-0 flex items-center justify-center transition-all duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${providerColor.from}08, ${providerColor.to}08)`,
                        padding: '20px'
                      }}
                    >
                      <img 
                        src={cert.image} 
                        alt={cert.title}
                        className="w-auto h-[100px] max-w-full object-contain transition-transform duration-300"
                        style={{
                          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                          filter: isHovered ? 'brightness(1.1)' : 'brightness(1)'
                        }}
                        loading="lazy"
                      />
                    </div>

                    {/* OVERLAY HOVER */}
                    <div
                      className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 z-10"
                      style={{
                        background: 'rgba(0, 0, 0, 0.90)',
                        opacity: isHovered ? 1 : 0
                      }}
                    >
                      <div className="text-center">
                        <ExternalLink className="w-7 h-7 text-white mx-auto mb-1" />
                        <p className="text-white font-semibold text-xs">View</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* INFO */}
                  <div 
                    className="relative z-10 flex-1 flex flex-col justify-between"
                    style={{
                      background: 'rgba(15, 23, 42, 0.6)',
                      padding: '14px 16px 18px 16px'
                    }}
                  >
                    <div>
                      <h3 
                        className="text-white font-semibold leading-tight mb-2 line-clamp-2"
                        style={{ fontSize: '12px' }}
                      >
                        {cert.title}
                      </h3>
                    </div>

                    {/* PALLINO + CATEGORIA */}
                    <div className="flex items-center gap-2">
                      <div
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: providerColor.from,
                          boxShadow: `0 0 8px ${providerColor.glow}`,
                          flexShrink: 0
                        }}
                      />
                      <span 
                        className="font-semibold truncate"
                        style={{
                          fontSize: '10px',
                          background: `linear-gradient(135deg, ${providerColor.from}, ${providerColor.to})`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}
                      >
                        {cert.category}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Line */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300"
                    style={{
                      background: `linear-gradient(to right, ${providerColor.from}, ${providerColor.to})`,
                      opacity: isHovered ? 1 : 0
                    }}
                  />
                </div>
              </a>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredCerts.length === 0 && (
          <div className="text-center py-20">
            <Award className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No certifications found for this category</p>
          </div>
        )}
      </div>

      <style jsx>{`
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

        /* DESKTOP: tutto come prima */
        @media (min-width: 769px) {
          .filters-wrapper {
            overflow: visible;
          }

          .filters-container {
            overflow: visible;
          }

          .filter-btn {
            /* Stile desktop originale */
          }
        }

        /* MOBILE: scroll orizzontale mantenendo grafica */
        @media (max-width: 768px) {
          .filters-wrapper {
            justify-content: flex-start;
            overflow-x: auto;
            overflow-y: hidden;
            -webkit-overflow-scrolling: touch;
            scroll-behavior: smooth;
            padding: 0 16px;
            
            /* Nascondi scrollbar */
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          .filters-wrapper::-webkit-scrollbar {
            display: none;
          }

          .filters-container {
            /* Mantiene sfondo e stile originale */
            flex-shrink: 0;
            min-width: min-content;
          }

          .filter-btn {
            /* Impedisce compressione bottoni */
            flex-shrink: 0;
            min-width: fit-content;
            padding: 12px 20px;
            font-size: 14px;
          }
        }
      `}</style>
    </section>
  );
};

export default CertificationsSection;