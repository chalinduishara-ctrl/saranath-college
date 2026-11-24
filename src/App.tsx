/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { MotionConfig, motion, useScroll, useSpring } from 'motion/react';
import { Language, CollegeEvent, CollegeHouse } from './types';
import { HOUSES_DATA } from './data/schoolData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HistoryTimeline } from './components/HistoryTimeline';
import { PrincipalMessage } from './components/PrincipalMessage';
import { HousesAndAcademics } from './components/HousesAndAcademics';
import { EventsSection } from './components/EventsSection';
import { Footer } from './components/Footer';
import { AnthemModal } from './components/AnthemModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { ChevronUp } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [anthemModalOpen, setAnthemModalOpen] = useState<boolean>(false);
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  const [events, setEvents] = useState<CollegeEvent[]>([]);
  const [houses, setHouses] = useState<CollegeHouse[]>(HOUSES_DATA);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => {
    fetch('/api/portal-data')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.events)) {
          setEvents(data.events);
        }
        if (Array.isArray(data.housePoints)) {
          setHouses(
            HOUSES_DATA.map((h) => {
              const found = data.housePoints.find((p: { id: string; points: number }) => p.id === h.id);
              return found ? { ...h, points: found.points } : h;
            })
          );
        }
      })
      .catch((err) => {
        console.error('Failed to fetch portal data:', err);
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      const sections = ['hero', 'heritage', 'principal', 'academics', 'events'];
      const scrollPos = window.scrollY + 200;

      for (const sId of sections) {
        const el = document.getElementById(sId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'si' : 'en'));
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHousesUpdated = (housePoints: Array<{ id: string; points: number }>) => {
    setHouses(
      HOUSES_DATA.map((h) => {
        const found = housePoints.find((p) => p.id === h.id);
        return found ? { ...h, points: found.points } : h;
      })
    );
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-amber-400 selection:text-slate-950">
        {/* Scroll Progress Indicator */}
        <motion.div
          style={{ scaleX }}
          className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 origin-left z-[60] pointer-events-none"
        />

        <Navbar
          lang={lang}
          onToggleLang={handleToggleLang}
          activeSection={activeSection}
          onNavigate={handleNavigate}
          onOpenAdmin={() => setAdminModalOpen(true)}
        />

        <main>
          <Hero
            lang={lang}
            onExploreHistory={() => handleNavigate('heritage')}
            onExploreEvents={() => handleNavigate('events')}
            onOpenAnthem={() => setAnthemModalOpen(true)}
          />

          <HistoryTimeline lang={lang} />

          <PrincipalMessage lang={lang} />

          <HousesAndAcademics lang={lang} houses={houses} />

          <EventsSection
            lang={lang}
            events={events}
            onOpenAdmin={() => setAdminModalOpen(true)}
          />
        </main>

        <Footer
          lang={lang}
          onNavigate={handleNavigate}
          onOpenAdmin={() => setAdminModalOpen(true)}
          events={events}
          houses={houses}
        />

        <AnthemModal
          isOpen={anthemModalOpen}
          onClose={() => setAnthemModalOpen(false)}
          lang={lang}
        />

        <AdminPanelModal
          isOpen={adminModalOpen}
          onClose={() => setAdminModalOpen(false)}
          lang={lang}
          events={events}
          houses={houses}
          onEventsUpdated={setEvents}
          onHousesUpdated={handleHousesUpdated}
        />

        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-[#06173d] text-amber-400 hover:text-white hover:bg-[#0e2554] border border-amber-400/40 shadow-xl transition-colors cursor-pointer active:scale-90"
            aria-label="Back to top"
            title="Back to top"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </div>
    </MotionConfig>
  );
}
