import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

function getSavedToken() {
  try { return sessionStorage.getItem('ignite-staff-token') || ''; } catch { return ''; }
}

export default function StaffCheckinPage() {
  const [token, setToken] = useState(getSavedToken);
  const [qrPayload, setQrPayload] = useState('');
  const [student, setStudent] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => () => {
    if (scannerRef.current) scannerRef.current.stop().catch(() => {}).finally(() => scannerRef.current?.clear().catch(() => {}));
  }, []);

  const saveToken = (value) => {
    setToken(value);
    try { sessionStorage.setItem('ignite-staff-token', value); } catch { /* storage may be unavailable */ }
  };

  const lookup = async (payload = qrPayload, confirm = false) => {
    if (!token.trim()) return setStatus({ type: 'error', text: 'Enter the staff check-in token first.' });
    if (!payload.trim()) return setStatus({ type: 'error', text: 'Scan or paste an IGNITE QR payload first.' });
    setLoading(true);
    setStatus(null);
    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-staff-token': token.trim() },
        body: JSON.stringify({ qrPayload: payload, confirm }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Check-in lookup failed.');
      setStudent(result.student);
      setStatus({ type: 'success', text: result.message });
    } catch (error) {
      setStudent(null);
      setStatus({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    if (cameraOn) return;
    setStatus(null);
    const scanner = new Html5Qrcode('qr-reader');
    scannerRef.current = scanner;
    try {
      await scanner.start({ facingMode: 'environment' }, { fps: 10, qrbox: { width: 250, height: 250 } }, (decodedText) => {
        setQrPayload(decodedText);
        scanner.stop().catch(() => {});
        setCameraOn(false);
        lookup(decodedText);
      }, () => {});
      setCameraOn(true);
    } catch {
      scanner.clear().catch(() => {});
      scannerRef.current = null;
      setStatus({ type: 'error', text: 'Camera access failed. Use manual QR payload entry instead.' });
    }
  };

  const stopCamera = () => {
    if (!scannerRef.current) return;
    scannerRef.current.stop().catch(() => {}).finally(() => {
      scannerRef.current?.clear().catch(() => {});
      scannerRef.current = null;
      setCameraOn(false);
    });
  };

  return (
    <main className="staff-page">
      <div className="staff-shell">
        <a className="staff-back" href="/">← Back to IGNITE portal</a>
        <span className="eyebrow">STAFF CHECK-IN</span>
        <h1>IGNITE Check-in Dashboard</h1>
        <p className="staff-subtitle">Scan a student QR code to view registration details and food preference before confirming entry.</p>
        <section className="staff-grid">
          <div className="staff-card glass-panel">
            <label htmlFor="staff-token">Staff check-in token</label>
            <input id="staff-token" className="field" type="password" value={token} onChange={(event) => saveToken(event.target.value)} placeholder="Enter STAFF_CHECKIN_TOKEN" autoComplete="off" />
            <div className="scanner-frame" id="qr-reader" />
            <div className="staff-actions">
              {!cameraOn ? <button className="btn-primary btn-pill" type="button" onClick={startCamera}>Open Camera Scanner</button> : <button className="btn-primary btn-pill btn-outline" type="button" onClick={stopCamera}>Stop Camera</button>}
            </div>
            <div className="manual-qr">
              <label htmlFor="qr-payload">Manual fallback</label>
              <textarea id="qr-payload" className="field field-textarea" value={qrPayload} onChange={(event) => setQrPayload(event.target.value)} placeholder='Paste the scanned QR text, e.g. {"event":"IGNITE",...}' />
              <button className="btn-primary btn-pill" type="button" disabled={loading} onClick={() => lookup()}>{loading ? 'Looking up... ⏳' : 'Look Up Registration'}</button>
            </div>
            {status && <div className={`form-status ${status.type}`} role="status">{status.text}</div>}
          </div>
          <div className="staff-card glass-panel staff-result-card">
            <span className="eyebrow">STUDENT DETAILS</span>
            {!student ? <div className="staff-empty"><span>▣</span><p>Scan a valid IGNITE QR code to display the student record.</p></div> : <>
              <div className="student-identity"><div className="student-avatar">{student.name.slice(0, 1).toUpperCase()}</div><div><h2>{student.name}</h2><p>{student.registration_code}</p></div></div>
              <dl className="student-details"><div><dt>Registration number</dt><dd>{student.registration_number}</dd></div><div><dt>Email</dt><dd>{student.email}</dd></div><div><dt>Food preference</dt><dd><span className={`food-badge ${student.food_preference === 'Veg' ? 'veg' : 'nonveg'}`}>{student.food_preference}</span></dd></div><div><dt>Check-in status</dt><dd>{student.checked_in ? `Checked in${student.checked_in_at ? ` · ${new Date(student.checked_in_at).toLocaleTimeString()}` : ''}` : 'Not checked in'}</dd></div></dl>
              {!student.checked_in && <button className="btn-primary btn-pill checkin-confirm" type="button" disabled={loading} onClick={() => lookup(qrPayload, true)}>{loading ? 'Confirming... ⏳' : 'Confirm Check-in'}</button>}
            </>}
          </div>
        </section>
      </div>
    </main>
  );
}
