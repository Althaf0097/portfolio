import { useState, useEffect } from 'react';
import { navLinks, siteConfig } from '../config/siteConfig';
import { useSound } from '../utils/sound';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { playClick } = useSound();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    playClick();
    setIsOpen(false);
    
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.offsetTop - 64;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-dark-900/95 backdrop-blur-lg border-b border-dark-600/50 shadow-lg shadow-dark-900/50' 
        : 'bg-dark-900/80 backdrop-blur-md border-b border-dark-600/30'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Animated Logo */}
          <a 
            href="#" 
            onClick={(e) => handleNavClick(e, '#')}
            className="group relative flex items-center gap-1"
          >
            {/* Logo container with glow effect */}
            <div className="relative">
              {/* Glow background */}
              <div className="absolute -inset-2 bg-gradient-to-r from-accent-500 via-cyan-400 to-accent-500 rounded-lg opacity-0 group-hover:opacity-30 blur-lg transition-all duration-500 animate-pulse"></div>
              
              {/* Main logo text */}
              <span className="relative text-2xl font-black tracking-tight bg-gradient-to-r from-white via-accent-300 to-cyan-300 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-slow group-hover:animate-gradient-fast transition-all duration-300 group-hover:scale-110 inline-block transform">
                {siteConfig.initials}
              </span>
            </div>
            
            {/* Animated dot */}
            <span className="relative flex items-center justify-center">
              <span className="absolute w-3 h-3 bg-accent-400/30 rounded-full animate-ping"></span>
              <span className="relative text-2xl font-black text-accent-400 group-hover:text-cyan-400 transition-colors duration-300 group-hover:animate-bounce">.</span>
            </span>
            
            {/* Code brackets decoration */}
            <span className="absolute -left-4 top-1/2 -translate-y-1/2 text-accent-400/50 font-mono text-sm opacity-0 group-hover:opacity-100 group-hover:-left-5 transition-all duration-300">&lt;</span>
            <span className="absolute -right-4 top-1/2 -translate-y-1/2 text-accent-400/50 font-mono text-sm opacity-0 group-hover:opacity-100 group-hover:-right-5 transition-all duration-300">/&gt;</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="relative text-sm font-medium text-slate-300 hover:text-accent-400 transition-all duration-300 link-hover"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="px-4 py-2 text-sm font-medium text-white bg-accent-500 rounded-lg hover:bg-accent-600 transition-all duration-300 hover:shadow-lg hover:shadow-accent-500/25 hover:scale-105 active:scale-95"
            >
              Get In Touch
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => {
              playClick();
              setIsOpen(!isOpen);
            }}
            className="md:hidden p-2 text-slate-300 hover:text-white transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <svg className="w-6 h-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-out ${isOpen ? 'max-h-80 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="flex flex-col gap-2 pt-2">
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-4 py-3 text-sm font-medium text-slate-300 hover:text-accent-400 hover:bg-dark-700/50 rounded-lg transition-all duration-300 hover:translate-x-2"
                style={{ 
                  transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? 'translateX(0)' : 'translateX(-10px)'
                }}
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="mx-4 mt-2 px-4 py-3 text-sm font-medium text-center text-white bg-accent-500 rounded-lg hover:bg-accent-600 transition-all duration-300 active:scale-95"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
