import React, { useState } from 'react';
import { Language, CollegeEvent, CollegeHouse } from '../types';
import { buildStandaloneHtml, downloadStandaloneHtml } from '../utils/htmlExporter';
import {
  X,
  Lock,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Calendar,
  Download,
  Upload,
  AlertCircle,
  Shield,
  ArrowRightCircle,
  Copy,
  Check,
} from 'lucide-react';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  events: CollegeEvent[];
  houses: CollegeHouse[];
  onEventsUpdated: (events: CollegeEvent[]) => void;
  onHousesUpdated: (housePoints: Array<{ id: string; points: number }>) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  lang,
  events,
  houses,
  onEventsUpdated,
  onHousesUpdated,
}) => {
  const [passcode, setPasscode] = useState<string>('');
  const [verifiedPasscode, setVerifiedPasscode] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'events' | 'houses' | 'export'>('events');
  const [copiedHtml, setCopiedHtml] = useState<boolean>(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [evType, setEvType] = useState<'upcoming' | 'past'>('upcoming');
  const [evCategory, setEvCategory] = useState<'academic' | 'sports' | 'cultural' | 'ceremony'>('academic');
  const [evTitleEn, setEvTitleEn] = useState<string>('');
  const [evTitleSi, setEvTitleSi] = useState<string>('');
  const [evDate, setEvDate] = useState<string>('');
  const [evTime, setEvTime] = useState<string>('');
  const [evVenue, setEvVenue] = useState<string>('');
  const [evDescEn, setEvDescEn] = useState<string>('');
  const [evDescSi, setEvDescSi] = useState<string>('');
  const [evOutcome, setEvOutcome] = useState<string>('');
  const [evImageUrl, setEvImageUrl] = useState<string>('');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [pointsDraft, setPointsDraft] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    houses.forEach((h) => {
      map[h.id] = h.points;
    });
    return map;
  });

  if (!isOpen) return null;

  const resetEventForm = () => {
    setEditingId(null);
    setEvType('upcoming');
    setEvCategory('academic');
    setEvTitleEn('');
    setEvTitleSi('');
    setEvDate('');
    setEvTime('');
    setEvVenue('');
    setEvDescEn('');
    setEvDescSi('');
    setEvOutcome('');
    setEvImageUrl('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: passcode.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.authorized) {
        setAuthError(data.error || 'Incorrect passcode.');
        return;
      }
      setVerifiedPasscode(passcode.trim());
      const map: Record<string, number> = {};
      houses.forEach((h) => {
        map[h.id] = h.points;
      });
      setPointsDraft(map);
    } catch {
      setAuthError('Unable to verify passcode.');
    }
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setEvImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifiedPasscode) return;
    setIsSubmitting(true);
    setErrorMsg(null);
    setStatusMsg(null);

    const payload = {
      type: evType,
      category: evCategory,
      titleEn: evTitleEn,
      titleSi: evTitleSi || evTitleEn,
      date: evDate,
      time: evTime,
      venue: evVenue,
      descriptionEn: evDescEn,
      descriptionSi: evDescSi || evDescEn,
      outcomeEn: evOutcome,
      imageUrl: evImageUrl,
    };

    try {
      const url = editingId ? `/api/events/${editingId}` : '/api/events';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': verifiedPasscode,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save event.');

      onEventsUpdated(data.events);
      setStatusMsg(editingId ? 'Event updated successfully.' : 'New event published successfully.');
      resetEventForm();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (evt: CollegeEvent) => {
    setEditingId(evt.id);
    setEvType(evt.type);
    setEvCategory(evt.category);
    setEvTitleEn(evt.titleEn);
    setEvTitleSi(evt.titleSi || '');
    setEvDate(evt.date);
    setEvTime(evt.time || '');
    setEvVenue(evt.venue);
    setEvDescEn(evt.descriptionEn);
    setEvDescSi(evt.descriptionSi || '');
    setEvOutcome(evt.outcomeEn || '');
    setEvImageUrl(evt.imageUrl || '');
    setStatusMsg(null);
    setErrorMsg(null);
  };

  const handleMoveToPast = async (evt: CollegeEvent) => {
    if (!verifiedPasscode) return;
    try {
      const res = await fetch(`/api/events/${evt.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': verifiedPasscode,
        },
        body: JSON.stringify({ type: 'past' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to move event.');
      onEventsUpdated(data.events);
      setStatusMsg(`"${evt.titleEn}" moved to Past Events.`);
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!verifiedPasscode) return;
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-passcode': verifiedPasscode },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete event.');
      onEventsUpdated(data.events);
      if (editingId === id) resetEventForm();
      setStatusMsg('Event removed.');
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleSaveHousePoints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifiedPasscode) return;
    setErrorMsg(null);
    setStatusMsg(null);
    const housePoints = houses.map((h) => ({
      id: h.id,
      points: Number(pointsDraft[h.id] ?? h.points) || 0,
    }));
    try {
      const res = await fetch('/api/houses', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': verifiedPasscode,
        },
        body: JSON.stringify({ housePoints }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update house points.');
      onHousesUpdated(data.housePoints);
      setStatusMsg('House points updated for Thisara, Mayura, Lihini & Paravi.');
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleCopyStandaloneHtml = async () => {
    const htmlCode = buildStandaloneHtml(events, houses);
    await navigator.clipboard.writeText(htmlCode);
    setCopiedHtml(true);
    setStatusMsg('Full single-page HTML/CSS code copied to clipboard.');
    setTimeout(() => setCopiedHtml(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-amber-400/30 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#06173d] text-white px-6 py-4 flex items-center justify-between border-b border-amber-400/20 shrink-0">
          <div>
            <h3 className="font-serif-display text-2xl font-bold tracking-wide">
              {lang === 'en' ? 'Saranath College Admin Panel' : 'සාරානාථ විද්‍යාලයීය පරිපාලක පුවරුව'}
            </h3>
            <p className="text-[11px] font-mono-code text-amber-300 uppercase tracking-wider">
              Upcoming Events · Past Chronicles · Thisara / Mayura / Lihini / Paravi
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close Admin Panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-800 dark:text-slate-100">
          {!verifiedPasscode ? (
            <form onSubmit={handleLogin} className="max-w-md mx-auto py-10 space-y-5 text-center">
              <div className="w-14 h-14 rounded-full bg-amber-400/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                <Lock className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-serif-display text-2xl font-bold text-[#06173d] dark:text-white">
                  {lang === 'en' ? 'Administrator Sign In' : 'පරිපාලක පිවිසුම'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {lang === 'en'
                    ? 'Enter the college admin passcode to update events, house points, or export HTML/CSS.'
                    : 'වැඩසටහන්, නිවාස ලකුණු හෝ HTML/CSS බාගත කිරීම සඳහා මුරපදය ඇතුළත් කරන්න.'}
                </p>
                <p className="text-[11px] font-mono-code text-amber-700 dark:text-amber-400 mt-2">
                  Passcode: saranath1882
                </p>
              </div>

              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter admin passcode..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />

              {authError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-600 dark:text-red-400">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-sm font-semibold bg-[#06173d] text-amber-300 hover:bg-[#0e2554] transition-colors cursor-pointer"
              >
                {lang === 'en' ? 'Unlock Admin Panel' : 'පුවරුව විවෘත කරන්න'}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Sub-navigation Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setActiveTab('events')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      activeTab === 'events'
                        ? 'bg-[#06173d] text-amber-300'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 inline mr-1.5" />
                    Events ({events.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('houses')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      activeTab === 'houses'
                        ? 'bg-[#06173d] text-amber-300'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5 inline mr-1.5" />
                    House Points
                  </button>
                  <button
                    onClick={() => setActiveTab('export')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      activeTab === 'export'
                        ? 'bg-[#06173d] text-amber-300'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Download className="w-3.5 h-3.5 inline mr-1.5" />
                    One-Page HTML/CSS
                  </button>
                </div>

                {statusMsg && (
                  <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{statusMsg}</span>
                  </div>
                )}
                {errorMsg && (
                  <div className="text-xs text-red-600 dark:text-red-400 font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errorMsg}</span>
                  </div>
                )}
              </div>

              {/* TAB 1: EVENTS MANAGER */}
              {activeTab === 'events' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <form
                    onSubmit={handleSaveEvent}
                    className="lg:col-span-6 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif-display text-xl font-bold text-[#06173d] dark:text-white">
                        {editingId ? 'Edit Event Details' : 'Publish New Event'}
                      </h4>
                      {editingId && (
                        <button
                          type="button"
                          onClick={resetEventForm}
                          className="text-xs text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
                        >
                          + Add New Instead
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold block mb-1">Event Type *</label>
                        <select
                          value={evType}
                          onChange={(e) => setEvType(e.target.value as 'upcoming' | 'past')}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs"
                        >
                          <option value="upcoming">Upcoming Event (ඉදිරි)</option>
                          <option value="past">Past Event (පසුගිය / කලින් වූ)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold block mb-1">Category *</label>
                        <select
                          value={evCategory}
                          onChange={(e) => setEvCategory(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs"
                        >
                          <option value="academic">Academic</option>
                          <option value="sports">Sports</option>
                          <option value="cultural">Cultural</option>
                          <option value="ceremony">Ceremony</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold block mb-1">Event Title (English) *</label>
                      <input
                        type="text"
                        required
                        value={evTitleEn}
                        onChange={(e) => setEvTitleEn(e.target.value)}
                        placeholder="e.g. Annual Sports Meet 2027"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold block mb-1">Event Title (සිංහල)</label>
                      <input
                        type="text"
                        value={evTitleSi}
                        onChange={(e) => setEvTitleSi(e.target.value)}
                        placeholder="e.g. වාර්ෂික නිවාසාන්තර ක්‍රීඩා උළෙල"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold block mb-1">Date *</label>
                        <input
                          type="date"
                          required
                          value={evDate}
                          onChange={(e) => setEvDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold block mb-1">Time</label>
                        <input
                          type="text"
                          value={evTime}
                          onChange={(e) => setEvTime(e.target.value)}
                          placeholder="e.g. 08:30 AM"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold block mb-1">Venue / Location *</label>
                      <input
                        type="text"
                        required
                        value={evVenue}
                        onChange={(e) => setEvVenue(e.target.value)}
                        placeholder="e.g. Meegahakotuwa Main Grounds"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold block mb-1">Description (English)</label>
                      <textarea
                        rows={2}
                        value={evDescEn}
                        onChange={(e) => setEvDescEn(e.target.value)}
                        placeholder="Summary of the event..."
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold block mb-1">Description (සිංහල)</label>
                      <textarea
                        rows={2}
                        value={evDescSi}
                        onChange={(e) => setEvDescSi(e.target.value)}
                        placeholder="වැඩසටහන පිළිබඳ කෙටි විස්තරය..."
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm resize-none"
                      />
                    </div>

                    {evType === 'past' && (
                      <div>
                        <label className="text-xs font-semibold block mb-1 text-emerald-700 dark:text-emerald-400">
                          Past Event Result / Highlights (කලින් සිදුවූ ප්‍රතිඵල හෝ ජයග්‍රහණ)
                        </label>
                        <input
                          type="text"
                          value={evOutcome}
                          onChange={(e) => setEvOutcome(e.target.value)}
                          placeholder="e.g. Thisara House won 1st Place with 540 points"
                          className="w-full px-3 py-2 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 text-sm"
                        />
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-semibold block mb-1">Event Photo (Upload or URL)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={evImageUrl}
                          onChange={(e) => setEvImageUrl(e.target.value)}
                          placeholder="/assets/aistudio/hero_9a4d2a7f.jpg or https://..."
                          className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs"
                        />
                        <label className="px-3 py-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-xs font-semibold cursor-pointer hover:bg-slate-100 shrink-0">
                          <Upload className="w-3.5 h-3.5 inline mr-1" />
                          Upload
                          <input type="file" accept="image/*" onChange={handleImageFile} className="hidden" />
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-400 text-[#06173d] hover:bg-amber-300 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{editingId ? 'Save Updated Event' : 'Publish Event'}</span>
                    </button>
                  </form>

                  <div className="lg:col-span-6 space-y-3">
                    <h4 className="font-serif-display text-xl font-bold text-[#06173d] dark:text-white">
                      Manage Existing Events ({events.length})
                    </h4>
                    <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
                      {events.map((evt) => (
                        <div
                          key={evt.id}
                          className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 flex flex-col gap-2"
                        >
                          <div className="flex items-center justify-between text-[11px] font-mono-code">
                            <span
                              className={`font-bold uppercase ${
                                evt.type === 'upcoming'
                                  ? 'text-blue-700 dark:text-blue-400'
                                  : 'text-emerald-700 dark:text-emerald-400'
                              }`}
                            >
                              {evt.type === 'upcoming' ? 'UPCOMING' : 'PAST EVENT'} · {evt.date}
                            </span>
                            <span className="text-slate-400 uppercase">{evt.category}</span>
                          </div>
                          <div className="font-serif-display text-lg font-bold text-[#06173d] dark:text-white leading-tight">
                            {evt.titleEn}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {evt.venue}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/70">
                            <button
                              type="button"
                              onClick={() => handleEditClick(evt)}
                              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-700 hover:bg-amber-400/20 text-slate-700 dark:text-slate-200 cursor-pointer flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" /> Edit
                            </button>
                            {evt.type === 'upcoming' && (
                              <button
                                type="button"
                                onClick={() => handleMoveToPast(evt)}
                                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 cursor-pointer flex items-center gap-1"
                              >
                                <ArrowRightCircle className="w-3 h-3" /> Mark Completed (Past)
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteEvent(evt.id)}
                              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-red-50 dark:bg-red-900/30 hover:bg-red-100 text-red-600 dark:text-red-400 cursor-pointer flex items-center gap-1 ml-auto"
                            >
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: HOUSE POINTS MANAGER */}
              {activeTab === 'houses' && (
                <form
                  onSubmit={handleSaveHousePoints}
                  className="max-w-2xl mx-auto bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-5"
                >
                  <div>
                    <h4 className="font-serif-display text-2xl font-bold text-[#06173d] dark:text-white">
                      Update Inter-House Points
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Adjust live points for Thisara, Mayura, Lihini, and Paravi Houses.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {houses.map((h) => (
                      <div
                        key={h.id}
                        className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                      >
                        <div className="flex items-center gap-2.5 mb-2">
                          <span
                            className="w-4 h-4 rounded-full shrink-0"
                            style={{ backgroundColor: h.colorHex }}
                          />
                          <div>
                            <div className="font-bold text-sm text-[#06173d] dark:text-white">
                              {h.nameEn}
                            </div>
                            <div className="text-[11px] font-sinhala text-slate-500">
                              {h.nameSi}
                            </div>
                          </div>
                        </div>
                        <input
                          type="number"
                          min={0}
                          value={pointsDraft[h.id] ?? h.points}
                          onChange={(e) =>
                            setPointsDraft({
                              ...pointsDraft,
                              [h.id]: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono-code font-bold"
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl text-sm font-semibold bg-amber-400 text-[#06173d] hover:bg-amber-300 transition-colors cursor-pointer"
                  >
                    Save House Points
                  </button>
                </form>
              )}

              {/* TAB 3: SINGLE-FILE HTML/CSS EXPORT */}
              {activeTab === 'export' && (
                <div className="max-w-2xl mx-auto bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                    <Download className="w-7 h-7" />
                  </div>
                  <h4 className="font-serif-display text-2xl font-bold text-[#06173d] dark:text-white">
                    {lang === 'en'
                      ? 'One-Page Pure HTML & CSS Website Code'
                      : 'මුළු වෙබ් අඩවියම තනි HTML / CSS ගොනුවක් ලෙස'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {lang === 'en'
                      ? 'Export or copy the complete Saranath College website as a single self-contained index.html file built purely with HTML, CSS, and Vanilla JS — including History, Principal, Thisara/Mayura/Lihini/Paravi Houses, Upcoming & Past Events, and built-in Admin Panel.'
                      : 'ඉතිහාසය, නිවාස 4 (තිසර, මයුර, ලිහිණි, පරවි), ඉදිරි හා පසුගිය වැඩසටහන් සහ Admin පුවරුව ඇතුළත් සම්පූර්ණ HTML/CSS කේතය බාගත හෝ Copy කරගන්න.'}
                  </p>
                  <div className="pt-2 flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => downloadStandaloneHtml(events, houses)}
                      className="px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-[#06173d] text-amber-300 hover:bg-[#0e2554] transition-colors cursor-pointer inline-flex items-center gap-2 shadow-md"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download index.html</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyStandaloneHtml}
                      className="px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-amber-400 text-[#06173d] hover:bg-amber-300 transition-colors cursor-pointer inline-flex items-center gap-2 shadow-sm"
                    >
                      {copiedHtml ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedHtml ? 'Copied HTML/CSS Code!' : 'Copy Full HTML/CSS Code'}</span>
                    </button>
                    <a
                      href="/saranath-college.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      Open Single-Page HTML
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
