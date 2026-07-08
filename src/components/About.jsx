import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { aboutContent, siteConfig } from '../config/siteConfig';
import { useSound } from '../utils/sound';
import InteractiveCard from './ui/InteractiveCard';
import { useTheme } from '../context/ThemeContext';

const About = () => {
  const { isDarkRed } = useTheme();
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const bioRef = useRef(null);
  const statsRef = useRef([]);
  const terminalRef = useRef(null);
  const { playHover } = useSound();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal animation
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

      // Scrubbed scrolling text highlight animation (word-by-word fill on scroll)
      const words = bioRef.current.querySelectorAll('.scrub-word');
      gsap.fromTo(
        words,
        { opacity: isDarkRed ? 0.4 : 0.65, color: isDarkRed ? '#A1A1AA' : '#475569' },
        {
          opacity: 1,
          color: isDarkRed ? '#FFFFFF' : '#0B1120',
          stagger: 0.1,
          ease: 'none',
          scrollTrigger: {
            trigger: bioRef.current,
            start: 'top 80%',
            end: 'bottom 60%',
            scrub: 1,
          },
        }
      );

      // Stats counter & card animation on scroll
      statsRef.current.forEach((stat, i) => {
        if (!stat) return;
        gsap.fromTo(
          stat,
          { opacity: 0, y: 70, scale: 0.85 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            ease: 'back.out(1.6)',
            delay: i * 0.15,
            scrollTrigger: {
              trigger: stat,
              start: 'top 95%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      });

      // profile.json Terminal card 3D reveal on scroll
      if (terminalRef.current) {
        gsap.fromTo(
          terminalRef.current,
          { opacity: 0, x: -70, y: 40, rotateY: 16, scale: 0.9 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            rotateY: 0,
            scale: 1,
            duration: 1.1,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: terminalRef.current,
              start: 'top 95%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );

        // Stagger every line of code inside profile.json
        const codeLines = terminalRef.current.querySelectorAll('.json-line');
        if (codeLines.length > 0) {
          gsap.fromTo(
            codeLines,
            { opacity: 0, x: -25 },
            {
              opacity: 1,
              x: 0,
              duration: 0.5,
              stagger: 0.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: terminalRef.current,
                start: 'top 95%',
                toggleActions: 'play reverse play reverse',
              },
            }
          );
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isDarkRed]);

  const stats = [
    {
      label: 'Experience',
      value: aboutContent.stats.yearsExperience,
      icon: '⚡',
    },
    { label: 'Projects', value: aboutContent.stats.projects, icon: '🚀' },
    { label: 'Clients', value: aboutContent.stats.clients, icon: '🤝' },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-box-structure overflow-hidden border-y border-blue-100/60"
    >
      {/* Box structure grid overlay */}
      <div className="absolute inset-0 bg-box-grid-subtle opacity-75 pointer-events-none" />
      <div className="absolute top-12 left-10 text-blue-400/40 font-mono text-xl select-none">+</div>
      <div className="absolute bottom-12 right-10 text-blue-400/40 font-mono text-xl select-none">+</div>

      {/* Blue & White ambient gradient orb */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] orb-blue opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div
          ref={titleRef}
          className="mb-16 text-center"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            About Me
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-navy tracking-tight">
            Get to Know <span className="text-gradient-blue">Me</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Terminal Card */}
          <div
            className="lg:col-span-5 order-2 lg:order-1"
            ref={terminalRef}
          >
            <InteractiveCard onMouseEnter={playHover} className="relative group overflow-hidden">
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-200/50 to-sky-200/50 rounded-[1.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-500 shine-effect">
                {/* Window Controls */}
                <div className="bg-gray-50 px-5 py-3.5 flex items-center justify-between border-b border-gray-100">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-300" />
                    <div className="w-3 h-3 rounded-full bg-yellow-300" />
                    <div className="w-3 h-3 rounded-full bg-green-300" />
                  </div>
                  <span className="text-xs font-mono text-gray-400 font-medium">
                    profile.json
                  </span>
                </div>

                {/* Code Content */}
                <div className="p-6 sm:p-8 font-mono text-sm leading-relaxed space-y-2">
                  <div className="json-line flex gap-4">
                    <span className="text-gray-300 text-xs w-6 text-right">
                      1
                    </span>
                    <span>
                      <span className="text-blue-600">const</span>{' '}
                      <span className="text-navy font-semibold">profile</span>{' '}
                      <span className="text-gray-400">=</span> {'{'}
                    </span>
                  </div>
                  <div className="json-line flex gap-4">
                    <span className="text-gray-300 text-xs w-6 text-right">
                      2
                    </span>
                    <span className="pl-4">
                      <span className="text-sky-600">name</span>
                      <span className="text-gray-400">:</span>{' '}
                      <span className="text-green-600">
                        "{siteConfig.name}"
                      </span>
                      ,
                    </span>
                  </div>
                  <div className="json-line flex gap-4">
                    <span className="text-gray-300 text-xs w-6 text-right">
                      3
                    </span>
                    <span className="pl-4">
                      <span className="text-sky-600">role</span>
                      <span className="text-gray-400">:</span>{' '}
                      <span className="text-green-600">
                        "{siteConfig.role}"
                      </span>
                      ,
                    </span>
                  </div>
                  <div className="json-line flex gap-4">
                    <span className="text-gray-300 text-xs w-6 text-right">
                      4
                    </span>
                    <span className="pl-4">
                      <span className="text-sky-600">location</span>
                      <span className="text-gray-400">:</span>{' '}
                      <span className="text-green-600">
                        "{siteConfig.location}"
                      </span>
                      ,
                    </span>
                  </div>
                  <div className="json-line flex gap-4">
                    <span className="text-gray-300 text-xs w-6 text-right">
                      5
                    </span>
                    <span className="pl-4">
                      <span className="text-sky-600">status</span>
                      <span className="text-gray-400">:</span>{' '}
                      <span className="text-green-600">"Available"</span>
                    </span>
                  </div>
                  <div className="json-line flex gap-4">
                    <span className="text-gray-300 text-xs w-6 text-right">
                      6
                    </span>
                    <span>{'}'}</span>
                  </div>
                </div>
              </div>
            </InteractiveCard>
          </div>

          {/* Content with Scrubbed Scroll Text Highlight */}
          <div className="lg:col-span-7 space-y-8 order-1 lg:order-2">
            <div ref={bioRef} className="space-y-6">
              {aboutContent.bio.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-xl sm:text-2xl leading-relaxed font-medium tracking-tight"
                >
                  {paragraph.split(' ').map((word, wIdx) => (
                    <span
                      key={wIdx}
                      className="scrub-word inline-block mr-[0.3em] transition-colors duration-150"
                    >
                      {word}
                    </span>
                  ))}
                </p>
              ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  ref={(el) => (statsRef.current[i] = el)}
                >
                  <InteractiveCard onMouseEnter={playHover} className="p-5 text-center h-full">
                    <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform duration-300">
                      {stat.icon}
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-navy mb-1 group-hover:text-blue-600 transition-colors duration-300">
                      {stat.value}
                    </div>
                    <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </InteractiveCard>
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
