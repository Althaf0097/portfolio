import { aboutContent, siteConfig } from '../config/siteConfig';

const About = () => {
  return (
    <section id="about" className="relative py-24 md:py-32 bg-dark-950 overflow-hidden">
      {/* Volumetric background lighting */}
      <div className="absolute top-1/4 -left-20 w-[400px] h-[400px] glow-pool-blue opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] glow-pool-cyan opacity-20 pointer-events-none"></div>

      {/* Modern HUD Elements */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-10">
        <div className="absolute top-1/3 right-10 w-32 hud-line-h"></div>
        <div className="absolute top-1/3 right-10 hud-dot"></div>
        <div className="absolute bottom-1/3 left-10 h-64 hud-line-v"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Modern Section Header */}
        <div className="mb-16 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-400/10 border border-accent-400/20 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-400"></span>
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-accent-400 uppercase">Architecture</span>
          </div>
          <h2 className="text-5xl sm:text-6xl font-black text-white uppercase tracking-tighter leading-tight font-sans">
            Core <span className="text-blue-400">Profile</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* High-Fidelity Terminal Visual */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative group">
              {/* Outer Glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-accent-400/20 to-blue-400/20 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <div className="relative glass-premium border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl backdrop-blur-3xl bg-dark-900/60">
                {/* Premium Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[1200ms] ease-in-out z-20 pointer-events-none"></div>

                {/* Modern Window Controls */}
                <div className="bg-white/5 px-6 py-4 flex items-center justify-between border-b border-white/5">
                  <div className="flex gap-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56]/20 group-hover:bg-[#ff5f56]/40 transition-colors"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e]/20 group-hover:bg-[#ffbd2e]/40 transition-colors"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f]/20 group-hover:bg-[#27c93f]/40 transition-colors"></div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 font-black uppercase tracking-[0.4em]">INIT://DATA</span>
                </div>

                {/* Premium JSON Content */}
                <div className="p-8 sm:p-12 font-mono text-[11px] sm:text-[13px] leading-relaxed">
                  <div className="flex gap-4 mb-4">
                    <span className="text-accent-400/30">L.01</span>
                    <p className="text-accent-400">const<span className="text-white ml-2">bioData</span><span className="text-accent-400 ml-2">=</span><span className="text-white ml-2">{'{'}</span></p>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-accent-400/30">L.02</span>
                    <p className="pl-4"><span className="text-blue-400">alias</span>:<span className="text-blue-400 ml-2">"{siteConfig.name.toUpperCase()}"</span>,</p>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-accent-400/30">L.03</span>
                    <p className="pl-4"><span className="text-blue-400">role</span>:<span className="text-blue-400 ml-2">"{siteConfig.role.toUpperCase()}"</span>,</p>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-accent-400/30">L.04</span>
                    <p className="pl-4"><span className="text-blue-400">status</span>:<span className="text-blue-400 ml-2">"STABLE"</span>,</p>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-accent-400/30">L.05</span>
                    <p className="pl-4"><span className="text-blue-400">origin</span>:<span className="text-blue-400 ml-2">"{siteConfig.location.toUpperCase()}"</span></p>
                  </div>
                  <div className="flex gap-4 mt-2">
                    <span className="text-accent-400/30">L.06</span>
                    <p className="text-white">{'}'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Narrative Content */}
          <div className="lg:col-span-7 space-y-10 order-1 lg:order-2">
            <div className="space-y-8">
              {aboutContent.bio.map((paragraph, index) => (
                <p key={index} className="text-xl sm:text-2xl leading-relaxed text-slate-300 font-sans font-light tracking-tight">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Modern Stats Bento Grid */}
            <div className="grid grid-cols-3 gap-4 pt-10 group/focus">
              {[
                { label: 'Uptime', val: aboutContent.stats.yearsExperience, icon: '⚡' },
                { label: 'Binaries', val: aboutContent.stats.projects, icon: '📦' },
                { label: 'Nodes', val: aboutContent.stats.clients, icon: '🌐' }
              ].map((stat, i) => (
                <div key={i} className="group relative p-6 glass-premium rounded-3xl transition-all duration-700 group-hover/focus:opacity-40 hover:!opacity-100 hover:scale-[1.05] text-center overflow-hidden border border-white/5 hover:border-accent-400/40">
                  {/* Premium Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none"></div>
                  <span className="block text-2xl mb-3 opacity-30 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500">{stat.icon}</span>
                  <div className="text-2xl sm:text-3xl font-black text-white mb-2 group-hover:text-accent-400 transition-colors duration-500 font-sans">{stat.val}</div>
                  <div className="text-[10px] uppercase font-mono font-black text-slate-500 tracking-[0.3em]">{stat.label}</div>
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
