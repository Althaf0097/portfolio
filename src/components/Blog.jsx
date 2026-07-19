import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useSound } from '../utils/sound';
import InteractiveCard from './ui/InteractiveCard';
import WaveText from './ui/WaveText';

const Blog = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const gridRef = useRef(null);
  const { playHover } = useSound();

  const posts = [
    {
      title: 'Procedural Wave Math in React Three Fiber',
      excerpt: 'How to create undulating, organic organic metallic surfaces using custom GLSL shaders and simplex noise.',
      tag: 'Graphics',
      time: '6 min read',
      date: 'July 10, 2026'
    },
    {
      title: 'Automating Support Pipelines with Gemini Functions',
      excerpt: 'A deep-dive analysis on building self-healing LLM pipelines using structured function calling syntax.',
      tag: 'Artificial Intelligence',
      time: '5 min read',
      date: 'June 28, 2026'
    },
    {
      title: 'The Blueprint for Ultra-Smooth Web Interactions',
      excerpt: 'Connecting Lenis Smooth Scroll with GSAP ScrollTrigger to build flawless cinematic pages.',
      tag: 'UI/UX',
      time: '4 min read',
      date: 'June 15, 2026'
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.8, ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
          }
        }
      );

      // Grid cards reveal
      const cards = gridRef.current?.querySelectorAll('.blog-card') || [];
      gsap.fromTo(cards,
        { opacity: 0, y: 45 },
        {
          opacity: 1, y: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="blog" ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden border-t border-white/5">
      <div className="absolute top-[30%] left-[-10%] w-[350px] h-[350px] rounded-full bg-primary/5 blur-[90px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div ref={titleRef} className="mb-16 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-mono uppercase tracking-[0.2em] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            // Articles
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            <WaveText text="Latest" />{' '}<span className="text-gradient"><WaveText text="Insights" gradient={true} /></span>
          </h2>
        </div>

        {/* Blog Post Cards Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <div key={i} className="blog-card">
              <InteractiveCard onMouseEnter={playHover} className="p-6 h-full flex flex-col justify-between glass-card">
                <div>
                  {/* Category and Reading Time */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-primary font-mono uppercase tracking-wider bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
                      {post.tag}
                    </span>
                    <span className="text-[10px] font-semibold text-muted font-mono uppercase">
                      {post.time}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-primary transition-colors duration-300">
                    {post.title}
                  </h3>

                  <p className="text-sm text-muted mb-6 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="border-t border-white/5 pt-4 flex items-center justify-between text-[11px] text-muted font-mono font-semibold">
                  <span>{post.date}</span>
                  <span className="text-white hover:text-primary transition-colors cursor-pointer">[ Read Article ]</span>
                </div>
              </InteractiveCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
