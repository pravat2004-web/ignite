import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LoadingScreen from './components/LoadingScreen.jsx';
import Navigation from './components/Navigation.jsx';
import HeroSection from './components/HeroSection.jsx';
import AboutSection from './components/AboutSection.jsx';
import EventSection from './components/EventSection.jsx';
import InvitationSection from './components/InvitationSection.jsx';
import ContactSection from './components/ContactSection.jsx';
import FeedbackSection from './components/FeedbackSection.jsx';
import MemoriesSection from './components/MemoriesSection.jsx';
import Footer from './components/Footer.jsx';
import StaffCheckinPage from './components/StaffCheckinPage.jsx';

function SiteContent() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <EventSection />
        <InvitationSection />
        <ContactSection />
        <FeedbackSection />
        <MemoriesSection />
      </main>
      <Footer />
    </motion.div>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);

  if (window.location.pathname === '/staff-checkin') {
    return <StaffCheckinPage />;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {!ready && <LoadingScreen key="loader" onComplete={() => setReady(true)} />}
      </AnimatePresence>
      {ready && <SiteContent />}
    </>
  );
}
