import { siteConfig } from '../config/siteConfig';
import { useSound } from '../utils/sound';

const Hero = () => {
  const { playClick } = useSound();

  const handleScrollTo = (e, href) => {
    e.preventDefault();
    playClick();
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.offsetTop - 64;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradient overlay - semi-transparent to show 3D from App */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900/60 via-dark-800/40 to-dark-900/60">
        <div className="absolute top-1/4 left-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] z-[2]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      ></div>

      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Status badge */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 mb-6 sm:mb-8 text-xs sm:text-sm font-medium text-accent-400 bg-accent-500/10 rounded-full border border-accent-500/20 backdrop-blur-sm animate-fade-in-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <span className="w-2 h-2 bg-green-400 rounded-full pulse-soft"></span>
          {siteConfig.availability}
        </div>

        {/* Main heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 tracking-tight animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          Hi, I'm{' '}
          <span className="bg-gradient-to-r from-accent-400 via-cyan-400 to-accent-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            {siteConfig.name}
          </span>
        </h1>

        {/* Role */}
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-slate-400 mb-4 sm:mb-6 animate-fade-in-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          {siteConfig.role}
        </p>

        {/* Value statement */}
        <p className="text-base sm:text-lg md:text-xl text-slate-500 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up opacity-0 px-2" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
          {siteConfig.tagline}
        </p>

        {/* CTA Buttons - stack on mobile */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-in-up opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
          <a
            href="#projects"
            onClick={(e) => handleScrollTo(e, '#projects')}
            className="group relative overflow-hidden w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-accent-500 to-accent-600 rounded-xl transition-all duration-500 hover:shadow-xl hover:shadow-accent-500/25 hover:-translate-y-1 hover:scale-105 active:scale-95 glow-accent"
          >
            <span className="relative z-10 flex items-center justify-center">
              View My Work
              <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-2">→</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-accent-600 to-accent-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </a>
          <a
            href="#contact"
            onClick={(e) => handleScrollTo(e, '#contact')}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-slate-300 border border-dark-500 rounded-xl hover:border-accent-500 hover:text-accent-400 transition-all duration-500 hover:-translate-y-1 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-accent-500/10 backdrop-blur-sm text-center"
          >
            Get In Touch
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-slate-500 transition-colors hover:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;
