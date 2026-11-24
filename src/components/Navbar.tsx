import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { Globe, Menu, X, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  activeSection,
  onNavigate,
  onOpenAdmin,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'heritage', labelEn: 'History', labelSi: 'ඉතිහාසය' },
    { id: 'principal', labelEn: 'Principal', labelSi: 'විදුහල්පති' },
    { id: 'academics', labelEn: 'Houses', labelSi: 'නිවාස' },
    { id: 'events', labelEn: 'Events', labelSi: 'වැඩසටහන්' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#06173d]/95 backdrop-blur-md shadow-lg shadow-black/20 py-3 border-b border-amber-400/20'
          : 'bg-[#06173d] py-4 border-b border-white/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => handleLinkClick('hero')}
            className="flex items-center gap-3 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg p-1 cursor-pointer"
          >
            <img
              src="/assets/aistudio/logo_e1a8d9c2.jpg"
              alt="Saranath College Crest"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400/80 shadow-md group-hover:scale-105 transition-transform"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="font-serif-display text-xl font-bold tracking-wider text-white whitespace-nowrap shrink-0">
              SARANATH COLLEGE
            </span>
          </button>

          {/* Zone 2: 5 concise single-line nav links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-200">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`whitespace-nowrap shrink-0 py-1 transition-colors relative cursor-pointer ${
                    isActive
                      ? 'text-amber-400 font-semibold'
                      : 'hover:text-amber-300 text-slate-200'
                  }`}
                >
                  {lang === 'en' ? link.labelEn : link.labelSi}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action + Language Switch */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold tracking-wider text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              title="Switch between Sinhala and English"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'en' ? 'සිංහල' : 'English'}</span>
            </button>

            <button
              onClick={onOpenAdmin}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wide text-[#06173d] bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Admin Panel' : 'පරිපාලක'}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:text-amber-300 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#06173d] border-b border-amber-400/20 px-4 pt-3 pb-6 mt-2 space-y-2 shadow-2xl">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-slate-100 hover:text-amber-300 hover:bg-white/5 transition-colors"
            >
              {lang === 'en' ? link.labelEn : link.labelSi}
            </button>
          ))}
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#06173d] bg-amber-400 rounded-lg"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{lang === 'en' ? 'Open Admin Panel' : 'පරිපාලක පුවරුව'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
