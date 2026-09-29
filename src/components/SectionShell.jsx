import { motion } from 'framer-motion';
import ParticleBackground from './ParticleBackground.jsx';

export default function SectionShell({ id, particleCount, eyebrow, title, subtitle, children, className = '' }) {
  return (
    <section id={id} className={`section-shell ${className}`}>
      <ParticleBackground particleCount={particleCount} />
      <div className="section-inner">
        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65 }}
        >
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </motion.div>
        {children}
      </div>
    </section>
  );
}
