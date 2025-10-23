import React, { useState } from 'react';
import { Mail, Github, Linkedin, MessageCircle, ExternalLink, Download, Globe, User, MessageSquare, Send, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import ParticlesBackground from '../UI/ParticlesBackground';
import { personalInfo } from '../../data/personalInfo';
import '../../styles/animations.css';
import '../../Contactsection.css';
const WEB3_TOKEN = process.env.REACT_APP_WEB3_TOKEN;

// SAP Community icon component
const SAPIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.003 3.015H4.997C3.341 3.015 2 4.356 2 6.012v11.976c0 1.656 1.341 2.997 2.997 2.997h14.006c1.656 0 2.997-1.341 2.997-2.997V6.012c0-1.656-1.341-2.997-2.997-2.997zM8.25 16.5c-1.24 0-2.25-1.01-2.25-2.25s1.01-2.25 2.25-2.25 2.25 1.01 2.25 2.25-1.01 2.25-2.25 2.25zm7.5 0c-1.24 0-2.25-1.01-2.25-2.25s1.01-2.25 2.25-2.25 2.25 1.01 2.25 2.25-1.01 2.25-2.25 2.25z"/>
  </svg>
);

// ContactForm Component
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [focusedField, setFocusedField] = useState(null);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = 'Subject must be at least 3 characters';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: WEB3_TOKEN,
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          from_name: 'Portfolio Contact Form',
          replyto: formData.email
        })
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        
        setTimeout(() => {
          setStatus('idle');
        }, 5000);
      } else {
        setStatus('error');
        setTimeout(() => {
          setStatus('idle');
        }, 5000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
    }
  };

  const formFields = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      icon: User,
      placeholder: 'John Doe',
      required: true
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      icon: Mail,
      placeholder: 'john@example.com',
      required: true
    },
    {
      name: 'subject',
      label: 'Subject',
      type: 'text',
      icon: MessageSquare,
      placeholder: 'Subject',
      required: true
    }
  ];

  return (
    <div className="w-full p-6 rounded-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2 gradient-text">
          Send a Message
        </h3>
        <p className="text-slate-400 text-sm">Fill out the form below</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {formFields.map((field) => {
          const Icon = field.icon;
          const hasError = errors[field.name];
          const isFocused = focusedField === field.name;

          return (
            <div key={field.name} className="relative">
              <label 
                htmlFor={field.name}
                className="block text-xs font-semibold text-slate-300 mb-2"
              >
                {field.label}
                {field.required && <span className="text-red-400 ml-1">*</span>}
              </label>
              
              <div className="relative">
                <div 
                  className="absolute top-1/2 -translate-y-1/2 transition-colors duration-300 pointer-events-none"
                  style={{
                    left: '16px',
                    color: hasError ? '#ef4444' : isFocused ? '#3b82f6' : '#64748b'
                  }}
                >
                  <Icon size={16} />
                </div>

                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={formData[field.name]}
                  onChange={handleChange}
                  onFocus={() => setFocusedField(field.name)}
                  onBlur={() => setFocusedField(null)}
                  placeholder={field.placeholder}
                  style={{
                    paddingLeft: '48px',
                    paddingRight: '16px',
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    width: '100%',
                    borderRadius: '12px',
                    background: hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(30, 41, 59, 0.5)',
                    border: hasError 
                      ? '2px solid #ef4444' 
                      : isFocused 
                        ? '2px solid #3b82f6'
                        : '2px solid rgba(100, 116, 139, 0.3)',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.3s'
                  }}
                  className="font-sans"
                />
              </div>

              {hasError && (
                <div className="flex items-center gap-2 mt-2">
                  <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                  <p className="text-xs text-red-400">{hasError}</p>
                </div>
              )}
            </div>
          );
        })}

        {/* Message Field */}
        <div className="relative">
          <label 
            htmlFor="message"
            className="block text-xs font-semibold text-slate-300 mb-2"
          >
            Message
            <span className="text-red-400 ml-1">*</span>
          </label>
          
          <div className="relative">
            <div 
              className="absolute transition-colors duration-300 pointer-events-none"
              style={{
                left: '16px',
                top: '16px',
                color: errors.message ? '#ef4444' : focusedField === 'message' ? '#3b82f6' : '#64748b'
              }}
            >
              <MessageCircle size={16} />
            </div>

            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              onFocus={() => setFocusedField('message')}
              onBlur={() => setFocusedField(null)}
              placeholder="Your message here..."
              rows={5}
              style={{
                paddingLeft: '48px',
                paddingRight: '16px',
                paddingTop: '16px',
                paddingBottom: '16px',
                width: '100%',
                borderRadius: '12px',
                background: errors.message ? 'rgba(239, 68, 68, 0.1)' : 'rgba(30, 41, 59, 0.5)',
                border: errors.message 
                  ? '2px solid #ef4444' 
                  : focusedField === 'message' 
                    ? '2px solid #3b82f6'
                    : '2px solid rgba(100, 116, 139, 0.3)',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.3s',
                resize: 'vertical',
                minHeight: '120px'
              }}
              className="font-sans"
            />
          </div>

          {errors.message && (
            <div className="flex items-center gap-2 mt-2">
              <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
              <p className="text-xs text-red-400">{errors.message}</p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full relative overflow-hidden group"
          style={{
            padding: '14px 28px',
            borderRadius: '12px',
            background: status === 'success' 
              ? 'linear-gradient(135deg, #10b981, #059669)'
              : status === 'error'
                ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                : 'linear-gradient(135deg, #3b82f6, #2563eb)',
            border: 'none',
            color: '#fff',
            fontSize: '15px',
            fontWeight: '600',
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s',
            opacity: status === 'loading' ? 0.7 : 1
          }}
        >
          <div className="flex items-center justify-center gap-2 relative z-10">
            {status === 'loading' && <Loader size={18} className="animate-spin" />}
            {status === 'success' && <CheckCircle size={18} />}
            {status === 'error' && <AlertCircle size={18} />}
            {status === 'idle' && <Send size={18} />}
            <span>
              {status === 'loading' && 'Sending...'}
              {status === 'success' && 'Message Sent!'}
              {status === 'error' && 'Failed to Send'}
              {status === 'idle' && 'Send Message'}
            </span>
          </div>

          {status === 'idle' && (
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              style={{
                transform: 'translateX(-100%)',
                transition: 'transform 0.6s'
              }}
            />
          )}
        </button>

        {/* Status Messages */}
        {status === 'success' && (
          <div 
            className="flex items-start gap-3 p-4 rounded-xl"
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}
          >
            <CheckCircle size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-green-400 mb-1">Success!</p>
              <p className="text-xs text-slate-300">Your message has been sent successfully. I'll get back to you soon!</p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div 
            className="flex items-start gap-3 p-4 rounded-xl"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}
          >
            <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-400 mb-1">Error</p>
              <p className="text-xs text-slate-300">Failed to send message. Please try again or contact me directly.</p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

// Main ContactSection Component
function ContactSection() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const contactMethods = [
    {
      name: 'Email',
      icon: Mail,
      description: 'Send me an email',
      link: `mailto:${personalInfo.email}`,
      displayValue: personalInfo.email,
      color: { from: '#3b82f6', to: '#2563eb', glow: 'rgba(59, 130, 246, 0.3)' }
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      description: 'Connect on LinkedIn',
      link: personalInfo.linkedin,
      displayValue: 'linkedin.com/in/vittorio',
      color: { from: '#0a66c2', to: '#004182', glow: 'rgba(10, 102, 194, 0.3)' }
    },
    {
      name: 'GitHub',
      icon: Github,
      description: 'Check my repositories',
      link: personalInfo.github,
      displayValue: 'Github.com',
      color: { from: '#8b5cf6', to: '#7c3aed', glow: 'rgba(139, 92, 246, 0.3)' }
    },
    {
      name: 'SAP Community',
      icon: SAPIcon,
      description: 'SAP Community profile',
      link: personalInfo.sapCommunity,
      displayValue: 'SAP Community',
      color: { from: '#0FAAFF', to: '#0080CC', glow: 'rgba(15, 170, 255, 0.3)' }
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      description: 'Quick message',
      link: `https://wa.me/${personalInfo.phone}`,
      displayValue: personalInfo.phone,
      color: { from: '#25D366', to: '#128C7E', glow: 'rgba(37, 211, 102, 0.3)' }
    },
    {
      name: 'LinkTree',
      icon: Globe,
      description: 'Visit my portfolio',
      link: personalInfo.website,
      displayValue: 'LinkTree',
      color: { from: '#ec4899', to: '#db2777', glow: 'rgba(236, 72, 153, 0.3)' }
    }
  ];

  return (
    <section 
      id="contact"
      className="relative min-h-screen py-16 overflow-hidden"
      style={{ paddingLeft: '16px', paddingRight: '16px' }}
    >
      {/* Particles Background */}
      <ParticlesBackground />

      {/* Content */}
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header - A SINISTRA */}
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
            Get In Touch
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl">
            Have a project in mind or just want to chat? Choose your preferred way to connect!
          </p>
        </div>

        {/* LAYOUT PRINCIPALE A 2 COLONNE - RESPONSIVE */}
        <div className="contact-grid">

          {/* ========== COLONNA 1: CONTACT METHODS + CV ========== */}
          <div style={{ opacity: 0, animation: 'fadeInUp 0.6s ease-out 0.3s forwards' }}>

            {/* Grid 2x3 per contact methods */}
            <div 
              className="contact-methods-grid"
              style={{
                marginBottom: '24px'
              }}
            >
              {contactMethods.map((contact, index) => {
                const Icon = contact.icon;
                const isHovered = hoveredCard === `contact-${index}`;

                return (
                  <a
                    key={index}
                    href={contact.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block"
                    onMouseEnter={() => setHoveredCard(`contact-${index}`)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      opacity: 0,
                      animation: `fadeInUp 0.6s ease-out ${0.1 + index * 0.05}s forwards`
                    }}
                  >
                    <div
                      className="relative rounded-xl transition-all duration-300 h-full"
                      style={{
                        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.7))',
                        border: `2px solid ${contact.color.from}40`,
                        boxShadow: isHovered ? `0 20px 60px ${contact.color.glow}` : `0 4px 16px ${contact.color.glow}`,
                        transform: isHovered ? 'scale(1.02) translateY(-4px)' : 'scale(1) translateY(0)',
                        overflow: 'hidden',
                        padding: '16px'
                      }}
                    >
                      {/* GLOW EFFECT */}
                      <div
                        className="absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none"
                        style={{
                          opacity: isHovered ? 1 : 0,
                          background: `radial-gradient(circle at 50% 50%, ${contact.color.from}20, ${contact.color.from}10 40%, transparent 70%)`,
                          filter: 'blur(20px)'
                        }}
                      />

                      <div className="relative z-10 flex flex-col h-full">
                        {/* ICON E EXTERNAL LINK */}
                        <div className="flex items-start justify-between mb-3">
                          <div
                            className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300"
                            style={{
                              background: `linear-gradient(135deg, ${contact.color.from}20, ${contact.color.to}20)`,
                              border: `2px solid ${contact.color.from}40`,
                              boxShadow: isHovered ? `0 4px 20px ${contact.color.glow}` : 'none',
                              transform: isHovered ? 'scale(1.1) rotate(6deg)' : 'scale(1) rotate(0deg)',
                              padding: '6px'
                            }}
                          >
                            <Icon size={18} style={{ color: contact.color.from }} />
                          </div>

                          <ExternalLink
                            size={13}
                            className="text-slate-500 transition-all duration-300 flex-shrink-0"
                            style={{
                              color: isHovered ? '#cbd5e1' : '#64748b',
                              transform: isHovered ? 'translate(2px, -2px)' : 'translate(0, 0)'
                            }}
                          />
                        </div>

                        {/* CONTENT */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="mb-2">
                            <h3
                              className="text-base font-bold mb-1.5"
                              style={{
                                background: `linear-gradient(135deg, ${contact.color.from}, ${contact.color.to})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                              }}
                            >
                              {contact.name}
                            </h3>
                            <p className="text-slate-400 text-xs leading-relaxed">{contact.description}</p>
                          </div>
                          
                          {/* PALLINO + TESTO */}
                          <div className="flex items-center gap-2">
                            <div
                              style={{
                                width: '7px',
                                height: '7px',
                                borderRadius: '50%',
                                backgroundColor: contact.color.from,
                                boxShadow: `0 0 8px ${contact.color.glow}, 0 0 16px ${contact.color.glow}`,
                                flexShrink: 0
                              }}
                            />
                            <span className="text-slate-300 text-xs font-medium truncate">
                              {contact.displayValue}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Line */}
                      <div
                        className="absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300"
                        style={{
                          background: `linear-gradient(to right, ${contact.color.from}, ${contact.color.to})`,
                          opacity: isHovered ? 1 : 0
                        }}
                      />
                    </div>
                  </a>
                );
              })}
            </div>

            {/* CV DOWNLOAD CARD - FULL WIDTH */}
            <div 
              style={{ 
                opacity: 0, 
                animation: 'fadeInUp 0.6s ease-out 0.5s forwards' 
              }}
            >
              <a
                href={personalInfo.cvLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block"
                onMouseEnter={() => setHoveredCard('cv')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  className="relative rounded-xl transition-all duration-300 overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.1))',
                    border: '2px solid rgba(59, 130, 246, 0.3)',
                    boxShadow: hoveredCard === 'cv' ? '0 20px 60px rgba(59, 130, 246, 0.4)' : '0 4px 16px rgba(59, 130, 246, 0.2)',
                    transform: hoveredCard === 'cv' ? 'scale(1.02) translateY(-2px)' : 'scale(1) translateY(0)',
                    padding: '20px'
                  }}
                >
                  {/* GLOW EFFECT */}
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none"
                    style={{
                      opacity: hoveredCard === 'cv' ? 1 : 0,
                      background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.08) 40%, transparent 70%)',
                      filter: 'blur(30px)'
                    }}
                  />

                  <div className="relative z-10 flex items-center gap-4">
                    {/* ICON */}
                    <div
                      className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300"
                      style={{
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.2))',
                        border: '2px solid rgba(59, 130, 246, 0.5)',
                        boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
                        transform: hoveredCard === 'cv' ? 'scale(1.1) rotate(6deg)' : 'scale(1) rotate(0deg)',
                        padding: '8px'
                      }}
                    >
                      <Download size={22} className="text-blue-400" />
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold gradient-text mb-1.5">
                        Download CV
                      </h3>
                      <p className="text-slate-400 text-xs mb-3 leading-relaxed">
                        Complete professional resume in PDF format
                      </p>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/20 border border-blue-500/50 text-blue-400 text-xs font-semibold group-hover:bg-blue-500/30 transition-all">
                        <Download size={13} />
                        <span>PDF Format</span>
                      </div>
                    </div>

                    {/* EXTERNAL LINK ICON */}
                    <div className="flex-shrink-0" style={{ marginRight: '4px' }}>
                      <ExternalLink
                        size={13}
                        className="text-slate-500 transition-all duration-300"
                        style={{
                          color: hoveredCard === 'cv' ? '#cbd5e1' : '#64748b',
                          transform: hoveredCard === 'cv' ? 'translate(2px, -2px)' : 'translate(0, 0)'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </a>
            </div>

          </div>

          {/* ========== COLONNA 2: FORM ========== */}
          <div 
            style={{ 
              opacity: 0, 
              animation: 'fadeInUp 0.6s ease-out 0.6s forwards' 
            }}
          >
            <ContactForm />
          </div>

        </div>

      </div>

      <style>{`
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

        /* GRID PRINCIPALE - RESPONSIVE */
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          align-items: start;
        }

        /* GRID CONTACT METHODS - RESPONSIVE */
        .contact-methods-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        /* MOBILE: 1 colonna per tutto */
        @media (max-width: 1023px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 24px;
          }

          .contact-methods-grid {
            grid-template-columns: 1fr !important;
          }
        }

        /* TABLET: 2x3 per contact methods, ma ancora 1 colonna per layout principale */
        @media (min-width: 640px) and (max-width: 1023px) {
          .contact-methods-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}

export default ContactSection;