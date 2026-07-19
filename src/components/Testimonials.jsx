import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useSound } from '../utils/sound';
import InteractiveCard from './ui/InteractiveCard';
import WaveText from './ui/WaveText';

const Testimonials = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const marqueeRef = useRef(null);
  const marqueeTweenRef = useRef(null);
  const { playHover } = useSound();

  const reviews = [
    { name: 'David Miller', role: 'CTO, DevScale', text: 'Althaf has an outstanding eye for modern design physics. The performance optimizations he integrated on our web application was Apple-grade.' },
    { name: 'Sarah Connor', role: 'Product Lead, CyberFlow', text: 'His ability to connect R3F scenes with real-time sockets transformed our interface. Truly a premium developer experience.' },
    { name: 'Nikhil R.', role: 'Founder, CloudStream', text: 'Very communicative, efficient, and clean code base. He automated our entire support chat stack via OpenAI within days.' },
    { name: 'David Miller', role: 'CTO, DevScale', text: 'Althaf has an outstanding eye for modern design physics. The performance optimizations he integrated on our web application was Apple-grade.' },
    { name: 'Sarah Connor', role: 'Product Lead, CyberFlow', text: 'His ability to connect R3F scenes with real-time sockets transformed our interface. Truly a premium developer experience.' },
    { name: 'Nikhil R.', role: 'Founder, CloudStream', text: 'Very communicative, efficient, and clean code base. He automated our entire support chat stack via OpenAI within days.' },
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

      // Infinite testimonials marquee
      const marqueeTrack = marqueeRef.current?.querySelector('.marquee-track');
      if (marqueeTrack) {
        const trackWidth = marqueeTrack.scrollWidth / 2;
        marqueeTweenRef.current = gsap.to(marqueeTrack, {
          x: -trackWidth,
          duration: 24,
          ease: 'none',
          repeat: -1,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMouseEnter = () => {
    if (marqueeTweenRef.current) {
      marqueeTweenRef.current.pause();
    }
  };

  const handleMouseLeave = () => {
    if (marqueeTweenRef.current) {
      marqueeTweenRef.current.play();
    }
  };

  return (
    <section id="testimonials" ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden border-t border-white/5">
      <div className="absolute top-[20%] left-[-10%] w-[350px] h-[350px] rounded-full bg-primary/5 blur-[90px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div ref={titleRef} className="mb-16 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-mono uppercase tracking-[0.2em] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            // Endorsements
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            <WaveText text="Client" />{' '}<span className="text-gradient"><WaveText text="Testimonials" gradient={true} /></span>
          </h2>
        </div>
      </div>

      {/* Testimonials Marquee Track */}
      <div
        ref={marqueeRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="w-full overflow-hidden py-6 marquee-container cursor-grab active:cursor-grabbing"
      >
        <div className="marquee-track flex gap-6 whitespace-nowrap pl-4">
          {reviews.map((rev, index) => (
            <div key={index} className="inline-block w-[320px] shrink-0 whitespace-normal">
              <InteractiveCard onMouseEnter={playHover} className="p-6 h-full glass-card">
                <p className="text-sm italic text-muted mb-4 leading-relaxed">
                  "{rev.text}"
                </p>
                <div className="border-t border-white/5 pt-4">
                  <div className="text-sm font-bold text-white leading-none mb-1">{rev.name}</div>
                  <div className="text-[10px] font-bold text-primary font-mono uppercase">{rev.role}</div>
                </div>
              </InteractiveCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
