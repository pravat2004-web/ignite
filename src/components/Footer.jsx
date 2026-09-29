import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { EVENT_CONFIG } from '../config.js';

export default function Footer() {
  const dots = useMemo(() => Array.from({ length: 10 }, (_, index) => ({ id: index, left: `${8 + Math.random() * 84}%`, top: `${18 + Math.random() * 64}%`, delay: `${Math.random() * 4}s`, duration: `${2.2 + Math.random() * 2}s` })), []);
  return (
    <footer className="site-footer">
      <div className="footer-dots" aria-hidden="true">{dots.map((dot) => <motion.span key={dot.id} style={{ left: dot.left, top: dot.top }} animate={{ opacity: [0.18, 0.95, 0.18], scale: [0.8, 1.2, 0.8] }} transition={{ duration: Number(dot.duration.replace('s', '')), delay: Number(dot.delay.replace('s', '')), repeat: Infinity }} />)}</div>
      <div className="footer-inner"><div className="footer-mark">IGNITE <span>✦</span> FRESHERS' PARTY</div><p>{EVENT_CONFIG.footer}</p><small>Made with gratitude by the MCA family of CUTM.</small></div>
    </footer>
  );
}
