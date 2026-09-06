import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";

export const Landing: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'solution', label: 'Solution' },
    { id: 'features', label: 'Features' },
    { id: 'about', label: 'About' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'solution', 'features', 'about'];
      let current = 'home';
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the section top is above 200px from viewport top, it's the current one
          if (rect.top <= 200) {
            current = section;
          }
        }
      }
      
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#f8fafc', color: '#0f172a' }}>
      
      {/* Navbar - Fixed at top */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 5%',
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Logo size={42} />
        </div>
        
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
          {navLinks.map(link => (
            <a 
              key={link.id}
              href={`#${link.id}`} 
              onClick={() => setActiveSection(link.id)}
              style={{ 
                color: activeSection === link.id ? '#f97316' : '#e2e8f0', 
                textDecoration: 'none', 
                fontSize: '0.95rem', 
                fontWeight: activeSection === link.id ? 700 : 500, 
                letterSpacing: '0.02em', 
                transition: 'all 0.2s'
              }}
            >
              {link.label}
            </a>
          ))}
          
          <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.2)' }}></div>
          
          <Link to="/login" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600 }}>Login</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#0f172a',
        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.85)), url("/images/bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        padding: '80px 5% 0',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 20px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(249, 115, 22, 0.1)',
            border: '1px solid rgba(249, 115, 22, 0.2)',
            color: '#f97316',
            fontSize: '1.1rem',
            fontWeight: 700,
            letterSpacing: '0.02em',
            marginBottom: '1.5rem'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f97316' }}></span>
            RailPravah
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            color: '#ffffff',
            fontFamily: 'Outfit, Inter, sans-serif',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            marginBottom: '1.5rem',
            maxWidth: '800px'
          }}>
            Unifying Railway <br />
            <span style={{ color: '#38bdf8' }}>Maintenance Planning</span>
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: '#cbd5e1',
            lineHeight: 1.6,
            marginBottom: '3rem',
            maxWidth: '600px',
            fontWeight: 400
          }}>
            Coordinate maintenance blocks across Engineering, Traction Distribution, and Signal & Telecommunication with intelligent, conflict-free planning. 
            <br /><br />
            <strong style={{ color: '#ffffff', fontStyle: 'italic', fontWeight: 600 }}>Plan Smart, Run Smooth.</strong>
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/login" style={{
              padding: '16px 36px',
              backgroundColor: '#f97316',
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '1.05rem',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 14px rgba(249, 115, 22, 0.3)'
            }}>
              Get Started
            </Link>
            <a href="#solution" style={{
              padding: '16px 36px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.2)',
              fontWeight: 600,
              fontSize: '1.05rem',
              transition: 'background-color 0.2s ease'
            }}>
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" style={{ 
        padding: '100px 5%', 
        backgroundColor: '#0f172a',
        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.9)), url("/images/bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.5rem' }}>The Integrated Solution</h2>
          <p style={{ fontSize: '1.1rem', color: '#cbd5e1', maxWidth: '800px', margin: '0 auto 4rem', lineHeight: 1.6 }}>
            RailPravah revolutionizes railway maintenance by bringing all departments onto a single, unified platform. 
            Say goodbye to isolated planning and scheduling conflicts.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {['Engineering', 'Traction Distribution (TRD)', 'Signal & Telecom (S&T)'].map((dept, idx) => (
              <div key={idx} style={{ padding: '2.5rem', backgroundColor: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(249, 115, 22, 0.15)', color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', border: '1px solid rgba(249, 115, 22, 0.2)' }}>
                  {idx + 1}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff', marginBottom: '1rem' }}>{dept}</h3>
                <p style={{ color: '#cbd5e1', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  Seamlessly request and schedule blocks for {dept.toLowerCase()} maintenance tasks, ensuring complete visibility across all other departments on the corridor.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ 
        padding: '100px 5%', 
        backgroundColor: '#0f172a',
        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.9)), url("/images/bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#ffffff', marginBottom: '3rem', textAlign: 'center' }}>Platform Features</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            {/* Feature 1 */}
            <div style={{ display: 'flex', gap: '4rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 400px' }}>
                <div style={{ color: '#f97316', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.85rem' }}>AI-Powered</div>
                <h3 style={{ fontSize: '2rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>Conflict Resolution</h3>
                <p style={{ color: '#cbd5e1', lineHeight: 1.6, fontSize: '1.1rem' }}>
                  Our intelligent engine automatically detects overlaps and scheduling conflicts between departments, suggesting optimized maintenance windows to ensure zero operational friction.
                </p>
              </div>
              <div style={{ flex: '1 1 400px', height: '300px', backgroundColor: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(10px)', borderRadius: '24px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#64748b', fontStyle: 'italic' }}>Dashboard UI Mockup</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div style={{ display: 'flex', gap: '4rem', alignItems: 'center', flexWrap: 'wrap', flexDirection: 'row-reverse' }}>
              <div style={{ flex: '1 1 400px' }}>
                <div style={{ color: '#f97316', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.85rem' }}>Efficiency</div>
                <h3 style={{ fontSize: '2rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>Co-located Blocks</h3>
                <p style={{ color: '#cbd5e1', lineHeight: 1.6, fontSize: '1.1rem' }}>
                  Maximize track utilization by safely grouping compatible maintenance tasks from different departments into a single unified time block, drastically reducing overall downtime.
                </p>
              </div>
              <div style={{ flex: '1 1 400px', height: '300px', backgroundColor: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(10px)', borderRadius: '24px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#64748b', fontStyle: 'italic' }}>Scheduling UI Mockup</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About / CTA Section */}
      <section id="about" style={{ 
        padding: '100px 5%', 
        backgroundColor: '#0f172a',
        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.9)), url("/images/bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: '#ffffff', 
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Logo size={64} className="mx-auto mb-8" />
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem', marginTop: '2rem' }}>Ready to Modernize Operations?</h2>
          <p style={{ fontSize: '1.1rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '3rem' }}>
            RailPravah is an initiative under the Ministry of Railways, Government of India, designed to bring enterprise-grade AI and coordination to railway maintenance operations nationwide.
          </p>
          <Link to="/login" style={{
            display: 'inline-block',
            padding: '16px 40px',
            backgroundColor: '#f97316',
            color: '#ffffff',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '1.1rem',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 14px rgba(249, 115, 22, 0.3)'
          }}>
            Access Portal
          </Link>
        </div>
      </section>

      {/* Footer Text */}
      <footer style={{
        padding: '2rem 5%',
        backgroundColor: '#020617',
        color: '#64748b',
        fontSize: '0.85rem',
        fontWeight: 500,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <span>© 2026 RailPravah</span>
        <span>Ministry of Railways, Government of India</span>
      </footer>
    </div>
  );
};

export default Landing;
