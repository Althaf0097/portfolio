// Portfolio Configuration
// Update these values with your own information

export const siteConfig = {
  name: 'Althaf S',
  initials: 'AS',
  role: 'Full Stack Developer',
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
  other: ['REST APIs', 'WebSockets', 'OAuth', 'Testing', 'UI/UX'],
};

export const projects = [
  {
    title: 'Sentiment Analysis',
    description: 'Sentiment Analysis is a web application that can be used to analyze the sentiment of a given text. It uses machine learning to determine whether the text is positive, negative, or neutral.',
    tech: ['Python', 'Streamlit'],
    demo: 'https://github.com/Althaf0097/Sentiment-hindi-english',
    source: 'https://github.com/Althaf0097/Sentiment-hindi-english',
    featured: true,
  },
  {
    title: 'EditzMedia',
    description: 'EditzMedia is a web application it contains videos and images for editing.',
    tech: ['React', 'Node.js', 'Socket.io', 'Supabase'],
    demo: 'https://github.com/Althaf0097/EditzMedia',
    source: 'https://github.com/Althaf0097/EditzMedia',
    featured: true,
  },
  {
    title: 'Electricity Prediction',
    description: 'Electricity Prediction is a web application that can be used to predict the electricity consumption of a given time. It uses machine learning to determine whether the electricity consumption is high or low.',
    tech: ['Python', 'Streamlit'],
    demo: 'https://github.com/Althaf0097/Electricity_pred',
    source: 'https://github.com/Althaf0097/Electricity_pred',
    featured: true,
  },
  {
    title: 'Hospital Management',
    description: 'Hospital Management is a web application that can be used to manage the operations of a hospital. It contains features like patient registration, doctor appointment booking, and billing.',
    tech: ['Django', 'PostgreSQL'],
    demo: 'https://github.com/Althaf0097/Hospital',
    source: 'https://github.com/Althaf0097/Hospital',
    featured: false,
  },
  {
    title: 'AIMUS',
    description: 'AIMUS is a web application that can be used to listen to music.',
    tech: ['React', 'Node.js', 'machine learning'],
    demo: 'https://github.com/Althaf0097/AIMUS/tree/main/AIMu/client',
    source: 'https://github.com/Althaf0097/AIMUS/tree/main/AIMu/client',
    featured: false,
  },
  {
    title: 'Developer Portfolio',
    description: 'Modern, responsive portfolio template with dark theme and smooth animations.',
    tech: ['React', 'Tailwind CSS', 'Vite'],
    demo: 'https://portfolio-six-wine-p29zgt8x2n.vercel.app/',
    source: 'https://github.com/Althaf0097/portfolio',
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
