import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { projects } from '../config/siteConfig';
import { useSound } from '../utils/sound';
import InteractiveCard from './ui/InteractiveCard';
import WaveText from './ui/WaveText';

const Projects = () => {
  const { playClick, playHover } = useSound();
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const rowsRef = useRef([]);

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

      const rows = rowsRef.current.filter(Boolean);
      if (rows.length === 0) return;
      if (window.matchMedia('(max-width: 767.98px)').matches) {
        gsap.set(rows, { clearProps: 'all' });
        return;
      }

      // Pin the projects section while stacking the cards (with snapping and optimal scroll duration)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${rows.length * 80}%`, // optimized scroll duration for snappier navigation
          pin: true,
          scrub: 0.8, // snappier scrub response
          snap: {
            snapTo: 1 / (rows.length - 1),
            duration: { min: 0.2, max: 0.4 },
            delay: 0.05,
            ease: 'power1.inOut'
          },
          invalidateOnRefresh: true,
        }
      });

      // Set initial states for subsequent cards
      rows.forEach((row, index) => {
        if (index > 0) {
          const card = row.children[0];
          if (card) gsap.set(card, { y: 80, opacity: 0, scale: 0.95 });
        }
      });

      // Construct stacking timeline sequence
      rows.forEach((row, index) => {
        const card = row.children[0];

        if (index === 0) {
          // Reveal the first card as the section pins
          if (card) {
            tl.fromTo(card, 
              { y: 80, opacity: 0, scale: 0.95 },
              { x: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' },
              'start'
            );
          }
          return;
        }

        const label = `stack-${index}`;

        // Fade out and scale down previous rows as the new row comes in
        for (let prevIndex = 0; prevIndex < index; prevIndex++) {
          tl.to(rows[prevIndex], {
            scale: 0.92,
            opacity: 0,
            y: -50,
            duration: 1.2,
            ease: 'power2.inOut',
          }, label);
        }

        // Animate the current card in after the previous card leaves
        if (card) {
          tl.to(card, {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: 'power2.out',
          }, label);
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);



  // One project per step so mobile/tablet shows card 1, then 2, then 3, up to all projects.
  const projectRows = projects.map((project) => [project]);

  return (
    <section id="projects" ref={sectionRef} className="relative py-16 md:py-32 overflow-hidden border-t border-white/5 bg-[#050505]">
      {/* Cinematic Ambient Lighting (Auroras) */}
      <div className="absolute top-[10%] left-[-15%] w-[500px] h-[500px] rounded-full bg-[#4F8CFF]/5 blur-[120px] pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-[10%] right-[-15%] w-[500px] h-[500px] rounded-full bg-[#00E5FF]/5 blur-[120px] pointer-events-none animate-pulse duration-[10000ms]" />

      {/* Abstract Background Floating Glass Element (Visual Depth) */}
      <div className="absolute top-[25%] right-[5%] w-16 h-16 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-[12px] rotate-12 pointer-events-none opacity-20 hidden md:block" />
      <div className="absolute bottom-[20%] left-[8%] w-24 h-24 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-[16px] -rotate-12 pointer-events-none opacity-25 hidden md:block" />

      {/* Grid Texture Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div ref={titleRef} className="mb-10 sm:mb-20 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-mono uppercase tracking-[0.2em] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            // Selected Works
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-normal">
            <WaveText text="Featured" />{' '}<span className="text-gradient"><WaveText text="Projects" gradient={true} /></span>
          </h2>
        </div>

        {/* Projects Stack Containers */}
        <div className="relative max-w-2xl mx-auto min-h-0 md:min-h-[560px]">
          {projectRows.map((rowProjects, rowIndex) => (
            <div 
              key={rowIndex}
              ref={(el) => (rowsRef.current[rowIndex] = el)}
              className={`${rowIndex === 0 ? 'relative' : 'relative md:absolute md:inset-0 mt-6 md:mt-0'} grid grid-cols-1 gap-6`}
              style={{ zIndex: rowIndex + 1 }}
            >
              {rowProjects.map((project) => (
                <div
                  key={project.title}
                  className="h-full"
                >
                  <InteractiveCard
                    featured={project.featured}
                    onMouseEnter={playHover}
                    className="p-4 sm:p-5 h-full flex flex-col justify-between"
                  >
                    <div>
                      {/* Project Image Container — Bleeding edge-to-edge at top of the card */}
                      <div className="relative -mx-4 sm:-mx-5 -mt-4 sm:-mt-5 mb-4 sm:mb-5 aspect-[16/9] overflow-hidden bg-white/5 border-b border-white/10 rounded-t-[24px]">
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        
                        {/* Shadow overlay inside image */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                        {/* Floating Category and Status on Top of Image */}
                        <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 flex items-center justify-between gap-2 z-10">
                          <span className="min-w-0 truncate text-[9px] sm:text-[10px] font-bold text-secondary font-mono bg-black/60 backdrop-blur-md px-2.5 sm:px-3 py-1.5 rounded-lg border border-white/10 uppercase tracking-widest">
                            {project.category}
                          </span>
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold font-mono border uppercase tracking-wider backdrop-blur-md ${
                            project.status === 'COMPLETED' 
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/35 shadow-[0_0_10px_rgba(52,211,153,0.2)]' 
                              : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/35 shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg sm:text-xl font-bold font-mono text-white mb-2 tracking-tight group-hover:text-primary transition-colors duration-300">
                        {project.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-[#A8A8A8] mb-4 sm:mb-5 line-clamp-3 leading-relaxed">
                        {project.description}
                      </p>

                      {/* Animated Progress Indicator */}
                      <div className="mb-5 space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-bold text-muted font-mono uppercase tracking-wider">
                          <span>Status Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="h-[4px] w-full bg-white/5 rounded-full overflow-hidden relative border border-white/5">
                          <div 
                            className="h-full bg-gradient-to-r from-[#4F8CFF] via-[#7EF9FF] to-[#00E5FF] rounded-full transition-all duration-1000 relative" 
                            style={{ width: `${project.progress}%` }}
                          >
                            {/* Shimmer sweep */}
                            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] animate-pulse w-full" />
                          </div>
                        </div>
                      </div>

                      {/* Tech Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {project.tech.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-0.5 text-[11px] font-semibold text-muted bg-white/5 border border-white/5 rounded-md hover:border-primary/30 hover:text-white transition-colors duration-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Actions CTA Row */}
                      <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                        {project.demo && (
                          <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={playClick}
                            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#4F8CFF]/15 hover:bg-[#4F8CFF]/25 border border-[#4F8CFF]/30 hover:border-[#4F8CFF]/60 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(79,140,255,0.2)]"
                          >
                            <span>Live Demo</span>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                        {project.source && (
                          <a
                            href={project.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={playClick}
                            title="View Source Code"
                            className="p-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 hover:border-[#4F8CFF]/50 transition-all duration-300 hover:scale-105 active:scale-95"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                            </svg>
                          </a>
                        )}
                      </div>

                      {/* Metadata Row */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] font-mono font-bold text-muted/80">
                        {project.metadata && project.metadata.map((meta, i) => (
                          <span key={i} className="flex items-center gap-1.5">
                            {i > 0 && <span className="w-1 h-1 rounded-full bg-white/20" />}
                            {meta}
                          </span>
                        ))}
                      </div>
                    </div>
                  </InteractiveCard>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
