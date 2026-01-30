import { siteConfig, socialLinks } from '../config/siteConfig';
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
    <footer className="py-8 border-t border-dark-600">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo and copyright */}
          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-lg font-bold text-white transition-all duration-300 hover:text-accent-400">
              {siteConfig.initials}<span className="text-accent-400">.</span>
            </span>
            <span className="text-sm">
              © {currentYear} {siteConfig.name}. All rights reserved.
            </span>
          </div>

          {/* Quick links */}
          <div className="flex items-center gap-6">
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClick}
              className="text-sm text-slate-400 hover:text-accent-400 transition-all duration-300 hover:scale-105"
            >
              GitHub
            </a>
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClick}
              className="text-sm text-slate-400 hover:text-accent-400 transition-all duration-300 hover:scale-105"
            >
              LinkedIn
            </a>
            <a
              href={socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClick}
              className="text-sm text-slate-400 hover:text-accent-400 transition-all duration-300 hover:scale-105"
            >
              Twitter
            </a>
          </div>
        </div>

        {/* Back to top */}
        <div className="mt-8 text-center">
          <a
            href="#"
            onClick={handleScrollToTop}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-accent-400 transition-all duration-300 hover:scale-105 active:scale-95 group"
          >
            Back to top
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
