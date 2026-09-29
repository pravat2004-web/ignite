import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FORM_ENDPOINTS } from '../config.js';

const ACTIVITIES = ['Group Dance', 'Solo Dance', 'Singing / Song', 'Poetry / Shayari', 'Stand-up Comedy', 'Mimicry', 'Drama / Skit', 'Fashion Walk', 'Anything Else / Other'];
const emptyForm = { name: '', registrationNumber: '', email: '', activities: [], otherActivity: '', participationType: '', groupMembers: '' };

export default function ActivityRegistrationModal({ isOpen, onClose }) {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !sending) onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose, sending]);

  const update = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const toggleActivity = (event) => {
    const { value, checked } = event.target;
    setForm((previous) => ({
      ...previous,
      activities: checked ? [...previous.activities, value] : previous.activities.filter((activity) => activity !== value),
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setStatus(null);
    if (!form.activities.length) return setStatus({ type: 'error', text: 'Please select at least one activity.' });
    if (!form.participationType) return setStatus({ type: 'error', text: 'Please select Solo or Group.' });
    if (form.activities.includes('Anything Else / Other') && !form.otherActivity.trim()) return setStatus({ type: 'error', text: 'Please specify your other activity.' });
    if (form.participationType === 'Group' && Number(form.groupMembers) < 2) return setStatus({ type: 'error', text: 'Please enter at least 2 group members.' });

    setSending(true);
    try {
      const data = new FormData();
      data.append('name', form.name);
      data.append('registrationNumber', form.registrationNumber);
      data.append('email', form.email);
      form.activities.forEach((activity) => data.append('activities', activity));
      data.append('otherActivity', form.otherActivity);
      data.append('participationType', form.participationType);
      data.append('groupMembers', form.groupMembers);
      data.append('_subject', 'IGNITE Activity Registration');
      const response = await fetch(FORM_ENDPOINTS.activityParticipation, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Activity registration failed');
      setForm(emptyForm);
      setStatus({ type: 'success', text: 'Activity registration submitted successfully! 🎉' });
    } catch {
      setStatus({ type: 'error', text: 'Unable to submit right now. Please check your connection and try again.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="registration-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={(event) => { if (event.target === event.currentTarget && !sending) onClose(); }}>
          <motion.div className="registration-modal glass-panel activity-modal" role="dialog" aria-modal="true" aria-labelledby="activity-registration-title" initial={{ opacity: 0, scale: 0.92, y: 22 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 14 }}>
            <button className="modal-close" type="button" onClick={onClose} disabled={sending} aria-label="Close activity registration form">×</button>
            <span className="eyebrow">IGNITE ACTIVITY REGISTRATION</span>
            <h2 id="activity-registration-title">Showcase Your Talent 🎭</h2>
            <p className="registration-intro">Participate in the IGNITE Freshers Party and share your talent with the MCA family.</p>
            <form className="registration-form" onSubmit={submit}>
              <label htmlFor="activity-name">Full Name</label>
              <input id="activity-name" className="field" type="text" name="name" value={form.name} onChange={update} placeholder="Enter your full name" required />
              <label htmlFor="activity-registration-number">Registration Number</label>
              <input id="activity-registration-number" className="field" type="text" name="registrationNumber" value={form.registrationNumber} onChange={update} placeholder="Enter registration number" required />
              <label htmlFor="activity-email">Email</label>
              <input id="activity-email" className="field" type="email" name="email" value={form.email} onChange={update} placeholder="Enter your email" required />
              <fieldset className="activity-fieldset">
                <legend>Choose your activity</legend>
                <div className="activity-options">
                  {ACTIVITIES.map((activity) => <label className="checkbox-option" key={activity}><input type="checkbox" value={activity} checked={form.activities.includes(activity)} onChange={toggleActivity} /> {activity}</label>)}
                </div>
              </fieldset>
              {form.activities.includes('Anything Else / Other') && <><label htmlFor="other-activity">Tell us your activity</label><input id="other-activity" className="field" type="text" name="otherActivity" value={form.otherActivity} onChange={update} placeholder="Describe your activity" required /></>}
              <fieldset className="activity-fieldset">
                <legend>Participation Type</legend>
                <label className="radio-option"><input type="radio" name="participationType" value="Solo" checked={form.participationType === 'Solo'} onChange={update} required /> Solo</label>
                <label className="radio-option"><input type="radio" name="participationType" value="Group" checked={form.participationType === 'Group'} onChange={update} /> Group</label>
              </fieldset>
              {form.participationType === 'Group' && <><label htmlFor="group-members">Number of Group Members</label><input id="group-members" className="field" type="number" name="groupMembers" min="2" value={form.groupMembers} onChange={update} placeholder="At least 2" required /></>}
              <button className="btn-primary btn-pill form-submit" type="submit" disabled={sending}>{sending ? 'Submitting... ⏳' : 'Submit Activity Registration'}</button>
              {status && <div className={`form-status ${status.type}`} role="status">{status.text}</div>}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
