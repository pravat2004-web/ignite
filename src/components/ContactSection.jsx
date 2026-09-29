import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SectionShell from './SectionShell.jsx';
import ParticleBackground from './ParticleBackground.jsx';
import { FORM_ENDPOINTS } from '../config.js';

const initialForm = { phone: '', message: '' };

export default function ContactSection() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!status) return undefined;
    const timeout = window.setTimeout(() => setStatus(null), 5000);
    return () => window.clearTimeout(timeout);
  }, [status]);

  const submit = async (event) => {
    event.preventDefault();
    setSending(true);
    setStatus(null);
    try {
      const response = await fetch(FORM_ENDPOINTS.contact, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!response.ok) throw new Error('Contact form request failed');
      setForm(initialForm);
      setStatus({ type: 'success', text: 'Message sent successfully! We will get back to you soon. 💙' });
    } catch {
      setStatus({ type: 'error', text: 'We could not send that just now. Please check the Formspree endpoint or try again.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <SectionShell id="contact" particleCount={50} eyebrow="WE ARE LISTENING" title="Get in Touch 📞" subtitle="Questions, ideas, or just a little post-event glow? We would love to hear from you.">
      <div className="form-layout">
        <motion.form className="event-form glass-panel" onSubmit={submit} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <label htmlFor="contact-phone">Phone Number</label>
          <motion.input id="contact-phone" className="field" type="tel" required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="Your phone number" whileFocus={{ borderColor: '#4de7ff', boxShadow: '0 0 24px rgba(77,231,255,.18)' }} />
          <label htmlFor="contact-message">Subject / Message</label>
          <motion.textarea id="contact-message" className="field field-textarea" required value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Tell us what is on your mind..." whileFocus={{ borderColor: '#4de7ff', boxShadow: '0 0 24px rgba(77,231,255,.18)' }} />
          <button className="btn-primary btn-pill form-submit" type="submit" disabled={sending}>{sending ? 'Sending... ⏳' : 'Send Message ✦'}</button>
          {status && <div className={`form-status ${status.type}`} role="status">{status.text}</div>}
        </motion.form>
        <motion.aside className="quick-response" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <ParticleBackground particleCount={18} particleColor="#c084fc" />
          <div className="quick-response-content"><span>💡</span><h3>Quick Response Guaranteed!</h3><p>Reach out to the MCA team and we will reply within minutes 🤍</p></div>
        </motion.aside>
      </div>
    </SectionShell>
  );
}
