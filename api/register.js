import { randomBytes } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import QRCode from 'qrcode';
import { Resend } from 'resend';

const requiredEnv = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'RESEND_API_KEY', 'RESEND_FROM_EMAIL'];

function getServices() {
  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Missing server configuration: ${missing.join(', ')}`);
  return {
    supabase: createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    }),
    resend: new Resend(process.env.RESEND_API_KEY),
  };
}

function makeRegistrationCode() {
  return `IGNITE-2026-${randomBytes(5).toString('hex').toUpperCase()}`;
}

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body || {};
  const name = clean(body.name);
  const email = clean(body.email).toLowerCase();
  const registrationNumber = clean(body.registrationNumber);
  const foodPreference = clean(body.foodPreference);

  if (!name || !email || !registrationNumber || !['Veg', 'Non-Veg'].includes(foodPreference)) {
    return response.status(400).json({ error: 'Full name, email, registration number, and food preference are required.' });
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return response.status(400).json({ error: 'Please provide a valid email address.' });
  }

  try {
    const { supabase, resend } = getServices();
    let registration;
    let insertError;

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const registrationCode = makeRegistrationCode();
      const result = await supabase
        .from('registrations')
        .insert({ name, email, registration_number: registrationNumber, food_preference: foodPreference, registration_code: registrationCode })
        .select('id, registration_code')
        .single();
      registration = result.data;
      insertError = result.error;
      if (!insertError || insertError.code !== '23505') break;
    }

    if (insertError) {
      if (insertError.code === '23505' && insertError.message?.includes('registration_number')) {
        return response.status(409).json({ error: 'That registration number is already registered.' });
      }
      console.error('Supabase registration insert failed', insertError);
      return response.status(500).json({ error: 'Registration could not be saved.' });
    }

    const qrPayload = JSON.stringify({
      event: 'IGNITE',
      registrationCode: registration.registration_code,
      foodPreference,
    });
    const qrDataUrl = await QRCode.toDataURL(qrPayload, { errorCorrectionLevel: 'M', margin: 2, width: 640 });
    const qrBase64 = qrDataUrl.replace(/^data:image\/png;base64,/, '');

    const emailResult = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: [email],
      subject: 'Your IGNITE registration QR code',
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033;max-width:620px;margin:auto;padding:24px">
          <h1 style="color:#3958d8">Registration confirmed for IGNITE</h1>
          <p>Hello ${name.replace(/[<>]/g, '')},</p>
          <p>Your IGNITE registration has been received. Keep the attached QR code ready for event check-in.</p>
          <p><strong>Registration ID:</strong> ${registration.registration_code}</p>
          <p><strong>Food preference:</strong> ${foodPreference}</p>
          <p><strong>Event:</strong> 9 October 2026, Gym Area, CUTM Campus</p>
          <p style="margin:24px 0 8px"><strong>Your check-in QR code</strong></p>
          <img src="cid:ignite-qr" alt="IGNITE check-in QR code" width="260" height="260" style="display:block;width:260px;height:260px;border:10px solid #fff;border-radius:12px" />
          <p style="font-size:13px;color:#5f6b7a">The same QR code is attached as a PNG file. Use your email app's attachment download control to save it.</p>
          <a href="${process.env.PUBLIC_SITE_URL || '/'}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#3958d8;color:#fff;text-decoration:none;font-weight:700">Open IGNITE Portal</a>
          <p>See you at IGNITE!</p>
        </div>
      `,
      attachments: [{ filename: `${registration.registration_code}.png`, content: qrBase64, contentId: 'ignite-qr' }],
    });

    if (emailResult.error) {
      await supabase.from('registrations').update({ email_status: 'failed' }).eq('id', registration.id);
      console.error('Resend email failed', emailResult.error);
      return response.status(502).json({ error: 'Registration was saved, but the QR email could not be sent. Please contact the event team.' });
    }

    await supabase.from('registrations').update({ email_status: 'sent', email_message_id: emailResult.data?.id || null }).eq('id', registration.id);
    return response.status(201).json({
      message: 'Registration successful. Your QR code has been sent by email.',
      registrationCode: registration.registration_code,
      qrCodeDataUrl: qrDataUrl,
    });
  } catch (error) {
    console.error('Registration endpoint failed', error);
    return response.status(500).json({ error: 'Registration service is not configured yet.' });
  }
}
