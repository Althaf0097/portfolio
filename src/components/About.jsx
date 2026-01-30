import { aboutContent, siteConfig } from '../config/siteConfig';

const About = () => {
  return (
    <section id="about" className="py-24 bg-dark-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            About <span className="text-accent-400">Me</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-accent-400 to-cyan-400 mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image/Visual */}
          <div className="relative">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Background decoration */}
              <div className="absolute inset-4 bg-gradient-to-br from-accent-500/20 to-cyan-500/20 rounded-2xl"></div>
              <div className="absolute inset-0 bg-dark-700 rounded-2xl border border-dark-500 overflow-hidden">
                {/* Abstract pattern */}
                <div className="absolute inset-0 opacity-50">
                  <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-accent-500/30 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-cyan-500/30 rounded-full blur-2xl"></div>
                </div>
                {/* Code-like decoration */}
                <div className="relative p-8 h-full flex flex-col justify-center font-mono text-sm text-slate-500">
                  <p className="text-accent-400">const developer = {'{'}</p>
                  <p className="ml-4"><span className="text-cyan-400">name</span>: <span className="text-green-400">"{siteConfig.name}"</span>,</p>
                  <p className="ml-4"><span className="text-cyan-400">role</span>: <span className="text-green-400">"{siteConfig.role}"</span>,</p>
                  <p className="ml-4"><span className="text-cyan-400">passion</span>: <span className="text-green-400">"Building things"</span>,</p>
                  <p className="ml-4"><span className="text-cyan-400">coffee</span>: <span className="text-yellow-400">true</span></p>
                  <p className="text-accent-400">{'}'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {aboutContent.bio.map((paragraph, index) => (
              <p 
                key={index} 
                className={`text-lg leading-relaxed ${index === 0 ? 'text-slate-300' : 'text-slate-400'}`}
              >
                {paragraph}
              </p>
            ))}

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="text-center p-4 bg-dark-700/50 rounded-xl border border-dark-600 hover:border-accent-500/50 transition-colors">
                <div className="text-2xl sm:text-3xl font-bold text-accent-400">{aboutContent.stats.yearsExperience}</div>
                <div className="text-sm text-slate-500">Years Exp.</div>
              </div>
              <div className="text-center p-4 bg-dark-700/50 rounded-xl border border-dark-600 hover:border-cyan-500/50 transition-colors">
                <div className="text-2xl sm:text-3xl font-bold text-cyan-400">{aboutContent.stats.projects}</div>
                <div className="text-sm text-slate-500">Projects</div>
              </div>
              <div className="text-center p-4 bg-dark-700/50 rounded-xl border border-dark-600 hover:border-green-500/50 transition-colors">
                <div className="text-2xl sm:text-3xl font-bold text-green-400">{aboutContent.stats.clients}</div>
                <div className="text-sm text-slate-500">Clients</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
