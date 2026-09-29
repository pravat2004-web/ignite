import { motion } from 'framer-motion';
import SectionShell from './SectionShell.jsx';

export default function MemoriesSection() {
  return (
    <SectionShell id="memories" particleCount={40} eyebrow="THE NEXT CHAPTER" title="Memories Coming Soon" subtitle="🔥 IGNITE is coming soon! Get ready for an unforgettable fresher experience! 🎉">
      <motion.div className="memories-card glass-panel" initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
        <div className="memories-orbit"><span>📸</span><span>🎥</span><span>💫</span></div>
        <h3>🔥 IGNITE is coming soon!</h3>
        <p>We are collecting the smiles, dance-floor moments, and behind-the-scenes magic from the event. Check back soon for a gallery worth replaying.</p>
        <div className="memories-line"><span /><span /><span /></div>
      </motion.div>
    </SectionShell>
  );
}
