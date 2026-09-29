import { createClient } from '@supabase/supabase-js';

const requiredEnv = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'STAFF_CHECKIN_TOKEN'];

function services() {
  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Missing server configuration: ${missing.join(', ')}`);
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function parseQrPayload(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const parsed = JSON.parse(value);
    if (parsed?.event !== 'IGNITE' || typeof parsed.registrationCode !== 'string') return null;
    return { registrationCode: parsed.registrationCode.trim(), foodPreference: parsed.foodPreference };
  } catch {
    const registrationCode = value.trim();
    return registrationCode.startsWith('IGNITE-2026-') ? { registrationCode } : null;
  }
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.STAFF_CHECKIN_TOKEN || request.headers['x-staff-token'] !== process.env.STAFF_CHECKIN_TOKEN) {
    return response.status(401).json({ error: 'Staff check-in authorization is required.' });
  }

  const body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body || {};
  const qr = parseQrPayload(body.qrPayload);
  if (!qr) return response.status(400).json({ error: 'Invalid IGNITE QR code.' });

  try {
    const supabase = services();
    const { data: student, error } = await supabase
      .from('registrations')
      .select('id, name, email, registration_number, food_preference, registration_code, checked_in, checked_in_at, created_at')
      .eq('registration_code', qr.registrationCode)
      .maybeSingle();

    if (error) {
      console.error('Supabase check-in lookup failed', error);
      return response.status(500).json({ error: 'Student lookup failed.' });
    }
    if (!student) return response.status(404).json({ error: 'No registration found for this QR code.' });

    if (body.confirm === true && !student.checked_in) {
      const { data: updated, error: updateError } = await supabase
        .from('registrations')
        .update({ checked_in: true, checked_in_at: new Date().toISOString() })
        .eq('id', student.id)
        .select('id, name, email, registration_number, food_preference, registration_code, checked_in, checked_in_at, created_at')
        .single();
      if (updateError) {
        console.error('Supabase check-in update failed', updateError);
        return response.status(500).json({ error: 'Could not confirm check-in.' });
      }
      return response.status(200).json({ student: updated, message: 'Check-in confirmed.' });
    }

    return response.status(200).json({ student, message: student.checked_in ? 'Already checked in.' : 'Registration found.' });
  } catch (error) {
    console.error('Check-in endpoint failed', error);
    return response.status(500).json({ error: 'Check-in service is not configured yet.' });
  }
}
