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
  const [honeypot, setHoneypot] = useState(''); // Bot trap
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
    if (isBot(honeypot)) {
      logSecurityEvent('Bot detected via honeypot');
      // Fake success to fool bots
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

    // Sanitize inputs before sending
    const sanitizedData = {
      name: sanitizeInput(formData.name),
      email: sanitizeInput(formData.email),
      message: sanitizeInput(formData.message),
    };

    // Check if EmailJS is configured
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

  const socialIcons = [
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
    {
      name: 'Twitter',
      href: socialLinks.twitter,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="contact" className="py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Get In <span className="text-accent-400">Touch</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-accent-400 to-cyan-400 mx-auto rounded-full"></div>
          <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">
            Have a project in mind or just want to chat? Feel free to reach out!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact form */}
          <div className="bg-dark-800/50 rounded-2xl border border-dark-600 p-8 transition-all duration-500 hover:border-dark-500">
            <h3 className="text-xl font-semibold text-white mb-6">Send a Message</h3>
            
            {/* Form errors */}
            {formErrors.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                <ul className="text-red-400 text-sm space-y-1">
                  {formErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {status.message && (
              <div className={`flex items-center gap-3 p-4 mb-6 rounded-xl animate-fade-in-up ${
                status.type === 'success' 
                  ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                  : 'bg-red-500/10 border border-red-500/20 text-red-400'
              }`}>
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {status.type === 'success' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  )}
                </svg>
                {status.message}
              </div>
            )}

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot field - hidden from users, visible to bots */}
              <div style={{ position: 'absolute', left: '-9999px', opacity: 0 }} aria-hidden="true">
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div className="group">
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2 transition-colors group-focus-within:text-accent-400">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  required
                  maxLength={100}
                  autoComplete="name"
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-500 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-accent-500 transition-all duration-300"
                  placeholder="Your name"
                />
              </div>

              <div className="group">
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2 transition-colors group-focus-within:text-accent-400">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  required
                  maxLength={254}
                  autoComplete="email"
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-500 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-accent-500 transition-all duration-300"
                  placeholder="your@email.com"
                />
              </div>

              <div className="group">
                <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2 transition-colors group-focus-within:text-accent-400">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  required
                  rows={5}
                  maxLength={5000}
                  autoComplete="off"
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-500 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-accent-500 transition-all duration-300 resize-none"
                  placeholder="Your message..."
                />
                <p className="text-xs text-slate-500 mt-1 text-right">
                  {formData.message.length}/5000
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 text-lg font-semibold text-white bg-gradient-to-r from-accent-500 to-accent-600 rounded-xl transition-all duration-500 hover:shadow-lg hover:shadow-accent-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>

          {/* Contact info */}
          <div className="flex flex-col justify-center">
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Let's Connect</h3>
                <p className="text-slate-400 leading-relaxed">
                  I'm always open to discussing new projects, creative ideas, or opportunities 
                  to be part of something amazing. Whether you have a question or just want to 
                  say hi, I'll try my best to get back to you!
                </p>
              </div>

              <div className="space-y-4">
                <a 
                  href={`mailto:${siteConfig.email}`}
                  onClick={playClick}
                  className="flex items-center gap-4 text-slate-300 hover:text-accent-400 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-dark-700 rounded-xl border border-dark-600 group-hover:border-accent-500/50 group-hover:scale-110 transition-all duration-300">
                    <svg className="w-5 h-5 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p>{siteConfig.email}</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 text-slate-300">
                  <div className="w-12 h-12 flex items-center justify-center bg-dark-700 rounded-xl border border-dark-600">
                    <svg className="w-5 h-5 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Location</p>
                    <p>{siteConfig.location}</p>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div>
                <p className="text-sm text-slate-500 mb-4">Follow me on</p>
                <div className="flex gap-4">
                  {socialIcons.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={playClick}
                      className="w-12 h-12 flex items-center justify-center bg-dark-700 rounded-xl border border-dark-600 text-slate-400 hover:text-accent-400 hover:border-accent-500/50 transition-all duration-300 hover:scale-110 active:scale-95"
                      aria-label={link.name}
                    >
                      {link.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
