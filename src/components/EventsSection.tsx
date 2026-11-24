import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Language, CollegeEvent } from '../types';
import { Calendar, MapPin, ShieldAlert, Award } from 'lucide-react';

interface EventsSectionProps {
  lang: Language;
  events: CollegeEvent[];
  onOpenAdmin: () => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({
  lang,
  events,
  onOpenAdmin,
}) => {
  const [activeType, setActiveType] = useState<'upcoming' | 'past'>('upcoming');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const upcomingEvents = events.filter((e) => e.type === 'upcoming');
  const pastEvents = events.filter((e) => e.type === 'past');

  const baseList = activeType === 'upcoming' ? upcomingEvents : pastEvents;
  const visibleEvents =
    categoryFilter === 'all'
      ? baseList
      : baseList.filter((e) => e.category === categoryFilter);

  const categories = [
    { id: 'all', en: 'All', si: 'සියල්ල' },
    { id: 'academic', en: 'Academic', si: 'අධ්‍යාපනික' },
    { id: 'sports', en: 'Sports', si: 'ක්‍රීඩා' },
    { id: 'cultural', en: 'Cultural', si: 'සංස්කෘතික' },
    { id: 'ceremony', en: 'Ceremony', si: 'උත්සව' },
  ];

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr + 'T00:00:00');
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <section
      id="events"
      className="py-20 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-t border-slate-200/60 dark:border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono-code font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-3">
              <Calendar className="w-4 h-4" />
              <span>{lang === 'en' ? 'COLLEGE CALENDAR & CHRONICLES' : 'විදුහල් දින දර්ශනය හා සිදුවීම්'}</span>
            </div>
            <h2 className="font-serif-display text-3xl sm:text-5xl font-bold tracking-tight text-[#06173d] dark:text-white text-balance">
              {lang === 'en' ? 'Upcoming & Past Events' : 'ඉදිරි වැඩසටහන් සහ පසුගිය සිදුවීම්'}
            </h2>
            <div className="w-16 h-1 bg-amber-400 my-4 rounded-full" />
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              {lang === 'en'
                ? 'Stay informed on upcoming collegiate competitions, founders’ ceremonies, and revisit milestones from recent school terms.'
                : 'විදුහලේ පැවැත්වීමට නියමිත ඉදිරි උත්සව හා ක්‍රීඩා තරගාවලි මෙන්ම පසුගිය කාලයේ පැවැත්වූ සුවිශේෂී වැඩසටහන් මෙතැනින් බලන්න.'}
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#06173d] hover:bg-[#0e2554] hover:-translate-y-0.5 border border-amber-400/40 shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>{lang === 'en' ? 'Admin Panel · Manage Events' : 'පරිපාලක පුවරුව (Admin)'}</span>
            </button>
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 self-start">
            <button
              onClick={() => setActiveType('upcoming')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeType === 'upcoming'
                  ? 'bg-[#06173d] text-amber-300 shadow-sm dark:bg-amber-400 dark:text-[#06173d]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {lang === 'en' ? `Upcoming Events (${upcomingEvents.length})` : `ඉදිරි වැඩසටහන් (${upcomingEvents.length})`}
            </button>
            <button
              onClick={() => setActiveType('past')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeType === 'past'
                  ? 'bg-[#06173d] text-amber-300 shadow-sm dark:bg-amber-400 dark:text-[#06173d]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {lang === 'en' ? `Past Events (${pastEvents.length})` : `පසුගිය සිදුවීම් (${pastEvents.length})`}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  categoryFilter === cat.id
                    ? 'bg-amber-400/20 text-amber-800 dark:text-amber-300 font-semibold border border-amber-400/40'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                }`}
              >
                {lang === 'en' ? cat.en : cat.si}
              </button>
            ))}
          </div>
        </div>

        {visibleEvents.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="font-serif-display text-2xl font-bold text-slate-800 dark:text-slate-200">
              {lang === 'en' ? 'No Events Found' : 'වැඩසටහන් හමු නොවීය'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              {lang === 'en'
                ? 'Use the Admin Panel to publish upcoming events or record past highlights.'
                : 'නව වැඩසටහන් එක් කිරීමට පරිපාලක පුවරුව (Admin Panel) භාවිතා කරන්න.'}
            </p>
            <button
              onClick={onOpenAdmin}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-amber-400 text-[#06173d] hover:bg-amber-300 transition-colors cursor-pointer"
            >
              {lang === 'en' ? 'Open Admin Panel' : 'Admin පුවරුව විවෘත කරන්න'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleEvents.map((evt, idx) => (
              <motion.article
                key={evt.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.45, delay: Math.min(idx * 0.08, 0.25), ease: [0.22, 1, 0.36, 1] }}
                className="group bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl transition-shadow"
              >
                <div>
                  {evt.imageUrl && (
                    <div className="h-44 w-full overflow-hidden bg-slate-200 dark:bg-slate-800 relative">
                      <img
                        src={evt.imageUrl}
                        alt={evt.titleEn}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs font-mono-code text-amber-700 dark:text-amber-400 mb-2">
                      <span className="uppercase font-semibold">{evt.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formatDate(evt.date)}</span>
                      {evt.time && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{evt.time}</span>
                        </>
                      )}
                    </div>

                    <h3 className="font-serif-display text-2xl font-bold text-[#06173d] dark:text-white leading-snug">
                      {lang === 'en' ? evt.titleEn : evt.titleSi}
                    </h3>

                    <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {lang === 'en' ? evt.descriptionEn : evt.descriptionSi}
                    </p>

                    {evt.type === 'past' && evt.outcomeEn && (
                      <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-slate-700/70 flex items-start gap-2 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                        <Award className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                        <span>{evt.outcomeEn}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 py-3.5 bg-white/80 dark:bg-slate-900/60 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span className="truncate">{evt.venue}</span>
                  </span>
                  <span className="font-mono-code text-[11px] uppercase shrink-0 ml-2 font-semibold text-slate-600 dark:text-slate-300">
                    {evt.type === 'upcoming' ? (lang === 'en' ? 'Scheduled' : 'ඉදිරියට') : (lang === 'en' ? 'Completed' : 'අවසන්')}
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
