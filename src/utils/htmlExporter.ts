import { CollegeEvent, CollegeHouse } from '../types';
import { HOUSES_DATA, TIMELINE_DATA, ACADEMIC_STREAMS, SCHOOL_ANTHEM } from '../data/schoolData';

export function buildStandaloneHtml(
  events: CollegeEvent[],
  houses: CollegeHouse[] = HOUSES_DATA
): string {
  const initialDataJson = JSON.stringify({
    events,
    houses: houses.map((h) => ({ id: h.id, points: h.points })),
  }).replace(/<\/script>/gi, '<\\/script>');

  const housesMetadataJson = JSON.stringify(houses).replace(/<\/script>/gi, '<\\/script>');
  const timelineJson = JSON.stringify(TIMELINE_DATA).replace(/<\/script>/gi, '<\\/script>');
  const streamsJson = JSON.stringify(ACADEMIC_STREAMS).replace(/<\/script>/gi, '<\\/script>');
  const anthemJson = JSON.stringify(SCHOOL_ANTHEM).replace(/<\/script>/gi, '<\\/script>');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<title>Saranath College, Kuliyapitiya | Since 1882</title>
<meta name="description" content="Official portal of Saranath College, Kuliyapitiya — celebrating a proud legacy of wisdom, unity, and excellence since 1882." />
<meta name="theme-color" content="#06173d" />
<link rel="icon" href="logo.jpg" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Noto+Serif+Sinhala:wght@500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
<style>
  :root {
    --navy: #06173d;
    --navy-dark: #030d24;
    --navy-light: #0d255a;
    --gold: #d9a845;
    --gold-light: #f4dc9b;
    --paper: #f8fafc;
    --surface: #ffffff;
    --ink: #0f172a;
    --muted: #475569;
    --line: #e2e8f0;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; color: var(--ink); background: var(--paper); line-height: 1.65; }
  body { overflow-x: hidden; }
  img { max-width: 100%; display: block; }
  .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
  .si { font-family: 'Noto Serif Sinhala', serif; }
  .mono { font-family: 'JetBrains Mono', monospace; font-variant-numeric: tabular-nums; }
  .container { width: min(1240px, 100% - 2rem); margin-inline: auto; }
  button { font-family: inherit; cursor: pointer; }

  /* Scroll Progress Bar */
  .scroll-progress {
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    width: 100%;
    background: linear-gradient(90deg, #d9a845, #f4dc9b, #eab308);
    transform-origin: left center;
    transform: scaleX(0);
    z-index: 90;
    pointer-events: none;
  }

  /* Scroll Reveal Animations */
  .reveal {
    opacity: 0;
    transform: translateY(26px);
    transition: opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1), transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .reveal-left {
    opacity: 0;
    transform: translateX(-28px);
    transition: opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1), transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .reveal-right {
    opacity: 0;
    transform: translateX(28px);
    transition: opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1), transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .reveal.is-visible,
  .reveal-left.is-visible,
  .reveal-right.is-visible {
    opacity: 1;
    transform: translate(0, 0);
  }

  @keyframes heroFadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes crestFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
  .hero-anim-1 { animation: heroFadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
  .hero-anim-2 { animation: heroFadeUp 0.65s 0.08s cubic-bezier(0.22,1,0.36,1) both; }
  .hero-anim-3 { animation: heroFadeUp 0.7s 0.16s cubic-bezier(0.22,1,0.36,1) both; }
  .hero-anim-4 { animation: heroFadeUp 0.7s 0.24s cubic-bezier(0.22,1,0.36,1) both; }
  .hero-anim-5 { animation: heroFadeUp 0.75s 0.32s cubic-bezier(0.22,1,0.36,1) both; }

  /* Navbar */
  header.topbar { position: fixed; top: 0; left: 0; right: 0; z-index: 50; background: rgba(6, 23, 61, 0.96); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(217, 168, 69, 0.25); padding: 0.75rem 0; transition: box-shadow 0.3s ease; }
  header.topbar.scrolled { box-shadow: 0 10px 25px -5px rgba(3, 13, 36, 0.45); }
  .nav-inner { display: flex; align-items: center; justify-content: space-between; gap: 1.25rem; }
  .brand { display: flex; align-items: center; gap: 0.75rem; text-decoration: none; color: #fff; background: none; border: 0; text-align: left; }
  .brand img { width: 42px; height: 42px; border-radius: 50%; object-fit: cover; border: 2px solid var(--gold); transition: transform 0.25s ease; }
  .brand:hover img { transform: scale(1.06); }
  .brand-title { font-family: 'Cormorant Garamond', serif; font-size: 1.25rem; font-weight: 700; letter-spacing: 0.05em; display: block; line-height: 1; white-space: nowrap; }
  .brand-sub { font-size: 0.65rem; letter-spacing: 0.22em; color: var(--gold-light); text-transform: uppercase; font-family: 'JetBrains Mono', monospace; white-space: nowrap; }
  .nav-links { display: flex; align-items: center; gap: 1.5rem; }
  .nav-links a { color: #e2e8f0; text-decoration: none; font-size: 0.875rem; font-weight: 500; white-space: nowrap; transition: color 0.2s; }
  .nav-links a:hover { color: var(--gold); }
  .nav-actions { display: flex; align-items: center; gap: 0.6rem; flex-shrink: 0; }
  .btn-lang { background: rgba(255,255,255,0.08); color: #fff; border: 1px solid rgba(255,255,255,0.2); padding: 0.45rem 0.8rem; border-radius: 0.5rem; font-size: 0.75rem; font-weight: 600; white-space: nowrap; transition: background 0.2s; }
  .btn-lang:hover { background: rgba(255,255,255,0.16); }
  .btn-admin { background: linear-gradient(135deg, var(--gold), #f3d285); color: var(--navy); border: 0; padding: 0.5rem 0.95rem; border-radius: 0.5rem; font-size: 0.75rem; font-weight: 700; white-space: nowrap; transition: transform 0.2s ease; }
  .btn-admin:hover { transform: translateY(-1px); }

  /* Hero */
  .hero { position: relative; min-height: 92vh; padding: 7rem 0 3rem; background: var(--navy); color: #fff; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; }
  .hero-bg { position: absolute; inset: 0; background: url('hero.jpg') center/cover no-repeat; opacity: 0.35; transform: scale(1.06); will-change: transform; transition: transform 0.08s linear; }
  .hero-scrim { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(6,23,61,0.88) 0%, rgba(6,23,61,0.72) 50%, #06173d 100%); }
  .hero-content { position: relative; z-index: 2; text-align: center; max-width: 900px; margin: auto; padding: 2rem 1rem; }
  .hero-kicker { display: inline-block; padding: 0.4rem 1rem; border-radius: 999px; background: rgba(255,255,255,0.08); border: 1px solid rgba(217,168,69,0.35); color: var(--gold-light); font-size: 0.72rem; letter-spacing: 0.14em; font-family: 'JetBrains Mono', monospace; margin-bottom: 1.5rem; }
  .hero-motto { font-size: clamp(1.6rem, 4vw, 2.5rem); color: var(--gold-light); font-weight: 700; }
  .hero-motto-tr { font-style: italic; color: #cbd5e1; font-size: 0.95rem; margin-bottom: 1rem; }
  .hero h1 { font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 700; line-height: 1.08; margin: 0.75rem 0 1.25rem; text-wrap: balance; }
  .hero h1 span { color: var(--gold); }
  .hero-lead { color: #cbd5e1; font-size: 1.05rem; max-width: 65ch; margin: 0 auto 2rem; }
  .hero-cta-row { display: flex; flex-wrap: wrap; gap: 0.85rem; justify-content: center; }
  .btn-primary { background: var(--gold); color: var(--navy); border: 0; padding: 0.8rem 1.4rem; border-radius: 0.6rem; font-weight: 700; font-size: 0.875rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem; transition: transform 0.2s ease, background 0.2s ease; }
  .btn-primary:hover { background: #e8b954; transform: translateY(-2px); }
  .btn-secondary { background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.22); padding: 0.8rem 1.35rem; border-radius: 0.6rem; font-weight: 600; font-size: 0.875rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.45rem; transition: transform 0.2s ease, background 0.2s ease; }
  .btn-secondary:hover { background: rgba(255,255,255,0.18); transform: translateY(-2px); }
  .stats-bar { position: relative; z-index: 2; display: grid; grid-template-columns: repeat(5, 1fr); gap: 1px; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.12); border-radius: 0.9rem; overflow: hidden; margin-top: 2rem; }
  .stat-cell { background: rgba(6,23,61,0.85); padding: 1.25rem 0.75rem; text-align: center; transition: background 0.2s ease; }
  .stat-cell:hover { background: rgba(14,37,84,0.92); }
  .stat-val { font-family: 'Cormorant Garamond', serif; font-size: 1.85rem; font-weight: 700; color: var(--gold-light); line-height: 1.1; }
  .stat-lbl { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: #cbd5e1; margin-top: 0.25rem; }

  /* Sections */
  section.pad { padding: 5rem 0; }
  section.alt { background: #ffffff; border-top: 1px solid var(--line); }
  .sec-head { text-align: center; max-width: 740px; margin: 0 auto 3rem; }
  .eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #b45309; margin-bottom: 0.5rem; }
  .sec-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem, 4.5vw, 3.1rem); font-weight: 700; color: var(--navy); line-height: 1.12; }
  .gold-rule { width: 64px; height: 4px; background: var(--gold); border-radius: 999px; margin: 1rem auto; }
  .sec-desc { color: var(--muted); font-size: 0.975rem; }

  /* Segmented Tabs */
  .tabs-wrap { display: inline-flex; flex-wrap: wrap; gap: 0.35rem; padding: 0.35rem; background: #e2e8f0; border-radius: 0.75rem; margin-top: 1.5rem; }
  .tab-btn { border: 0; background: transparent; padding: 0.5rem 1rem; border-radius: 0.55rem; font-size: 0.78rem; font-weight: 600; color: #475569; transition: background 0.2s, color 0.2s; }
  .tab-btn.active { background: var(--navy); color: var(--gold-light); }

  /* Cards Grid */
  .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
  .card { background: var(--surface); border: 1px solid var(--line); border-radius: 1rem; padding: 1.5rem; box-shadow: 0 1px 3px rgba(15,23,42,0.04); transition: transform 0.25s ease, box-shadow 0.25s ease; }
  .card-hover:hover { transform: translateY(-4px); box-shadow: 0 14px 28px -12px rgba(6,23,61,0.14); }
  .card-dark { background: linear-gradient(135deg, var(--navy), var(--navy-light)); color: #fff; border: 1px solid rgba(217,168,69,0.3); border-radius: 1rem; padding: 2rem; }

  /* Timeline */
  .timeline { position: relative; margin-left: 6rem; padding-left: 2.25rem; display: flex; flex-direction: column; gap: 2rem; }
  .tl-spine-bg { position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: rgba(217,168,69,0.22); }
  .tl-spine-fill { position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: linear-gradient(180deg, #d9a845, #f59e0b); transform-origin: top center; transform: scaleY(0); }
  .tl-item { position: relative; }
  .tl-dot { position: absolute; left: -2.8rem; top: 0.5rem; width: 16px; height: 16px; border-radius: 50%; background: #fff; border: 4px solid var(--gold); transition: transform 0.25s ease; }
  .tl-item:hover .tl-dot { transform: scale(1.25); }
  .tl-year { position: absolute; left: -8.25rem; top: 0.1rem; width: 4.5rem; text-align: right; font-family: 'Cormorant Garamond', serif; font-size: 1.65rem; font-weight: 700; color: var(--navy); }
  .tl-meta { font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; color: #b45309; text-transform: uppercase; margin-bottom: 0.35rem; }

  /* Principal */
  .principal-grid { display: grid; grid-template-columns: 340px 1fr; gap: 2.5rem; align-items: start; }
  .crest-box { width: 130px; height: 130px; border-radius: 50%; margin: 0 auto 1rem; padding: 3px; background: linear-gradient(135deg, var(--gold-light), var(--gold)); animation: crestFloat 6s ease-in-out infinite; }
  .crest-box img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }

  /* Houses */
  .house-badge { width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 1rem; }

  /* Events */
  .events-bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; padding-bottom: 1.5rem; margin-bottom: 2rem; border-bottom: 1px solid var(--line); }
  .event-card { background: var(--paper); border: 1px solid var(--line); border-radius: 1rem; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.25s ease, box-shadow 0.25s ease; }
  .event-card:hover { transform: translateY(-4px); box-shadow: 0 14px 28px -12px rgba(6,23,61,0.14); }
  .event-img-wrap { overflow: hidden; height: 180px; }
  .event-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.45s ease; }
  .event-card:hover .event-img { transform: scale(1.06); }
  .event-body { padding: 1.5rem; }
  .event-meta { font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; color: #b45309; font-weight: 600; margin-bottom: 0.4rem; }
  .event-foot { padding: 0.85rem 1.5rem; background: #fff; border-top: 1px solid var(--line); display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--muted); }
  .outcome-box { margin-top: 0.9rem; padding-top: 0.75rem; border-top: 1px solid var(--line); font-size: 0.8rem; color: #065f46; font-weight: 600; }

  /* Back to top */
  .back-top { position: fixed; bottom: 1.5rem; right: 1.5rem; width: 44px; height: 44px; border-radius: 50%; background: var(--navy); color: var(--gold-light); border: 1px solid rgba(217,168,69,0.45); box-shadow: 0 10px 25px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; opacity: 0; pointer-events: none; transform: translateY(10px); transition: opacity 0.25s ease, transform 0.25s ease; z-index: 45; }
  .back-top.show { opacity: 1; pointer-events: auto; transform: translateY(0); }

  /* Forms & Modal */
  .modal-backdrop { position: fixed; inset: 0; z-index: 100; background: rgba(3, 13, 36, 0.75); backdrop-filter: blur(4px); display: none; align-items: center; justify-content: center; padding: 1rem; }
  .modal-backdrop.open { display: flex; }
  .modal-panel { background: #fff; width: 100%; max-width: 960px; max-height: 90vh; border-radius: 1.25rem; overflow: hidden; display: flex; flex-direction: column; border: 1px solid rgba(217,168,69,0.35); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.4); }
  .modal-head { background: var(--navy); color: #fff; padding: 1.15rem 1.5rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(217,168,69,0.25); }
  .modal-body { padding: 1.5rem; overflow-y: auto; flex: 1; }
  .field { margin-bottom: 0.9rem; }
  .field label { display: block; font-size: 0.75rem; font-weight: 600; color: #334155; margin-bottom: 0.3rem; }
  .field input, .field select, .field textarea { width: 100%; padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 0.55rem; font-size: 0.875rem; font-family: inherit; }

  /* Footer */
  footer { background: var(--navy-dark); color: #cbd5e1; padding: 4rem 0 2.5rem; border-top: 1px solid rgba(217,168,69,0.25); }
  .footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 1.2fr; gap: 2.5rem; padding-bottom: 2.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
  .footer-bottom { padding-top: 1.5rem; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem; font-size: 0.78rem; color: #94a3b8; font-family: 'JetBrains Mono', monospace; }

  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    .reveal, .reveal-left, .reveal-right { opacity: 1; transform: none; transition: none; }
    .hero-anim-1, .hero-anim-2, .hero-anim-3, .hero-anim-4, .hero-anim-5, .crest-box { animation: none; }
  }

  @media (max-width: 960px) {
    .nav-links { display: none; }
    .stats-bar { grid-template-columns: repeat(2, 1fr); }
    .grid-3, .grid-4 { grid-template-columns: repeat(2, 1fr); }
    .principal-grid, .footer-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 640px) {
    .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
    .timeline { margin-left: 0.75rem; padding-left: 1.75rem; }
    .tl-year { position: static; text-align: left; width: auto; margin-bottom: 0.25rem; }
    .tl-dot { left: -2.32rem; }
  }
</style>
</head>
<body>

<div class="scroll-progress" id="scrollProgress"></div>

<header class="topbar" id="topNavbar">
  <div class="container nav-inner">
    <a href="#hero" class="brand">
      <img src="logo.jpg" alt="Saranath College Crest" onerror="this.style.display='none'" />
      <div>
        <span class="brand-title">SARANATH COLLEGE</span>
        <span class="brand-sub">KULIYAPITIYA · EST. 1882</span>
      </div>
    </a>
    <nav class="nav-links">
      <a href="#heritage" data-en="History" data-si="ඉතිහාසය">History</a>
      <a href="#principal" data-en="Principal" data-si="විදුහල්පති">Principal</a>
      <a href="#academics" data-en="Houses &amp; Academics" data-si="නිවාස හා අධ්‍යාපනය">Houses &amp; Academics</a>
      <a href="#events" data-en="Events" data-si="වැඩසටහන්">Events</a>
    </nav>
    <div class="nav-actions">
      <button class="btn-lang" id="langToggle" type="button">සිංහල</button>
      <button class="btn-admin" id="openAdminTop" type="button" data-en="Admin Panel" data-si="පරිපාලක">Admin Panel</button>
    </div>
  </div>
</header>

<section class="hero" id="hero">
  <div class="hero-bg" id="heroBg"></div>
  <div class="hero-scrim"></div>
  <div class="hero-content" id="heroContent">
    <div class="hero-kicker hero-anim-1" data-en="A PROUD LEGACY SINCE 1882 · KULIYAPITIYA" data-si="1882 සිට අභිමානවත් අධ්‍යාපන පදනම · කුලියාපිටිය">A PROUD LEGACY SINCE 1882 · KULIYAPITIYA</div>
    <div class="hero-motto si hero-anim-2">පඤ්ඤා නරානං රතනං</div>
    <div class="hero-motto-tr serif hero-anim-2">“Wisdom is the Jewel of Humankind”</div>
    <h1 class="serif hero-anim-3" id="heroTitle">Shaping Leaders, Champions &amp; Scholars for <span>144+ Years</span></h1>
    <p class="hero-lead hero-anim-4" id="heroLead">From 30 visionary students in 1882 to a modern center of academic distinction, sports championships, and cultural harmony in the North Western Province.</p>
    <div class="hero-cta-row hero-anim-5">
      <a href="#heritage" class="btn-primary" data-en="Explore 144-Year Journey" data-si="අපේ ඉතිහාසය ගවේෂණය">Explore 144-Year Journey</a>
      <a href="#events" class="btn-secondary" data-en="Upcoming &amp; Past Events" data-si="විදුහල් වැඩසටහන්">Upcoming &amp; Past Events</a>
      <button type="button" class="btn-secondary" id="openAnthemBtn" data-en="College Anthem" data-si="විදුහල් ගීතය">College Anthem</button>
    </div>
  </div>
  <div class="container hero-anim-5">
    <div class="stats-bar">
      <div class="stat-cell"><div class="stat-val mono" data-count="1882">1882</div><div class="stat-lbl" data-en="Founded In" data-si="ආරම්භය">Founded In</div></div>
      <div class="stat-cell"><div class="stat-val mono" data-count="30">30</div><div class="stat-lbl" data-en="First Cohort" data-si="මුල්ම සිසුන්">First Cohort</div></div>
      <div class="stat-cell"><div class="stat-val mono" data-count="3800" data-suffix="+">3,800+</div><div class="stat-lbl" data-en="Active Students" data-si="වත්මන් සිසුන්">Active Students</div></div>
      <div class="stat-cell"><div class="stat-val mono" data-count="124">124</div><div class="stat-lbl" data-en="University Entrants" data-si="සරසවි ප්‍රවේශ (2017)">University Entrants</div></div>
      <div class="stat-cell"><div class="stat-val mono" id="collegeYears">144+</div><div class="stat-lbl" data-en="Years of Glory" data-si="වසර ගණන">Years of Glory</div></div>
    </div>
  </div>
</section>

<section class="pad" id="heritage">
  <div class="container">
    <div class="sec-head reveal">
      <div class="eyebrow" data-en="OUR LIVING HERITAGE" data-si="ඓතිහාසික චාරිකාව">OUR LIVING HERITAGE</div>
      <h2 class="sec-title" data-en="144 Years of Heritage &amp; Glory" data-si="වසර 144 ක අභිමානවත් සාරානාථ ගමන්මඟ">144 Years of Heritage &amp; Glory</h2>
      <div class="gold-rule"></div>
      <p class="sec-desc" data-en="From a courageous 30-student academy founded in 1882 to a modern center of excellence in Kuliyapitiya." data-si="1882 දී ඇන්තනී ද සිල්වා මුල්ගුරුතුමන් විසින් දැල්වූ නැණ පහන අද වන විට මුළු මහත් ජාතියම ඒකාලෝක කරන මහා ප්‍රදීපාගාරයකි.">From a courageous 30-student academy founded in 1882 to a modern center of excellence in Kuliyapitiya.</p>
      <div class="tabs-wrap" id="timelineFilters">
        <button class="tab-btn active" data-cat="all" data-en="All" data-si="සියල්ල">All</button>
        <button class="tab-btn" data-cat="foundation" data-en="Foundations" data-si="ආරම්භය">Foundations</button>
        <button class="tab-btn" data-cat="academic" data-en="Academic" data-si="අධ්‍යාපනික">Academic</button>
        <button class="tab-btn" data-cat="leadership" data-en="Leadership" data-si="නායකත්වය">Leadership</button>
        <button class="tab-btn" data-cat="unity" data-en="Unity" data-si="සමගිය">Unity</button>
      </div>
    </div>
    <div class="timeline" id="timelineWrap">
      <div class="tl-spine-bg"></div>
      <div class="tl-spine-fill" id="tlSpineFill"></div>
      <div id="timelineContainer" style="display:flex;flex-direction:column;gap:2rem;"></div>
    </div>
  </div>
</section>

<section class="pad alt" id="principal">
  <div class="container">
    <div class="reveal" style="margin-bottom: 2rem;">
      <div class="eyebrow" data-en="COLLEGE LEADERSHIP &amp; VISION" data-si="විදුහල්පති පණිවුඩය">COLLEGE LEADERSHIP &amp; VISION</div>
      <h2 class="sec-title" data-en="From the Principal's Desk" data-si="විදුහල්පතිතුමන්ගේ පණිවුඩය">From the Principal's Desk</h2>
      <div class="gold-rule" style="margin-inline: 0;"></div>
    </div>
    <div class="principal-grid">
      <div class="card-dark reveal-left" style="text-align:center;">
        <div class="crest-box"><img src="logo.jpg" alt="Saranath College Crest" onerror="this.style.display='none'" /></div>
        <h3 class="serif" style="font-size:1.65rem;color:var(--gold-light);">Mr. R.M.C. Randeniya</h3>
        <p class="mono" style="font-size:0.72rem;color:#cbd5e1;letter-spacing:0.15em;text-transform:uppercase;margin-top:0.25rem;" data-en="Principal, Saranath College" data-si="විදුහල්පති, සාරානාථ විද්‍යාලය">Principal, Saranath College</p>
        <div style="margin-top:1.5rem;padding-top:1rem;border-top:1px solid rgba(255,255,255,0.15);text-align:left;font-size:0.76rem;" class="mono">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.4rem;"><span style="color:#94a3b8;">Assumed Duties:</span><span style="color:var(--gold-light);">14 June 2021</span></div>
          <div style="display:flex;justify-content:space-between;"><span style="color:#94a3b8;">Campus:</span><span>Meegahakotuwa</span></div>
        </div>
      </div>
      <div class="card reveal-right" style="background:var(--paper);padding:2rem;">
        <p class="si" style="font-size:1.25rem;font-weight:700;color:var(--navy);margin-bottom:1rem;" data-en="“A Proud Legacy of Learning, Unity, and Academic Rigour Since 1882”" data-si="“වසර 144 ක අභිමානවත් සාරානාථ විදුහල් මාතාවගේ සෙවණට ඔබ සැම සාදරයෙන් පිළිගනිමි”">“A Proud Legacy of Learning, Unity, and Academic Rigour Since 1882”</p>
        <p id="principalLetter" style="color:#334155;margin-bottom:1rem;">It is with immense pride that I welcome you to Saranath College, Kuliyapitiya. Founded in 1882 under Headmaster Anthony de Silva with just thirty students, our College has grown over more than a century into an esteemed fountain of knowledge shaping intellectuals, doctors, engineers, educators, and champions. Guided by our sacred motto “පඤ්ඤා නරානං රතනං”, we continue elevating Saranath College to greater heights alongside our dedicated staff, students, parents, and global alumni.</p>
        <div style="padding-top:1rem;border-top:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
          <div>
            <div class="serif" style="font-size:1.4rem;font-weight:700;color:var(--navy);">R.M.C. Randeniya</div>
            <div class="mono" style="font-size:0.72rem;color:#b45309;">Principal · Saranath College, Kuliyapitiya</div>
          </div>
          <div class="si" style="font-weight:700;color:var(--navy);">චිරං ජයතු සාරානාථ මාතා!</div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="pad" id="academics">
  <div class="container">
    <div class="sec-head reveal">
      <div class="eyebrow" data-en="LIFE AT SARANATH" data-si="අධ්‍යාපනය හා නිවාස">LIFE AT SARANATH</div>
      <h2 class="sec-title" data-en="Collegiate Houses &amp; Academics" data-si="ක්‍රීඩා නිවාස සහ අධ්‍යාපනික අංශ">Collegiate Houses &amp; Academics</h2>
      <div class="gold-rule"></div>
      <p class="sec-desc" data-en="Four historic bird houses — Thisara, Mayura, Lihini, and Paravi — alongside five Advanced Level academic streams." data-si="තිසර, මයුර, ලිහිණි සහ පරවි යන ක්‍රීඩා නිවාස 4 සහ උසස් පෙළ විෂය ධාරාවන්.">Four historic bird houses — Thisara, Mayura, Lihini, and Paravi — alongside five Advanced Level academic streams.</p>
      <div class="tabs-wrap" id="lifeTabs">
        <button class="tab-btn active" data-tab="houses" data-en="4 Bird Houses" data-si="ක්‍රීඩා නිවාස 4">4 Bird Houses</button>
        <button class="tab-btn" data-tab="streams" data-en="A/L Streams" data-si="උසස් පෙළ අංශ">A/L Streams</button>
      </div>
    </div>
    <div id="housesPane" class="grid-4"></div>
    <div id="streamsPane" class="grid-3" style="display:none;"></div>
  </div>
</section>

<section class="pad alt" id="events">
  <div class="container">
    <div class="reveal" style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:1rem;margin-bottom:2rem;">
      <div>
        <div class="eyebrow" data-en="COLLEGE CALENDAR &amp; CHRONICLES" data-si="විදුහල් දින දර්ශනය">COLLEGE CALENDAR &amp; CHRONICLES</div>
        <h2 class="sec-title" data-en="Upcoming &amp; Past Events" data-si="ඉදිරි වැඩසටහන් සහ පසුගිය සිදුවීම්">Upcoming &amp; Past Events</h2>
        <div class="gold-rule" style="margin-inline:0;"></div>
      </div>
      <button type="button" class="btn-primary" id="openAdminEvents" style="background:var(--navy);color:var(--gold-light);border:1px solid rgba(217,168,69,0.4);" data-en="Admin Panel · Update Events" data-si="පරිපාලක පුවරුව (Admin)">Admin Panel · Update Events</button>
    </div>

    <div class="events-bar reveal">
      <div class="tabs-wrap" id="eventTypeTabs" style="margin-top:0;">
        <button class="tab-btn active" data-etype="upcoming" id="tabUpcoming">Upcoming Events</button>
        <button class="tab-btn" data-etype="past" id="tabPast">Past Events</button>
      </div>
      <div class="tabs-wrap" id="eventCatTabs" style="margin-top:0;background:transparent;">
        <button class="tab-btn active" data-ecat="all">All</button>
        <button class="tab-btn" data-ecat="academic">Academic</button>
        <button class="tab-btn" data-ecat="sports">Sports</button>
        <button class="tab-btn" data-ecat="cultural">Cultural</button>
        <button class="tab-btn" data-ecat="ceremony">Ceremony</button>
      </div>
    </div>

    <div class="grid-3" id="eventsGrid"></div>
  </div>
</section>

<footer>
  <div class="container">
    <div class="footer-grid reveal">
      <div>
        <h4 class="serif" style="font-size:1.6rem;color:#fff;">SARANATH COLLEGE</h4>
        <p class="mono" style="font-size:0.72rem;color:var(--gold-light);margin-bottom:0.85rem;">KULIYAPITIYA · ESTABLISHED 1882</p>
        <p style="font-size:0.875rem;color:#94a3b8;max-width:38ch;">A proud sanctuary of wisdom, brotherhood, and moral virtue for over 144 years.</p>
        <p class="si" style="color:var(--gold-light);font-weight:700;margin-top:0.75rem;">පඤ්ඤා නරානං රතනං</p>
      </div>
      <div>
        <h5 class="mono" style="font-size:0.75rem;color:var(--gold-light);margin-bottom:0.75rem;">EXPLORE</h5>
        <div style="display:flex;flex-direction:column;gap:0.5rem;font-size:0.875rem;">
          <a href="#heritage" style="color:#cbd5e1;text-decoration:none;">Our History</a>
          <a href="#principal" style="color:#cbd5e1;text-decoration:none;">Principal's Desk</a>
          <a href="#academics" style="color:#cbd5e1;text-decoration:none;">Thisara · Mayura · Lihini · Paravi</a>
          <a href="#events" style="color:#cbd5e1;text-decoration:none;">Upcoming &amp; Past Events</a>
        </div>
      </div>
      <div>
        <h5 class="mono" style="font-size:0.75rem;color:var(--gold-light);margin-bottom:0.75rem;">CONTACT</h5>
        <p class="mono" style="font-size:0.8rem;color:#cbd5e1;line-height:1.8;">Meegahakotuwa, Kuliyapitiya 60200<br />Tel: +94 37 228 1355</p>
        <button type="button" id="openAdminFooter" class="btn-admin" style="margin-top:0.85rem;">Open Admin Panel</button>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© <span id="yrNow"></span> Saranath College, Kuliyapitiya. All rights reserved.</span>
      <span class="si" style="color:var(--gold-light);">පඤ්ඤා නරානං රතනං</span>
    </div>
  </div>
</footer>

<button type="button" class="back-top" id="backToTopBtn" aria-label="Back to top">↑</button>

<!-- Admin Panel Modal -->
<div class="modal-backdrop" id="adminModal">
  <div class="modal-panel">
    <div class="modal-head">
      <div>
        <h3 class="serif" style="font-size:1.5rem;">College Admin Panel</h3>
        <span class="mono" style="font-size:0.7rem;color:var(--gold-light);">MANAGE UPCOMING &amp; PAST EVENTS · HOUSE POINTS</span>
      </div>
      <button type="button" id="closeAdmin" style="background:none;border:0;color:#fff;font-size:1.4rem;">×</button>
    </div>
    <div class="modal-body" id="adminBody"></div>
  </div>
</div>

<!-- Anthem Modal -->
<div class="modal-backdrop" id="anthemModal">
  <div class="modal-panel" style="max-width:650px;">
    <div class="modal-head">
      <div>
        <h3 class="serif" style="font-size:1.5rem;">The College Anthem</h3>
        <span class="mono" style="font-size:0.7rem;color:var(--gold-light);">SARANATH COLLEGE KULIYAPITIYA</span>
      </div>
      <button type="button" id="closeAnthem" style="background:none;border:0;color:#fff;font-size:1.4rem;">×</button>
    </div>
    <div class="modal-body" id="anthemBody"></div>
  </div>
</div>

<script>
(function() {
  const STORAGE_KEY = 'saranath_portal_store_v3';
  const ADMIN_PASSCODE = 'saranath1882';
  const SEED_STORE = ${initialDataJson};
  const HOUSES_META = ${housesMetadataJson};
  const TIMELINE = ${timelineJson};
  const STREAMS = ${streamsJson};
  const ANTHEM = ${anthemJson};

  let lang = 'en';
  let tlCat = 'all';
  let evtType = 'upcoming';
  let evtCat = 'all';
  let adminUnlocked = false;
  let editingEventId = null;

  // IntersectionObserver for scroll reveal animations
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  function observeReveals(root = document) {
    root.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
      revealObserver.observe(el);
    });
  }

  // Scroll Progress, Parallax, Spine & Back-to-top
  function handleScrollAnimations() {
    const scrollY = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0;
    const bar = document.getElementById('scrollProgress');
    if (bar) bar.style.transform = 'scaleX(' + progress + ')';

    const nav = document.getElementById('topNavbar');
    if (nav) nav.classList.toggle('scrolled', scrollY > 36);

    const backBtn = document.getElementById('backToTopBtn');
    if (backBtn) backBtn.classList.toggle('show', scrollY > 400);

    const hero = document.getElementById('hero');
    const heroBg = document.getElementById('heroBg');
    if (hero && heroBg && scrollY <= hero.offsetHeight) {
      const ratio = scrollY / hero.offsetHeight;
      heroBg.style.transform = 'translateY(' + (ratio * 70) + 'px) scale(' + (1.06 + ratio * 0.08) + ')';
    }

    const tlWrap = document.getElementById('timelineWrap');
    const spineFill = document.getElementById('tlSpineFill');
    if (tlWrap && spineFill) {
      const rect = tlWrap.getBoundingClientRect();
      const viewTrigger = window.innerHeight * 0.72;
      const pct = Math.max(0, Math.min(1, (viewTrigger - rect.top) / rect.height));
      spineFill.style.transform = 'scaleY(' + pct + ')';
    }
  }
  window.addEventListener('scroll', handleScrollAnimations, { passive: true });
  document.getElementById('backToTopBtn').onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // KPI Count-Up Animation
  function animateCountUps() {
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1100;
      const start = performance.now();
      function step(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = Math.round(target * eased);
        el.textContent = (target >= 1000 && el.getAttribute('data-count') === '3800' ? val.toLocaleString() : val) + suffix;
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  function loadStore() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          events: Array.isArray(parsed.events) ? parsed.events : SEED_STORE.events,
          houses: Array.isArray(parsed.houses) ? parsed.houses : SEED_STORE.houses,
        };
      }
    } catch (e) {}
    return JSON.parse(JSON.stringify(SEED_STORE));
  }

  function saveStore(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
  }

  let store = loadStore();
  const yr = new Date().getFullYear();
  document.getElementById('yrNow').textContent = yr;
  document.getElementById('collegeYears').textContent = (yr - 1882) + '+';

  function updateLanguageTexts() {
    document.querySelectorAll('[data-en]').forEach(el => {
      el.innerHTML = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-si');
    });
    document.getElementById('langToggle').textContent = lang === 'en' ? 'සිංහල' : 'English';
    document.getElementById('heroTitle').innerHTML = lang === 'en'
      ? 'Shaping Leaders, Champions &amp; Scholars for <span>144+ Years</span>'
      : 'ශතවර්ෂයකට අධික <span>ප්‍රෞඪ අධ්‍යාපනික</span> උරුමයේ මුදුන්මල්කඩ';
    document.getElementById('heroLead').textContent = lang === 'en'
      ? 'From 30 visionary students in 1882 to a modern center of academic distinction, sports championships, and cultural harmony in the North Western Province.'
      : '1882 දී සිසුන් තිස් දෙනෙකුගෙන් ඇරඹි ගමන අද වන විට දහස් සංඛ්‍යාත බුද්ධිමතුන් හා ක්‍රීඩා ශූරයන් බිහිකළ අද්විතීය අධ්‍යාපන ක්ෂේම භූමියකි.';
    renderTimeline();
    renderHousesAndStreams();
    renderEvents();
  }

  function renderTimeline() {
    const list = tlCat === 'all' ? TIMELINE : TIMELINE.filter(i => i.category === tlCat);
    const wrap = document.getElementById('timelineContainer');
    wrap.innerHTML = list.map((item, idx) => \`
      <div class="tl-item reveal" style="transition-delay: \${Math.min(idx * 60, 240)}ms;">
        <span class="tl-dot"></span>
        <div class="tl-year">\${item.year}</div>
        <div class="card card-hover">
          <div class="tl-meta">\${item.category} · No. \${idx + 1}\${item.exactDate ? ' · ' + item.exactDate : ''}</div>
          <h3 class="serif" style="font-size:1.45rem;color:var(--navy);margin-bottom:0.4rem;">\${lang === 'en' ? item.titleEn : item.titleSi}</h3>
          <p style="font-size:0.9rem;color:#475569;">\${lang === 'en' ? item.descEn : item.descSi}</p>
        </div>
      </div>
    \`).join('');
    observeReveals(wrap);
  }

  function renderHousesAndStreams() {
    const hPane = document.getElementById('housesPane');
    hPane.innerHTML = HOUSES_META.map((h, idx) => {
      const ptObj = (store.houses || []).find(x => x.id === h.id);
      const pts = ptObj ? ptObj.points : h.points;
      return \`
        <div class="card card-hover reveal" style="transition-delay: \${idx * 80}ms;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.85rem;">
            <div class="house-badge" style="background:\${h.colorHex};">\${h.nameEn[0]}</div>
            <div style="text-align:right;">
              <div class="mono" style="font-size:0.65rem;color:#64748b;text-transform:uppercase;">Points</div>
              <div class="mono" style="font-size:1.1rem;font-weight:700;color:var(--navy);">\${pts} pts</div>
            </div>
          </div>
          <h3 class="serif" style="font-size:1.5rem;color:var(--navy);">\${lang === 'en' ? h.nameEn : h.nameSi}</h3>
          <div style="font-size:0.75rem;font-weight:700;color:\${h.colorHex};margin:0.2rem 0 0.5rem;">\${lang === 'en' ? h.birdEn + ' · ' + h.colorNameEn : h.birdSi + ' · ' + h.colorNameSi}</div>
          <p style="font-size:0.8rem;color:#475569;">\${lang === 'en' ? h.descriptionEn : h.descriptionSi}</p>
        </div>
      \`;
    }).join('');
    observeReveals(hPane);

    const sPane = document.getElementById('streamsPane');
    sPane.innerHTML = STREAMS.map((s, idx) => \`
      <div class="card card-hover reveal" style="transition-delay: \${idx * 70}ms;">
        <h3 class="serif" style="font-size:1.35rem;color:var(--navy);margin-bottom:0.4rem;">\${lang === 'en' ? s.titleEn : s.titleSi}</h3>
        <p style="font-size:0.82rem;color:#475569;margin-bottom:0.75rem;">\${lang === 'en' ? s.descriptionEn : s.descriptionSi}</p>
        <div class="mono" style="font-size:0.72rem;color:#b45309;">\${(lang === 'en' ? s.subjectsEn : s.subjectsSi).join(' · ')}</div>
      </div>
    \`).join('');
    observeReveals(sPane);
  }

  function renderEvents() {
    const upcoming = store.events.filter(e => e.type === 'upcoming');
    const past = store.events.filter(e => e.type === 'past');
    document.getElementById('tabUpcoming').textContent = (lang === 'en' ? 'Upcoming Events' : 'ඉදිරි වැඩසටහන්') + ' (' + upcoming.length + ')';
    document.getElementById('tabPast').textContent = (lang === 'en' ? 'Past Events' : 'පසුගිය සිදුවීම්') + ' (' + past.length + ')';

    const list = (evtType === 'upcoming' ? upcoming : past).filter(e => evtCat === 'all' || e.category === evtCat);
    const grid = document.getElementById('eventsGrid');
    if (list.length === 0) {
      grid.innerHTML = '<div class="card" style="grid-column:1/-1;text-align:center;padding:3rem;">No events in this category yet. Use Admin Panel to add events.</div>';
      return;
    }
    grid.innerHTML = list.map((e, idx) => \`
      <article class="event-card reveal" style="transition-delay: \${Math.min(idx * 80, 240)}ms;">
        <div>
          \${e.imageUrl ? '<div class="event-img-wrap"><img class="event-img" src="' + e.imageUrl + '" alt="" onerror="this.parentElement.style.display=\\'none\\'" /></div>' : ''}
          <div class="event-body">
            <div class="event-meta">\${e.category.toUpperCase()} · \${e.date}\${e.time ? ' · ' + e.time : ''}</div>
            <h3 class="serif" style="font-size:1.5rem;color:var(--navy);line-height:1.2;margin-bottom:0.5rem;">\${lang === 'en' ? e.titleEn : (e.titleSi || e.titleEn)}</h3>
            <p style="font-size:0.875rem;color:#475569;">\${lang === 'en' ? e.descriptionEn : (e.descriptionSi || e.descriptionEn)}</p>
            \${e.type === 'past' && e.outcomeEn ? '<div class="outcome-box">Outcome: ' + e.outcomeEn + '</div>' : ''}
          </div>
        </div>
        <div class="event-foot"><span>\${e.venue}</span><span class="mono">\${e.type === 'upcoming' ? 'SCHEDULED' : 'COMPLETED'}</span></div>
      </article>
    \`).join('');
    observeReveals(grid);
  }

  function renderAdminBody(feedbackText) {
    const body = document.getElementById('adminBody');
    if (!adminUnlocked) {
      body.innerHTML = \`
        <form id="adminLoginForm" style="max-width:400px;margin:2rem auto;text-align:center;">
          <h4 class="serif" style="font-size:1.7rem;color:var(--navy);margin-bottom:0.5rem;">Admin Authentication</h4>
          <p style="font-size:0.82rem;color:#64748b;margin-bottom:1.25rem;">Enter passcode to update Upcoming Events, Past Chronicles, and House Points. (Default: <code class="mono">saranath1882</code>)</p>
          <div class="field"><input type="password" id="adminPassInput" placeholder="Enter passcode (saranath1882)" required /></div>
          <p id="loginErr" style="color:#dc2626;font-size:0.8rem;margin-bottom:0.75rem;display:none;">Incorrect passcode.</p>
          <button type="submit" class="btn-primary" style="width:100%;justify-content:center;">Unlock Admin Panel</button>
        </form>
      \`;
      document.getElementById('adminLoginForm').onsubmit = function(ev) {
        ev.preventDefault();
        if (document.getElementById('adminPassInput').value === ADMIN_PASSCODE) {
          adminUnlocked = true;
          renderAdminBody();
        } else {
          document.getElementById('loginErr').style.display = 'block';
        }
      };
      return;
    }

    const editingEvt = editingEventId ? store.events.find(x => x.id === editingEventId) : null;
    body.innerHTML = \`
      \${feedbackText ? '<div style="margin-bottom:1rem;padding:0.75rem 1rem;border-radius:0.65rem;background:#ecfdf5;color:#065f46;font-size:0.85rem;font-weight:600;">' + feedbackText + '</div>' : ''}
      <div class="grid-2" style="align-items:start;">
        <div>
          <h4 class="serif" style="font-size:1.45rem;color:var(--navy);margin-bottom:0.75rem;">\${editingEvt ? 'Edit Event' : 'Add Upcoming or Past Event'}</h4>
          <form id="eventCrudForm" class="card">
            <div class="grid-2" style="gap:0.65rem;">
              <div class="field"><label>Event Status *</label>
                <select id="efType">
                  <option value="upcoming" \${editingEvt && editingEvt.type === 'upcoming' ? 'selected' : ''}>Upcoming Event</option>
                  <option value="past" \${editingEvt && editingEvt.type === 'past' ? 'selected' : ''}>Past Event</option>
                </select>
              </div>
              <div class="field"><label>Category</label>
                <select id="efCat">
                  <option value="academic" \${editingEvt && editingEvt.category === 'academic' ? 'selected' : ''}>Academic</option>
                  <option value="sports" \${editingEvt && editingEvt.category === 'sports' ? 'selected' : ''}>Sports</option>
                  <option value="cultural" \${editingEvt && editingEvt.category === 'cultural' ? 'selected' : ''}>Cultural</option>
                  <option value="ceremony" \${editingEvt && editingEvt.category === 'ceremony' ? 'selected' : ''}>Ceremony</option>
                </select>
              </div>
            </div>
            <div class="field"><label>Title (English) *</label><input id="efTitleEn" required value="\${editingEvt ? editingEvt.titleEn : ''}" placeholder="e.g. Annual Prize Giving" /></div>
            <div class="field"><label>Title (සිංහල)</label><input id="efTitleSi" value="\${editingEvt ? (editingEvt.titleSi || '') : ''}" placeholder="e.g. වාර්ෂික ත්‍යාග ප්‍රදානෝත්සවය" /></div>
            <div class="grid-2" style="gap:0.65rem;">
              <div class="field"><label>Date *</label><input type="date" id="efDate" required value="\${editingEvt ? editingEvt.date : ''}" /></div>
              <div class="field"><label>Time</label><input id="efTime" value="\${editingEvt ? (editingEvt.time || '') : ''}" placeholder="08:30 AM" /></div>
            </div>
            <div class="field"><label>Venue *</label><input id="efVenue" required value="\${editingEvt ? editingEvt.venue : ''}" placeholder="Main Auditorium / Grounds" /></div>
            <div class="field"><label>Description (English)</label><textarea id="efDescEn" rows="2">\${editingEvt ? editingEvt.descriptionEn : ''}</textarea></div>
            <div class="field"><label>Past Event Outcome (Optional)</label><input id="efOutcome" value="\${editingEvt ? (editingEvt.outcomeEn || '') : ''}" placeholder="e.g. Thisara House won overall championship" /></div>
            <div style="display:flex;gap:0.5rem;">
              <button type="submit" class="btn-primary" style="flex:1;justify-content:center;">\${editingEvt ? 'Save Changes' : 'Publish Event'}</button>
              \${editingEvt ? '<button type="button" id="cancelEditBtn" class="btn-secondary" style="color:var(--navy);border-color:#cbd5e1;">Cancel</button>' : ''}
            </div>
          </form>

          <h4 class="serif" style="font-size:1.35rem;color:var(--navy);margin:1.25rem 0 0.65rem;">Update House Points</h4>
          <form id="housesForm" class="card">
            <div class="grid-2" style="gap:0.65rem;">
              \${HOUSES_META.map(h => {
                const cur = (store.houses || []).find(x => x.id === h.id);
                return '<div class="field"><label>' + h.nameEn + ' (' + h.nameSi + ')</label><input type="number" data-hid="' + h.id + '" value="' + (cur ? cur.points : h.points) + '" /></div>';
              }).join('')}
            </div>
            <button type="submit" class="btn-primary" style="width:100%;justify-content:center;">Update House Points</button>
          </form>
        </div>

        <div>
          <h4 class="serif" style="font-size:1.45rem;color:var(--navy);margin-bottom:0.75rem;">Existing Events (\${store.events.length})</h4>
          <div style="display:flex;flex-direction:column;gap:0.75rem;max-height:540px;overflow-y:auto;">
            \${store.events.map(e => \`
              <div class="card" style="padding:1rem;">
                <div class="mono" style="font-size:0.7rem;color:\${e.type === 'upcoming' ? '#1d4ed8' : '#047857'};font-weight:700;">\${e.type.toUpperCase()} · \${e.date}</div>
                <div style="font-weight:700;color:var(--navy);margin:0.2rem 0;">\${e.titleEn}</div>
                <div style="display:flex;flex-wrap:wrap;gap:0.4rem;margin-top:0.5rem;">
                  <button type="button" class="btn-lang" style="color:var(--navy);border-color:#cbd5e1;" data-edit="\${e.id}">Edit</button>
                  \${e.type === 'upcoming' ? '<button type="button" class="btn-lang" style="color:#047857;border-color:#a7f3d0;" data-topast="' + e.id + '">Move to Past</button>' : ''}
                  <button type="button" class="btn-lang" style="color:#dc2626;border-color:#fecaca;" data-del="\${e.id}">Delete</button>
                </div>
              </div>
            \`).join('')}
          </div>
        </div>
      </div>
    \`;

    if (document.getElementById('cancelEditBtn')) {
      document.getElementById('cancelEditBtn').onclick = () => { editingEventId = null; renderAdminBody(); };
    }

    document.getElementById('eventCrudForm').onsubmit = function(ev) {
      ev.preventDefault();
      const payload = {
        id: editingEventId || 'evt-' + Date.now(),
        type: document.getElementById('efType').value,
        category: document.getElementById('efCat').value,
        titleEn: document.getElementById('efTitleEn').value.trim(),
        titleSi: document.getElementById('efTitleSi').value.trim() || document.getElementById('efTitleEn').value.trim(),
        date: document.getElementById('efDate').value,
        time: document.getElementById('efTime').value.trim(),
        venue: document.getElementById('efVenue').value.trim(),
        descriptionEn: document.getElementById('efDescEn').value.trim(),
        descriptionSi: document.getElementById('efDescEn').value.trim(),
        outcomeEn: document.getElementById('efOutcome').value.trim(),
      };
      if (editingEventId) {
        store.events = store.events.map(x => x.id === editingEventId ? Object.assign({}, x, payload) : x);
        editingEventId = null;
      } else {
        store.events.unshift(payload);
      }
      saveStore(store);
      renderEvents();
      renderAdminBody('Event saved successfully.');
    };

    document.getElementById('housesForm').onsubmit = function(ev) {
      ev.preventDefault();
      const inputs = ev.target.querySelectorAll('input[data-hid]');
      store.houses = Array.from(inputs).map(inp => ({ id: inp.getAttribute('data-hid'), points: Number(inp.value) || 0 }));
      saveStore(store);
      renderHousesAndStreams();
      renderAdminBody('House points updated for Thisara, Mayura, Lihini, and Paravi.');
    };

    body.querySelectorAll('[data-edit]').forEach(btn => {
      btn.onclick = () => { editingEventId = btn.getAttribute('data-edit'); renderAdminBody(); };
    });
    body.querySelectorAll('[data-topast]').forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute('data-topast');
        store.events = store.events.map(x => x.id === id ? Object.assign({}, x, { type: 'past' }) : x);
        saveStore(store);
        renderEvents();
        renderAdminBody('Moved event to Past Events.');
      };
    });
    body.querySelectorAll('[data-del]').forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute('data-del');
        store.events = store.events.filter(x => x.id !== id);
        saveStore(store);
        renderEvents();
        renderAdminBody('Event deleted.');
      };
    });
  }

  document.getElementById('langToggle').onclick = () => { lang = lang === 'en' ? 'si' : 'en'; updateLanguageTexts(); };
  document.querySelectorAll('#timelineFilters .tab-btn').forEach(b => {
    b.onclick = () => {
      document.querySelectorAll('#timelineFilters .tab-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      tlCat = b.getAttribute('data-cat');
      renderTimeline();
    };
  });
  document.querySelectorAll('#lifeTabs .tab-btn').forEach(b => {
    b.onclick = () => {
      document.querySelectorAll('#lifeTabs .tab-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      const t = b.getAttribute('data-tab');
      document.getElementById('housesPane').style.display = t === 'houses' ? 'grid' : 'none';
      document.getElementById('streamsPane').style.display = t === 'streams' ? 'grid' : 'none';
      observeReveals();
    };
  });
  document.querySelectorAll('#eventTypeTabs .tab-btn').forEach(b => {
    b.onclick = () => {
      document.querySelectorAll('#eventTypeTabs .tab-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      evtType = b.getAttribute('data-etype');
      renderEvents();
    };
  });
  document.querySelectorAll('#eventCatTabs .tab-btn').forEach(b => {
    b.onclick = () => {
      document.querySelectorAll('#eventCatTabs .tab-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      evtCat = b.getAttribute('data-ecat');
      renderEvents();
    };
  });

  function openAdmin() {
    document.getElementById('adminModal').classList.add('open');
    renderAdminBody();
  }
  document.getElementById('openAdminTop').onclick = openAdmin;
  document.getElementById('openAdminEvents').onclick = openAdmin;
  document.getElementById('openAdminFooter').onclick = openAdmin;
  document.getElementById('closeAdmin').onclick = () => document.getElementById('adminModal').classList.remove('open');

  document.getElementById('openAnthemBtn').onclick = () => {
    document.getElementById('anthemBody').innerHTML = \`
      <div class="card" style="margin-bottom:1rem;"><p class="si" style="white-space:pre-line;font-size:1.05rem;">\${ANTHEM.verse1Si}</p></div>
      <div class="card" style="margin-bottom:1rem;background:rgba(217,168,69,0.12);border-color:rgba(217,168,69,0.4);"><p class="si" style="white-space:pre-line;font-size:1.1rem;font-weight:700;color:var(--navy);">\${ANTHEM.chorusSi}</p></div>
      <div class="card"><p class="si" style="white-space:pre-line;font-size:1.05rem;">\${ANTHEM.verse2Si}</p></div>
    \`;
    document.getElementById('anthemModal').classList.add('open');
  };
  document.getElementById('closeAnthem').onclick = () => document.getElementById('anthemModal').classList.remove('open');

  renderTimeline();
  renderHousesAndStreams();
  renderEvents();
  observeReveals();
  animateCountUps();
  handleScrollAnimations();
})();
</script>
</body>
</html>`;
}

export function downloadStandaloneHtml(
  events: CollegeEvent[],
  houses: CollegeHouse[] = HOUSES_DATA
): void {
  const html = buildStandaloneHtml(events, houses);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'saranath-college-index.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
