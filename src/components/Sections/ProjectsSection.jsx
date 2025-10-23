import React from 'react';
import { projects } from '../../data/projects';
import { Github, Play } from 'lucide-react';

function ProjectsSection() {
  return (
    <section className="min-h-screen py-20 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <h2 
            className="text-5xl md:text-6xl font-bold mb-4"
            style={{
              background: 'linear-gradient(to right, #60a5fa, #06b6d4, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Projects
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl">
            Open source contributions and personal projects showcasing technical expertise
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.7))',
                border: '2px solid rgba(59, 130, 246, 0.3)',
                boxShadow: '0 4px 16px rgba(59, 130, 246, 0.2)',
                opacity: 0,
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`
              }}
            >
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>
                    {project.technology && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3"
                        style={{
                          background: 'rgba(6, 182, 212, 0.1)',
                          border: '1px solid rgba(6, 182, 212, 0.3)',
                          color: '#67e8f9'
                        }}
                      >
                        {project.technology}
                      </div>
                    )}
                  </div>
                  <Github className="w-6 h-6 text-slate-400 group-hover:text-blue-400 transition-colors" />
                </div>

                {/* Description */}
                <p className="text-slate-300 text-base mb-6 leading-relaxed">
                  {project.description}
                </p>

                {/* Tags */}
                {project.languages && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.languages.map((lang, i) => (
                      <span 
                        key={i}
                        className="px-3 py-1 rounded-lg text-xs font-medium"
                        style={{
                          background: 'rgba(59, 130, 246, 0.1)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          color: '#93c5fd'
                        }}
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                )}

                {/* Links */}
                <div className="flex gap-3">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold hover:scale-105 transition-all"
                      style={{
                        background: 'linear-gradient(to right, #3b82f6, #06b6d4)'
                      }}
                    >
                      <Github size={16} />
                      View Code
                    </a>
                  )}
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold hover:scale-105 transition-all"
                      style={{
                        background: 'rgba(59, 130, 246, 0.2)',
                        border: '1px solid rgba(59, 130, 246, 0.4)'
                      }}
                    >
                      <Play size={16} />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>

              {/* Glow Effect */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.15), transparent 70%)'
                }}
              ></div>
            </div>
          ))}
        </div>
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
      `}</style>
    </section>
  );
}

export default ProjectsSection;