import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Language, CollegeHouse, AcademicStream } from '../types';
import { ACADEMIC_STREAMS } from '../data/schoolData';
import { Shield, BookOpen, Trophy, CheckCircle2 } from 'lucide-react';

interface HousesAndAcademicsProps {
  lang: Language;
  houses: CollegeHouse[];
}

export const HousesAndAcademics: React.FC<HousesAndAcademicsProps> = ({ lang, houses }) => {
  const [activeTab, setActiveTab] = useState<'houses' | 'academics' | 'sports'>('houses');
  const [selectedHouseId, setSelectedHouseId] = useState<string>(houses[0]?.id || 'thisara');

  const selectedHouse = houses.find((h) => h.id === selectedHouseId) || houses[0];

  const sportsAndClubs = [
    { titleEn: 'Cricket First XI', titleSi: 'පළමු පෙළ ක්‍රිකට් කණ්ඩායම', descEn: 'Regular contenders in provincial school tournaments and big match derbies.', descSi: 'වයඹ පළාත් තරගාවලි නියෝජනය කරන ප්‍රමුඛ පාසල් ක්‍රිකට් කණ්ඩායමකි.' },
    { titleEn: 'Cadet Platoon (2nd Bn)', titleSi: 'ශිෂ්‍යභට ඛණ්ඩය (2 වන බලඇණිය)', descEn: 'Exemplary military drill, leadership camps at Rantembe, and ceremonial parades.', descSi: 'රන්ටැඹේ කඳවුරු සහ ජාතික ආචාර පෙළපාලි නියෝජනය කරමින් විනය ගොඩනංවයි.' },
    { titleEn: 'Western & Eastern Brass Bands', titleSi: 'බටහිර හා පෙරදිග තූර්යවාදක කණ්ඩායම්', descEn: 'Award-winning musical ensembles performing at provincial and national festivals.', descSi: 'ජාතික සහ පළාත් මට්ටමින් සම්මාන දිනූ සංගීත හා වාදන කණ්ඩායම්.' },
    { titleEn: 'Badminton & Athletics', titleSi: 'බැඩ්මින්ටන් සහ මලල ක්‍රීඩා', descEn: 'National school championship medals in track events, relay sprints, and singles badminton.', descSi: 'සමස්ත ලංකා පාසල් මලල ක්‍රීඩා සහ බැඩ්මින්ටන් ශූරතාවලි ජයග්‍රහණ.' },
    { titleEn: 'ICT & Robotics Society', titleSi: 'තොරතුරු තාක්ෂණ හා රොබෝ විද්‍යා සංගමය', descEn: 'National software hackathons, web development contests, and robotics competitions.', descSi: 'නව නිපැයුම්, මෘදුකාංග නිර්මාණ හා රොබෝ තාක්ෂණ ජාතික ජයග්‍රහණ.' },
    { titleEn: 'Buddhist & Heritage Society', titleSi: 'බෞද්ධ හා සංස්කෘතික සංගමය', descEn: 'Annual Pirith pinkama, Vesak lantern celebrations, and spiritual ethics development.', descSi: 'වාර්ෂික පරිත්‍රාණ ධර්ම දේශනා, වෙසක් මහෝත්සව සහ දහම් අධ්‍යාපන වැඩසටහන්.' },
  ];

  return (
    <section id="academics" className="py-20 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 text-xs font-mono-code font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-3">
            <Trophy className="w-4 h-4" />
            <span>{lang === 'en' ? 'LIFE AT SARANATH' : 'අධ්‍යාපනය හා ශිෂ්‍ය ජීවිතය'}</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-5xl font-bold tracking-tight text-[#06173d] dark:text-white text-balance">
            {lang === 'en' ? 'Thisara · Mayura · Lihini · Paravi' : 'තිසර · මයුර · ලිහිණි · පරවි නිවාස හා අධ්‍යාපනය'}
          </h2>
          <div className="w-16 h-1 bg-amber-400 mx-auto my-4 rounded-full" />
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed text-balance">
            {lang === 'en'
              ? 'Balancing intellectual rigour with athletics, discipline, and spirit across five Advanced Level streams and our four historic bird houses.'
              : 'විෂයානුබද්ධ අධ්‍යාපනය, ක්‍රීඩාව සහ විනය සමබරව සංකලනය කරමින් තිසර, මයුර, ලිහිණි සහ පරවි නිවාස ඔස්සේ සාරානාථ දරුවන් පෙරට යයි.'}
          </p>

          <div className="mt-8 flex items-center justify-center gap-2 p-1 bg-slate-200/80 dark:bg-slate-900 rounded-xl max-w-md mx-auto border border-slate-300/60 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('houses')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'houses'
                  ? 'bg-[#06173d] text-amber-300 shadow-sm dark:bg-amber-400 dark:text-[#06173d]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5 inline mr-1.5" />
              {lang === 'en' ? '4 Bird Houses' : 'ක්‍රීඩා නිවාස'}
            </button>
            <button
              onClick={() => setActiveTab('academics')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'academics'
                  ? 'bg-[#06173d] text-amber-300 shadow-sm dark:bg-amber-400 dark:text-[#06173d]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 inline mr-1.5" />
              {lang === 'en' ? 'A/L Streams' : 'උසස් පෙළ අංශ'}
            </button>
            <button
              onClick={() => setActiveTab('sports')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'sports'
                  ? 'bg-[#06173d] text-amber-300 shadow-sm dark:bg-amber-400 dark:text-[#06173d]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 inline mr-1.5" />
              {lang === 'en' ? 'Clubs & Sports' : 'ක්‍රීඩා හා සමිති'}
            </button>
          </div>
        </motion.div>

        {/* Tab 1: 4 Bird Houses */}
        {activeTab === 'houses' && selectedHouse && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {houses.map((house, idx) => {
                const isSelected = selectedHouse.id === house.id;
                return (
                  <motion.div
                    key={house.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => setSelectedHouseId(house.id)}
                    className={`p-6 rounded-2xl border-2 transition-colors cursor-pointer relative ${
                      isSelected
                        ? 'border-amber-400 bg-white dark:bg-slate-900 shadow-lg'
                        : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md"
                        style={{ backgroundColor: house.colorHex }}
                      >
                        <Shield className="w-5 h-5 fill-current" />
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono-code uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                          House Points
                        </span>
                        <span className="font-mono-code font-bold text-lg text-slate-800 dark:text-slate-100 tabular-nums">
                          {house.points} pts
                        </span>
                      </div>
                    </div>

                    <h3 className="font-serif-display text-2xl font-bold text-[#06173d] dark:text-white">
                      {lang === 'en' ? house.nameEn : house.nameSi}
                    </h3>

                    <div className="text-xs font-semibold mt-1" style={{ color: house.colorHex }}>
                      {lang === 'en'
                        ? `${house.birdEn} · ${house.colorNameEn}`
                        : `${house.birdSi} · ${house.colorNameSi}`}
                    </div>

                    <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 italic">
                      “{lang === 'en' ? house.mottoEn : house.mottoSi}”
                    </p>

                    {isSelected && (
                      <div className="mt-4 pt-3 border-t border-amber-300/40 text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{lang === 'en' ? 'Currently Selected' : 'තෝරාගත් නිවාසය'}</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              key={selectedHouse.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="p-8 rounded-2xl bg-gradient-to-r from-[#06173d] to-[#0d255a] text-white border border-amber-400/30 flex flex-col md:flex-row items-center justify-between gap-8"
            >
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 text-xs font-mono-code text-amber-300 uppercase tracking-widest mb-2">
                  <Shield className="w-4 h-4" />
                  <span>{lang === 'en' ? 'HOUSE SPOTLIGHT' : 'නිවාස විශේෂාංගය'} · {selectedHouse.nameEn}</span>
                </div>
                <h4 className="font-serif-display text-3xl font-bold text-white mb-2">
                  {lang === 'en' ? `${selectedHouse.nameEn} (${selectedHouse.nameSi})` : selectedHouse.nameSi}
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  {lang === 'en' ? selectedHouse.descriptionEn : selectedHouse.descriptionSi}
                </p>
                <div className="flex flex-wrap gap-3 text-xs font-mono-code">
                  <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
                    Emblem: {selectedHouse.birdEn} ({selectedHouse.birdSi})
                  </span>
                  <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
                    Color: {selectedHouse.colorNameEn}
                  </span>
                  <span className="bg-amber-400/20 text-amber-300 px-3 py-1.5 rounded-lg border border-amber-400/40 tabular-nums">
                    Standing: {selectedHouse.points} pts
                  </span>
                </div>
              </div>

              <div
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full flex flex-col items-center justify-center p-4 text-center ring-4 ring-white/20 shadow-2xl shrink-0 transition-colors duration-300"
                style={{ backgroundColor: selectedHouse.colorHex }}
              >
                <Shield className="w-9 h-9 text-white mb-1 fill-current" />
                <span className="font-serif-display font-bold text-xl text-white">
                  {selectedHouse.nameEn.split(' ')[0]}
                </span>
                <span className="text-[11px] font-sinhala text-white/95">
                  {selectedHouse.nameSi}
                </span>
              </div>
            </motion.div>
          </div>
        )}

        {/* Tab 2: Academic Streams */}
        {activeTab === 'academics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ACADEMIC_STREAMS.map((stream: AcademicStream, idx: number) => (
              <motion.div
                key={stream.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md flex flex-col justify-between transition-shadow"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-[#06173d] dark:text-white">
                    {lang === 'en' ? stream.titleEn : stream.titleSi}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                    {lang === 'en' ? stream.descriptionEn : stream.descriptionSi}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-mono-code font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                      {lang === 'en' ? 'Key Subjects Offered:' : 'ප්‍රධාන විෂය ධාරාවන්:'}
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                      {(lang === 'en' ? stream.subjectsEn : stream.subjectsSi).map((sub, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                          <span>{sub}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono-code text-slate-500 dark:text-slate-400">
                  {stream.deanEn}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Tab 3: Sports & Clubs */}
        {activeTab === 'sports' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sportsAndClubs.map((club, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#06173d] text-amber-300 flex items-center justify-center font-bold text-xs">
                    0{idx + 1}
                  </div>
                  <h3 className="font-serif-display text-xl font-bold text-[#06173d] dark:text-white">
                    {lang === 'en' ? club.titleEn : club.titleSi}
                  </h3>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {lang === 'en' ? club.descEn : club.descSi}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
