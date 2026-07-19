import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useSound } from '../utils/sound';
import InteractiveCard from './ui/InteractiveCard';

const Services = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const gridRef = useRef(null);
  const { playHover } = useSound();

  const services = [
    { title: 'Web Development', desc: 'Crafting responsive, high-performance web applications using React, Next.js, and modern tools.' },
    { title: 'Flutter Apps', desc: 'Building premium native cross-platform mobile apps for iOS and Android with Dart.' },
    { title: 'AI Automation', desc: 'Integrating LLMs (Gemini, OpenAI), LangChain pipelines, and workflows to automate backend tasks.' },
    { title: 'Data Analytics', desc: 'Transforming database schemas and spreadsheets into clear statistical metrics and reports.' },
    { title: 'Content Creation', desc: 'Creating rich technical articles, system architecture documents, and educational content.' },
    { title: 'Full Stack Development', desc: 'Engineering databases, high-speed API layers, security tokens, and frontend UI decks.' },
    { title: 'UI Engineering', desc: 'Implementing highly polished layouts, motion physics, R3F experiences, and custom cursors.' },
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

      // Staggered service cards reveal
      const cards = gridRef.current?.querySelectorAll('.service-card') || [];
      gsap.fromTo(cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden border-t border-white/5">
      <div className="absolute top-[10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-primary/5 blur-[90px] pointer-events-none animate-pulse-soft" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div ref={titleRef} className="mb-16 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-mono uppercase tracking-[0.2em] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            // Services
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            What I <span className="text-gradient">Offer</span>
          </h2>
        </div>

        {/* Services Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <InteractiveCard onMouseEnter={playHover} className="p-6 h-full glass-card">
                <span className="text-2xl text-primary font-mono font-bold mb-3 block">
                  {String(index + 1).padStart(2, '0')}.
                </span>
                <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
                  {service.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {service.desc}
                </p>
              </InteractiveCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
