export const EVENT_CONFIG = {
  festName: 'IGNITE',
  eventName: 'IGNITE',
  organizer: 'Master of Computer Applications Department, Centurion University of Technology and Management (CUTM)',
  venue: 'Gym Area, CUTM Campus',
  eventStart: '2026-10-09T11:00:00+05:30',
  eventEnd: '2026-10-09T17:30:00+05:30',
  eventDateLabel: '9 October',
  eventTimeLabel: '11:00 AM – 5:30 PM',
  posterReleaseDate: '5 October 2026',
  forceCompleted: false,
  footer: '© 2026 mcafreshers2026 - All Rights Reserved',
};

// Contact, feedback, and activity forms submit directly from the browser. Registration uses /api/register for QR and email processing.
export const FORM_ENDPOINTS = {
  contact: 'https://formspree.io/f/myezojna',
  feedback: 'https://formspree.io/f/myezojna',
  registration: 'https://formspree.io/f/mdekbzvl',
  activityParticipation: 'https://formspree.io/f/mgavdyjg',
};

export const VIDEO_SOURCES = {
  official: {
    url: '/ignite.mp4',
    label: 'IGNITE / Official Video',
    filename: 'IGNITE_Official_Video.mp4',
  },
  poster1: {
    url: '/videos/poster1.mp4',
    label: 'Video 1 / First Look',
    filename: 'IGNITE_Poster_Release_Video_1.mp4',
  },
  poster2: {
    url: '/videos/poster2.mp4',
    label: 'Video 2 / Final Reveal',
    filename: 'IGNITE_Poster_Release_Video_2.mp4',
  },
};

export const NAV_ITEMS = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  { label: 'Event Info', id: 'event' },
  { label: 'Invitation', id: 'invitation' },
  { label: 'Contact', id: 'contact' },
  { label: 'Feedback', id: 'feedback' },
  { label: 'Memories', id: 'memories', comingSoon: true },
];

export const IGNITE_COPY = {
  tagline: 'Get Ready to Make IGNITE Unforgettable! 🎉',
  invitationSubtitle: "You're cordially invited to celebrate IGNITE — where innovation meets inspiration!",
  invitationNote: '📅 Save the Date!',
};
