// Portfolio Configuration
// Update these values with your own information

export const siteConfig = {
  name: 'Alex Chen',
  initials: 'AC',
  role: 'Full Stack Developer',
  tagline: 'I craft exceptional digital experiences that combine elegant design with robust functionality. Turning complex problems into simple, beautiful solutions.',
  email: 'hello@alexchen.dev',
  location: 'San Francisco, CA',
  availability: 'Available for opportunities',
};

export const socialLinks = {
  github: 'https://github.com/alexchen',
  linkedin: 'https://linkedin.com/in/alexchen',
  twitter: 'https://twitter.com/alexchen',
};

export const aboutContent = {
  bio: [
    "I'm a passionate full-stack developer with over 5 years of experience building web applications that make a difference. I specialize in creating scalable, user-centric solutions using modern technologies.",
    "I love tackling complex problems and turning them into simple, intuitive interfaces. Whether it's building a fast API, crafting pixel-perfect UIs, or optimizing database queries, I enjoy every part of the development process.",
    "When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community.",
  ],
  stats: {
    yearsExperience: '5+',
    projects: '50+',
    clients: '30+',
  },
};

export const skills = {
  frontend: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vue.js', 'HTML/CSS'],
  backend: ['Node.js', 'Python', 'Express', 'Django', 'FastAPI', 'GraphQL'],
  database: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'Prisma', 'Firebase'],
  devops: ['Docker', 'AWS', 'Git', 'CI/CD', 'Linux', 'Vercel'],
  other: ['REST APIs', 'WebSockets', 'OAuth', 'Testing', 'Agile', 'UI/UX'],
};

export const projects = [
  {
    title: 'E-Commerce Platform',
    description: 'A full-featured online store with real-time inventory, secure payments, and an admin dashboard for managing products and orders.',
    tech: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL', 'Prisma'],
    demo: 'https://demo.example.com',
    source: 'https://github.com/alexchen/ecommerce',
    featured: true,
  },
  {
    title: 'Task Management App',
    description: 'Collaborative project management tool with real-time updates, drag-and-drop boards, and team workspaces.',
    tech: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
    demo: 'https://demo.example.com',
    source: 'https://github.com/alexchen/taskapp',
    featured: true,
  },
  {
    title: 'AI Content Generator',
    description: 'AI-powered writing assistant that helps create blog posts, social media content, and marketing copy.',
    tech: ['Python', 'FastAPI', 'OpenAI', 'React', 'Redis'],
    demo: 'https://demo.example.com',
    source: 'https://github.com/alexchen/aiwriter',
    featured: true,
  },
  {
    title: 'Real Estate Finder',
    description: 'Property search platform with advanced filtering, map integration, and saved searches.',
    tech: ['Vue.js', 'Django', 'PostgreSQL', 'Mapbox'],
    demo: 'https://demo.example.com',
    source: 'https://github.com/alexchen/realestate',
    featured: false,
  },
  {
    title: 'Fitness Tracker',
    description: 'Mobile-first workout tracking app with progress analytics, custom routines, and social features.',
    tech: ['React Native', 'Firebase', 'Chart.js'],
    demo: 'https://demo.example.com',
    source: 'https://github.com/alexchen/fittrack',
    featured: false,
  },
  {
    title: 'Developer Portfolio',
    description: 'Modern, responsive portfolio template with dark theme and smooth animations.',
    tech: ['React', 'Tailwind CSS', 'Vite'],
    demo: 'https://alexchen.dev',
    source: 'https://github.com/alexchen/portfolio',
    featured: false,
  },
];

// EmailJS Configuration
// Sign up at https://www.emailjs.com/ and get your credentials
export const emailConfig = {
  serviceId: 'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
  templateId: 'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
  publicKey: 'YOUR_PUBLIC_KEY', // Replace with your EmailJS public key
};

// Navigation links
export const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];
