import { useState } from 'react';
import { motion } from 'framer-motion';
import SectionShell from './SectionShell.jsx';
import { IGNITE_COPY } from '../config.js';

const INVITATION_ASSET = '/ignite-invitation.png';

export default function InvitationSection() {
  const [imageFailed, setImageFailed] = useState(false);

  const downloadInvitation = () => {
    if (imageFailed) {
      window.alert('The invitation image is not available yet. Please add /ignite-invitation.png to the public folder.');
      return;
    }
    const anchor = document.createElement('a');
    anchor.href = INVITATION_ASSET;
    anchor.download = 'IGNITE_Invitation.png';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  return (
    <SectionShell id="invitation" particleCount={60} eyebrow="A NOTE FROM THE TEAM" title="Official Invitation" subtitle={IGNITE_COPY.invitationSubtitle}>
      <div className="invitation-layout">
        <motion.button className="invitation-preview" onClick={() => !imageFailed && window.open(INVITATION_ASSET, '_blank', 'noopener,noreferrer')} initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} aria-label="Open invitation image in a new tab">
          {!imageFailed ? <img src={INVITATION_ASSET} alt="IGNITE official invitation" onError={() => setImageFailed(true)} /> : <div className="asset-fallback"><span>🖼️</span><p>Invitation artwork<br />coming with the media drop</p></div>}
          <span className="preview-overlay">👁️ Click to View</span>
        </motion.button>
        <div className="invitation-copy">
          <p>Keep this invitation close — it holds the energy of a day built for new beginnings, shared laughter, and the first memories of your MCA journey.</p>
          <button className="btn-primary btn-pill btn-green-purple" onClick={downloadInvitation}>💾 Download Image</button>
          <span className="save-date">{IGNITE_COPY.invitationNote}</span>
        </div>
      </div>
    </SectionShell>
  );
}
