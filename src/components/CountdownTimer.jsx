import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { EVENT_CONFIG } from '../config.js';

function getRemaining() {
  if (EVENT_CONFIG.forceCompleted) return { days: 0, hours: 0, minutes: 0, seconds: 0, complete: true };
  const difference = new Date(EVENT_CONFIG.eventStart).getTime() - Date.now();
  if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, complete: true };
  return {
    days: Math.floor(difference / 86400000),
    hours: Math.floor((difference / 3600000) % 24),
    minutes: Math.floor((difference / 60000) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    complete: false,
  };
}

const pad = (value) => String(value).padStart(2, '0');

export default function CountdownTimer() {
  const [remaining, setRemaining] = useState(getRemaining);

  useEffect(() => {
    const interval = window.setInterval(() => setRemaining(getRemaining()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  if (remaining.complete) {
    return (
      <motion.div className="completion-card" initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
        <span className="completion-spark">✦</span>
        <h3>🎊 IGNITE - SUCCESSFULLY COMPLETED! 🎊</h3>
        <p>Thank you for making this event memorable! Hope you had an amazing experience! 💖</p>
      </motion.div>
    );
  }

  const units = [['Days', remaining.days], ['Hours', remaining.hours], ['Minutes', remaining.minutes], ['Seconds', remaining.seconds]];
  return (
    <div className="countdown-wrap">
      <h3 className="countdown-title">🎉 Event Countdown</h3>
      <div className="countdown-grid">
        {units.map(([label, value], index) => <div className="countdown-unit-wrap" key={label}>
          <div className="countdown-unit"><strong>{pad(value)}</strong><span>{label}</span></div>
          {index < units.length - 1 && <span className="countdown-colon">:</span>}
        </div>)}
      </div>
    </div>
  );
}
