import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import emailjs from '@emailjs/browser';
import { siteConfig, socialLinks, emailConfig } from '../config/siteConfig';
import { useSound } from '../utils/sound';
import InteractiveCard from './ui/InteractiveCard';
import WaveText from './ui/WaveText';

const Contact = () => {
  const formRef = useRef();
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const infoRef = useRef(null);
  const formCardRef = useRef(null);
  const { playClick, playSuccess, playType } = useSound();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState([]);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 35, scale: 0.96 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.8, ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 95%',
          }
        }
      );

      // Staggered info items
      const infoItems = infoRef.current?.querySelectorAll('.contact-card-item') || [];
      if (infoItems.length > 0) {
        gsap.fromTo(infoItems,
          { opacity: 0, x: -30 },
          {
            opacity: 1, x: 0,
            duration: 0.8, ease: 'power3.out',
            stagger: 0.15,
            scrollTrigger: {
              trigger: infoRef.current,
              start: 'top 95%',
            }
          }
        );
      }

      // Form card slide-in
      gsap.fromTo(formCardRef.current,
        { opacity: 0, x: 30 },
        {
          opacity: 1, x: 0,
          duration: 0.8, ease: 'power3.out',
          scrollTrigger: {
            trigger: formCardRef.current,
            start: 'top 95%',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    playType();
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formErrors.length > 0) setFormErrors([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Enter') playType();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    playClick();
    setFormErrors([]);
    setStatus({ type: '', message: '' });

    setIsSubmitting(true);

    if (emailConfig.serviceId === 'YOUR_SERVICE_ID') {
      console.log('Form submission (EmailJS not configured):', formData);
      playSuccess();
      setShowSuccessOverlay(true);
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitting(false);
      setTimeout(() => setShowSuccessOverlay(false), 4000);
      return;
    }

    try {
      await emailjs.sendForm(emailConfig.serviceId, emailConfig.templateId, formRef.current, emailConfig.publicKey);
      playSuccess();
      setShowSuccessOverlay(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setShowSuccessOverlay(false), 4000);
    } catch (error) {
      console.error('EmailJS Error:', error);
      setStatus({ type: 'error', message: 'Something went wrong. Please try again or email me directly.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const socials = [
    {
      name: 'GitHub', href: socialLinks.github,
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
    },
    {
      name: 'LinkedIn', href: socialLinks.linkedin,
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
    },
  ];

  return (
    <section id="contact" ref={sectionRef} className="relative py-16 md:py-32 overflow-hidden border-t border-white/5">
      {/* Decorative glows */}
      <div className="absolute top-[20%] left-[-10%] w-[350px] h-[350px] rounded-full bg-primary/5 blur-[90px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div ref={titleRef} className="mb-10 sm:mb-16 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-mono uppercase tracking-[0.2em] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            // Contact
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-normal">
            <WaveText text="Let's" />{' '}<span className="text-gradient"><WaveText text="Connect" gradient={true} /></span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Contact Info */}
          <div ref={infoRef} className="space-y-6">
            {/* Email Card */}
            <div className="contact-card-item">
              <InteractiveCard>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="group flex items-center gap-4 sm:gap-5 p-4 sm:p-5 bg-[#101010]/40 transition-all duration-500 h-full w-full"
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-white/5 text-primary rounded-xl group-hover:bg-primary group-hover:text-white border border-white/10 transition-all duration-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-muted uppercase tracking-wider mb-0.5 font-mono">// Email</div>
                    <div className="text-sm sm:text-base font-semibold text-white group-hover:text-primary transition-colors break-all">{siteConfig.email}</div>
                  </div>
                </a>
              </InteractiveCard>
            </div>

            {/* Location Card */}
            <div className="contact-card-item">
              <InteractiveCard>
                <div className="flex items-center gap-4 sm:gap-5 p-4 sm:p-5 bg-[#101010]/40 h-full w-full">
                  <div className="w-12 h-12 flex items-center justify-center bg-white/5 text-primary rounded-xl border border-white/10">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-muted uppercase tracking-wider mb-0.5 font-mono">// Location</div>
                    <div className="text-base font-semibold text-white">{siteConfig.location}</div>
                  </div>
                </div>
              </InteractiveCard>
            </div>

            {/* Socials */}
            <div className="contact-card-item flex gap-3 pt-2">
              {socials.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 flex items-center justify-center bg-white/5 border border-white/10 text-muted rounded-xl hover:text-primary hover:border-primary hover:bg-primary/10 hover:-translate-y-1 transition-all duration-300"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div ref={formCardRef} className="relative">
            <InteractiveCard className="p-5 sm:p-8 glass-card">
              {/* Submission success screen */}
              {showSuccessOverlay ? (
                <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-success/20 border border-success/30 flex items-center justify-center text-success mb-6">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Message Transmitted</h3>
                  <p className="text-sm text-muted font-mono">// Connection established. Response incoming shortly.</p>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  {/* Honeypot */}
                  <input
                    type="text"
                    name="honeypot"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {formErrors.length > 0 && (
                    <div className="bg-red-950/20 border border-red-500/30 px-5 py-4 rounded-xl">
                      <ul className="text-red-400 text-sm space-y-1">
                        {formErrors.map((error, index) => (
                          <li key={index} className="flex gap-2 items-start">
                            <span className="text-red-500 mt-0.5">•</span> {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-muted mb-2 font-mono">// Your Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-3.5 rounded-xl placeholder-gray-600 outline-none text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-muted mb-2 font-mono">// Your Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      required
                      placeholder="john@example.com"
                      className="w-full px-4 py-3.5 rounded-xl placeholder-gray-600 outline-none text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-muted mb-2 font-mono">// Your Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      required
                      rows={4}
                      placeholder="Tell me about your project..."
                      className="w-full px-4 py-3.5 rounded-xl placeholder-gray-600 outline-none text-sm font-medium resize-none font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 btn-primary rounded-xl uppercase tracking-wider text-xs font-semibold hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>

                  {status.message && (
                    <div className="text-center text-sm font-medium text-red-500 pt-2 font-mono">
                      {status.message}
                    </div>
                  )}
                </form>
              )}
            </InteractiveCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
