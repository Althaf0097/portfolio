import { projects, socialLinks } from '../config/siteConfig';
import { useSound } from '../utils/sound';

const Projects = () => {
  const { playClick, playHover } = useSound();

  return (
    <section id="projects" className="relative py-16 md:py-20 bg-dark-950 overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-cyan-400/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Modern Section Header */}
        <div className="mb-12 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 mb-4 animate-fade-in-up">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-cyan-400 uppercase">Portfolio</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter font-sans">
            Selected <span className="text-pattern-blue">Works</span>
          </h2>
        </div>

        {/* Modern high-fidelity Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 group/focus">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className="group relative h-full transition-all duration-500 group-hover/focus:blur-[1px] group-hover/focus:opacity-60 hover:!blur-none hover:!opacity-100 hover:scale-[1.03]"
              onMouseEnter={playHover}
            >
              {/* Card Glow Background */}
              <div className="absolute -inset-1 bg-gradient-to-r from-accent-400/20 to-cyan-400/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative h-full bg-dark-900 border border-white/5 rounded-[2.5rem] p-8 flex flex-col backdrop-blur-xl hover:border-accent-400/30 card-hover overflow-hidden">
                {/* Sleek shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[1200ms] ease-out pointer-events-none"></div>

                {/* Modern Project Status Bar */}
                <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${project.featured ? 'bg-accent-400 shadow-[0_0_10px_rgba(0,255,65,0.5)]' : 'bg-white/10'}`}></div>
                    <span className="text-[8px] font-mono font-black text-slate-500 uppercase tracking-[0.3em]">
                      {project.featured ? 'Featured' : 'Completed'}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-2xl font-black text-white mb-3 tracking-tighter group-hover:text-accent-400 transition-colors font-sans">
                    {project.title}
                  </h3>
                  <div className="h-0.5 w-10 bg-accent-400/30 mb-6 group-hover:w-full transition-all duration-700"></div>
                  <p className="text-base text-slate-400 leading-relaxed font-sans font-light">
                    {project.description}
                  </p>
                </div>

                {/* Tech tags as modern chips */}
                <div className="flex flex-wrap gap-2 mb-10 mt-auto">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-[9px] font-black text-cyan-400/60 border border-cyan-400/10 rounded-lg group-hover:border-cyan-400/50 group-hover:text-cyan-400 group-hover:bg-cyan-400/10 group-hover:shadow-[0_0_10px_rgba(249,115,22,0.2)] transition-all duration-300 font-mono"
                    >
                      {tech.toUpperCase()}
                    </span>
                  ))}
                </div>

                {/* Modern CTA Links */}
                <div className="flex items-center gap-6">
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-black text-white hover:text-accent-400 transition-all group/link font-mono"
                  >
                    <span>Live Demo</span>
                    <svg className="w-3 h-3 -rotate-45 group-hover:rotate-0 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                  <a
                    href={project.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-slate-400 hover:text-white transition-colors font-mono"
                  >
                    Source Code
                  </a>
                </div>

                {/* Abstract decoration icon */}
                <div className="absolute -bottom-10 -right-10 text-9xl text-white/[0.02] -rotate-12 transition-all duration-700 group-hover:-rotate-12 group-hover:scale-125 group-hover:-translate-y-4 group-hover:-translate-x-4 group-hover:text-accent-400/[0.08] pointer-events-none">
                  {index + 1}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Global Action */}
        <div className="text-center mt-12">
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={playClick}
            className="group relative inline-flex items-center gap-4 px-10 py-5 bg-dark-900 border border-white/5 rounded-2xl text-white font-bold uppercase text-xs tracking-[0.2em] overflow-hidden transition-all duration-500 hover:border-accent-400"
          >
            <span className="relative z-10 font-mono">View More on GitHub</span>
            <div className="absolute inset-0 bg-white/5 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;
