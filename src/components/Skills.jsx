import { skills } from '../config/siteConfig';

const Skills = () => {
  const skillCategories = [
    { title: 'Frontend', skills: skills.frontend, icon: '🎨' },
    { title: 'Backend', skills: skills.backend, icon: '⚙️' },
    { title: 'Database', skills: skills.database, icon: '🗄️' },
    { title: 'DevOps & Tools', skills: skills.devops, icon: '🚀' },
  ];

  return (
    <section id="skills" className="relative py-24 md:py-32 bg-dark-950 overflow-hidden">
      {/* Volumetric background lighting */}
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] glow-pool-blue opacity-10 pointer-events-none"></div>

      {/* Modern HUD Elements */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-0 w-32 hud-line-h"></div>
        <div className="absolute top-1/2 left-32 hud-dot"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Modern Section Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-400/10 border border-accent-400/20 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse"></span>
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-accent-400 uppercase">Tech Stack</span>
          </div>
          <h2 className="text-5xl sm:text-6xl font-black text-white uppercase tracking-tighter font-sans">
            Expert <span className="text-blue-400">Systems</span>
          </h2>
        </div>

        {/* Modern Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 group/focus">
          {skillCategories.map((category) => (
            <div
              key={category.title}
              className={`group relative p-6 glass-premium rounded-3xl transition-all duration-700 group-hover/focus:opacity-40 hover:!opacity-100 hover:scale-[1.03] card-hover flex flex-col h-full border border-white/5 hover:border-accent-400/30 ${category.icon === '🚀' ? 'hover:z-50' : 'overflow-hidden'}`}
            >
              <div className={`absolute top-6 right-8 text-2xl opacity-20 group-hover:opacity-100 transition-all duration-700 ease-out drop-shadow-[0_0_20px_rgba(239,68,68,0.4)] ${category.icon === '🚀' ? 'group-hover:animate-rocket-launch' : 'group-hover:-translate-y-3 group-hover:scale-[1.8] group-hover:rotate-[12deg] group-hover:animate-bounce-subtle'}`}>
                {category.icon}
              </div>

              <h3 className="text-xl font-black text-white mb-6 pr-8 font-sans uppercase tracking-tight">
                {category.title}
              </h3>

              <div className="flex flex-wrap gap-2.5 mt-auto">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3.5 py-2 text-[10px] font-black text-slate-400 bg-white/5 border border-white/10 rounded-xl group-hover:border-accent-400/40 group-hover:text-white group-hover:bg-accent-400/10 transition-all duration-300 font-mono uppercase tracking-widest"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional skills bar - Modern Utility Style */}
        <div className="mt-16 p-10 glass-premium rounded-[2.5rem] border border-white/5 hover:border-accent-400/20 transition-all duration-500 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <span className="px-3 py-1.5 rounded bg-accent-400/10 text-accent-400 text-[10px] font-mono font-black border border-accent-400/20 tracking-widest">AUXILIARY</span>
              <span className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Complementary:</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
              {skills.other.map((skill) => (
                <span key={skill} className="text-xs font-black text-slate-400 hover:text-accent-400 transition-all duration-300 cursor-default uppercase tracking-[0.2em] font-mono hover:-translate-y-1">
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
