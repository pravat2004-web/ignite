<<<<<<< HEAD
# IGNITE Freshers Event

A responsive single-page React/Vite event site for the upcoming IGNITE freshers celebration hosted by the Master of Computer Applications Department at Centurion University of Technology and Management. The poster releases on 5 October 2026 and the main event is on 9 October 2026.

## Registration architecture

Registration follows this serverless flow:

```text
React IGNITE site → Vercel Function /api/register → Supabase registrations table
                                           └──────→ QR generation → Resend student email
```

The Vercel function creates a unique `IGNITE-2026-XXXXXXXXXX` registration code, saves the student record in Supabase, generates a QR code containing the registration code and selected food preference for immediate staff scanning, and emails the QR image to the student through Resend. After a successful submission, the registration modal also displays the QR code and provides an immediate download button. Supabase and Resend secrets are server-only and are never exposed to the browser.

## Staff check-in dashboard

Open `/staff-checkin` after deployment. Staff enter the server-only `STAFF_CHECKIN_TOKEN`, open the camera scanner, and scan the student QR code. The dashboard calls `/api/checkin` and displays the student name, registration number, email, food preference, and check-in state. Staff can then confirm check-in; the record is marked with `checked_in` and `checked_in_at` in Supabase. A manual QR payload field is available when camera access is unavailable.

The dashboard is token-protected at the serverless endpoint. Do not put the Supabase service-role key in frontend code, and use a long random value for `STAFF_CHECKIN_TOKEN` in Vercel.

## Services and setup

1. Create a Supabase project.
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL Editor. The schema is safe to rerun and adds the check-in columns to an existing table.
3. Create a Resend account and verify the sending domain used by `RESEND_FROM_EMAIL`.
4. Copy `.env.example` to `.env.local` for local Vercel testing, or add the same variables in the Vercel project settings:

   ```text
   SUPABASE_URL
   SUPABASE_SERVICE_ROLE_KEY
   RESEND_API_KEY
   RESEND_FROM_EMAIL
   PUBLIC_SITE_URL
   STAFF_CHECKIN_TOKEN
   ```

5. Deploy the project to Vercel. The API endpoints will be available at `/api/register` and `/api/checkin`; the staff dashboard will be available at `/staff-checkin`.

Never commit `.env.local`, the Supabase service-role key, or the Resend API key. The service-role key bypasses Supabase Row Level Security and must only be used inside the serverless functions.

The current managed Preview can build and display the frontend, but automatic QR email delivery and staff lookup require deployment of the serverless functions with the secrets configured.

## Resend email template

The registration function uses a responsive inline HTML template rather than relying on a dashboard template. It sends the QR as both an attachment and a CID inline image:

- The HTML uses `<img src="cid:ignite-qr">`.
- The Resend attachment uses `contentId: 'ignite-qr'` and a `.png` filename.
- The email keeps the PNG attachment so inboxes expose their native download control.
- The styled **Open IGNITE Portal** button uses `PUBLIC_SITE_URL` as a reliable fallback link.

Resend supports CID inline images by matching the HTML `cid:` value to the attachment `contentId`. This is more reliable than a data URL in email HTML. Test the message in Gmail and Outlook because clients can differ in inline-image rendering. The attachment remains the portable download path; HTML email buttons cannot force-download an inline CID image consistently across inboxes.

If you prefer a reusable Resend Dashboard template, define variables such as `{{{NAME}}}`, `{{{REGISTRATION_CODE}}}`, `{{{FOOD_PREFERENCE}}}`, and `{{{PUBLIC_SITE_URL}}}`. Resend supports test emails with sample variable values. Keep the CID QR block in the server-side email because the QR image is generated per registration.

## Other frontend forms

Contact and Feedback use the shared Formspree endpoint `https://formspree.io/f/myezojna`. Activity Participation uses `https://formspree.io/f/mgavdyjg`. The old Registration Formspree endpoint `https://formspree.io/f/mdekbzvl` remains documented in `src/config.js` for reference, but the Registration modal now posts to `/api/register` for QR generation and email delivery.

## Install and run

```bash
npm install
npm run dev
```

The development server listens on `http://localhost:3000`. To create a production build:

```bash
npm run build
npm run preview
```

For local API testing, use the Vercel CLI after setting `.env.local`:

```bash
npx vercel dev
```

## File tree

```text
.
├── .env.example
├── api
│   ├── checkin.js                  # protected staff lookup + check-in
│   └── register.js                 # registration + QR + email
├── app.config.ts
├── ideas.md
├── index.html
├── package.json
├── package-lock.json
├── pnpm-workspace.yaml
├── supabase
│   └── schema.sql                  # registrations and check-in fields
├── vercel.json
├── vite.config.js
├── public
│   ├── ignite-invitation.png
│   ├── manus-routes.json
│   ├── ignite-mark.svg
│   ├── ignite-logo.png              # optional alternate logo asset
│   ├── ignite.mp4                   # optional official video
│   └── videos
│       ├── poster1.mp4
│       └── poster2.mp4
└── src
    ├── App.jsx
    ├── config.js
    ├── index.css
    ├── main.jsx
    └── components
        ├── AboutSection.jsx
        ├── ActivityRegistrationModal.jsx
        ├── ContactSection.jsx
        ├── CountdownTimer.jsx
        ├── EventSection.jsx
        ├── Footer.jsx
        ├── FeedbackSection.jsx
        ├── HeroSection.jsx
        ├── InvitationSection.jsx
        ├── LoadingScreen.jsx
        ├── MemoriesSection.jsx
        ├── Navigation.jsx
        ├── ParticleBackground.jsx
        ├── RegistrationModal.jsx
        ├── SectionShell.jsx
        ├── StaffCheckinPage.jsx
        ├── Video.jsx
        └── index.js
```

## Editing event content

Event timing, venue, poster-release date, Formspree endpoints, source media paths, and download names live in `src/config.js`. The registration and check-in endpoints have validated request contracts in `api/register.js` and `api/checkin.js`; Supabase persistence and check-in fields are defined in `supabase/schema.sql`.

## Technology

- React 19 + Vite
- Vercel Functions
- Supabase PostgreSQL
- Resend transactional email
- `qrcode` server-side QR generation
- `html5-qrcode` camera scanning
- framer-motion
- three.js
- CSS custom properties and inline style objects
- Frontend and serverless browser-data flow
=======
# ignite
>>>>>>> 3ef9895e5be8514a0ce812f9fae61c96c3098533
