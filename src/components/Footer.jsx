import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig, socialLinks, navLinks } from '../config/siteConfig';
import { useSound } from '../utils/sound';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { isDarkRed } = useTheme();
  const currentYear = new Date().getFullYear();
  const { playClick } = useSound();
  const footerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.8, ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
          }
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const handleScrollToTop = (e) => {
    e.preventDefault();
    playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      ref={footerRef}
      className={`relative py-16 overflow-hidden transition-colors duration-500 ${
        isDarkRed
          ? 'bg-[#0A050A] border-t border-red-500/30 text-white font-mono'
          : 'bg-gradient-to-b from-gray-50 to-white border-t border-gray-100 text-gray-800'
      }`}
    >
      {/* Top gradient accent line */}
      <div
        className={`absolute top-0 left-0 w-full h-px bg-gradient-to-r ${
          isDarkRed
            ? 'from-transparent via-red-500/60 to-transparent'
            : 'from-transparent via-blue-500/40 to-transparent'
        }`}
      />

      {/* Ambient background orb */}
      {isDarkRed ? (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-red-600/15 blur-[90px] pointer-events-none" />
      ) : (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] orb-blue opacity-10 pointer-events-none" />
      )}

      <div ref={contentRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center gap-8">
          {/* Logo & Name */}
          <div className="space-y-3">
            <a
              href="#"
              onClick={handleScrollToTop}
              className="group inline-flex items-center gap-3"
            >
              <span
                className={`text-3xl font-black font-display tracking-tight transition-colors duration-500 ${
                  isDarkRed
                    ? 'text-white group-hover:text-red-400'
                    : 'text-navy group-hover:text-blue-600'
                }`}
              >
                {siteConfig.initials}
              </span>
              <div
                className={`h-6 w-px transition-colors duration-500 ${
                  isDarkRed ? 'bg-red-500/30 group-hover:bg-red-400' : 'bg-gray-300 group-hover:bg-blue-400'
                }`}
              />
              <span
                className={`text-sm font-semibold uppercase tracking-wider transition-colors duration-500 ${
                  isDarkRed
                    ? 'text-gray-300 group-hover:text-white font-mono'
                    : 'text-gray-600 group-hover:text-navy'
                }`}
              >
                {isDarkRed ? `// SYS_${siteConfig.name}` : siteConfig.name}
              </span>
            </a>
            <p className={`text-sm ${isDarkRed ? 'text-gray-300' : 'text-gray-500'}`}>
              Crafting premium digital experiences
            </p>
          </div>

          {/* Navigation + Social Links */}
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
            {/* Quick Links */}
            <div className="flex gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    playClick();
                    const el = document.querySelector(link.href);
                    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
                  }}
                  className={`text-sm font-medium transition-colors duration-300 relative group/link ${
                    isDarkRed
                      ? 'text-gray-200 hover:text-red-400 font-mono uppercase tracking-wider'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-0.5 left-0 w-0 h-px transition-all duration-300 group-hover/link:w-full ${
                      isDarkRed ? 'bg-red-400' : 'bg-blue-600'
                    }`}
                  />
                </a>
              ))}
            </div>

            {/* Divider */}
            <div
              className={`w-px h-4 hidden md:block ${
                isDarkRed ? 'bg-red-500/30' : 'bg-gray-200'
              }`}
            />

            {/* Social Links */}
            <div className="flex gap-4">
              {[
                { name: 'GitHub', href: socialLinks.github },
                { name: 'LinkedIn', href: socialLinks.linkedin },
                { name: 'Twitter', href: socialLinks.twitter }
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={playClick}
                  className={`text-sm font-medium transition-colors duration-300 ${
                    isDarkRed
                      ? 'text-gray-200 hover:text-red-400 font-mono uppercase tracking-wider'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className={`w-full pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 ${
              isDarkRed ? 'border-red-500/20' : 'border-gray-200'
            }`}
          >
            <div className={`text-xs font-medium ${isDarkRed ? 'text-gray-300' : 'text-gray-500'}`}>
              © {currentYear} {siteConfig.name}. All rights reserved.
            </div>

            <a
              href="#"
              onClick={handleScrollToTop}
              className={`text-xs transition-all flex items-center gap-2 group px-4 py-2 rounded-full border ${
                isDarkRed
                  ? 'text-red-300 border-red-500/40 bg-red-950/40 hover:bg-red-900/60 hover:text-white font-mono uppercase tracking-widest'
                  : 'text-gray-600 border-gray-200 hover:border-blue-400/40 hover:text-blue-600 bg-white shadow-sm'
              }`}
            >
              {isDarkRed ? '[ SYS :: BACK_TO_TOP ]' : 'Back to top'}
              <svg className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
