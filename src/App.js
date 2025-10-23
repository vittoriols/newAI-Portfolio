import React, { useState, useEffect } from 'react';
import Navbar from './components/Layout/Navbar';
import AnimatedBackground from './components/UI/AnimatedBackground';
import BioSection from './components/Sections/BioSection';
import AskMeSection from './components/Sections/AskMeSection';
import ExperienceSection from './components/Sections/ExperienceSection';
import CertificationsSection from './components/Sections/CertificationsSection';
import SkillsSection from './components/Sections/SkillsSection';
import ProjectsSection from './components/Sections/ProjectsSection';
import AuthoredSection from './components/Sections/AuthoredSection';
import ContactSection from './components/Sections/ContactSection';
import { trackVisitor } from './utils/visitorTracking';

function App() {
  const [currentSection, setCurrentSection] = useState('bio');

  useEffect(() => {
    trackVisitor();
  }, []);

  const renderSection = () => {
    switch (currentSection) {
      case 'bio':
        return <BioSection onContactClick={() => setCurrentSection('contact')} />;
      case 'askme':
        return <AskMeSection />;
      case 'experience':
        return <ExperienceSection />;
      case 'certifications':
        return <CertificationsSection />;
      case 'skills':
        return <SkillsSection />;
      case 'projects':
        return <ProjectsSection />;
      case 'authored':
        return <AuthoredSection />;
      case 'contact':
        return <ContactSection />;
      default:
        return <BioSection onContactClick={() => setCurrentSection('contact')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-x-hidden relative">
      <AnimatedBackground />
      <Navbar currentSection={currentSection} onSectionChange={setCurrentSection} />
      
      <main className="relative pt-20 pb-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-fade-in" key={currentSection}>
            {renderSection()}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;