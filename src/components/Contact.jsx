import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { siteConfig, socialLinks, emailConfig } from '../config/siteConfig';
import { useSound } from '../utils/sound';
import {
  validateFormData,
  checkRateLimit,
  isBot,
  sanitizeInput,
  logSecurityEvent
} from '../utils/security';

const Contact = () => {
  const formRef = useRef();
  const { playClick, playSuccess, playType } = useSound();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState([]);

  const handleChange = (e) => {
    playType();
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear errors on change
    if (formErrors.length > 0) {
      setFormErrors([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Enter') {
      playType();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    playClick();
    setFormErrors([]);
    setStatus({ type: '', message: '' });

    // Bot detection (honeypot)
    // Read from the form targets instead of state to reduce re-renders
    if (isBot(e.target.user_bot_field?.value || '')) {
      logSecurityEvent('Bot detected via honeypot');
      setStatus({ type: 'success', message: 'Thanks for your message!' });
      return;
    }

    // Rate limiting
    const rateCheck = checkRateLimit('contact-form');
    if (!rateCheck.allowed) {
      setStatus({ type: 'error', message: rateCheck.message });
      logSecurityEvent('Rate limit exceeded');
      return;
    }

    // Validate form data
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
      setStatus({
        type: 'success',
        message: 'Thanks for your message! (Note: Email service not configured)',
      });
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitting(false);
      setTimeout(() => setStatus({ type: '', message: '' }), 5000);
      return;
    }

    try {
      await emailjs.sendForm(
        emailConfig.serviceId,
        emailConfig.templateId,
        formRef.current,
        emailConfig.publicKey
      );
      playSuccess();
      setStatus({
        type: 'success',
        message: 'Thanks for your message! I\'ll get back to you soon.',
      });
      setFormData({ name: '', email: '', message: '' });
      logSecurityEvent('Form submitted successfully');
    } catch (error) {
      console.error('EmailJS Error:', error);
      setStatus({
        type: 'error',
        message: 'Something went wrong. Please try again or email me directly.',
      });
      logSecurityEvent('Form submission failed', { error: error.message });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setStatus({ type: '', message: '' }), 5000);
    }
  };

  const socialIconsList = [
    {
      name: 'GitHub',
      href: socialLinks.github,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: socialLinks.linkedin,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="contact" className="relative py-24 md:py-32 bg-dark-950 overflow-hidden">
      {/* Volumetric background lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] glow-pool-blue opacity-10 pointer-events-none"></div>

      {/* Modern HUD Elements */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-10 h-64 hud-line-v"></div>
        <div className="absolute top-1/2 left-10 hud-dot"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Detailed Contact Info */}
          <div className="space-y-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-400/10 border border-accent-400/20 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse"></span>
                <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-accent-400 uppercase">Communication</span>
              </div>
              <h2 className="text-5xl sm:text-6xl font-black text-white uppercase tracking-tighter mb-8 font-sans">
                Let's <span className="text-blue-400">Connect</span>
              </h2>
              <p className="text-xl text-slate-400 font-sans font-light leading-relaxed max-w-md">
                Looking for new challenges or just a technical chat? My inbox is always active for meaningful collaborations.
              </p>
            </div>

            <div className="space-y-4 group/focus">
              <a
                href={`mailto:${siteConfig.email}`}
                className="group relative flex items-center gap-6 p-6 glass-premium rounded-[2rem] transition-all duration-700 group-hover/focus:opacity-40 hover:!opacity-100 hover:scale-[1.03] border border-white/5 hover:border-accent-400/40 overflow-hidden"
              >
                {/* Premium Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[1200ms] ease-in-out pointer-events-none"></div>

                <div className="w-14 h-14 flex items-center justify-center bg-accent-400/10 text-accent-400 group-hover:bg-accent-400 group-hover:text-dark-950 transition-all duration-500 rounded-2xl shadow-xl group-hover:shadow-accent-400/20 group-hover:scale-110">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[9px] uppercase font-black text-slate-500 tracking-[0.3em] font-mono mb-1">Primary Node</div>
                  <div className="text-lg text-white group-hover:text-accent-400 font-bold transition-colors font-sans">{siteConfig.email}</div>
                </div>
              </a>

              <div className="group relative flex items-center justify-between p-6 glass-premium rounded-[2rem] transition-all duration-700 group-hover/focus:opacity-40 hover:!opacity-100 hover:scale-[1.03] border border-white/5 overflow-hidden">
                {/* Premium Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[1200ms] ease-in-out pointer-events-none"></div>
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 flex items-center justify-center bg-blue-400/10 text-blue-400 rounded-2xl transition-all duration-500 group-hover:bg-blue-400 group-hover:text-dark-950 group-hover:scale-110 shadow-xl group-hover:shadow-blue-400/20">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase font-black text-slate-500 tracking-[0.3em] font-mono mb-1">Deployment Base</div>
                    <div className="text-lg text-white font-bold font-sans tracking-tight">{siteConfig.location}</div>
                  </div>
                </div>
              </div>

              {/* Enhanced Socials */}
              <div className="flex gap-4 pt-4 group/focus-socials">
                {socialIconsList.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 flex items-center justify-center glass-premium border border-white/10 text-slate-400 transition-all duration-500 group-hover/focus-socials:opacity-50 hover:!opacity-100 hover:text-accent-400 hover:border-accent-400 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)] rounded-xl hover:-translate-y-2 hover:scale-110"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Premium Form Card */}
          <div className="relative group">
            {/* Outer Background Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-accent-400/10 to-blue-400/10 rounded-[4rem] blur-3xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>

            <div className="relative glass-premium border border-white/10 p-10 rounded-[2.5rem] shadow-2xl backdrop-blur-3xl overflow-hidden">
              {/* Premium Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[1500ms] ease-in-out pointer-events-none z-10"></div>
              {/* Window Controls Decor */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]/20 group-hover:bg-[#ff5f56]/40 transition-colors"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/20 group-hover:bg-[#ffbd2e]/40 transition-colors"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]/20 group-hover:bg-[#27c93f]/40 transition-colors"></div>
                </div>
                <div className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-[0.5em]">Transmission::Ready</div>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
                {/* Form errors */}
                {formErrors.length > 0 && (
                  <div className="bg-red-500/5 border border-red-500/20 px-6 py-5 rounded-2xl mb-8">
                    <ul className="text-red-400 text-[10px] space-y-2 font-mono font-bold">
                      {formErrors.map((error, index) => (
                        <li key={index} className="flex gap-2">
                          <span className="opacity-50">!</span> ERR_VAL: {error.toUpperCase()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-3">
                  <label className="text-[10px] font-mono font-black text-accent-400/60 uppercase tracking-[0.2em] ml-2">Identify//Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    required
                    placeholder="Subject Name"
                    className="w-full px-8 py-5 bg-white/[0.02] border border-white/5 rounded-2xl text-white placeholder-slate-700 focus:border-accent-400/40 focus:bg-accent-400/[0.02] outline-none transition-all font-mono text-sm"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-mono font-black text-accent-400/60 uppercase tracking-[0.2em] ml-2">Response//Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    required
                    placeholder="domain@uplink.com"
                    className="w-full px-8 py-5 bg-white/[0.02] border border-white/5 rounded-2xl text-white placeholder-slate-700 focus:border-accent-400/40 focus:bg-accent-400/[0.02] outline-none transition-all font-mono text-sm"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-mono font-black text-accent-400/60 uppercase tracking-[0.2em] ml-2">Manifest//Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    required
                    rows={4}
                    placeholder="Describe your objective..."
                    className="w-full px-8 py-5 bg-white/[0.02] border border-white/5 rounded-2xl text-white placeholder-slate-700 focus:border-accent-400/40 focus:bg-accent-400/[0.02] outline-none transition-all font-mono text-sm resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative w-full py-6 bg-accent-400 text-dark-950 font-black text-xs uppercase tracking-[0.5em] rounded-2xl overflow-hidden group/btn disabled:opacity-50 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(239,68,68,0.3)] active:scale-[0.98]"
                >
                  {/* Premium Shine Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[150%] group-hover/btn:translate-x-[150%] transition-transform duration-1000 ease-in-out"></div>

                  <span className="relative z-10 flex items-center justify-center gap-4">
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        TRANSMITTING...
                      </>
                    ) : (
                      'EXECUTE SEND'
                    )}
                  </span>
                </button>

                {status.message && (
                  <div className={`text-center font-mono text-[10px] font-black animate-fade-in pt-4 ${status.type === 'success' ? 'text-accent-400' : 'text-red-500'}`}>
                    &gt; {status.message.toUpperCase()}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
