import React from 'react';
import { motion } from 'motion/react';
import { Language } from '../types';
import { Quote, Award } from 'lucide-react';

interface PrincipalMessageProps {
  lang: Language;
}

export const PrincipalMessage: React.FC<PrincipalMessageProps> = ({ lang }) => {
  return (
    <section id="principal" className="py-20 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-t border-slate-200/60 dark:border-slate-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4"
        >
          <div className="inline-flex items-center gap-2 text-xs font-mono-code font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            <Award className="w-4 h-4" />
            <span>{lang === 'en' ? "COLLEGE LEADERSHIP & VISION" : "විදුහල්පති පණිවුඩය"}</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-5xl font-bold tracking-tight text-[#06173d] dark:text-white mt-1">
            {lang === 'en' ? "From the Principal's Desk" : "විදුහල්පතිතුමන්ගේ පණිවුඩය"}
          </h2>
          <div className="w-16 h-1 bg-amber-400 my-4 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mt-8">
          {/* Portrait Column (4 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4 space-y-4"
          >
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#06173d] to-[#0e3a8c] p-6 text-center text-white border-2 border-amber-400/40 shadow-xl">
              <div className="relative mx-auto w-36 h-36 rounded-full overflow-hidden p-1 bg-gradient-to-br from-amber-300 to-amber-600 shadow-lg mb-4 animate-float-slow">
                <img
                  src="/assets/aistudio/logo_e1a8d9c2.jpg"
                  alt="Saranath College Crest"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              <h3 className="font-serif-display text-2xl font-bold text-amber-300">
                Mr. R.M.C. Randeniya
              </h3>
              <p className="text-xs uppercase tracking-widest text-slate-300 font-mono-code mt-1">
                {lang === 'en' ? 'Principal, Saranath College' : 'විදුහල්පති, සාරානාථ විද්‍යාලය'}
              </p>
              <p className="text-xs text-amber-200/80 mt-1">
                Kuliyapitiya, Sri Lanka
              </p>

              <div className="mt-6 pt-5 border-t border-white/15 text-left space-y-2 text-xs text-slate-200 font-mono-code">
                <div className="flex justify-between">
                  <span className="text-slate-400">{lang === 'en' ? 'Assumed Duties:' : 'ධුරය භාරගැනීම:'}</span>
                  <span className="font-semibold text-amber-300">14 June 2021 (2nd Term)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{lang === 'en' ? 'Administration:' : 'පාලන පරිශ්‍රය:'}</span>
                  <span>Meegahakotuwa Campus</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{lang === 'en' ? 'Motto Focus:' : 'තේමා පාඨය:'}</span>
                  <span className="font-sinhala text-amber-300">පඤ්ඤා නරානං රතනං</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-400/30">
              <Quote className="w-5 h-5 text-amber-600 dark:text-amber-400 mb-2" />
              <p className="font-serif-display italic text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                “Every great institution is built by those who came before us. Ours began with thirty students and an unshakable vision of wisdom.”
              </p>
            </div>
          </motion.div>

          {/* Letter Prose Column (8 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-8 bg-slate-50 dark:bg-slate-800/40 p-8 sm:p-10 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm leading-relaxed space-y-5 text-slate-700 dark:text-slate-300 text-sm sm:text-base"
          >
            <div className="font-sinhala text-xl sm:text-2xl font-bold text-[#06173d] dark:text-amber-300 leading-snug">
              {lang === 'en'
                ? "“A Proud Legacy of Learning, Unity, and Academic Rigour Since 1882”"
                : "“වසර 144 ක අභිමානවත් සාරානාථ විදුහල් මාතාවගේ සෙවණට ඔබ සැම සාදරයෙන් පිළිගනිමි”"}
            </div>

            {lang === 'en' ? (
              <>
                <p>
                  It is with immense pride and humility that I welcome you to Saranath College, Kuliyapitiya. Founded in 1882 under the pioneering leadership of Headmaster Anthony de Silva with just thirty students, our College has grown over more than a century into an esteemed fountain of knowledge that has shaped countless generations of intellectuals, national leaders, doctors, engineers, educators, and champions.
                </p>
                <p>
                  Our journey has always been marked by courage, harmony, and national unity. In 1924, we welcomed a bilingual curriculum; by 1941, our student enrolment exceeded 500; and in 1944, we opened our gates as a unified mixed school teaching in Sinhala, Tamil, and English. In 1947, under the visionary free education policy of Hon. Dr. C.W.W. Kannangara, our College was elevated to Central College status—cementing our commitment to provide world-class education to every child regardless of background.
                </p>
                <p>
                  Today, our students consistently prove their brilliance on both national and international stages. In 2017 alone, an unprecedented 124 Saranathians gained direct admission to prestigious state universities. In sports, co-curricular arts, robotic design, and scouting, our sons and daughters bring home championship shields year after year.
                </p>
                <p>
                  Our sacred motto, <strong className="font-sinhala text-[#06173d] dark:text-amber-300">පඤ්ඤා නරානං රතනං</strong> (Wisdom is the true jewel of humankind), is not merely a motto—it is our guiding compass. I invite our teachers, students, devoted parents, and esteemed alumni worldwide to hold this jewel high and continue elevating Saranath College to ever greater heights.
                </p>
              </>
            ) : (
              <>
                <p className="font-sinhala">
                  1882 දී ඇන්තනී ද සිල්වා මුල්ගුරුතුමන්ගේ කැපවීමෙන් සිසුන් තිස් දෙනෙකුගෙන් ඇරඹි අප විදුහල, ශතවර්ෂයකට අධික කාලයක් පුරා මෙරටට වෛද්‍යවරුන්, ඉංජිනේරුවන්, විද්වතුන්, ක්‍රීඩා ශූරයන් හා ජාතික නායකයින් රැසක් දායාද කළ පින්බිමකි.
                </p>
                <p className="font-sinhala">
                  අපගේ ඉතිහාසය ධෛර්යය සහ ජාතික සමගියෙන් පිරිපුන් එකකි. 1924 දී ද්විභාෂා පාසලක් බවට පත්වෙමින්ද, 1944 දී සිංහල, දෙමළ හා ඉංග්‍රීසි භාෂා ත්‍රිත්වයෙන්ම එකම සෙවණක දරුවන්ට අධ්‍යාපනය ලබාදෙමින්ද, 1947 නිදහස් අධ්‍යාපනයේ පියා ආචාර්ය සී.ඩබ්.ඩබ්. කන්නන්ගර මැතිතුමාගේ සංකල්පයට අනුව මධ්‍ය මහා විද්‍යාලයක් බවට උසස් වෙමින්ද සාරානාථය අභිමානයෙන් පෙරට ආවේය.
                </p>
                <p className="font-sinhala">
                  2017 වසරේදී විදුහලේ සිසු දරුවන් 124 දෙනෙකු එකවර රාජ්‍ය විශ්වවිද්‍යාල සඳහා සුදුසුකම් ලැබීම අපේ අධ්‍යාපනික ප්‍රමිතියේ සුවිශේෂී සන්ධිස්ථානයකි. එසේම ජාත්‍යන්තර ක්‍රීඩා පිටියේද අපේ දරුවන් දිනාගත් ජයග්‍රහණ රැසකි.
                </p>
                <p className="font-sinhala font-medium text-[#06173d] dark:text-amber-200">
                  'පඤ්ඤා නරානං රතනං' (ප්‍රඥාව මිනිසාට මැණිකක් බඳුය) යන උතුම් තේමාව පෙරදැරි කරගනිමින්, අපේ විදුහල් මාතාව තව තවත් බබළවන්නට ලොව පුරා විසිරී සිටින සියලුම ආදි සිසුන්ට, ගුරු මණ්ඩලයට සහ දෙමව්පියන්ට මම ආරාධනා කරමි.
                </p>
              </>
            )}

            <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="font-serif-display text-2xl font-bold text-[#06173d] dark:text-white">
                  R.M.C. Randeniya
                </div>
                <div className="text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400 font-mono-code">
                  Principal · Saranath College, Kuliyapitiya
                </div>
              </div>
              <div className="text-right">
                <span className="font-sinhala text-sm font-semibold text-slate-700 dark:text-slate-300">
                  චිරං ජයතු සාරානාථ මාතා!
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
