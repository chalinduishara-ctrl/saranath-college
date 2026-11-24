import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { SCHOOL_ANTHEM } from '../data/schoolData';
import { X, Play, Square, Volume2 } from 'lucide-react';

interface AnthemModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const AnthemModal: React.FC<AnthemModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRefs = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    return () => {
      stopMelody();
    };
  }, []);

  if (!isOpen) return null;

  // Play a solemn school brass fanfare using Web Audio API
  const playMelody = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.18, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // School anthem majestic melody notes (frequencies in Hz)
      const notes = [
        { f: 261.63, d: 0.6 }, // C4
        { f: 329.63, d: 0.6 }, // E4
        { f: 392.00, d: 0.8 }, // G4
        { f: 523.25, d: 1.2 }, // C5
        { f: 440.00, d: 0.6 }, // A4
        { f: 392.00, d: 0.8 }, // G4
        { f: 349.23, d: 0.6 }, // F4
        { f: 329.63, d: 1.0 }, // E4
        { f: 293.66, d: 0.8 }, // D4
        { f: 261.63, d: 1.6 }, // C4
      ];

      let startTime = ctx.currentTime + 0.1;
      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = 'triangle'; // warm brassy/choral timbre
        osc.frequency.setValueAtTime(n.f, startTime);

        noteGain.gain.setValueAtTime(0, startTime);
        noteGain.gain.linearRampToValueAtTime(0.7, startTime + 0.08);
        noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + n.d - 0.05);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(startTime);
        osc.stop(startTime + n.d);

        oscillatorRefs.current.push(osc);
        startTime += n.d;
      });

      setIsPlaying(true);

      const totalDuration = notes.reduce((acc, curr) => acc + curr.d, 0);
      setTimeout(() => {
        setIsPlaying(false);
      }, (totalDuration + 0.3) * 1000);
    } catch (e) {
      console.warn('Web Audio not supported or blocked:', e);
      setIsPlaying(false);
    }
  };

  const stopMelody = () => {
    try {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    } catch (e) {
      // ignore
    }
    setIsPlaying(false);
  };

  const toggleAudio = () => {
    if (isPlaying) {
      stopMelody();
    } else {
      playMelody();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-amber-400/30 overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-[#06173d] text-white px-6 py-5 flex items-center justify-between border-b border-amber-400/20">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/logo_e1a8d9c2.jpg"
              alt="Logo"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-400"
            />
            <div>
              <h3 className="font-serif-display text-xl font-bold tracking-wide">
                {lang === 'en' ? SCHOOL_ANTHEM.titleEn : SCHOOL_ANTHEM.titleSi}
              </h3>
              <p className="text-xs text-amber-300 font-mono-code">
                SARANATH COLLEGE ANTHEM
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopMelody();
              onClose();
            }}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Melody Player Bar */}
        <div className="bg-amber-50 dark:bg-slate-800/80 px-6 py-3 border-b border-amber-200/50 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
            <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>{lang === 'en' ? 'Collegiate Fanfare Melody' : 'විදුහල් තනුව ශ්‍රවණය'}</span>
            {isPlaying && (
              <span className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold ml-2">
                <span className="w-1.5 h-3 bg-amber-500 animate-pulse rounded-full" />
                <span className="w-1.5 h-5 bg-amber-500 animate-pulse rounded-full delay-100" />
                <span className="w-1.5 h-2 bg-amber-500 animate-pulse rounded-full delay-200" />
                Playing Fanfare
              </span>
            )}
          </div>
          <button
            onClick={toggleAudio}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-[#06173d] bg-amber-400 hover:bg-amber-300 transition-colors shadow-sm cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Anthem Tune</span>
              </>
            )}
          </button>
        </div>

        {/* Anthem Lyrics Body */}
        <div className="p-6 md:p-8 space-y-6 max-h-[68vh] overflow-y-auto text-slate-800 dark:text-slate-200">
          {/* Verse 1 */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200/70 dark:border-slate-700">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
              {lang === 'en' ? 'Verse 1' : '1 වන පදය'}
            </h4>
            <p className="font-sinhala text-base sm:text-lg leading-relaxed whitespace-pre-line font-medium text-slate-900 dark:text-slate-100">
              {SCHOOL_ANTHEM.verse1Si}
            </p>
            {lang === 'en' && (
              <p className="font-serif-display italic text-sm text-slate-600 dark:text-slate-400 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                {SCHOOL_ANTHEM.verse1En}
              </p>
            )}
          </div>

          {/* Chorus */}
          <div className="bg-amber-500/10 dark:bg-amber-500/15 p-5 rounded-xl border border-amber-400/40">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 mb-2">
              {lang === 'en' ? 'Chorus (ධ්‍රැව පදය)' : 'ධ්‍රැව පදය'}
            </h4>
            <p className="font-sinhala text-lg sm:text-xl font-bold leading-relaxed whitespace-pre-line text-[#06173d] dark:text-amber-200">
              {SCHOOL_ANTHEM.chorusSi}
            </p>
            {lang === 'en' && (
              <p className="font-serif-display italic text-sm text-slate-700 dark:text-slate-300 mt-3 pt-3 border-t border-amber-300/40">
                {SCHOOL_ANTHEM.chorusEn}
              </p>
            )}
          </div>

          {/* Verse 2 */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200/70 dark:border-slate-700">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
              {lang === 'en' ? 'Verse 2' : '2 වන පදය'}
            </h4>
            <p className="font-sinhala text-base sm:text-lg leading-relaxed whitespace-pre-line font-medium text-slate-900 dark:text-slate-100">
              {SCHOOL_ANTHEM.verse2Si}
            </p>
            {lang === 'en' && (
              <p className="font-serif-display italic text-sm text-slate-600 dark:text-slate-400 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                {SCHOOL_ANTHEM.verse2En}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 dark:bg-slate-800 px-6 py-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700">
          <span className="font-sinhala text-slate-700 dark:text-slate-300 font-semibold">
            පඤ්ඤා නරානං රතනං
          </span>
          <button
            onClick={() => {
              stopMelody();
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            {lang === 'en' ? 'Close' : 'වසන්න'}
          </button>
        </div>
      </div>
    </div>
  );
};
