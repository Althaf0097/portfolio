import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import emailjs from '@emailjs/browser';
import { siteConfig, socialLinks, emailConfig } from '../config/siteConfig';
import { useSound } from '../utils/sound';
import InteractiveCard from './ui/InteractiveCard';
import {
  validateFormData,
  checkRateLimit,
  isBot,
  sanitizeInput,
  logSecurityEvent
} from '../utils/security';

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

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 55, scale: 0.94 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.9, ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 95%',
            toggleActions: 'play reverse play reverse',
          }
        }
      );

      // Staggered Contact Info cards reveal
      const infoItems = infoRef.current?.querySelectorAll('.contact-card-item') || [];
      if (infoItems.length > 0) {
        gsap.fromTo(infoItems,
          { opacity: 0, x: -60, y: 25 },
          {
            opacity: 1, x: 0, y: 0,
            duration: 0.85, ease: 'back.out(1.4)',
            stagger: 0.15,
            scrollTrigger: {
              trigger: infoRef.current,
              start: 'top 95%',
              toggleActions: 'play reverse play reverse',
            }
          }
        );
      }

      // 3D Perspective Form Card reveal
      gsap.fromTo(formCardRef.current,
        { opacity: 0, x: 75, rotateY: -14, scale: 0.92 },
        {
          opacity: 1, x: 0, rotateY: 0, scale: 1,
          duration: 1.05, ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: formCardRef.current,
            start: 'top 95%',
            toggleActions: 'play reverse play reverse',
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

    if (isBot(honeypot)) {
      logSecurityEvent('Bot detected via honeypot');
      setStatus({ type: 'success', message: 'Thanks for your message!' });
      return;
    }

    const rateCheck = checkRateLimit('contact-form');
    if (!rateCheck.allowed) {
      setStatus({ type: 'error', message: rateCheck.message });
      logSecurityEvent('Rate limit exceeded');
      return;
    }

    const validation = validateFormData(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      logSecurityEvent('Form validation failed', { errors: validation.errors });
      return;
    }

    setIsSubmitting(true);

    const sanitizedData = {
      name: sanitizeInput(formData.name),
      email: sanitizeInput(formData.email),
      message: sanitizeInput(formData.message),
    };

    if (emailConfig.serviceId === 'YOUR_SERVICE_ID') {
      console.log('Form submission (EmailJS not configured):', sanitizedData);
      playSuccess();
      setStatus({ type: 'success', message: 'Thanks for your message! (Email service not configured)' });
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitting(false);
      setTimeout(() => setStatus({ type: '', message: '' }), 5000);
      return;
    }

    try {
      await emailjs.sendForm(emailConfig.serviceId, emailConfig.templateId, formRef.current, emailConfig.publicKey);
      playSuccess();
      setStatus({ type: 'success', message: "Thanks for your message! I'll get back to you soon." });
      setFormData({ name: '', email: '', message: '' });
      logSecurityEvent('Form submitted successfully');
    } catch (error) {
      console.error('EmailJS Error:', error);
      setStatus({ type: 'error', message: 'Something went wrong. Please try again or email me directly.' });
      logSecurityEvent('Form submission failed', { error: error.message });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setStatus({ type: '', message: '' }), 5000);
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
    <section id="contact" ref={sectionRef} className="relative py-24 md:py-32 bg-box-structure overflow-hidden border-t border-blue-100/60">
      {/* Box structure grid overlay */}
      <div className="absolute inset-0 bg-box-grid-subtle opacity-80 pointer-events-none" />
      <div className="absolute top-12 left-10 text-blue-400/40 font-mono text-xl select-none">+</div>
      <div className="absolute bottom-12 right-10 text-blue-400/40 font-mono text-xl select-none">+</div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] orb-blue opacity-20 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div ref={titleRef} className="mb-16 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Contact
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-navy tracking-tight">
            Let's <span className="text-gradient-blue">Connect</span>
          </h2>
          <p className="mt-4 text-lg text-gray-700 font-medium max-w-xl mx-auto">
            Have a project in mind or just want to chat? I'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Contact Info */}
          <div ref={infoRef} className="space-y-6">
            {/* Email Card */}
            <InteractiveCard className="contact-card-item">
              <a
                href={`mailto:${siteConfig.email}`}
                className="group flex items-center gap-5 p-5 bg-gray-50 border border-gray-100 rounded-2xl hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-500 card-lift shine-effect"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-0.5">Email</div>
                  <div className="text-base font-semibold text-navy group-hover:text-blue-600 transition-colors">{siteConfig.email}</div>
                </div>
              </a>
            </InteractiveCard>

            {/* Location Card */}
            <InteractiveCard className="contact-card-item">
              <div className="flex items-center gap-5 p-5 bg-gray-50 border border-gray-100 rounded-2xl shine-effect">
                <div className="w-12 h-12 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-0.5">Location</div>
                  <div className="text-base font-semibold text-navy">{siteConfig.location}</div>
                </div>
              </div>
            </InteractiveCard>

            {/* Socials */}
            <div className="contact-card-item flex gap-3 pt-2">
              {socials.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 flex items-center justify-center bg-gray-50 border border-gray-100 text-gray-400 rounded-xl hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 hover:-translate-y-1 transition-all duration-300"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div ref={formCardRef}>
            <InteractiveCard className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg shadow-gray-200/50 shine-effect">
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

                {/* Errors */}
                {formErrors.length > 0 && (
                  <div className="bg-red-50 border border-red-100 px-5 py-4 rounded-xl">
                    <ul className="text-red-500 text-sm space-y-1">
                      {formErrors.map((error, index) => (
                        <li key={index} className="flex gap-2 items-start">
                          <span className="text-red-400 mt-0.5">•</span> {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-navy placeholder-gray-400 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Your Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    required
                    placeholder="john@example.com"
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-navy placeholder-gray-400 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Your Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    required
                    rows={4}
                    placeholder="Tell me about your project..."
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-navy placeholder-gray-400 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-medium resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative w-full py-4 bg-blue-600 text-white font-semibold text-sm rounded-xl overflow-hidden disabled:opacity-50 transition-all duration-500 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98] group"
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </>
                    )}
                  </span>
                </button>

                {status.message && (
                  <div className={`text-center text-sm font-medium animate-fade-in pt-2 ${
                    status.type === 'success' ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {status.message}
                  </div>
                )}
              </form>
            </InteractiveCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
