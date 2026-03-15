import { useState, useEffect } from 'react';
import { navLinks, siteConfig } from '../config/siteConfig';
import { useSound } from '../utils/sound';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { playClick } = useSound();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolledTotal = (winScroll / height) * 100;
      setScrollProgress(scrolledTotal);
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
    <nav className={`fixed top-0 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 w-full ${
      scrolled 
        ? 'max-w-4xl translate-y-4 rounded-full py-1' 
        : 'max-w-7xl translate-y-0 py-4'
    }`}>
      {/* Scroll Progress Indicator */}
      <div className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-accent-400 via-accent-500 to-accent-600 shadow-[0_0_10px_#3b82f6] transition-all duration-300 z-[60]" style={{ width: `${scrollProgress}%` }} />

      <div className={`mx-4 sm:px-6 lg:px-8 transition-all duration-500 rounded-full ${scrolled ? 'glass-premium px-4' : 'bg-transparent'}`}>
        <div className="flex items-center justify-between h-14">
          {/* Modern Animated Logo */}
          <a
            href="#"
            onClick={(e) => handleNavClick(e, '#')}
            className="group flex items-center gap-1.5"
          >
            <div className="relative flex items-center">
              <span className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-200 group-hover:from-accent-400 group-hover:to-accent-600 transition-all duration-500 font-mono drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                {siteConfig.initials}
              </span>
              <span className="text-2xl font-black text-accent-400 ml-0.5 animate-pulse">_</span>
            </div>
          </a>

          {/* Desktop Navigation - Premium Pill Style */}
          <div className={`hidden md:flex items-center gap-1 transition-all duration-500 ${scrolled ? 'opacity-100 translate-y-0' : 'opacity-90 translate-y-0'}`}>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="relative px-5 py-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-all duration-500 rounded-full group/nav overflow-hidden"
              >
                {/* Background glow pill that slides in on hover */}
                <div className="absolute inset-0 bg-accent-400/10 rounded-full blur-md opacity-0 group-hover/nav:opacity-100 transition-opacity duration-500"></div>
                
                <span className="relative z-10 transition-transform duration-300 group-hover/nav:-translate-y-0.5 inline-block">{link.name}</span>
                
                {/* Premium active indicator line */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-[2.5px] bg-accent-400 group-hover/nav:w-6 transition-all duration-500 ease-out shadow-[0_0_12px_rgba(239,68,68,1)] rounded-full"></div>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="hidden sm:flex flex-row items-center gap-2 px-6 py-2.5 glass-premium-accent text-xs font-black uppercase tracking-widest hover:scale-105 transition-all duration-300 rounded-xl group/btn overflow-hidden relative shadow-lg shadow-accent-400/5 hover:shadow-accent-400/20"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover/btn:translate-x-[150%] transition-transform duration-[1000ms] ease-in-out"></div>
              <span className="relative z-10">CONNECT</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => {
                playClick();
                setIsOpen(!isOpen);
              }}
              className="md:hidden p-2 text-slate-400 hover:text-white transition-all"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 relative flex flex-col justify-between items-end">
                <span className={`h-0.5 bg-current transition-all duration-300 ${isOpen ? 'w-6 translate-y-2 -rotate-45' : 'w-6'}`}></span>
                <span className={`h-0.5 bg-current transition-all duration-300 ${isOpen ? 'opacity-0' : 'w-4'}`}></span>
                <span className={`h-0.5 bg-current transition-all duration-300 ${isOpen ? 'w-6 -translate-y-2 rotate-45' : 'w-5'}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div className={`md:hidden overflow-hidden transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'max-h-[500px] py-4 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4'}`}>
          <div className="flex flex-col gap-2 border-t border-white/5 pt-4 mt-2 glass-premium rounded-b-3xl -mx-4 px-4 pb-6 shadow-2xl">
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="relative px-6 py-4 text-base font-black text-slate-400 hover:text-white transition-all duration-300 flex items-center justify-between group rounded-2xl overflow-hidden uppercase tracking-widest"
              >
                <div className="absolute inset-0 bg-accent-400/0 group-hover:bg-accent-400/5 transition-colors duration-300"></div>
                <span className="relative z-10 group-hover:translate-x-2 transition-transform duration-300">{link.name}</span>
                <span className="text-[10px] font-mono opacity-20 group-hover:opacity-100 group-hover:text-accent-400 transition-all duration-300">#0{index + 1}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
