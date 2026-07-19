import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { aboutContent } from '../config/siteConfig';
import { useSound } from '../utils/sound';
import InteractiveCard from './ui/InteractiveCard';
import WaveText from './ui/WaveText';

const About = () => {
  const { playHover } = useSound();
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);
  const marqueeRef = useRef(null);

  const stats = [
    { label: 'Years of Experience', value: aboutContent.stats.yearsExperience },
    { label: 'Completed Projects', value: aboutContent.stats.projects },
    { label: 'Happy Clients', value: aboutContent.stats.clients },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.8, ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
          }
        }
      );

      // Left Column (Image overlay) entry
      gsap.fromTo(leftColRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1, x: 0,
          duration: 1, ease: 'power3.out',
          scrollTrigger: {
            trigger: leftColRef.current,
            start: 'top 80%',
          }
        }
      );

      // Right Column entry
      gsap.fromTo(rightColRef.current,
        { opacity: 0, x: 50 },
        {
          opacity: 1, x: 0,
          duration: 1, ease: 'power3.out',
          scrollTrigger: {
            trigger: rightColRef.current,
            start: 'top 80%',
          }
        }
      );

      // Paragraph scrub animation
      const paragraphs = rightColRef.current.querySelectorAll('p');
      gsap.fromTo(paragraphs,
        { opacity: 0.2, y: 20 },
        {
          opacity: 1, y: 0,
          stagger: 0.1,
          scrollTrigger: {
            trigger: rightColRef.current,
            start: 'top 75%',
            end: 'bottom 85%',
            scrub: 1.5,
          }
        }
      );

      // Background slow horizontal scrolling text marquee + scroll interaction
      const marqueeTrack = marqueeRef.current?.querySelector('.marquee-track');
      if (marqueeTrack) {
        const trackWidth = marqueeTrack.scrollWidth / 2;
        
        // Continuous slow scroll
        gsap.to(marqueeTrack, {
          x: -trackWidth,
          duration: 40,
          ease: 'none',
          repeat: -1,
        });

        // Fast scroll scrub on page scroll
        gsap.to(marqueeTrack, {
          x: `-=${trackWidth * 0.5}`,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          }
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative py-16 md:py-32 overflow-hidden border-t border-white/5">
      {/* Dynamic light glows in background */}
      <div className="absolute top-[30%] left-[-10%] w-[350px] h-[350px] rounded-full bg-primary/5 blur-[90px] pointer-events-none" />

      {/* Slow Moving Background Marquee */}
      <div ref={marqueeRef} className="absolute top-[10%] left-0 w-full overflow-hidden select-none pointer-events-none opacity-5 py-4 hidden sm:block">
        <div className="marquee-track flex gap-12 whitespace-nowrap text-8xl font-black uppercase font-sans tracking-widest text-white">
          <span>ALPHAF S • DEVELOPER • DESIGNER • AI BUILDER • CREATOR • </span>
          <span>ALPHAF S • DEVELOPER • DESIGNER • AI BUILDER • CREATOR • </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 sm:pt-16">
        {/* Section Header */}
        <div
          ref={titleRef}
          className="mb-10 sm:mb-16 text-center"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-mono uppercase tracking-[0.2em] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            // About Me
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-normal">
            <WaveText text="Get to Know" />{' '}<span className="text-gradient"><WaveText text="Me" gradient={true} /></span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left Column — Large interactive image card */}
          <div ref={leftColRef} className="lg:col-span-5 flex justify-center">
            <InteractiveCard onMouseEnter={playHover} className="p-2 relative group overflow-hidden max-w-[19rem] sm:max-w-sm rounded-[2rem]">
              <div className="absolute -inset-1 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative overflow-hidden rounded-[1.8rem] bg-card border border-white/10 aspect-[4/5] flex items-center justify-center">
                {/* Tech structure lines in background */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] bg-[size:16px_16px]" />
                
                {/* Abstract graphic replacing profile image */}
                <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-full border border-primary/20 flex items-center justify-center bg-primary/5 animate-float relative z-10">
                  <svg className="w-20 h-20 sm:w-24 sm:h-24 text-primary opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>

                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 p-4 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md z-20">
                  <div className="text-xs font-mono uppercase tracking-widest text-primary mb-1">Status</div>
                  <div className="text-sm font-semibold text-white font-mono">Available for projects</div>
                </div>
              </div>
            </InteractiveCard>
          </div>

          {/* Right Column — Biography & counters */}
          <div ref={rightColRef} className="lg:col-span-7 space-y-7 sm:space-y-8">
            <div className="space-y-4 sm:space-y-6 text-muted text-sm sm:text-lg leading-relaxed">
              {aboutContent.bio.map((paragraph, index) => (
                <p key={index}>
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Stats Grid with dynamic counting */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-white/5">
              {stats.map((stat, i) => (
                <div key={i}>
                  <InteractiveCard onMouseEnter={playHover} className="p-4 sm:p-5 text-center h-full glass-card">
                    <div className="text-2xl sm:text-4xl font-black text-white mb-1 sm:mb-2 font-display tracking-tight text-gradient">
                      {stat.value}
                    </div>
                    <div className="text-[10px] sm:text-xs font-bold text-muted uppercase tracking-wider font-mono">
                      {stat.label}
                    </div>
                  </InteractiveCard>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
