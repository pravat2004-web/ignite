import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NAV_ITEMS } from '../config.js';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoSrc] = useState('/ignite-mark.svg');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMenuOpen(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const navigate = (item) => {
    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMenuOpen(false);
  };

  return (
    <>
      <motion.nav className={`site-nav ${scrolled ? 'site-nav-scrolled' : ''}`} initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
        <button className="brand-lockup" onClick={() => navigate({ id: 'home' })} aria-label="Go to IGNITE home">
          <img src={logoSrc} alt="IGNITE logo" />
          <span>Welcome</span>
        </button>
        {!isMobile && (
          <div className="nav-links">
            {NAV_ITEMS.map((item, index) => <motion.button key={item.id} onClick={() => navigate(item)} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + index * 0.05 }} whileHover={{ y: -3, color: '#4de7ff' }}>{item.label}{item.comingSoon && <sup>soon</sup>}</motion.button>)}
          </div>
        )}
        {isMobile && <button className="menu-toggle" onClick={() => setMenuOpen(true)} aria-label="Open navigation menu"><span /><span /><span /></button>}
      </motion.nav>

      <AnimatePresence>
        {isMobile && menuOpen && (
          <motion.div className="mobile-menu" initial={{ y: '-100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }} transition={{ type: 'spring', stiffness: 240, damping: 28 }}>
            <button className="menu-close" onClick={() => setMenuOpen(false)} aria-label="Close navigation menu">×</button>
            <div className="mobile-menu-links">
              {NAV_ITEMS.map((item, index) => <motion.button key={item.id} onClick={() => navigate(item)} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 + index * 0.08 }}>{item.label}{item.comingSoon && <span>soon</span>}</motion.button>)}
            </div>
            <p className="mobile-menu-note">IGNITE · FRESHERS' PARTY</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
