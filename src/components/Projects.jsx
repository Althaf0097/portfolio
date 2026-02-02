import { projects, socialLinks } from '../config/siteConfig';
import { useSound } from '../utils/sound';

const Projects = () => {
  const { playClick, playHover } = useSound();

  return (
    <section id="projects" className="py-24 bg-dark-800/30 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Featured <span className="text-accent-400">Projects</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-accent-400 to-cyan-400 mx-auto rounded-full"></div>
          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            A selection of projects that showcase my skills and passion for building
          </p>
        </div>

        {/* Projects grid - 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className="group project-card relative glass-card rounded-2xl border border-dark-600 overflow-hidden card-hover hover:border-accent-500/50 transition-all duration-500"
              onMouseEnter={playHover}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Project image placeholder */}
              <div className="relative h-40 sm:h-48 bg-gradient-to-br from-dark-600 to-dark-700 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center project-image">
                  <div className="text-5xl font-bold text-dark-500 group-hover:text-accent-500/30 transition-all duration-500">
                    {project.title.charAt(0)}
                  </div>
                </div>
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/95 via-dark-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-4">
                  <div className="flex gap-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        playClick();
                        if (project.demo === '#' || project.demo.includes('example.com')) {
                          e.preventDefault();
                          alert('Demo link coming soon!');
                        }
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-accent-500 rounded-lg hover:bg-accent-600 transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      Live Demo
                    </a>
                    <a
                      href={project.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={playClick}
                      className="px-4 py-2 text-sm font-medium text-slate-300 bg-dark-600 rounded-lg hover:bg-dark-500 transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      Source
                    </a>
                  </div>
                </div>
                {project.featured && (
                  <div className="absolute top-3 right-3 px-2 py-1 text-xs font-medium text-accent-400 bg-accent-500/20 rounded-full border border-accent-500/30 backdrop-blur-sm">
                    Featured
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2 group-hover:text-accent-400 transition-all duration-300">
                  {project.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-2">
                  {project.tech.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs font-medium text-slate-400 bg-dark-600 rounded transition-all duration-300 hover:bg-dark-500 hover:text-accent-400"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech.length > 4 && (
                    <span className="px-2 py-1 text-xs font-medium text-slate-500">
                      +{project.tech.length - 4}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View more */}
        <div className="text-center mt-12">
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={playClick}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-slate-300 border border-dark-500 rounded-xl hover:border-accent-500 hover:text-accent-400 transition-all duration-500 hover:scale-105 active:scale-95"
          >
            View More on GitHub
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;
