import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const emptyForm = {
  name: '',
  email: '',
  registrationNumber: '',
  foodPreference: '',
};

export default function RegistrationModal({ isOpen, onClose }) {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);
  const [qrResult, setQrResult] = useState(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !sending) onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose, sending]);

  const submit = async (event) => {
    event.preventDefault();
    setSending(true);
    setStatus(null);
    setQrResult(null);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Registration request failed');
      setForm(emptyForm);
      setQrResult({ code: result.registrationCode, dataUrl: result.qrCodeDataUrl });
      setStatus({ type: 'success', text: result.message || 'Registration successful. Your QR code has been sent by email.' });
    } catch (error) {
      setStatus({ type: 'error', text: error.message || 'Registration could not be submitted. Please check your details and try again.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="registration-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(event) => { if (event.target === event.currentTarget && !sending) onClose(); }}
        >
          <motion.div
            className="registration-modal glass-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="registration-title"
            initial={{ opacity: 0, scale: 0.92, y: 22 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 14 }}
          >
            <button className="modal-close" type="button" onClick={onClose} disabled={sending} aria-label="Close registration form">×</button>
            <span className="eyebrow">IGNITE REGISTRATION</span>
            <h2 id="registration-title">Register Now</h2>
            <p className="registration-intro">Reserve your place for the IGNITE freshers celebration on 9 October.</p>
            <form action="/api/register" method="POST" className="registration-form" onSubmit={submit}>
              <label htmlFor="registration-name">Full Name</label>
              <input id="registration-name" className="field" type="text" name="name" placeholder="Enter your full name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />

              <label htmlFor="registration-email">Email</label>
              <input id="registration-email" className="field" type="email" name="email" placeholder="Enter your email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />

              <label htmlFor="registration-number">Registration Number</label>
              <input id="registration-number" className="field" type="text" name="registrationNumber" placeholder="Enter registration number" required value={form.registrationNumber} onChange={(event) => setForm({ ...form, registrationNumber: event.target.value })} />

              <fieldset className="food-preference-field">
                <legend>Food Preference</legend>
                <label className="radio-option"><input type="radio" name="foodPreference" value="Veg" required checked={form.foodPreference === 'Veg'} onChange={(event) => setForm({ ...form, foodPreference: event.target.value })} /> Veg</label>
                <label className="radio-option"><input type="radio" name="foodPreference" value="Non-Veg" checked={form.foodPreference === 'Non-Veg'} onChange={(event) => setForm({ ...form, foodPreference: event.target.value })} /> Non-Veg</label>
              </fieldset>

              <button className="btn-primary btn-pill form-submit" type="submit" disabled={sending}>{sending ? 'Submitting... ⏳' : 'Register Now'}</button>
              {status && <div className={`form-status ${status.type}`} role="status">{status.text}</div>}
              {qrResult?.dataUrl && <div className="qr-result" role="region" aria-label="Your registration QR code">
                <h3>Your IGNITE QR Code</h3>
                <img src={qrResult.dataUrl} alt={`QR code for registration ${qrResult.code}`} />
                <p>Keep this QR code ready for event check-in.</p>
                <a className="btn-primary btn-pill qr-download" href={qrResult.dataUrl} download={`${qrResult.code}.png`}>⬇️ Download QR Code</a>
              </div>}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
