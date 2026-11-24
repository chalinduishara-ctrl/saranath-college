import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

// Persistent JSON store for Events, House Points & Alumni
const DATA_DIR = path.resolve(__dirname, 'data');
const STORE_FILE = path.join(DATA_DIR, 'college-store.json');
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'saranath1882';

interface CollegeEvent {
  id: string;
  type: 'upcoming' | 'past';
  titleEn: string;
  titleSi: string;
  date: string;
  time?: string;
  venue: string;
  category: 'academic' | 'sports' | 'cultural' | 'ceremony';
  descriptionEn: string;
  descriptionSi: string;
  outcomeEn?: string;
  imageUrl?: string;
  createdAt: string;
}

interface HousePointEntry {
  id: string;
  points: number;
}

interface AlumniRecord {
  id: string;
  name: string;
  batchYear: string;
  house: string;
  profession: string;
  email: string;
  country: string;
  memory?: string;
  createdAt: string;
}

interface CollegeStore {
  events: CollegeEvent[];
  housePoints: HousePointEntry[];
  alumni: AlumniRecord[];
}

const DEFAULT_STORE: CollegeStore = {
  housePoints: [
    { id: 'thisara', points: 540 },
    { id: 'mayura', points: 515 },
    { id: 'lihini', points: 495 },
    { id: 'paravi', points: 525 },
  ],
  alumni: [
    {
      id: 'alm-1',
      name: 'Dr. Nalin Wijesinghe',
      batchYear: '2004',
      house: 'Thisara',
      profession: 'Consultant Physician',
      email: 'nalin.w@example.com',
      country: 'Colombo, Sri Lanka',
      memory: 'Winning the inter-house science quiz and morning assemblies under the palm trees.',
      createdAt: '2026-10-12T08:00:00.000Z',
    },
    {
      id: 'alm-2',
      name: 'Eng. Tharindu Senanayake',
      batchYear: '2012',
      house: 'Mayura',
      profession: 'Civil & Structural Engineer',
      email: 'tharindu.s@example.com',
      country: 'Melbourne, Australia',
      memory: 'March-past rehearsals on the Meegahakotuwa grounds with Mayura House.',
      createdAt: '2026-10-18T10:30:00.000Z',
    },
    {
      id: 'alm-3',
      name: 'Kavindi Rathnayake',
      batchYear: '2017',
      house: 'Lihini',
      profession: 'Software Architect',
      email: 'kavindi.r@example.com',
      country: 'London, United Kingdom',
      memory: 'Celebrating with the 2017 batch when 124 of us earned university admission.',
      createdAt: '2026-11-02T14:15:00.000Z',
    },
  ],
  events: [
    {
      id: 'evt-up-1',
      type: 'upcoming',
      titleEn: 'Annual Inter-House Athletic Championship 2027',
      titleSi: 'වාර්ෂික නිවාසාන්තර මලල ක්‍රීඩා උළෙල 2027',
      date: '2027-02-18',
      time: '08:00 AM',
      venue: 'Saranath College Main Grounds, Meegahakotuwa',
      category: 'sports',
      descriptionEn:
        'Thisara, Mayura, Lihini, and Paravi Houses compete across track and field disciplines, march-past drill displays, and relay finals.',
      descriptionSi:
        'තිසර, මයුර, ලිහිණි සහ පරවි නිවාස අතර පැවැත්වෙන වාර්ෂික මලල ක්‍රීඩා තරගාවලිය සහ ආචාර පෙළපාලිය.',
      imageUrl: '/assets/aistudio/hero_9a4d2a7f.jpg',
      createdAt: '2026-11-20T08:00:00.000Z',
    },
    {
      id: 'evt-up-2',
      type: 'upcoming',
      titleEn: '145th Founders’ Day & Prize Giving Ceremony',
      titleSi: '145 වන ආදි කර්තෘ දිනය සහ ත්‍යාග ප්‍රදානෝත්සවය',
      date: '2027-03-10',
      time: '09:00 AM',
      venue: 'Main Auditorium, Saranath College',
      category: 'ceremony',
      descriptionEn:
        'Commemorating Headmaster Anthony de Silva and celebrating top academic scholars, national sports medalists, and O/L & A/L achievers.',
      descriptionSi:
        'ඇන්තනී ද සිල්වා මුල්ගුරුතුමන් සිහිපත් කරමින් දක්ෂතම සිසු දරුවන් ඇගයීමේ වාර්ෂික ත්‍යාග ප්‍රදානෝත්සවය.',
      createdAt: '2026-11-20T08:30:00.000Z',
    },
    {
      id: 'evt-up-3',
      type: 'upcoming',
      titleEn: 'Wayamba Science & Robotics Innovation Exhibition',
      titleSi: 'වයඹ විද්‍යා හා රොබෝ තාක්ෂණ නව නිපැයුම් ප්‍රදර්ශනය',
      date: '2027-04-04',
      time: '08:30 AM',
      venue: 'Science & Technology Block',
      category: 'academic',
      descriptionEn:
        'Student inventors from Physical Science, Biological Science, and Technology streams showcase sustainable engineering and ICT prototypes.',
      descriptionSi:
        'විද්‍යා හා තාක්ෂණ අංශයේ සිසුන්ගේ නව නිපැයුම් හා රොබෝ තාක්ෂණික නිර්මාණ එළිදැක්වීම.',
      createdAt: '2026-11-21T09:00:00.000Z',
    },
    {
      id: 'evt-past-1',
      type: 'past',
      titleEn: 'Annual Poson Bakthi Gee & Dhamma Program',
      titleSi: 'වාර්ෂික පොසොන් භක්ති ගීත හා ධර්ම වැඩසටහන',
      date: '2026-06-20',
      time: '06:00 PM',
      venue: 'College Shrine & Pagoda Courtyard',
      category: 'cultural',
      descriptionEn:
        'Students, teachers, and parents gathered at the sacred college shrine courtyard for illuminated lanterns, devotional chants, and Dansala.',
      descriptionSi:
        'විදුහල් බුදු මැදුර අභියස පැවති පොසොන් භක්ති ගීත ප්‍රසංගය සහ පහන් කූඩු ප්‍රදර්ශනය.',
      outcomeEn: 'Over 2,400 attendees joined; 45 traditional lanterns crafted by the four Houses.',
      imageUrl: '/assets/aistudio/hero_9a4d2a7f.jpg',
      createdAt: '2026-06-22T10:00:00.000Z',
    },
    {
      id: 'evt-past-2',
      type: 'past',
      titleEn: 'North Western Province Schools Badminton Gold',
      titleSi: 'වයඹ පළාත් පාසල් බැඩ්මින්ටන් රන් පදක්කම් ජයග්‍රහණය',
      date: '2026-08-14',
      time: '04:00 PM',
      venue: 'Kurunegala Indoor Stadium',
      category: 'sports',
      descriptionEn:
        'Saranath College Under-19 Badminton squad swept the provincial finals, qualifying directly for the All-Island Championship.',
      descriptionSi:
        'වයඹ පළාත් වයස අවුරුදු 19 න් පහළ බැඩ්මින්ටන් ශූරතාවලියේ රන් පදක්කම් දිනා සමස්ත ලංකා තරගාවලියට සුදුසුකම් ලැබීම.',
      outcomeEn: '1st Place Overall Provincial Champions (Under-19 Boys & Girls).',
      createdAt: '2026-08-15T14:00:00.000Z',
    },
    {
      id: 'evt-past-3',
      type: 'past',
      titleEn: 'Past Pupils’ Association Annual General Meeting & Scholarship Night',
      titleSi: 'ආදි ශිෂ්‍ය සංගම් මහා සභා රැස්වීම හා ශිෂ්‍යත්ව ප්‍රදානය',
      date: '2026-09-28',
      time: '05:30 PM',
      venue: 'Meegahakotuwa Main Hall',
      category: 'ceremony',
      descriptionEn:
        'Alumni from Colombo, Kuliyapitiya, and overseas chapters awarded 35 merit scholarships to A/L students and handed over smart-board equipment.',
      descriptionSi:
        'දෙස් විදෙස් ආදි සිසුන්ගේ සහභාගීත්වයෙන් උසස් පෙළ සිසුන් 35 දෙනෙකුට ශිෂ්‍යත්ව හා නව ස්මාර්ට් පන්ති කාමර උපකරණ පරිත්‍යාග කිරීම.',
      outcomeEn: 'LKR 3.2 Million raised for Science Lab upgrade and student scholarships.',
      createdAt: '2026-09-29T11:00:00.000Z',
    },
  ],
};

function readStore(): CollegeStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(STORE_FILE)) {
      fs.writeFileSync(STORE_FILE, JSON.stringify(DEFAULT_STORE, null, 2), 'utf-8');
      return DEFAULT_STORE;
    }
    const raw = fs.readFileSync(STORE_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      events: Array.isArray(parsed.events) ? parsed.events : DEFAULT_STORE.events,
      housePoints: Array.isArray(parsed.housePoints) ? parsed.housePoints : DEFAULT_STORE.housePoints,
      alumni: Array.isArray(parsed.alumni) ? parsed.alumni : DEFAULT_STORE.alumni,
    };
  } catch (err) {
    console.error('Error reading store file:', err);
    return DEFAULT_STORE;
  }
}

function writeStore(store: CollegeStore): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing store file:', err);
  }
}

// Initialise server-side Google GenAI client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasKey: !!apiKey,
    school: 'Saranath College, Kuliyapitiya',
    founded: 1882,
    timestamp: new Date().toISOString(),
  });
});

async function callWithRetry<T>(fn: () => Promise<T>, retries = 3, delayMs = 1000): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    const msg = err?.message || '';
    const isTransient = msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('429');
    if (retries > 0 && isTransient) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return callWithRetry(fn, retries - 1, delayMs * 1.5);
    }
    throw err;
  }
}

function formatErrorMessage(err: any): string {
  if (!err) return 'An unexpected error occurred.';
  const msg = err.message || err.toString();
  try {
    const parsed = JSON.parse(msg);
    if (parsed.error?.message) {
      if (parsed.error.code === 503 || parsed.error.status === 'UNAVAILABLE') {
        return 'The AI model is currently experiencing high demand. Please try again in a few seconds.';
      }
      return parsed.error.message;
    }
  } catch {
    // not JSON
  }
  if (msg.includes('503') || msg.includes('UNAVAILABLE')) {
    return 'The AI model is currently experiencing high demand. Please try again in a few seconds.';
  }
  if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
    return 'Rate limit reached. If using advanced models, a billing-enabled key in AI Studio Settings > Secrets is recommended.';
  }
  return msg;
}

// ==========================================
// PORTAL DATA, EVENTS, HOUSES & ALUMNI ROUTES
// ==========================================

app.get('/api/portal-data', (_req: Request, res: Response) => {
  const store = readStore();
  res.json(store);
});

app.post('/api/admin/verify', (req: Request, res: Response) => {
  const { passcode } = req.body;
  if (passcode === ADMIN_PASSCODE) {
    return res.json({ authorized: true });
  }
  return res.status(401).json({ authorized: false, error: 'Incorrect admin passcode.' });
});

app.post('/api/events', (req: Request, res: Response) => {
  const passcode = req.headers['x-admin-passcode'] || req.body.passcode;
  if (passcode !== ADMIN_PASSCODE) {
    return res.status(401).json({ error: 'Unauthorized admin access.' });
  }

  const {
    type,
    titleEn,
    titleSi,
    date,
    time,
    venue,
    category,
    descriptionEn,
    descriptionSi,
    outcomeEn,
    imageUrl,
  } = req.body;

  if (!titleEn || !date || !venue) {
    return res.status(400).json({ error: 'Event title, date, and venue are required.' });
  }

  const store = readStore();
  const newEvent: CollegeEvent = {
    id: `evt-${Date.now()}`,
    type: type === 'past' ? 'past' : 'upcoming',
    titleEn: String(titleEn).trim(),
    titleSi: String(titleSi || titleEn).trim(),
    date: String(date),
    time: time ? String(time) : '',
    venue: String(venue).trim(),
    category: ['academic', 'sports', 'cultural', 'ceremony'].includes(category) ? category : 'academic',
    descriptionEn: String(descriptionEn || '').trim(),
    descriptionSi: String(descriptionSi || descriptionEn || '').trim(),
    outcomeEn: outcomeEn ? String(outcomeEn).trim() : '',
    imageUrl: imageUrl ? String(imageUrl).trim() : '',
    createdAt: new Date().toISOString(),
  };

  store.events.unshift(newEvent);
  writeStore(store);

  return res.status(201).json({ event: newEvent, events: store.events });
});

app.put('/api/events/:id', (req: Request, res: Response) => {
  const passcode = req.headers['x-admin-passcode'] || req.body.passcode;
  if (passcode !== ADMIN_PASSCODE) {
    return res.status(401).json({ error: 'Unauthorized admin access.' });
  }

  const { id } = req.params;
  const store = readStore();
  const idx = store.events.findIndex((e) => e.id === id);

  if (idx === -1) {
    return res.status(404).json({ error: 'Event not found.' });
  }

  const existing = store.events[idx];
  const updated: CollegeEvent = {
    ...existing,
    type: req.body.type === 'past' || req.body.type === 'upcoming' ? req.body.type : existing.type,
    titleEn: req.body.titleEn !== undefined ? String(req.body.titleEn).trim() : existing.titleEn,
    titleSi: req.body.titleSi !== undefined ? String(req.body.titleSi).trim() : existing.titleSi,
    date: req.body.date !== undefined ? String(req.body.date) : existing.date,
    time: req.body.time !== undefined ? String(req.body.time) : existing.time,
    venue: req.body.venue !== undefined ? String(req.body.venue).trim() : existing.venue,
    category: ['academic', 'sports', 'cultural', 'ceremony'].includes(req.body.category)
      ? req.body.category
      : existing.category,
    descriptionEn: req.body.descriptionEn !== undefined ? String(req.body.descriptionEn).trim() : existing.descriptionEn,
    descriptionSi: req.body.descriptionSi !== undefined ? String(req.body.descriptionSi).trim() : existing.descriptionSi,
    outcomeEn: req.body.outcomeEn !== undefined ? String(req.body.outcomeEn).trim() : existing.outcomeEn,
    imageUrl: req.body.imageUrl !== undefined ? String(req.body.imageUrl).trim() : existing.imageUrl,
  };

  store.events[idx] = updated;
  writeStore(store);

  return res.json({ event: updated, events: store.events });
});

app.delete('/api/events/:id', (req: Request, res: Response) => {
  const passcode = req.headers['x-admin-passcode'] || req.query.passcode;
  if (passcode !== ADMIN_PASSCODE) {
    return res.status(401).json({ error: 'Unauthorized admin access.' });
  }

  const { id } = req.params;
  const store = readStore();
  store.events = store.events.filter((e) => e.id !== id);
  writeStore(store);

  return res.json({ success: true, events: store.events });
});

app.put('/api/houses', (req: Request, res: Response) => {
  const passcode = req.headers['x-admin-passcode'] || req.body.passcode;
  if (passcode !== ADMIN_PASSCODE) {
    return res.status(401).json({ error: 'Unauthorized admin access.' });
  }

  const { housePoints } = req.body;
  if (!Array.isArray(housePoints)) {
    return res.status(400).json({ error: 'Invalid housePoints array.' });
  }

  const store = readStore();
  store.housePoints = housePoints.map((h: any) => ({
    id: String(h.id),
    points: Math.max(0, Number(h.points) || 0),
  }));
  writeStore(store);

  return res.json({ housePoints: store.housePoints });
});

// Alumni Registration & Directory Routes
app.post('/api/alumni', (req: Request, res: Response) => {
  const { name, batchYear, house, profession, email, country, memory } = req.body;
  if (!name || !batchYear || !email) {
    return res.status(400).json({ error: 'Name, batch year, and email are required.' });
  }

  const store = readStore();
  const record: AlumniRecord = {
    id: `alm-${Date.now()}`,
    name: String(name).trim(),
    batchYear: String(batchYear).trim(),
    house: String(house || 'Thisara').trim(),
    profession: String(profession || 'Saranathian').trim(),
    email: String(email).trim(),
    country: String(country || 'Sri Lanka').trim(),
    memory: memory ? String(memory).trim() : '',
    createdAt: new Date().toISOString(),
  };

  store.alumni.unshift(record);
  writeStore(store);

  return res.status(201).json({ record, alumni: store.alumni });
});

app.delete('/api/alumni/:id', (req: Request, res: Response) => {
  const passcode = req.headers['x-admin-passcode'] || req.query.passcode;
  if (passcode !== ADMIN_PASSCODE) {
    return res.status(401).json({ error: 'Unauthorized admin access.' });
  }
  const store = readStore();
  store.alumni = store.alumni.filter((a) => a.id !== req.params.id);
  writeStore(store);
  return res.json({ success: true, alumni: store.alumni });
});

// ==========================================
// GEMINI AI ROUTES (Chat, High-Res Image & Video)
// ==========================================

app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const {
      messages = [],
      model = 'gemini-4-hydrogen',
      rolePreset = 'general',
      thinkingMode = false,
    } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    if (!apiKey) {
      return res.status(401).json({
        error: 'Gemini API key is not configured in environment secrets.',
      });
    }

    let systemInstruction = `You are the official AI Academic Advisor and College Historian (සාරානාථ AI සහකරු) for Saranath College, Kuliyapitiya (founded in 1882).
You are knowledgeable about the College's proud 144+ year history:
- Founded in 1882 with 30 students under Headmaster Anthony de Silva.
- Became a bilingual institution in 1924.
- Surpassed 500 students by 1941.
- In 1944, became a united tri-lingual school teaching in Sinhala, Tamil, and English.
- Elevated to Central College in 1947 under Dr. C.W.W. Kannangara's free education policy.
- Relocated in 1951 (July 7) to Meegahakotuwa.
- Led by prominent principals including Mr. H.M. Dayananda Herath (1977) and currently Mr. R.M.C. Randeniya (re-assumed duties June 2021).
- Celebrated landmark achievements such as 124 students entering state universities in 2017, and ongoing international sports honors.
- School motto: 'පඤ්ඤා නරානං රතනං' (Panna Narānam Ratanam - 'Wisdom is the jewel of humankind').
- College Houses (Four Bird Houses): Thisara (තිසර - Swan / Gold), Mayura (මයුර - Peacock / Green), Lihini (ලිහිණි - Tern / Blue), Paravi (පරවි - Dove / Red).
- Colors: Deep Navy Blue and Gold.
Speak with dignity, intellectual warmth, and school pride. Support both English and Sinhala (සිංහල).`;

    if (rolePreset === 'stem') {
      systemInstruction = `You are the Saranath College Advanced Level Senior STEM and Mathematics Mentor.
You provide deep, rigorous, step-by-step mathematical reasoning, physics proofs, chemistry analyses, and algorithmic explanations.
Guide students patiently with methodical derivations, clear formulas, and intuitive explanations.`;
    } else if (rolePreset === 'guide') {
      systemInstruction = `You are the Saranath College Campus Guide and Activities Coordinator.
You help prospective students, parents, and alumni navigate school facilities (laboratories, ICT center, shrine pagoda, playgrounds, library), academic subject combinations, the four Houses (Thisara, Mayura, Lihini, Paravi), sports clubs, societies, and upcoming events.
Be warm, inviting, energetic, and practical.`;
    } else if (rolePreset === 'speed') {
      systemInstruction = `You are the Saranath College Quick Info Desk.
Provide concise, fast, and directly actionable facts about school contact info (+94 37 228 1355), bell times, term dates, admission procedures, and the four Houses (Thisara, Mayura, Lihini, Paravi). Answer in 2-3 brief sentences whenever possible.`;
    }

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    let targetModel = model;
    const config: Record<string, any> = {
      systemInstruction,
    };

    if (thinkingMode || targetModel === 'gemini-4-carbon') {
      targetModel = 'gemini-4-carbon';
      config.thinkingConfig = {
        thinkingLevel: ThinkingLevel.HIGH,
      };
    }

    let modelActuallyUsed = targetModel;
    const response = await callWithRetry(async () => {
      try {
        return await ai.models.generateContent({
          model: targetModel,
          contents,
          config,
        });
      } catch (err: any) {
        const msg = err?.message || '';
        // Graceful fallback on transient 503 if not explicitly locked to thinking
        if (msg.includes('503') && targetModel !== 'gemini-3.1-flash-lite') {
          modelActuallyUsed = 'gemini-3.1-flash-lite';
          const fallbackConfig: Record<string, any> = { systemInstruction };
          return await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents,
            config: fallbackConfig,
          });
        }
        throw err;
      }
    });

    const replyText = response.text || '';

    return res.json({
      text: replyText,
      modelUsed: modelActuallyUsed,
      success: true,
    });
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    return res.status(500).json({
      error: formatErrorMessage(err),
      details: err?.toString(),
    });
  }
});

// High-quality image generation endpoint (1K, 2K, 4K) using gemini-3-pro-image-preview
app.post('/api/generate-image', async (req: Request, res: Response) => {
  try {
    const {
      prompt,
      imageSize = '1K',
      aspectRatio = '1:1',
    } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    if (!apiKey) {
      return res.status(401).json({
        error: 'Gemini API key is not configured in environment secrets.',
      });
    }

    const validSizes = ['1K', '2K', '4K'];
    const selectedSize = validSizes.includes(imageSize) ? imageSize : '1K';
    const targetModel = 'gemini-3-pro-image-preview';

    const response = await callWithRetry(async () =>
      ai.models.generateContent({
        model: targetModel,
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio || '1:1',
            imageSize: selectedSize,
          },
        },
      })
    );

    let imageUrl = '';
    const parts = response.candidates?.[0]?.content?.parts ?? [];
    for (const part of parts) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType || 'image/png';
        imageUrl = `data:${mime};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) {
      throw new Error('The image model did not return any image data.');
    }

    return res.json({
      imageUrl,
      modelUsed: targetModel,
      imageSize: selectedSize,
      aspectRatio,
      success: true,
    });
  } catch (err: any) {
    console.error('Error in /api/generate-image:', err);
    return res.status(500).json({
      error: formatErrorMessage(err),
      details: err?.toString(),
    });
  }
});

// Video animation endpoint using gemini-omni-1.2-flash via Interactions API
app.post('/api/animate-video', async (req: Request, res: Response) => {
  try {
    const {
      imageBase64,
      mimeType = 'image/jpeg',
      prompt = 'Animate this school scene with gentle natural breeze through the palm trees, warm golden morning light, and cinematic atmospheric movement.',
      aspectRatio = '16:9',
    } = req.body;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: 'imageBase64 is required.' });
    }

    if (!apiKey) {
      return res.status(401).json({
        error: 'Gemini API key is not configured in environment secrets.',
      });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
    const validAspectRatio = aspectRatio === '9:16' ? '9:16' : '16:9';

    const interaction = await callWithRetry(async () =>
      ai.interactions.create(
        {
          model: 'gemini-omni-1.2-flash',
          input: [
            {
              type: 'image',
              mime_type: mimeType,
              data: cleanBase64,
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
          background: false,
          store: false,
          stream: false,
          response_format: {
            type: 'video',
            aspect_ratio: validAspectRatio,
          },
        },
        { timeout: 300000 }
      )
    );

    const videoPart = interaction.output_video;
    if (videoPart && videoPart.data) {
      const vMime = videoPart.mime_type || 'video/mp4';
      const videoUrl = `data:${vMime};base64,${videoPart.data}`;
      return res.json({
        videoUrl,
        aspectRatio: validAspectRatio,
        success: true,
      });
    } else if (videoPart && videoPart.uri) {
      return res.json({
        videoUrl: videoPart.uri,
        aspectRatio: validAspectRatio,
        success: true,
      });
    }

    throw new Error('Video generation completed, but no video output was returned.');
  } catch (err: any) {
    console.error('Error in /api/animate-video:', err);
    return res.status(500).json({
      error: formatErrorMessage(err),
      details: err?.toString(),
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Saranath College Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
