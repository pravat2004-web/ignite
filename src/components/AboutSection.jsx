import { motion } from 'framer-motion';
import SectionShell from './SectionShell.jsx';

const cards = [
  {
    icon: '👔',
    title: 'Dress Code',
    items: [
      ['✅', 'Boys: casual or semi-formal — jeans, shirts, trousers.'],
      ['❌', 'Not allowed: kurta, pyjama, dhoti.'],
      ['✅', 'Girls: casual or semi-formal — formal dresses, suits.'],
      ['❌', 'Not allowed: saree, sleeveless, revealing dresses.'],
    ],
  },
  {
    icon: '📋',
    title: 'Rules & Guidelines',
    items: [
      ['✅', 'Offensive behavior is prohibited.'],
      ['✅', 'Misconduct will be taken seriously.'],
      ['✅', 'Misconduct towards organizers or staff leads to strict action.'],
      ['✅', 'Registration is valid only through university email.'],
      ['✅', 'University ID is mandatory; contact organizers if you do not have one.'],
      ['✅', 'Follow instructions and enjoy responsibly.'],
    ],
  },
];

export default function AboutSection() {
  return (
    <SectionShell id="about" particleCount={60} eyebrow="THE IGNITE STORY" title="Welcome Freshers! 🎉" subtitle="A new chapter deserves a little electricity.">
      <div className="about-message glass-panel">
        <h3>⚡ Freshers, It's Time to Power Up! ⚡</h3>
        <p>Welcome to IGNITE — your first celebration as part of the MCA family. This is the beginning of a brilliant adventure filled with new challenges, new ideas, and new friends.</p>
        <p>For one unforgettable day, step away from the code, turn up the music, and let the dance floor do the debugging. The best memories are the ones you make together.</p>
        <p>Come with your energy, your curiosity, and your biggest smile. Forget the code for a day — the next chapter of your MCA journey starts here.</p>
      </div>
      <div className="info-card-grid">
        {cards.map((card, cardIndex) => <motion.article className="info-card glass-panel" key={card.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.16 }} transition={{ delay: cardIndex * 0.12, duration: 0.55 }} whileHover={{ y: -8, scale: 1.015 }}>
          <div className="card-icon">{card.icon}</div>
          <h3>{card.title}</h3>
          <ul>{card.items.map(([icon, text]) => <li key={text} className={icon === '❌' ? 'not-allowed' : 'allowed'}><span>{icon}</span>{text}</li>)}</ul>
        </motion.article>)}
      </div>
    </SectionShell>
  );
}
