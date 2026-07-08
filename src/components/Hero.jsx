import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from '../config/siteConfig';
import { useSound } from '../utils/sound';
import profileImg from '../assets/images/profile photo.png';
import BoxStructureOverlay from './ui/BoxStructureOverlay';
import { useTheme } from '../context/ThemeContext';

const Hero = () => {
  const { isDarkRed } = useTheme();
  const { playClick } = useSound();
  const sectionRef = useRef(null);
  const nameRef = useRef(null);
  const taglineRef = useRef(null);
  const ctaRef = useRef(null);
  const imageRef = useRef(null);
  const marqueeRef = useRef(null);
  const badgeRef = useRef(null);
  const scrollHintRef = useRef(null);
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const orb3Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.6 });

      // Badge fade in
      tl.fromTo(badgeRef.current,
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.5)' }
      );

      // Name reveal — word by word
      const nameWords = nameRef.current.querySelectorAll('.word');
      tl.fromTo(nameWords,
        { opacity: 0, y: 80, rotateX: 40 },
        {
          opacity: 1, y: 0, rotateX: 0,
          duration: 0.8, ease: 'power4.out',
          stagger: 0.12
        },
        '-=0.3'
      );

      // Profile image clip reveal
      tl.fromTo(imageRef.current,
        { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
        {
          clipPath: 'inset(0% 0 0 0)', opacity: 1,
          duration: 1, ease: 'power3.inOut'
        },
        '-=0.5'
      );

      // Tagline
      tl.fromTo(taglineRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', clearProps: 'all' },
        '-=0.4'
      );

      // CTA buttons
      const buttons = ctaRef.current.querySelectorAll('a');
      tl.fromTo(buttons,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.15 },
        '-=0.3'
      );

      // Marquee start
      tl.fromTo(marqueeRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        '-=0.3'
      );

      // Scroll hint
      tl.fromTo(scrollHintRef.current,
        { opacity: 0, y: -10 },
        { opacity: 0.4, y: 0, duration: 0.6 },
        '-=0.2'
      );

      // Parallax orbs on scroll
      gsap.to(orb1Ref.current, {
        y: -100,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });

      gsap.to(orb2Ref.current, {
        y: -60, x: 40,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });

      gsap.to(orb3Ref.current, {
        y: -80,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });

      // Scrubbed scrolling text parallax & fade
      gsap.to([nameRef.current, taglineRef.current], {
        y: -70,
        opacity: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '60% top',
          scrub: 1
        }
      });

      // Infinite marquee animation
      const marqueeTrack = marqueeRef.current?.querySelector('.marquee-track');
      if (marqueeTrack) {
        const trackWidth = marqueeTrack.scrollWidth / 2;
        gsap.to(marqueeTrack, {
          x: -trackWidth,
          duration: 25,
          ease: 'none',
          repeat: -1,
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleScrollTo = (e, href) => {
    e.preventDefault();
    playClick();
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  const roleItems = [...siteConfig.roles, ...siteConfig.roles];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-box-structure"
    >
      <BoxStructureOverlay />

      {/* Ambient Gradient Orbs - Dramatic Top-Right Dark Nebula Eclipse in Cyber Noir Mode */}
      {isDarkRed ? (
        <>
          {/* Top Right Dark Crimson Nebula Eclipse */}
          <div className="absolute top-[-15%] right-[-10%] w-[750px] h-[750px] rounded-full bg-gradient-to-br from-red-600/35 via-red-950/45 to-black blur-[100px] pointer-events-none animate-pulse-slow" />
          <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-red-500/15 blur-[80px] pointer-events-none animate-float" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-red-900/20 blur-[100px] pointer-events-none animate-float-slow" />
        </>
      ) : (
        <>
          <div ref={orb1Ref} className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] orb-blue animate-float-slow" />
          <div ref={orb2Ref} className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] orb-sky animate-float" />
          <div ref={orb3Ref} className="absolute top-[30%] left-[20%] w-[300px] h-[300px] orb-indigo animate-pulse-soft" />
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Availability Badge - Futuristic Cyber HUD Pill in Dark Mode */}
            <div
              ref={badgeRef}
              className={`inline-flex items-center gap-3 px-4 py-2 rounded-full mb-8 transition-all duration-500 ${
                isDarkRed
                  ? 'bg-red-950/60 border border-red-500/50 shadow-lg shadow-red-500/20 font-mono text-xs tracking-widest'
                  : 'bg-blue-50 border border-blue-100'
              }`}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isDarkRed ? 'bg-red-400' : 'bg-green-400'}`} />
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isDarkRed ? 'bg-red-500' : 'bg-green-500'}`} />
              </span>
              <span className={`text-sm font-medium ${isDarkRed ? 'text-red-300 font-mono text-xs uppercase' : 'text-blue-600'}`}>
                {isDarkRed ? `// SYS::ACTIVE -- ${siteConfig.availability}` : siteConfig.availability}
              </span>
            </div>

            {/* Name */}
            <h1
              ref={nameRef}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight mb-6"
              style={{ perspective: '1000px' }}
            >
              {siteConfig.name.split(' ').map((word, i) => (
                <span key={i} className="word inline-block mr-4">
                  {i === 0 ? (
                    <span className="text-navy">{word}</span>
                  ) : (
                    <span className="text-gradient-blue">{word}</span>
                  )}
                </span>
              ))}
            </h1>

            {/* Role */}
            <p className={`text-xl sm:text-2xl font-display font-bold mb-6 tracking-tight ${
              isDarkRed ? 'text-red-400 font-mono tracking-widest uppercase text-lg' : 'text-gray-700'
            }`}>
              {isDarkRed ? `// ROLE :: ${siteConfig.role}` : siteConfig.role}
            </p>

            {/* Tagline */}
            <p
              ref={taglineRef}
              className={`text-base sm:text-lg font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10 ${
                isDarkRed ? 'text-white' : 'text-gray-700'
              }`}
            >
              {siteConfig.tagline}
            </p>

            {/* CTA Buttons - Cyber HUD Terminal Style in Dark Mode */}
            <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#projects"
                onClick={(e) => handleScrollTo(e, '#projects')}
                className={`w-full sm:w-auto px-8 py-4 flex items-center justify-center gap-2 transition-all duration-300 ${
                  isDarkRed
                    ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-lg shadow-red-600/40 font-mono tracking-widest uppercase text-xs border border-red-400/50 rounded-lg hover:scale-105'
                    : 'btn-blue rounded-full text-sm font-semibold tracking-wide'
                }`}
              >
                {isDarkRed ? '[ EXEC :: VIEW_WORK ]' : 'View My Work'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="#contact"
                onClick={(e) => handleScrollTo(e, '#contact')}
                className={`w-full sm:w-auto px-8 py-4 transition-all duration-300 text-center ${
                  isDarkRed
                    ? 'bg-red-950/50 border border-red-500/60 text-red-300 font-mono tracking-widest uppercase text-xs rounded-lg hover:bg-red-900/40 hover:text-white'
                    : 'btn-outline rounded-full text-sm font-semibold tracking-wide'
                }`}
              >
                {isDarkRed ? '[ INIT :: CONTACT ]' : 'Get in Touch'}
              </a>
            </div>
          </div>

          {/* Right — Profile Image */}
          <div className={`order-1 lg:order-2 flex justify-center lg:justify-end ${isDarkRed ? 'animate-photo-levitate' : ''}`}>
            <div className="relative">
              {/* Outer Counter-Rotating Ring in Dark Mode */}
              {isDarkRed && (
                <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-tr from-red-600/50 via-transparent to-red-500/40 opacity-70 animate-spin-reverse-slow pointer-events-none" />
              )}
              {/* Decorative ring */}
              <div className={`absolute -inset-4 rounded-[2rem] animate-spin-slow ${
                isDarkRed
                  ? 'bg-gradient-to-br from-red-500/80 via-transparent to-red-900/80 shadow-[0_0_55px_rgba(255,30,86,0.6)] opacity-90'
                  : 'bg-gradient-to-br from-blue-100 via-transparent to-sky-100 opacity-60'
              }`} />
              <div
                ref={imageRef}
                className={`relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-[2rem] overflow-hidden ${
                  isDarkRed
                    ? 'border-2 border-red-500/80 animate-ruby-pulse shadow-2xl shadow-red-600/50'
                    : 'shadow-2xl shadow-blue-500/10'
                }`}
              >
                <img
                  src={profileImg}
                  alt={siteConfig.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(siteConfig.name)}&background=2563EB&color=fff&size=512&bold=true`;
                  }}
                />
                {/* Continuous Cyber Scanline Sweep in Dark Mode */}
                {isDarkRed && (
                  <div className="absolute left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_14px_#FF1E56] animate-cyber-scanline pointer-events-none z-10" />
                )}
                {/* Overlay gradient */}
                <div className={`absolute inset-0 ${isDarkRed ? 'bg-gradient-to-t from-red-600/30 via-transparent to-transparent rounded-[2rem]' : 'bg-gradient-to-t from-blue-600/10 via-transparent to-transparent'}`} />
              </div>
              {/* Floating stats card */}
              <div className={`absolute -bottom-6 -left-6 rounded-2xl px-5 py-4 border animate-float transition-all duration-500 ${
                isDarkRed
                  ? 'bg-[#0A050A]/95 border-red-500/50 shadow-xl shadow-red-500/30 font-mono'
                  : 'bg-white border-gray-100 shadow-xl shadow-blue-500/10'
              }`}>
                <div className={`text-2xl font-black ${isDarkRed ? 'text-red-400' : 'text-blue-600'}`}>
                  {isDarkRed ? `SYS_${siteConfig.roles.length}+` : `${siteConfig.roles.length}+`}
                </div>
                <div className={`text-xs font-bold uppercase tracking-wider ${isDarkRed ? 'text-gray-300 font-mono' : 'text-gray-600'}`}>
                  {isDarkRed ? 'MODS_READY' : 'Skills'}
                </div>
              </div>
              {/* Floating experience card */}
              <div className={`absolute -top-4 -right-4 rounded-2xl px-5 py-4 border animate-float-slow transition-all duration-500 ${
                isDarkRed
                  ? 'bg-[#0A050A]/95 border-red-500/50 shadow-xl shadow-red-500/30 font-mono'
                  : 'bg-white border-gray-100 shadow-xl shadow-blue-500/10'
              }`}>
                <div className={`text-2xl font-black ${isDarkRed ? 'text-white' : 'text-navy'}`}>1+</div>
                <div className={`text-xs font-bold uppercase tracking-wider ${isDarkRed ? 'text-red-400 font-mono' : 'text-gray-600'}`}>
                  {isDarkRed ? '// EXP_YR' : 'Year Exp.'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrolling Marquee */}
        <div ref={marqueeRef} className="mt-20 mb-8 marquee-container opacity-0" >
          <div className="marquee-track">
            {roleItems.map((role, i) => (
              <span key={i} className={`inline-flex items-center gap-4 text-sm font-bold uppercase tracking-[0.2em] whitespace-nowrap ${isDarkRed ? 'text-gray-200 font-mono' : 'text-gray-400'}`}>
                {role}
                <span className={`w-1.5 h-1.5 rounded-full ${isDarkRed ? 'bg-red-500 animate-ping' : 'bg-blue-500'}`} />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Hint */}
      <div
        ref={scrollHintRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={(e) => handleScrollTo(e, '#about')}
        style={{ opacity: 0 }}
      >
        <span className="text-xs font-medium text-gray-400 tracking-widest uppercase">Scroll</span>
        <div className="w-6 h-10 rounded-full border-2 border-gray-300 flex items-start justify-center p-1.5">
          <div className="w-1 h-2.5 bg-blue-500 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
