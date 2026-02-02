import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Scene3DFullPage from './components/3d/Scene3DFullPage';
import { initProtection } from './utils/protection';
import { initSecurity } from './utils/security';

function App() {
  useEffect(() => {
    // Initialize content protection (copy/screenshot prevention)
    initProtection();
    
    // Initialize security measures (XSS prevention, clickjacking)
    initSecurity();
  }, []);

  return (
    <div className="min-h-screen bg-dark-900 relative">
      {/* Full-page 3D Background */}
      <Scene3DFullPage />
      
      {/* Content layer */}
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
