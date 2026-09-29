import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ParticleBackground from './ParticleBackground.jsx';
import Video from './Video.jsx';
import RegistrationModal from './RegistrationModal.jsx';
import ActivityRegistrationModal from './ActivityRegistrationModal.jsx';
import { EVENT_CONFIG, IGNITE_COPY } from '../config.js';

export default function HeroSection() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [videoOpen, setVideoOpen] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);

  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', resize, { passive: true });
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <section id="home" className="hero-section">
      <ParticleBackground particleCount={100} />
      <div className="hero-scanline" aria-hidden="true" />
      <div className="hero-inner">
        <motion.div className="hero-kicker" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>MCA DEPARTMENT · CUTM</motion.div>
        <motion.h1 className="hero-title" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.7 }}>IGNITE</motion.h1>
        <motion.div className="hero-version" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}>FRESHERS' PARTY</motion.div>
        <motion.p className="hero-tagline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.68 }}>{IGNITE_COPY.tagline}</motion.p>
        <motion.p className="hero-university" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>{EVENT_CONFIG.organizer}</motion.p>
        <motion.div className="hero-actions" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.92 }} style={{ flexDirection: isMobile ? 'column' : 'row' }}>
          <button className="btn-primary btn-pill" onClick={() => setRegistrationOpen(true)}>✨ Registration</button>
          <button className="btn-primary btn-pill btn-purple" onClick={() => setActivityOpen(true)}>🎯 Activity Participation</button>
          <button className="btn-primary btn-pill btn-outline" onClick={() => setVideoOpen(true)}>🎬 Watch the Vibe</button>
        </motion.div>
        <div className="hero-details">
          <span><b>WHEN</b>{EVENT_CONFIG.eventDateLabel} · {EVENT_CONFIG.eventTimeLabel}</span>
          <span><b>WHERE</b>{EVENT_CONFIG.venue}</span>
        </div>
      </div>
      <motion.div className="scroll-indicator" animate={{ y: [0, 9, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }} aria-hidden="true"><span /></motion.div>
      <Video isOpen={videoOpen} onClose={() => setVideoOpen(false)} />
      <RegistrationModal isOpen={registrationOpen} onClose={() => setRegistrationOpen(false)} />
      <ActivityRegistrationModal isOpen={activityOpen} onClose={() => setActivityOpen(false)} />
    </section>
  );
}
