import { skills } from '../config/siteConfig';

const Skills = () => {
  const skillCategories = [
    { title: 'Frontend', skills: skills.frontend },
    { title: 'Backend', skills: skills.backend },
    { title: 'Database', skills: skills.database },
    { title: 'DevOps & Tools', skills: skills.devops },
  ];

  return (
    <section id="skills" className="py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Skills & <span className="text-accent-400">Technologies</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-accent-400 to-cyan-400 mx-auto rounded-full"></div>
          <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">
            Here are the technologies I work with to bring ideas to life
          </p>
        </div>

        {/* Skills grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category) => (
            <div
              key={category.title}
              className="group p-6 bg-dark-800/50 rounded-2xl border border-dark-600 hover:border-accent-500/50 transition-all duration-300 hover:-translate-y-1"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-accent-400 rounded-full"></span>
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 text-sm font-medium text-slate-300 bg-dark-700 rounded-lg border border-dark-500 hover:border-accent-500/50 hover:text-accent-400 transition-all duration-200 cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional skills bar */}
        <div className="mt-12 p-6 bg-gradient-to-r from-dark-800/80 to-dark-700/80 rounded-2xl border border-dark-600">
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
            <span className="text-sm font-medium text-slate-500">Also familiar with:</span>
            {skills.other.map((skill) => (
              <span key={skill} className="text-sm hover:text-accent-400 transition-colors cursor-default">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
