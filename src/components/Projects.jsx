import { projects, socialLinks } from '../config/siteConfig';
import { useSound } from '../utils/sound';

const Projects = () => {
  const { playClick, playHover } = useSound();

  return (
    <section id="projects" className="relative py-24 md:py-32 bg-dark-950 overflow-hidden">
      {/* Volumetric background lighting */}
      <div className="absolute top-1/2 -right-20 w-[600px] h-[600px] glow-pool-cyan opacity-10 pointer-events-none"></div>

      {/* Modern HUD Elements */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-20">
        <div className="absolute top-1/4 right-0 w-32 hud-line-h"></div>
        <div className="absolute top-1/4 right-32 hud-dot"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Modern Section Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-400/10 border border-blue-400/20 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-blue-400 uppercase">Architecture</span>
          </div>
          <h2 className="text-5xl sm:text-6xl font-black text-white uppercase tracking-tighter font-sans">
            Selected <span className="text-blue-400">Works</span>
          </h2>
        </div>

        {/* Modern high-fidelity Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 group/focus">
          {projects.map((project) => (
            <div
              key={project.title}
              className="group relative flex flex-col h-full transition-all duration-700 group-hover/focus:opacity-40 hover:!opacity-100 hover:scale-[1.03]"
              onMouseEnter={playHover}
            >
              {/* Card Outer Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-accent-400/10 to-blue-400/10 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              <div className="relative flex flex-col h-full glass-premium border border-white/5 rounded-[2rem] p-6 backdrop-blur-3xl hover:border-accent-400/30 transition-all duration-500 overflow-hidden">
                  {/* Premium Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[1200ms] ease-in-out pointer-events-none z-20"></div>

                {/* Modern Project Status Bar */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${project.featured ? 'bg-accent-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-white/10'}`}></div>
                    <span className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-[0.3em]">
                      {project.featured ? 'Status: Primary' : 'Status: Stable'}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-2xl font-black text-white mb-3 tracking-tight group-hover:text-accent-400 transition-colors duration-500 font-sans uppercase">
                    {project.title}
                  </h3>
                  <div className="h-0.5 w-10 bg-accent-400/20 mb-4 group-hover:w-full transition-all duration-1000"></div>
                  <p className="text-base text-slate-400 leading-relaxed font-sans font-light tracking-tight">
                    {project.description}
                  </p>
                </div>

                {/* Tech tags as modern chips */}
                <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3.5 py-1.5 text-[10px] font-black text-slate-400 border border-white/10 rounded-xl group-hover:border-blue-400/40 group-hover:text-blue-400 group-hover:bg-blue-400/5 transition-all duration-300 font-mono uppercase tracking-[0.15em]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Modern CTA Links */}
                <div className="flex items-center gap-6 border-t border-white/5 pt-6">
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-[10px] font-black text-white hover:text-accent-400 transition-all group/link font-mono uppercase tracking-widest"
                  >
                    <span>Deploy</span>
                    <svg className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                  <a
                    href={project.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-black text-slate-500 hover:text-white transition-colors font-mono uppercase tracking-widest"
                  >
                    Source
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Global Action */}
        <div className="text-center mt-20">
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={playClick}
            className="group relative inline-flex items-center gap-6 px-12 py-6 glass-premium rounded-2xl text-white font-black uppercase text-xs tracking-[0.4em] overflow-hidden transition-all duration-500 hover:border-accent-400/50 hover:scale-[1.05] hover:shadow-[0_0_40px_rgba(239,68,68,0.2)]"
          >
            <span className="relative z-10 font-mono">Synchronize Catalog</span>
            <div className="absolute inset-0 bg-accent-400/10 -translate-x-full group-hover:translate-0 transition-transform duration-700 ease-out"></div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;
