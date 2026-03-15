import { siteConfig, socialLinks, navLinks } from '../config/siteConfig';
import { useSound } from '../utils/sound';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { playClick } = useSound();

  const handleScrollToTop = (e) => {
    e.preventDefault();
    playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-dark-950 py-16 border-t border-white/5 overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center gap-10">
          
          {/* Logo & Name */}
          <div className="space-y-4">
            <a 
              href="#" 
              onClick={handleScrollToTop}
              className="group inline-flex items-center gap-4"
            >
              <span className="text-4xl font-black font-archivo tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500 group-hover:from-blue-400 group-hover:to-cyan-400 transition-all duration-700">
                {siteConfig.initials}
              </span>
              <div className="h-8 w-px bg-white/10 group-hover:bg-blue-500/40 transition-colors duration-500"></div>
              <span className="text-base font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-white transition-colors duration-500">
                {siteConfig.name}
              </span>
            </a>
            <p className="text-slate-500 text-sm font-light max-w-sm mx-auto uppercase tracking-widest font-mono">
              Crafting premium digital experiences // 2026 Edition
            </p>
          </div>

          {/* Navigation & Social Link Row */}
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
            {/* Quick Links Group */}
            <div className="flex gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    playClick();
                    const el = document.querySelector(link.href);
                    if (el) window.scrollTo({ top: el.offsetTop - 64, behavior: 'smooth' });
                  }}
                  className="text-xs font-black text-slate-400 hover:text-white transition-all uppercase tracking-[0.2em] relative group/link"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-500 transition-all duration-500 group-hover/link:w-full"></span>
                </a>
              ))}
            </div>

            {/* Social Group */}
            <div className="flex gap-6 items-center">
              <div className="w-px h-4 bg-white/10 hidden md:block"></div>
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
                  className="text-[11px] font-mono font-black text-slate-500 hover:text-blue-400 transition-all uppercase tracking-widest"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>

          {/* Bottom section with copyright and back to top */}
          <div className="w-full pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-[10px] font-mono font-black text-slate-600 uppercase tracking-[0.4em]">
              © {currentYear} // {siteConfig.name.toUpperCase()} // ALL_RIGHTS_RESERVED
            </div>

            <a 
              href="#" 
              onClick={handleScrollToTop}
              className="text-[10px] font-mono font-black text-slate-500 hover:text-white transition-all uppercase tracking-[0.5em] flex items-center gap-3 group px-4 py-2 bg-white/5 rounded-full border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5"
            >
              UP
              <svg className="w-3 h-3 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
              </svg>
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
