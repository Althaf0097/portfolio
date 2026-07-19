import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSound } from '../utils/sound';
import InteractiveCard from './ui/InteractiveCard';
import WaveText from './ui/WaveText';

const Experience = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const timelineLineRef = useRef(null);
  const { playHover } = useSound();

  const experiences = [
    {
      year: '2024 - Present',
      role: 'Full Stack & AI Developer',
      company: 'Freelance / Contract',
      desc: 'Developing scalable web architectures using Next.js/React and Node.js. Integrating Gemini/OpenAI API microservices to automate processes.'
    },
    {
      year: '2023 - 2024',
      role: 'Software Engineer',
      company: 'Tech Solutions',
      desc: 'Built custom mobile interfaces with Flutter and Dart. Automated server analytics tasks and database backups using Python cron jobs.'
    },
    {
      year: '2021 - 2023',
      role: 'Junior Web Developer',
      company: 'Web Craft Studio',
      desc: 'Coded responsive landing interfaces, handled MySQL query migrations, and managed code integrations using Git.'
    }
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

      // Growing vertical line on scroll
      gsap.fromTo(timelineLineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: timelineLineRef.current,
            start: 'top 70%',
            end: 'bottom 60%',
            scrub: true,
          }
        }
      );

      // Timeline items reveal
      const items = sectionRef.current.querySelectorAll('.timeline-item');
      items.forEach((item, index) => {
        const direction = index % 2 === 0 ? -60 : 60;
        gsap.fromTo(item,
          { opacity: 0, x: direction, scale: 0.95 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
            }
          }
        );
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden border-t border-white/5">
      <div className="absolute top-[30%] right-[-10%] w-[350px] h-[350px] rounded-full bg-secondary/5 blur-[90px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div ref={titleRef} className="mb-16 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-mono uppercase tracking-[0.2em] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            // Journey
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            <WaveText text="Work" />{' '}<span className="text-gradient"><WaveText text="Experience" gradient={true} /></span>
          </h2>
        </div>

        {/* Timeline container */}
        <div className="relative mt-20">
          {/* Vertical central timeline guide line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-white/10 origin-top" />
          <div
            ref={timelineLineRef}
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-primary origin-top shadow-[0_0_8px_#4F8CFF]"
          />

          <div className="space-y-16">
            {experiences.map((exp, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={index} className="relative flex flex-col md:flex-row items-center justify-between timeline-item">
                  {/* Left Spacer or Content */}
                  <div className={`w-full md:w-[45%] ${isEven ? 'order-1 text-right' : 'order-1 md:order-2 text-left md:pl-8'}`}>
                    {isEven && (
                      <InteractiveCard onMouseEnter={playHover} className="p-6 text-left glass-card inline-block w-full">
                        <span className="text-xs font-mono font-bold text-primary mb-1 block">{exp.year}</span>
                        <h3 className="text-lg font-bold text-white mb-0.5">{exp.role}</h3>
                        <h4 className="text-sm font-semibold text-secondary mb-3">{exp.company}</h4>
                        <p className="text-sm text-muted leading-relaxed">{exp.desc}</p>
                      </InteractiveCard>
                    )}
                  </div>

                  {/* Central Node Dot */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-[#050505] shadow-[0_0_8px_#4F8CFF] z-10" />

                  {/* Right Spacer or Content */}
                  <div className={`w-full md:w-[45%] ${isEven ? 'order-2 md:pl-8' : 'order-1 text-left'}`}>
                    {!isEven && (
                      <InteractiveCard onMouseEnter={playHover} className="p-6 text-left glass-card inline-block w-full">
                        <span className="text-xs font-mono font-bold text-primary mb-1 block">{exp.year}</span>
                        <h3 className="text-lg font-bold text-white mb-0.5">{exp.role}</h3>
                        <h4 className="text-sm font-semibold text-secondary mb-3">{exp.company}</h4>
                        <p className="text-sm text-muted leading-relaxed">{exp.desc}</p>
                      </InteractiveCard>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
