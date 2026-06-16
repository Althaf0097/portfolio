import { useState, useEffect, useRef } from 'react';
import { siteConfig } from '../config/siteConfig';
import { useSound } from '../utils/sound';
import profileImg from '../assets/images/profile photo.png';

const Hero = () => {
  const { playClick } = useSound();
  const [roleIndex, setRoleIndex] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);
  const glowRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!glowRef.current) return;
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      // Direct DOM update to avoid React re-renders
      glowRef.current.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(59, 130, 246, 0.08) 0%, transparent 40%)`;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlashing(true);
      
      // Delay to complete the split animation
      setTimeout(() => {
        setRoleIndex((prev) => (prev + 1) % siteConfig.roles.length);
        setIsFlashing(false);
      }, 700);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleScrollTo = (e, href) => {
    e.preventDefault();
    playClick();
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.offsetTop - 64;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  const nextRoleIndex = (roleIndex + 1) % siteConfig.roles.length;

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 bg-dark-950">
      {/* Volumetric Mouse Follow Glow - Optimized with useRef for 60fps interaction */}
      <div 
        ref={glowRef}
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 40%)`,
          willChange: 'background'
        }}
      ></div>

      {/* Background Mesh Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent-400/20 rounded-full blur-[120px] mix-blend-screen animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-400/15 rounded-full blur-[120px] mix-blend-screen animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

      {/* Modern HUD Elements */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-0 w-24 hud-line-h"></div>
        <div className="absolute top-1/4 left-24 hud-dot"></div>
        <div className="absolute top-0 right-1/4 h-32 hud-line-v"></div>
        <div className="absolute bottom-1/4 right-0 w-32 hud-line-h"></div>
        <div className="absolute bottom-1/4 right-32 hud-dot"></div>
      </div>

      {/* Modern Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.05] z-[2]"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: 'clamp(20px, 5vw, 40px) clamp(20px, 5vw, 40px)',
          maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
        }}
      ></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
        {/* Modern Label */}
        <div className="group inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md animate-fade-in relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-400"></span>
          </span>
          <span className="text-[10px] font-mono font-black tracking-[0.3em] text-slate-400 uppercase">SYSTEM_INIT_COMPLETE</span>
        </div>

        {/* Mobile/Tablet Profile Image - Hidden on lg screens */}
        <div className="lg:hidden relative mb-8 animate-fade-in animate-delay-200">
          <div className="absolute inset-0 bg-accent-400/20 blur-2xl rounded-full animate-pulse"></div>
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-accent-400/50 shadow-[0_0_30px_rgba(239,68,68,0.3)] mx-auto">
            <img 
              src={profileImg} 
              alt="Althaf" 
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=Althaf+S&background=09090b&color=3b82f6&size=512&bold=true"; }}
            />
          </div>
        </div>

        {/* Main Display Area */}
        <div className="relative mb-8 mt-4 flex justify-center w-full">
          
          <h1 className="relative text-6xl sm:text-7xl md:text-[6rem] font-black tracking-tight leading-none font-archivo cursor-default group/name text-center">
            {/* Emerging Photo from Left on Hover */}
            <div className="absolute top-1/2 -translate-y-1/2 right-[105%] mr-8 hidden lg:block w-48 h-52 rounded-3xl overflow-hidden border-2 border-accent-400/50 opacity-0 -translate-x-10 group-hover/name:opacity-100 group-hover/name:translate-x-0 transition-all duration-700 ease-out shadow-[0_0_50px_rgba(239,68,68,0.4)] z-50 pointer-events-none rotate-[-6deg] group-hover/name:rotate-0">
              <div className="absolute inset-0 bg-accent-400/10 mix-blend-overlay z-10"></div>
              <img 
                src={profileImg} 
                alt="Hover Preview" 
                className="w-full h-full object-cover scale-125 group-hover/name:scale-100 transition-all duration-1000"
                onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=Althaf+S&background=09090b&color=3b82f6&size=512&bold=true"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent"></div>
              {/* Decorative scanlines on the hover photo */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] opacity-20 z-20"></div>
            </div>

            {/* Premium intense glow behind text on hover */}
            <div className="absolute inset-0 bg-accent-400/0 group-hover/name:bg-accent-400/40 blur-[80px] rounded-full transition-all duration-1000 ease-out -z-10 pointer-events-none scale-50 group-hover/name:scale-150"></div>
            
            <span className="relative z-10 inline-block text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 uppercase transition-all duration-[800ms] cubic-bezier(0.16, 1, 0.3, 1) group-hover/name:scale-[1.08] group-hover/name:-translate-y-2 group-hover/name:tracking-[0.15em] drop-shadow-2xl">
              {siteConfig.name}
            </span>
            
            {/* Tech line that expands underneath */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-0 h-px bg-gradient-to-r from-transparent via-accent-400 to-transparent group-hover/name:w-[120%] transition-all duration-1000 ease-in-out opacity-0 group-hover/name:opacity-100 pointer-events-none"></div>
            {/* Glowing core of the tech line */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-0 h-[3px] bg-accent-400 blur-sm group-hover/name:w-[40%] transition-all duration-700 delay-100 ease-out opacity-0 group-hover/name:opacity-100 pointer-events-none"></div>
          </h1>
          
          {/* Decorative side accent */}
          <div className="hidden lg:block absolute -left-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent-400/50 to-transparent"></div>
        </div>

        {/* Value Proposition */}
        <div className="max-w-4xl mx-auto mb-16 text-center select-none">
          <div className="relative h-20 md:h-28 flex items-center justify-center">
            {/* Laser Beam */}
            {isFlashing && (
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-50 pointer-events-none">
                <div className="w-full animate-laser-ignite" />
              </div>
            )}

            {/* Roles Container */}
            <div className="relative w-full h-full flex items-center justify-center">
              {/* The Static State (Visible when NOT flashing) */}
              <div className={`transition-opacity duration-200 ${isFlashing ? 'opacity-0' : 'opacity-100'}`}>
                <p className="text-3xl md:text-4xl text-white font-black uppercase tracking-[0.25em]">
                  {siteConfig.roles[roleIndex]}
                </p>
              </div>

              {/* The "Power-Down" Split Layers (Visible ONLY when flashing) */}
              {isFlashing && (
                <>
                  {/* Top Half Moving Up */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center animate-split-top pointer-events-none"
                    style={{ clipPath: 'inset(0 0 49% 0)' }}
                  >
                    <p className="text-3xl md:text-4xl text-white font-black uppercase tracking-[0.25em]">
                      {siteConfig.roles[roleIndex]}
                    </p>
                  </div>

                  {/* Bottom Half Moving Down */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center animate-split-bottom pointer-events-none"
                    style={{ clipPath: 'inset(49% 0 0 0)' }}
                  >
                    <p className="text-3xl md:text-4xl text-white font-black uppercase tracking-[0.25em]">
                      {siteConfig.roles[roleIndex]}
                    </p>
                  </div>

                  {/* The Incoming Role (Reveals from behind) */}
                  <div className="absolute inset-0 flex items-center justify-center animate-fade-in opacity-0 animate-delay-500">
                    <p className="text-3xl md:text-4xl text-white font-black uppercase tracking-[0.25em] text-glow filter drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                      {siteConfig.roles[nextRoleIndex]}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="flex justify-center mt-4 mb-8">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-accent-400/50 to-transparent"></div>
          </div>
          <p className="text-sm md:text-base font-sans text-slate-300 tracking-wide font-light leading-relaxed max-w-2xl mx-auto">
            {siteConfig.tagline}
          </p>
        </div>

        {/* Modern CTA Cluster */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a
            href="#projects"
            onClick={(e) => handleScrollTo(e, '#projects')}
            className="w-full sm:w-auto px-10 py-4 btn-premium-accent rounded-xl text-xs font-bold uppercase tracking-[0.2em] font-sans"
          >
            View Projects
          </a>

          <a
            href="#contact"
            onClick={(e) => handleScrollTo(e, '#contact')}
            className="w-full sm:w-auto px-10 py-4 btn-premium rounded-xl text-xs font-bold uppercase tracking-[0.2em] font-sans"
          >
            Contact Me
          </a>
        </div>
      </div>

      {/* Scroll Hint */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30 hover:opacity-100 transition-opacity duration-500 cursor-pointer" onClick={(e) => handleScrollTo(e, '#about')}>
        <span className="text-[10px] font-mono tracking-[0.4em] uppercase -rotate-90 origin-center mb-8">SCROLL</span>
        <div className="w-px h-16 bg-gradient-to-b from-accent-400 to-transparent"></div>
      </div>
    </section>
  );
};

export default Hero;
