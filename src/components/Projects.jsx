import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects, socialLinks } from '../config/siteConfig';
import { useSound } from '../utils/sound';
import InteractiveCard from './ui/InteractiveCard';

const Projects = () => {
  const { playClick, playHover } = useSound();
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
          },
        }
      );

      // Best-in-class 3D perspective unfold card reveal on scroll
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 95, rotateX: 18, scale: 0.86 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            duration: 0.95,
            ease: 'back.out(1.5)',
            delay: (i % 3) * 0.14,
            scrollTrigger: {
              trigger: card,
              start: 'top 95%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      });

      // CTA reveal
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 90%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-box-structure overflow-hidden"
    >
      {/* Box structure grid overlay & architectural crosshairs */}
      <div className="absolute inset-0 bg-box-grid-subtle opacity-80 pointer-events-none" />
      <div className="absolute top-10 left-12 text-blue-400/40 font-mono text-xl select-none">+</div>
      <div className="absolute top-10 right-12 text-blue-400/40 font-mono text-xl select-none">+</div>

      {/* Background gradient orb */}
      <div className="absolute top-1/3 left-0 w-[600px] h-[600px] orb-sky opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" style={{ perspective: '1200px' }}>
        {/* Section Header */}
        <div
          ref={titleRef}
          className="mb-16 text-center"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Portfolio
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-navy tracking-tight">
            Selected <span className="text-gradient-blue">Works</span>
          </h2>
          <p className="mt-4 text-lg text-gray-700 font-medium max-w-2xl mx-auto">
            A collection of projects that showcase my skills and passion for
            building meaningful digital solutions.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.title}
              ref={(el) => (cardsRef.current[index] = el)}
              className="h-full"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <InteractiveCard
                featured={project.featured}
                onMouseEnter={playHover}
                className="p-6 sm:p-7 h-full"
              >
                {/* Featured badge */}
                {project.featured && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded-full uppercase tracking-wider shadow-sm">
                      Featured
                    </span>
                  </div>
                )}

                {/* Project icon */}
                <div className="w-12 h-12 flex items-center justify-center bg-blue-50 text-blue-600 rounded-2xl mb-5 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-navy mb-3 tracking-tight group-hover:text-blue-600 transition-colors duration-300">
                  {project.title}
                </h3>

                {/* Animated underline */}
                <div className="h-0.5 w-10 bg-blue-200 mb-4 group-hover:w-full group-hover:bg-blue-600 transition-all duration-700" />

                <p className="text-sm text-gray-700 font-medium leading-relaxed mb-6 flex-grow">
                  {project.description}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs font-bold text-gray-700 bg-gray-100 border border-gray-200 rounded-lg hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-all duration-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={playClick}
                    className="flex items-center gap-2 text-sm font-bold text-navy hover:text-blue-600 transition-colors group/link"
                  >
                    <span>View Demo</span>
                    <svg
                      className="w-4 h-4 -rotate-45 group-hover/link:rotate-0 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </a>
                  <a
                    href={project.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={playClick}
                    className="text-sm font-bold text-gray-600 hover:text-navy transition-colors"
                  >
                    Source Code
                  </a>
                </div>
              </InteractiveCard>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div ref={ctaRef} className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center justify-between gap-6 p-8 bg-blue-50/80 border border-blue-100 rounded-3xl w-full">
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-bold text-navy">
                Have a project in mind?
              </h3>
              <p className="text-sm font-medium text-gray-700 mt-1">
                Let's discuss how we can build something great together.
              </p>
            </div>
            <a
              href="#contact"
              onClick={playClick}
              className="px-8 py-3.5 btn-blue rounded-full text-sm font-semibold tracking-wide whitespace-nowrap shadow-lg shadow-blue-500/20"
            >
              Start a Conversation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
