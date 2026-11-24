import React, { useState, useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { Language } from '../types';
import { TIMELINE_DATA } from '../data/schoolData';
import { History } from 'lucide-react';

interface HistoryTimelineProps {
  lang: Language;
}

export const HistoryTimeline: React.FC<HistoryTimelineProps> = ({ lang }) => {
  const [filter, setFilter] = useState<string>('all');
  const timelineRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 75%', 'end 75%'],
  });
  const spineScaleY = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 26,
  });

  const categories = [
    { id: 'all', labelEn: 'All Milestones', labelSi: 'සියලු සන්ධිස්ථාන' },
    { id: 'foundation', labelEn: 'Foundations & Campus', labelSi: 'ආරම්භය හා පරිශ්‍රය' },
    { id: 'academic', labelEn: 'Academic Landmarks', labelSi: 'අධ්‍යාපනික වාර්තා' },
    { id: 'leadership', labelEn: 'Leadership', labelSi: 'විදුහල්පති නායකත්වය' },
    { id: 'unity', labelEn: 'Unity & Culture', labelSi: 'සමගිය හා සංස්කෘතිය' },
    { id: 'sports', labelEn: 'Sports & Global', labelSi: 'ක්‍රීඩා හා ජාත්‍යන්තර' },
  ];

  const filteredItems = filter === 'all'
    ? TIMELINE_DATA
    : TIMELINE_DATA.filter((item) => item.category === filter);

  return (
    <section id="heritage" className="py-20 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 text-xs font-mono-code font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-3">
            <History className="w-4 h-4" />
            <span>{lang === 'en' ? 'OUR LIVING HERITAGE' : 'ඓතිහාසික චාරිකාව'}</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-5xl font-bold tracking-tight text-[#06173d] dark:text-white text-balance">
            {lang === 'en' ? '144 Years of Heritage & Glory' : 'වසර 144 ක අභිමානවත් සාරානාථ ගමන්මඟ'}
          </h2>
          <div className="w-16 h-1 bg-amber-400 mx-auto my-4 rounded-full" />
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed text-balance">
            {lang === 'en'
              ? 'From a courageous 30-student academy founded in 1882 to a modern center of excellence and national leadership in Kuliyapitiya.'
              : '1882 දී ඇන්තනී ද සිල්වා මුල්ගුරුතුමන් විසින් දැල්වූ නැණ පහන අද වන විට මුළු මහත් ජාතියම ඒකාලෝක කරන මහා ප්‍රදීපාගාරයක් බවට පත්වූ හැටි.'}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 p-1.5 bg-slate-200/70 dark:bg-slate-900 rounded-xl max-w-2xl mx-auto border border-slate-300/60 dark:border-slate-800">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  filter === cat.id
                    ? 'bg-[#06173d] text-amber-300 shadow-sm dark:bg-amber-400 dark:text-[#06173d]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {lang === 'en' ? cat.labelEn : cat.labelSi}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Timeline Stream with Animated Scroll Spine */}
        <div ref={timelineRef} className="relative ml-4 md:ml-32 pl-6 md:pl-10 space-y-12">
          {/* Static background spine */}
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber-400/20 dark:bg-amber-400/15" />
          {/* Scroll-linked animated gold progress spine */}
          <motion.div
            style={{ scaleY: spineScaleY }}
            className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-300 origin-top"
          />

          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: Math.min(index * 0.05, 0.2), ease: [0.22, 1, 0.36, 1] }}
              className="relative group"
            >
              {/* Timeline Pin Node */}
              <div className="absolute -left-[33px] md:-left-[49px] top-1.5 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-4 border-amber-500 shadow-md group-hover:scale-125 transition-transform duration-300" />

              {/* Year Indicator */}
              <div className="md:absolute md:-left-32 md:top-0 md:w-24 md:text-right">
                <span className="font-serif-display font-bold text-2xl md:text-3xl text-[#06173d] dark:text-amber-300 font-mono-code block">
                  {item.year}
                </span>
                {item.exactDate && (
                  <span className="text-[11px] font-mono-code text-slate-500 dark:text-slate-400 block -mt-1">
                    {item.exactDate}
                  </span>
                )}
              </div>

              {/* Content Card */}
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-[#06173d] dark:text-white">
                    {lang === 'en' ? item.titleEn : item.titleSi}
                  </h3>
                  <div className="text-xs font-mono-code text-amber-700 dark:text-amber-400 font-medium capitalize">
                    <span>{item.category}</span>
                    <span className="mx-1.5" aria-hidden="true">·</span>
                    <span>No. {index + 1}</span>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                  {lang === 'en' ? item.descEn : item.descSi}
                </p>

                <p className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs italic text-slate-500 dark:text-slate-400 font-sinhala">
                  {lang === 'en' ? item.titleSi : item.titleEn}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Heritage Quote Callout */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 bg-[#06173d] text-white p-8 rounded-2xl border border-amber-400/30 text-center relative overflow-hidden"
        >
          <div className="relative z-10 max-w-3xl mx-auto">
            <p className="font-sinhala text-xl sm:text-2xl font-bold text-amber-300 mb-2">
              “අපේ ආරම්භය ශිෂ්‍යයන් තිස් දෙනෙකුගෙන් විය. නමුත් අද සාරානාථ නාමය දසත විහිදී ඇත.”
            </p>
            <p className="font-serif-display italic text-slate-300 text-sm sm:text-base">
              “Every great institution is built by those who came before us. Ours began with thirty students and a noble vision.”
            </p>
            <div className="text-xs font-mono-code text-amber-400/80 tracking-widest uppercase mt-4">
              SARANATH COLLEGE HISTORICAL ARCHIVES · 1882–{new Date().getFullYear()}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
