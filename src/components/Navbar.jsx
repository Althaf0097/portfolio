import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { navLinks, siteConfig } from '../config/siteConfig';
import { useSound } from '../utils/sound';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  const linksRef = useRef([]);
  const logoRef = useRef(null);
  const ctaRef = useRef(null);
  const { playClick } = useSound();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Entrance animation
    const tl = gsap.timeline({ delay: 0.3 });
    tl.fromTo(
      logoRef.current,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }
    );
    tl.fromTo(
      linksRef.current,
      { opacity: 0, y: -12 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.07 },
      '-=0.3'
    );
    tl.fromTo(
      ctaRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.6)' },
      '-=0.2'
    );

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
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none pt-3 sm:pt-6">
      <nav
        ref={navRef}
        className={`pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled
            ? 'w-[92%] sm:w-[85%] max-w-3xl translate-y-1'
            : 'w-[92%] sm:w-[90%] max-w-7xl translate-y-0'
        }`}
      >
        <div
          className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-full ${
            scrolled
              ? 'bg-[#101010]/95 px-4 sm:px-7 py-2.5 shadow-xl shadow-primary/10 border border-primary/20 backdrop-blur-xl'
              : 'bg-[#050505]/85 backdrop-blur-md px-4 sm:px-8 py-3 border border-white/10 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a
              ref={logoRef}
              href="#"
              onClick={(e) => handleNavClick(e, '#')}
              className="group flex items-center gap-1.5"
            >
              <span className="text-xl sm:text-2xl font-black tracking-tight group-hover:text-primary transition-colors duration-300 font-display text-white">
                {siteConfig.initials}
              </span>
              <span className="text-xl sm:text-2xl font-black text-primary animate-pulse">
                _
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link, i) => (
                <a
                  key={link.name}
                  ref={(el) => (linksRef.current[i] = el)}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="relative px-4 py-1.5 text-sm font-semibold transition-all duration-300 rounded-full group/nav text-muted hover:text-white"
                >
                  <span className="relative z-10">{link.name}</span>
                  <div className="absolute inset-0 rounded-full opacity-0 scale-95 group-hover/nav:opacity-100 group-hover/nav:scale-100 transition-all duration-300 -z-0 bg-white/5" />
                </a>
              ))}
            </div>

            {/* CTA & Mobile Menu */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <a
                ref={ctaRef}
                href="#contact"
                onClick={(e) => handleNavClick(e, '#contact')}
                className="hidden sm:flex items-center gap-2 font-semibold rounded-full transition-all duration-400 btn-primary px-5 py-2 text-xs"
              >
                Let's Talk
              </a>

              {/* Mobile Menu Button */}
              <button
                onClick={() => {
                  playClick();
                  setIsOpen(!isOpen);
                }}
                className="md:hidden p-2 text-muted hover:text-white transition-all rounded-full hover:bg-white/5"
                aria-label="Toggle menu"
              >
                <div className="w-5 h-4 relative flex flex-col justify-between">
                  <span
                    className={`h-0.5 bg-current rounded-full transition-all duration-300 ${
                      isOpen ? 'w-5 translate-y-[7px] -rotate-45' : 'w-5'
                    }`}
                  />
                  <span
                    className={`h-0.5 bg-current rounded-full transition-all duration-300 ${
                      isOpen ? 'opacity-0 w-0' : 'w-3 ml-auto'
                    }`}
                  />
                  <span
                    className={`h-0.5 bg-current rounded-full transition-all duration-300 ${
                      isOpen ? 'w-5 -translate-y-[7px] rotate-45' : 'w-4 ml-auto'
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Dropdown */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isOpen ? 'max-h-[380px] pt-4 pb-3 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="flex flex-col gap-1 pt-2 border-t border-white/10">
              {navLinks.map((link, index) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 flex items-center justify-between text-white hover:text-primary hover:bg-white/5"
                >
                  <span>{link.name}</span>
                  <span className="text-xs font-mono text-primary/60">
                    0{index + 1}
                  </span>
                </a>
              ))}
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, '#contact')}
                className="mt-2 mx-2 py-2.5 text-center text-white text-sm font-semibold rounded-full btn-primary"
              >
                Let's Talk
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
