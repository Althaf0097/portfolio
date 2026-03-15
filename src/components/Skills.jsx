import { skills } from '../config/siteConfig';

const Skills = () => {
  const skillCategories = [
    { title: 'Frontend', skills: skills.frontend, icon: '🎨' },
    { title: 'Backend', skills: skills.backend, icon: '⚙️' },
    { title: 'Database', skills: skills.database, icon: '🗄️' },
    { title: 'DevOps & Tools', skills: skills.devops, icon: '🚀' },
  ];

  return (
    <section id="skills" className="relative py-16 md:py-20 bg-dark-950 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent-400/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Modern Section Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-400/10 border border-accent-400/20 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse"></span>
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-accent-400 uppercase">Skills & Tools</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter font-sans">
            Technical <span className="text-pattern-blue">Expertise</span>
          </h2>
        </div>

        {/* Modern Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 group/focus">
          {skillCategories.map((category, index) => (
            <div
              key={category.title}
              className={`group relative p-8 bg-dark-900 border border-white/5 rounded-[2rem] transition-all duration-500 group-hover/focus:blur-[1px] group-hover/focus:opacity-60 hover:!blur-none hover:!opacity-100 hover:scale-[1.03] card-hover flex flex-col h-full ${category.icon === '🚀' ? 'hover:z-50' : 'overflow-hidden'}`}
            >
              {/* Sleek shine effect - moved to its own container to allow icon overflow */}
              <div className="absolute inset-0 overflow-hidden rounded-[2rem] pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[1200ms] ease-out"></div>
              </div>

              <div className={`absolute top-6 right-8 text-2xl opacity-20 group-hover:opacity-100 transition-all duration-700 ease-out drop-shadow-[0_0_20px_rgba(239,68,68,0.4)] ${category.icon === '🚀' ? 'group-hover:animate-rocket-launch' : 'group-hover:-translate-y-3 group-hover:scale-[1.8] group-hover:rotate-[12deg] group-hover:animate-bounce-subtle'}`}>
                {category.icon}
              </div>

              <h3 className="text-lg font-bold text-white mb-8 pr-8 font-sans">
                {category.title}
              </h3>

              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 text-[10px] font-bold text-slate-400 bg-white/5 border border-white/5 rounded-lg group-hover:border-accent-400/40 group-hover:text-white group-hover:bg-accent-400/10 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all duration-300 cursor-default uppercase tracking-widest font-mono"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Modern corner glow */}
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-accent-400/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>

        {/* Additional skills bar - Modern Utility Style */}
        <div className="mt-12 p-8 bg-dark-900/50 border border-white/5 rounded-[2rem] backdrop-blur-xl hover:border-white/10 transition-colors duration-500 hover:shadow-[0_0_30px_rgba(239,68,68,0.1)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 rounded bg-accent-400/10 text-accent-400 text-[10px] font-mono font-black border border-accent-400/20">TOOLS</span>
              <span className="text-xs font-sans text-slate-500 uppercase tracking-[0.2em] font-bold">Other Tools:</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              {skills.other.map((skill) => (
                <span key={skill} className="text-xs font-mono font-bold text-slate-400 hover:text-accent-400 hover:drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] transition-all duration-300 cursor-default uppercase tracking-widest hover:-translate-y-1">
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
