import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { skills } from '../config/siteConfig';
import { useSound } from '../utils/sound';
import InteractiveCard from './ui/InteractiveCard';

const Skills = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);
  const marqueeRef = useRef(null);
  const auxRef = useRef(null);
  const { playHover } = useSound();

  const skillCategories = [
    { title: 'Frontend', skills: skills.frontend, color: 'blue', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )},
    { title: 'Backend', skills: skills.backend, color: 'indigo', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    )},
    { title: 'Database', skills: skills.database, color: 'sky', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    )},
    { title: 'DevOps & Tools', skills: skills.devops, color: 'emerald', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
  ];

  // All skills for marquee
  const allSkills = [...skills.frontend, ...skills.backend, ...skills.database, ...skills.devops, ...skills.other];
  const marqueeItems = [...allSkills, ...allSkills];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0,
          duration: 0.8, ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
          }
        }
      );

      // Staggered 3D card cascade on scroll
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 85, rotateX: 18, scale: 0.88 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            duration: 0.9,
            ease: 'back.out(1.5)',
            delay: (i % 4) * 0.12,
            scrollTrigger: {
              trigger: card,
              start: 'top 95%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      });

      // Auxiliary bar
      if (auxRef.current) {
        gsap.fromTo(auxRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0,
            duration: 0.6, ease: 'power3.out',
            scrollTrigger: {
              trigger: auxRef.current,
              start: 'top 90%',
            }
          }
        );
      }

      // Marquee animation
      const marqueeTrack = marqueeRef.current?.querySelector('.marquee-track');
      if (marqueeTrack) {
        const trackWidth = marqueeTrack.scrollWidth / 2;
        gsap.to(marqueeTrack, {
          x: -trackWidth,
          duration: 30,
          ease: 'none',
          repeat: -1,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="relative py-24 md:py-32 bg-box-structure overflow-hidden border-t border-blue-100/60">
      {/* Box structure grid overlay */}
      <div className="absolute inset-0 bg-box-grid-subtle opacity-75 pointer-events-none" />
      <div className="absolute top-16 left-8 text-blue-400/40 font-mono text-xl select-none">+</div>
      <div className="absolute bottom-16 right-8 text-blue-400/40 font-mono text-xl select-none">+</div>

      {/* Marquee band at top */}
      <div ref={marqueeRef} className="absolute top-0 left-0 w-full py-4 border-b border-gray-100 marquee-container">
        <div className="marquee-track">
          {marqueeItems.map((skill, i) => (
            <span key={i} className="inline-flex items-center gap-3 text-xs font-semibold text-gray-200 uppercase tracking-[0.2em] whitespace-nowrap">
              {skill}
              <span className="w-1 h-1 rounded-full bg-blue-200" />
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-8">
        {/* Section Header */}
        <div ref={titleRef} className="mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Tech Stack
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-navy tracking-tight">
            Skills & <span className="text-gradient-blue">Expertise</span>
          </h2>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category, i) => (
            <div
              key={category.title}
              ref={(el) => (cardsRef.current[i] = el)}
              className="h-full"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <InteractiveCard onMouseEnter={playHover} className="p-6 h-full">
                {/* Icon */}
                <div className="w-12 h-12 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl mb-5 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/20">
                  {category.icon}
                </div>

                <h3 className="text-lg font-bold text-navy mb-4 tracking-tight">
                  {category.title}
                </h3>

                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 text-xs font-bold text-gray-700 bg-gray-100 border border-gray-200 rounded-lg group-hover:border-blue-300 group-hover:text-blue-700 group-hover:bg-blue-50 transition-all duration-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </InteractiveCard>
            </div>
          ))}
        </div>

        {/* Auxiliary Skills */}
        <div
          ref={auxRef}
          className="mt-12 p-8 bg-gray-50 border border-gray-100 rounded-2xl"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">Also proficient in</span>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {skills.other.map((skill) => (
                <span key={skill} className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors duration-300 cursor-default">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
