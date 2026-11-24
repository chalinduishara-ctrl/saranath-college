import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Language } from '../types';
import { Music, ArrowRight, Calendar, Award } from 'lucide-react';
import { SCHOOL_STATS } from '../data/schoolData';

interface HeroProps {
  lang: Language;
  onExploreHistory: () => void;
  onExploreEvents: () => void;
  onOpenAnthem: () => void;
}

const AnimatedStatValue: React.FC<{ value: string; suffix: string }> = ({ value, suffix }) => {
  const [display, setDisplay] = useState<string>(value);

  useEffect(() => {
    const numeric = parseInt(value.replace(/,/g, ''), 10);
    if (isNaN(numeric)) {
      setDisplay(value);
      return;
    }

    const hasComma = value.includes(',');
    const duration = 1200;
    const startTime = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(numeric * eased);
      setDisplay(hasComma ? current.toLocaleString() : String(current));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setDisplay(value);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [value]);

  return (
    <div className="font-serif-display text-2xl sm:text-3xl font-bold text-amber-300 font-mono-code tabular-nums">
      {display}
      <span className="text-base text-amber-400 font-normal ml-0.5">{suffix}</span>
    </div>
  );
};

export const Hero: React.FC<HeroProps> = ({
  lang,
  onExploreHistory,
  onExploreEvents,
  onOpenAnthem,
}) => {
  const [photoLoaded, setPhotoLoaded] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.16]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.25]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 48]);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-[92vh] flex flex-col justify-between pt-24 pb-12 overflow-hidden bg-[#06173d] text-white"
    >
      <motion.div style={{ y: bgY, scale: bgScale }} className="absolute inset-0 z-0 will-change-transform">
        <img
          src="/assets/aistudio/hero_9a4d2a7f.jpg"
          alt="Saranath College main building and shrine pagoda"
          className={`w-full h-full object-cover object-center transition-opacity duration-1000 ${
            photoLoaded ? 'opacity-40' : 'opacity-20'
          }`}
          onLoad={() => setPhotoLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#06173d]/90 via-[#06173d]/75 to-[#06173d]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(217,168,69,0.12),transparent_60%)]" />
      </motion.div>

      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-16 my-auto text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-amber-400/30 text-xs font-mono-code text-amber-300 tracking-wider mb-6"
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>{lang === 'en' ? 'KULIYAPITIYA · EST. 1882 · A PROUD LEGACY' : '1882 සිට අභිමානවත් අධ්‍යාපන පදනම · කුලියාපිටිය'}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4"
        >
          <h2 className="font-sinhala text-2xl sm:text-3xl md:text-4xl text-amber-300 font-bold tracking-wide drop-shadow-sm">
            පඤ්ඤා නරානං රතනං
          </h2>
          <p className="font-serif-display italic text-slate-300 text-sm sm:text-base tracking-widest mt-1">
            “Wisdom is the Jewel of Humankind”
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.08] text-balance"
        >
          {lang === 'en' ? (
            <>
              Shaping Leaders, Champions & Scholars for <span className="text-amber-400">144+ Years</span>
            </>
          ) : (
            <>
              ශතවර්ෂයකට අධික <span className="text-amber-400">ප්‍රෞඪ අධ්‍යාපනික</span> උරුමයේ මුදුන්මල්කඩ
            </>
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed text-balance"
        >
          {lang === 'en'
            ? 'From 30 visionary students in 1882 to a modern center of academic distinction, sports championships, and cultural harmony in the North Western Province.'
            : '1882 දී සිසුන් තිස් දෙනෙකුගෙන් ඇරඹි ගමන අද වන විට දහස් සංඛ්‍යාත බුද්ධිමතුන්, ක්‍රීඩා ශූරයන් හා ජාතික නායකයින් බිහිකළ අද්විතීය අධ්‍යාපන ක්ෂේම භූමියක් බවට පත්ව ඇත.'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={onExploreHistory}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-lg text-sm font-semibold text-[#06173d] bg-amber-400 hover:bg-amber-300 hover:-translate-y-0.5 transition-all shadow-lg shadow-amber-500/20 cursor-pointer whitespace-nowrap"
          >
            <span>{lang === 'en' ? 'Explore 144-Year Journey' : 'අපේ ඉතිහාසය ගවේෂණය'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onExploreEvents}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-lg text-sm font-semibold text-white bg-white/10 hover:bg-white/15 hover:-translate-y-0.5 border border-white/20 transition-all backdrop-blur-sm cursor-pointer whitespace-nowrap"
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>{lang === 'en' ? 'Upcoming & Past Events' : 'ඉදිරි හා පසුගිය වැඩසටහන්'}</span>
          </button>

          <button
            onClick={onOpenAnthem}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium text-amber-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Music className="w-4 h-4 text-amber-400" />
            <span>{lang === 'en' ? 'College Anthem' : 'විදුහල් ගීතය'}</span>
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-12"
      >
        <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-white/10 rounded-xl overflow-hidden border border-white/10 backdrop-blur-md">
          {SCHOOL_STATS.map((stat, i) => (
            <div
              key={i}
              className="bg-[#06173d]/80 p-4 sm:p-5 text-center flex flex-col justify-center transition-colors hover:bg-[#0e2554]/90"
            >
              <AnimatedStatValue value={stat.value} suffix={stat.suffix} />
              <div className="text-[11px] sm:text-xs font-medium text-slate-300 uppercase tracking-wider mt-1">
                {lang === 'en' ? stat.labelEn : stat.labelSi}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
