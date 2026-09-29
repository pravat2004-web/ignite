import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SectionShell from './SectionShell.jsx';
import { FORM_ENDPOINTS } from '../config.js';

const emptyForm = { name: '', feedback: '' };

export default function FeedbackSection() {
  const [form, setForm] = useState(emptyForm);
  const [rating, setRating] = useState(5);
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
      const response = await fetch(FORM_ENDPOINTS.feedback, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, rating }) });
      if (!response.ok) throw new Error('Feedback form request failed');
      setForm(emptyForm);
      setRating(5);
      setStatus({ type: 'success', text: 'Thank you for sharing your IGNITE experience! ✨' });
    } catch {
      setStatus({ type: 'error', text: 'Your feedback could not be sent yet. Please check the endpoint or try again.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <SectionShell id="feedback" particleCount={50} eyebrow="YOUR VOICE MATTERS" title="Feedback Corner 💬" subtitle="Tell us what made IGNITE memorable — your words help the next celebration shine brighter.">
      <motion.form className="feedback-form glass-panel" onSubmit={submit} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <label htmlFor="feedback-name">Full Name</label>
        <motion.input id="feedback-name" className="field" type="text" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your name" whileFocus={{ borderColor: '#4de7ff', boxShadow: '0 0 24px rgba(77,231,255,.18)' }} />
        <fieldset className="rating-field"><legend>How would you rate the vibe?</legend><div className="stars" aria-label={`${rating} out of 5 stars`}>{[1, 2, 3, 4, 5].map((star) => <button type="button" key={star} className={star <= rating ? 'star active' : 'star'} onClick={() => setRating(star)} aria-label={`Rate ${star} stars`}>★</button>)}</div></fieldset>
        <label htmlFor="feedback-message">Your Feedback</label>
        <motion.textarea id="feedback-message" className="field field-textarea" required value={form.feedback} onChange={(event) => setForm({ ...form, feedback: event.target.value })} placeholder="Share your experience about the IGNITE freshers event..." whileFocus={{ borderColor: '#4de7ff', boxShadow: '0 0 24px rgba(77,231,255,.18)' }} />
        <button className="btn-primary btn-pill form-submit" type="submit" disabled={sending}>{sending ? 'Sending... ⏳' : 'Share Feedback 💬'}</button>
        {status && <div className={`form-status ${status.type}`} role="status">{status.text}</div>}
      </motion.form>
    </SectionShell>
  );
}
