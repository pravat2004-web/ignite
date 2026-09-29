import { motion } from 'framer-motion';
import SectionShell from './SectionShell.jsx';
import CountdownTimer from './CountdownTimer.jsx';
import { EVENT_CONFIG } from '../config.js';

export default function EventSection() {
  return (
    <SectionShell id="event" particleCount={70} eyebrow="MARK THE MOMENT" title="Event Info" subtitle="Mark your calendars and get excited for IGNITE!">
      <CountdownTimer />
      <div className="event-card-grid">
        <motion.article className="event-card glass-panel" animate={{ y: [0, -5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
          <span className="event-card-icon">🎉</span>
          <h3>Poster Release Is Coming Up!</h3>
          <strong className="released-date">📅 Releases on {EVENT_CONFIG.posterReleaseDate}</strong>
          <p>✨ Get ready for the IGNITE poster reveal!</p>
          <p>🚀 The main event follows on {EVENT_CONFIG.eventDateLabel}.</p>
        </motion.article>
        <motion.article className="event-card glass-panel" animate={{ y: [0, 5, 0] }} transition={{ duration: 5.7, repeat: Infinity, ease: 'easeInOut' }}>
          <span className="event-card-icon">🎉</span>
          <h3>IGNITE Main Event Coming Up!</h3>
          <p><b>📅</b> {EVENT_CONFIG.eventDateLabel} · {EVENT_CONFIG.eventTimeLabel}</p>
          <p><b>⏳</b> Event is coming up — get ready!</p>
          <p><b>📍</b> {EVENT_CONFIG.venue}</p>
          <strong className="heart-thanks">See you all at IGNITE ❤️</strong>
          <p>🎉 We cannot wait to celebrate with you!</p>
        </motion.article>
      </div>
    </SectionShell>
  );
}
