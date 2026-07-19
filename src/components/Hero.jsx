import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from '../config/siteConfig';
import { useSound } from '../utils/sound';

const Hero = () => {
  const { playClick } = useSound();
  const sectionRef = useRef(null);
  const title1Ref = useRef(null);
  const taglineRef = useRef(null);
  const ctaRef = useRef(null);
  const scrollHintRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      // Staggered cinematic word display entrance
      tl.fromTo(title1Ref.current,
        { opacity: 0, y: 50, rotateX: 20 },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.9, stagger: 0.2, ease: 'power4.out' }
      );

      // Subtitle fade up
      tl.fromTo(taglineRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.4'
      );

      // CTA Buttons reveal
      const buttons = ctaRef.current?.querySelectorAll('a') || [];
      tl.fromTo(buttons,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out' },
        '-=0.4'
      );

      // Scroll Cue reveal
      tl.fromTo(scrollHintRef.current,
        { opacity: 0, y: -10 },
        { opacity: 0.6, y: 0, duration: 0.6 },
        '-=0.2'
      );
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

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[92svh] md:min-h-screen flex items-center justify-center overflow-hidden px-4 pt-20 pb-12 bg-[radial-gradient(circle_at_center,rgba(126,249,255,0.14),rgba(5,5,5,0.72)_44%,#050505_82%)]"
    >
      {/* Decorative neon blue light rays overlay */}
      <div className="absolute top-[18%] left-[-20%] sm:left-[30%] w-[260px] sm:w-[350px] h-[260px] sm:h-[350px] rounded-full bg-primary/10 blur-[80px] sm:blur-[90px] pointer-events-none animate-pulse-soft" />
      <div className="absolute bottom-[18%] right-[-35%] sm:right-[30%] w-[320px] sm:w-[450px] h-[320px] sm:h-[450px] rounded-full bg-secondary/8 blur-[90px] sm:blur-[110px] pointer-events-none animate-float-slow" />

      <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 relative z-10 w-full text-center">
        {/* Cinematic Headline (Original Name Details) */}
        <h1 className="text-[clamp(2.75rem,16vw,5rem)] sm:text-7xl md:text-8xl font-black tracking-normal leading-[0.98] mb-5 sm:mb-6 font-display drop-shadow-[0_0_28px_rgba(126,249,255,0.22)]">
          <div ref={title1Ref} className="flex flex-wrap justify-center gap-x-2 sm:gap-x-3 gap-y-1">
            {siteConfig.name.split(' ').map((word, i) => (
              <span key={i} className="word inline-block">
                {i === 0 ? (
                  <span className="text-white brightness-125">{word}</span>
                ) : (
                  <span className="text-gradient">{word}</span>
                )}
              </span>
            ))}
          </div>
        </h1>


        {/* Subtitle */}
        <p
          ref={taglineRef}
          className="text-sm sm:text-lg md:text-xl max-w-2xl mx-auto mb-6 sm:mb-10 text-muted leading-relaxed"
        >
          {siteConfig.tagline}
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#projects"
            onClick={(e) => handleScrollTo(e, '#projects')}
            className="w-full sm:w-auto px-7 py-3 sm:px-8 sm:py-4 btn-primary rounded-full uppercase tracking-wider text-xs border border-primary/40 hover:scale-105 active:scale-95 transition-all"
          >
            VIEW WORK
          </a>
          <a
            href="#contact"
            onClick={(e) => handleScrollTo(e, '#contact')}
            className="w-full sm:w-auto px-7 py-3 sm:px-8 sm:py-4 btn-secondary rounded-full uppercase tracking-wider text-xs hover:scale-105 active:scale-95 transition-all"
          >
            CONTACT ME
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollHintRef}
        onClick={(e) => handleScrollTo(e, '#about')}
        className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-3 cursor-pointer hover:opacity-100 transition-opacity"
      >
        <span className="text-[10px] font-bold text-muted uppercase tracking-[0.25em]">Scroll Down</span>
        <div className="w-5 h-9 rounded-full border border-white/20 flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-primary rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
