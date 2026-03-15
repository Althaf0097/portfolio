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
    <nav className={`fixed top-0 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 w-[calc(100%-2rem)] ${
      scrolled 
        ? 'max-w-4xl translate-y-4 bg-dark-900/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] rounded-full py-2 px-4' 
        : 'max-w-5xl translate-y-6 bg-transparent py-4 px-2'
    }`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Modern Animated Logo */}
          <a
            href="#"
            onClick={(e) => handleNavClick(e, '#')}
            className="group flex items-center gap-1.5"
          >
            <div className="relative flex items-center">
              <span className="text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 group-hover:from-accent-400 group-hover:to-cyan-400 transition-all duration-500 font-mono drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] group-hover:drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]">
                {siteConfig.initials}
              </span>
              <span className="text-xl font-black text-accent-400 ml-0.5 animate-pulse drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">_</span>
            </div>
            
            {/* Subtle floating label for desktop */}
            <div className="hidden sm:block overflow-hidden transition-all duration-500 max-w-0 group-hover:max-w-[100px]">
              <span className="text-[10px] font-bold text-accent-400/50 uppercase tracking-widest pl-2 border-l border-white/10 ml-2">
                DEVELOPER
              </span>
            </div>
          </a>

          {/* Desktop Navigation - Premium Pill Style */}
          <div className="hidden md:flex items-center gap-1 bg-dark-900/50 rounded-full p-1.5 border border-white/10 shadow-inner shadow-black/50 backdrop-blur-md">
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="relative px-5 py-2 text-xs font-bold text-slate-400 hover:text-white transition-all duration-500 rounded-full group/nav overflow-hidden"
              >
                {/* Background glow pill that slides in on hover */}
                <div className="absolute inset-0 bg-accent-400/20 rounded-full blur-md opacity-0 group-hover/nav:opacity-100 transition-opacity duration-500"></div>
                
                {/* Border subtle glow */}
                <div className="absolute inset-0 border border-accent-400/0 group-hover/nav:border-accent-400/40 rounded-full transition-colors duration-500"></div>

                <span className="relative z-10 transition-transform duration-300 group-hover/nav:-translate-y-0.5 inline-block">{link.name}</span>
                
                {/* Premium active indicator line */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-accent-400 group-hover/nav:w-6 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(239,68,68,0.9)] rounded-full"></div>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="hidden sm:flex flex-row items-center gap-2 px-6 py-2.5 btn-premium-accent text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all duration-300 rounded-xl group/btn overflow-hidden relative"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-[150%] group-hover/btn:translate-x-[150%] transition-transform duration-[1000ms] ease-in-out"></div>
              
              <svg className="w-3 h-3 relative z-10 group-hover/btn:rotate-45 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <span className="relative z-10 drop-shadow-md">CONNECT</span>
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
          <div className="flex flex-col gap-2 border-t border-white/10 pt-4 mt-2 bg-dark-900/50 backdrop-blur-xl rounded-b-3xl -mx-4 px-4 pb-6 shadow-2xl">
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="relative px-6 py-4 text-lg font-bold text-slate-400 hover:text-white transition-all duration-300 flex items-center justify-between group rounded-2xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-accent-400/0 group-hover:bg-accent-400/10 transition-colors duration-300"></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-accent-400 group-hover:h-full transition-all duration-300 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                <span className="relative z-10 group-hover:translate-x-2 transition-transform duration-300">{link.name}</span>
                <span className="text-xs font-mono opacity-20 group-hover:opacity-100 group-hover:text-accent-400 transition-all duration-300">0{index + 1}</span>
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="relative mt-4 mx-2 py-4 px-6 btn-premium-accent text-center font-black uppercase tracking-[0.2em] text-xs rounded-2xl transition-all shadow-xl hover:scale-[1.02] overflow-hidden group/mobibtn"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-[150%] group-hover/mobibtn:translate-x-[150%] transition-transform duration-[1000ms] ease-in-out"></div>
              <span className="relative z-10 drop-shadow-md">Contact Me</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
