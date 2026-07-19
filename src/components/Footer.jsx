import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig, socialLinks, navLinks } from '../config/siteConfig';
import { useSound } from '../utils/sound';

const Footer = () => {
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
      className="relative py-12 sm:py-16 overflow-hidden bg-[#0A0A0A] border-t border-white/5 text-white"
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Ambient background orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-primary/5 blur-[90px] pointer-events-none" />

      <div ref={contentRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center gap-8">
          {/* Logo & Name */}
          <div className="space-y-3">
            <a
              href="#"
              onClick={handleScrollToTop}
              className="group inline-flex items-center gap-3"
            >
              <span className="text-3xl font-black tracking-tight transition-colors duration-300 text-white group-hover:text-primary">
                {siteConfig.initials}
              </span>
              <div className="h-6 w-px bg-white/10 group-hover:bg-primary" />
              <span className="text-sm font-semibold uppercase tracking-wider transition-colors duration-300 text-muted group-hover:text-white font-mono">
                {siteConfig.name}
              </span>
            </a>
            <p className="text-sm text-muted">
              Crafting premium digital experiences
            </p>
          </div>

          {/* Navigation + Social Links */}
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-3 sm:gap-6">
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
                  className="text-sm font-medium transition-colors duration-300 relative group/link text-muted hover:text-primary font-mono uppercase tracking-wider"
                >
                  {link.name}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px transition-all duration-300 group-hover/link:w-full bg-primary" />
                </a>
              ))}
            </div>

            {/* Divider */}
            <div className="w-px h-4 hidden md:block bg-white/10" />

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
                  className="text-sm font-medium transition-colors duration-300 text-muted hover:text-primary font-mono uppercase tracking-wider"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="w-full pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 border-white/5">
            <div className="text-xs font-medium text-muted">
              © {currentYear} {siteConfig.name}. All rights reserved.
            </div>

            <a
              href="#"
              onClick={handleScrollToTop}
              className="text-xs transition-all flex items-center gap-2 group px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-primary/10 hover:text-primary hover:border-primary/30 font-mono uppercase tracking-widest"
            >
              [ BACK TO TOP ]
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
