import { aboutContent, siteConfig } from '../config/siteConfig';

const About = () => {
  return (
    <section id="about" className="relative py-16 md:py-20 bg-dark-950 overflow-hidden">
      {/* Decorative Background Accent */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-accent-400/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Modern Section Header */}
        <div className="mb-12 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-400/10 border border-accent-400/20 mb-4 animate-fade-in-up">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-400"></span>
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-accent-400 uppercase">About Me</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter leading-tight font-sans">
            Core <span className="text-pattern-blue">Architecture</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* High-Fidelity Terminal Visual */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative group">
              {/* Outer Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-accent-400/20 to-cyan-400/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              <div className="relative bg-dark-900 border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden backdrop-blur-xl hover-lift">
                {/* Modern Window Controls */}
                <div className="bg-white/5 px-6 py-4 flex items-center justify-between border-b border-white/5">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]/20"></div>
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/20"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]/20"></div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">profile.json</span>
                </div>

                {/* Premium JSON Content */}
                <div className="p-8 sm:p-10 font-mono text-xs sm:text-sm leading-relaxed">
                  <div className="flex gap-4 mb-4">
                    <span className="text-accent-400/50">01</span>
                    <p className="text-accent-400">const<span className="text-white ml-2">bioData</span><span className="text-accent-400 ml-2">=</span><span className="text-white ml-2">{'{'}</span></p>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-accent-400/50">02</span>
                    <p className="pl-4"><span className="text-cyan-400">alias</span>:<span className="text-accent-400 ml-2">"{siteConfig.name.toUpperCase()}"</span>,</p>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-accent-400/50">03</span>
                    <p className="pl-4"><span className="text-cyan-400">role</span>:<span className="text-accent-400 ml-2">"{siteConfig.role.toUpperCase()}"</span>,</p>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-accent-400/50">04</span>
                    <p className="pl-4"><span className="text-cyan-400">status</span>:<span className="text-emerald-400 ml-2">"OPERATIONAL"</span>,</p>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-accent-400/50">05</span>
                    <p className="pl-4"><span className="text-cyan-400">location</span>:<span className="text-accent-400 ml-2">"{siteConfig.location.toUpperCase()}"</span></p>
                  </div>
                  <div className="flex gap-4 mt-2">
                    <span className="text-accent-400/50">06</span>
                    <p className="text-white">{'}'}</p>
                  </div>


                </div>
              </div>
            </div>
          </div>

          {/* Narrative Content */}
          <div className="lg:col-span-7 space-y-8 order-1 lg:order-2">
            <div className="space-y-6">
              {aboutContent.bio.map((paragraph, index) => (
                <p key={index} className="text-lg sm:text-xl leading-relaxed text-slate-300 font-sans font-light">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Modern Stats Bento Grid */}
            <div className="grid grid-cols-3 gap-4 pt-8 group/focus">
              {[
                { label: 'Uptime', val: aboutContent.stats.yearsExperience, icon: '⚡' },
                { label: 'Binaries', val: aboutContent.stats.projects, icon: '📦' },
                { label: 'Nodes', val: aboutContent.stats.clients, icon: '🌐' }
              ].map((stat, i) => (
                <div key={i} className="group relative p-6 bg-dark-900 border border-white/5 rounded-2xl transition-all duration-500 group-hover/focus:blur-[1px] group-hover/focus:opacity-60 hover:!blur-none hover:!opacity-100 hover:scale-[1.05] text-center card-hover overflow-hidden">
                  {/* Subtle shine on hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
                  <span className="block text-2xl mb-2 opacity-50 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500 drop-shadow-md">{stat.icon}</span>
                  <div className="text-2xl sm:text-4xl font-black text-white mb-1 group-hover:text-accent-400 transition-colors duration-500 font-sans text-glow-hover">{stat.val}</div>
                  <div className="text-[10px] uppercase font-mono font-bold text-slate-500 tracking-[0.2em]">{stat.label}</div>
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
