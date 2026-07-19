// Portfolio Configuration
// Update these values with your own information

export const siteConfig = {
  name: 'Althaf S',
  initials: 'AS',
  role: 'Full Stack Developer',
  roles: ['Full Stack Developer', 'Data Analyst', 'Python Developer', 'Content Creator', 'AI Builder'],
  tagline: 'I craft exceptional digital experiences that combine elegant design with robust functionality. Turning complex problems into simple, beautiful solutions.',
  email: 'althafs879@gmail.com',
  location: 'Varkala, Kerala',
  availability: 'Available for opportunities',
};

export const socialLinks = {
  github: 'https://github.com/Althaf0097',
  linkedin: 'https://www.linkedin.com/in/althaf-s-1b086b210',
  twitter: 'https://x.com/ALTHAF_S12',
};

export const aboutContent = {
  bio: [
    "I'm a passionate full-stack developer with over 5 years of experience building web applications that make a difference. I specialize in creating scalable, user-centric solutions using modern technologies.",
    "I love tackling complex problems and turning them into simple, intuitive interfaces. Whether it's building a fast API, crafting pixel-perfect UIs, or optimizing database queries, I enjoy every part of the development process.",
    "When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community.",
  ],
  stats: {
    yearsExperience: '1 Year',
    projects: '10+',
    clients: '5+',
  },
};

export const skills = {
  frontend: ['React', 'Next.js', 'JavaScript', 'Tailwind CSS', 'HTML/CSS'],
  backend: ['Node.js', 'Python', 'SpringBoot', 'Django', 'FastAPI'],
  database: ['PostgreSQL', 'MongoDB', 'MySQL', 'Supabase', 'Firebase'],
  devops: ['Docker', 'GitHub', 'Git', 'Linux', 'Vercel'],
};

export const projects = [
  {
    title: 'Sentiment Analysis',
    description: 'A deep-learning sentiment analyzer designed for multilingual input, processing textual statements to determine positive, negative, or neutral sentiment scores.',
    tech: ['Python', 'Streamlit', 'NLP'],
    demo: 'https://github.com/Althaf0097/Sentiment-hindi-english',
    source: 'https://github.com/Althaf0097/Sentiment-hindi-english',
    featured: true,
    category: 'Artificial Intelligence',
    status: 'COMPLETED',
    progress: 100,
    metadata: ['2026', 'Machine Learning', 'Academic'],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop'
  },
  {
    title: 'EditzMedia',
    description: 'A cloud-based rich media delivery platform engineered for content editors, delivering high-fidelity assets dynamically with real-time editing resources.',
    tech: ['React', 'Node.js', 'Socket.io', 'Supabase'],
    demo: 'https://github.com/Althaf0097/EditzMedia',
    source: 'https://github.com/Althaf0097/EditzMedia',
    featured: true,
    category: 'Full Stack Web',
    status: 'COMPLETED',
    progress: 100,
    metadata: ['2026', 'Cloud Storage', 'Interactive'],
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=800&auto=format&fit=crop'
  },
  {
    title: 'Electricity Prediction',
    description: 'An AI-powered smart-grid utility forecasting system that tracks and predicts grid loading thresholds based on historical load metrics.',
    tech: ['Python', 'Streamlit', 'Scikit-Learn'],
    demo: 'https://github.com/Althaf0097/Electricity_pred',
    source: 'https://github.com/Althaf0097/Electricity_pred',
    featured: true,
    category: 'Data Science & ML',
    status: 'ACTIVE',
    progress: 90,
    metadata: ['2025', 'Smart Grid', 'Automation'],
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop'
  },
  {
    title: 'Hospital Management',
    description: 'An enterprise healthcare management hub supporting registration operations, appointment schedules, and secure transactional billing workflows.',
    tech: ['Django', 'PostgreSQL', 'Tailwind'],
    demo: 'https://github.com/Althaf0097/Hospital',
    source: 'https://github.com/Althaf0097/Hospital',
    featured: false,
    category: 'Enterprise Software',
    status: 'COMPLETED',
    progress: 100,
    metadata: ['2025', 'Database Systems', 'Management'],
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=800&auto=format&fit=crop'
  },
  {
    title: 'AIMUS Music Player',
    description: 'A lightweight interactive audio streaming application offering local library playlist management and high-quality background audio output.',
    tech: ['React', 'Node.js', 'Web Audio API'],
    demo: 'https://github.com/Althaf0097/AIMUS/tree/main/AIMu/client',
    source: 'https://github.com/Althaf0097/AIMUS/tree/main/AIMu/client',
    featured: false,
    category: 'Audio Streaming',
    status: 'IN_PROGRESS',
    progress: 75,
    metadata: ['2026', 'Front-End', 'Personal Project'],
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop'
  },
  {
    title: 'Developer Portfolio',
    description: 'A luxury digital space presenting interactive works, built with premium 3D design layers, modern sound cues, and micro-interactive physics.',
    tech: ['React', 'Tailwind CSS', 'Vite', 'GSAP'],
    demo: 'https://portfolio-six-wine-p29zgt8x2n.vercel.app/',
    source: 'https://github.com/Althaf0097/portfolio',
    featured: false,
    category: 'Design Engineering',
    status: 'ACTIVE',
    progress: 95,
    metadata: ['2026', 'Creative Dev', 'Production'],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop'
  },
];

// EmailJS Configuration
// Sign up at https://www.emailjs.com/ and get your credentials
export const emailConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY',
};

// Navigation links
export const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];
