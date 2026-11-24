import React from 'react';
import { Language, CollegeEvent, CollegeHouse } from '../types';
import { downloadStandaloneHtml } from '../utils/htmlExporter';
import { Phone, MapPin, ExternalLink, ShieldAlert, Download, FileCode2 } from 'lucide-react';

interface FooterProps {
  lang: Language;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
  events: CollegeEvent[];
  houses: CollegeHouse[];
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onNavigate,
  onOpenAdmin,
  events,
  houses,
}) => {
  const currentYear = new Date().getFullYear();
  const collegeAge = currentYear - 1882;

  return (
    <footer className="bg-[#030d24] text-slate-300 pt-16 pb-12 border-t border-amber-400/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/logo_e1a8d9c2.jpg"
                alt="Saranath College Crest"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400"
              />
              <div>
                <h4 className="font-serif-display text-2xl font-bold text-white tracking-wide leading-none">
                  SARANATH COLLEGE
                </h4>
                <p className="text-[10px] uppercase font-mono-code tracking-[0.25em] text-amber-300 mt-1">
                  KULIYAPITIYA · ESTABLISHED 1882
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {lang === 'en'
                ? `A proud sanctuary of knowledge, brotherhood, and moral virtue for over ${collegeAge} years. Fostering champions and scholars under the guidance of our sacred motto.`
                : `වසර ${collegeAge} කට අධික අභිමානවත් කාලයක් පුරා 'පඤ්ඤා නරානං රතනං' උතුම් තේමාව පෙරදැරි කරගනිමින් දැයට නැණ පහන් දල්වන කුලියාපිටිය සාරානාථ විද්‍යාලය.`}
            </p>

            <div className="font-sinhala text-amber-300 font-bold text-lg pt-1">
              පඤ්ඤා නරානං රතනං
            </div>
          </div>

          {/* Navigation Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h5 className="text-xs font-mono-code font-bold uppercase tracking-wider text-amber-300">
              {lang === 'en' ? 'EXPLORE PORTAL' : 'ප්‍රධාන පිටු'}
            </h5>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('heritage')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  {lang === 'en' ? 'Our 144-Year History' : 'අපේ ඉතිහාසය'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('principal')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  {lang === 'en' ? "Principal's Desk" : 'විදුහල්පතිතුමන්'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('academics')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  {lang === 'en' ? 'Thisara · Mayura · Lihini · Paravi' : 'නිවාස හා අධ්‍යාපනය'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('events')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  {lang === 'en' ? 'Upcoming & Past Events' : 'වැඩසටහන් හා සිදුවීම්'}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact, Admin & HTML/CSS Download (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h5 className="text-xs font-mono-code font-bold uppercase tracking-wider text-amber-300">
              {lang === 'en' ? 'CONTACT & SINGLE-PAGE HTML' : 'සම්බන්ධීකරණය හා HTML/CSS'}
            </h5>
            <div className="space-y-3 text-sm text-slate-300 font-mono-code">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Saranath College, Meegahakotuwa,<br />
                  Kuliyapitiya 60200, Sri Lanka
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:+94372281355" className="hover:text-amber-300 transition-colors">
                  +94 37 228 1355
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <ExternalLink className="w-4 h-4 text-amber-400 shrink-0" />
                <a
                  href="https://www.facebook.com/p/Saranath-College-61556442792437/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors"
                >
                  Official Facebook Page
                </a>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap gap-2">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-amber-400 text-[#06173d] hover:bg-amber-300 transition-colors cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Admin Panel' : 'Admin පුවරුව'}</span>
              </button>
              <button
                onClick={() => downloadStandaloneHtml(events, houses)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white/10 text-white hover:bg-white/20 border border-white/15 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'en' ? 'Download 1-Page HTML' : 'තනි HTML/CSS බාගන්න'}</span>
              </button>
              <a
                href="/saranath-college.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white/5 text-amber-300 hover:bg-white/15 border border-amber-400/25 transition-colors"
              >
                <FileCode2 className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'View Single-File Site' : 'HTML පිටුව'}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono-code">
          <div>
            © {currentYear} Saranath College, Kuliyapitiya. All rights reserved.
          </div>
          <div className="font-sinhala text-amber-300 font-semibold text-sm">
            පඤ්ඤා නරානං රතනං
          </div>
        </div>
      </div>
    </footer>
  );
};
