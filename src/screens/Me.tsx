import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import { Squiggle } from "../components/Decor";
import { ALL_INTERESTS, NEIGHBORHOODS } from "../data/interests";
import { useStore } from "../store";
import type { Interest } from "../types";

export default function Me() {
  const { state, updateMe, logout } = useStore();
  const nav = useNavigate();
  const me = state.me!;

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(me.name);
  const [bio, setBio] = useState(me.bio || "");
  const [neighborhood, setNeighborhood] = useState(me.neighborhood);
  const [interests, setInterests] = useState<Interest[]>(me.interests);

  const save = () => {
    updateMe({ name, bio, neighborhood, interests });
    setEditing(false);
  };

  const toggle = (i: Interest) =>
    setInterests((curr) =>
      curr.includes(i) ? curr.filter((x) => x !== i) : [...curr, i]
    );

  const handleLogout = () => {
    if (confirm("בטוח שברצונך להתנתק? הנתונים המקומיים יישמרו עד הכניסה הבאה.")) {
      logout();
      nav("/", { replace: true });
    }
  };

  return (
    <>
      <AppHeader title="הפרופיל שלי" />
      <div className="screen-pad pt-4 pb-8 space-y-6">
        <div className="card relative p-6 text-center overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-olive-100 to-transparent" />
          <div className="relative">
            <img
              src={me.photo}
              alt=""
              className="w-24 h-24 mx-auto rounded-3xl bg-paper-200 border-2 border-ink-900 shadow-sticker"
            />
            <h2 className="mt-4 font-display text-2xl text-ink-900 tracking-tight2">
              {me.name || "—"}
              <Squiggle className="mx-auto mt-1 w-20 h-2 text-clay-500" />
            </h2>
            <p className="text-sm text-ink-500 font-medium mt-2">
              {me.neighborhood} · בן/בת {me.age}
            </p>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="btn-secondary mt-4 py-1.5 px-4 text-sm"
              >
                עריכת פרופיל ✎
              </button>
            )}
          </div>
        </div>

        {editing ? (
          <div className="card p-4 space-y-4 animate-fade-in">
            <div>
              <label className="block text-sm font-bold text-ink-700 mb-2">
                שם
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-ink-700 mb-2">
                שכונה
              </label>
              <select
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="input"
              >
                {NEIGHBORHOODS.map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-ink-700 mb-2">
                כמה מילים על עצמך
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 200))}
                rows={3}
                className="input resize-none leading-relaxed"
                placeholder="לדוגמה: אבא לשניים, אוהב לרוץ ולקרוא..."
              />
              <p className="mt-1 text-xs text-ink-400 text-end tabular">
                {bio.length} / 200
              </p>
            </div>
            <div>
              <p className="text-sm font-bold text-ink-700 mb-2">
                תחומי עניין
              </p>
              <div className="flex flex-wrap gap-2">
                {ALL_INTERESTS.map((i) => (
                  <button
                    key={i}
                    onClick={() => toggle(i)}
                    className={interests.includes(i) ? "chip-selected" : "chip"}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={save}
                disabled={!name.trim() || interests.length < 3}
                className="btn-primary flex-1"
              >
                שמירה
              </button>
              <button
                onClick={() => setEditing(false)}
                className="btn-secondary"
              >
                ביטול
              </button>
            </div>
          </div>
        ) : (
          <>
            {me.bio && (
              <section>
                <span className="label-eyebrow">על עצמי</span>
                <div className="mt-2 card p-4 text-ink-800 leading-relaxed">
                  <span className="font-display text-3xl text-clay-500 leading-none align-top -mt-1 ms-1 inline-block">"</span>
                  {me.bio}
                </div>
              </section>
            )}
            <section>
              <span className="label-eyebrow">ילדים</span>
              <div className="mt-2 card p-4 flex flex-wrap gap-2">
                {me.kidsAges.map((a, i) => (
                  <span
                    key={i}
                    className="chip-clay"
                  >
                    גיל {a}
                  </span>
                ))}
              </div>
            </section>
            <section>
              <span className="label-eyebrow">תחומי עניין</span>
              <div className="mt-2 card p-4 flex flex-wrap gap-2">
                {me.interests.map((i) => (
                  <span key={i} className="chip">
                    {i}
                  </span>
                ))}
              </div>
            </section>
          </>
        )}

        <section>
          <span className="label-eyebrow">הגדרות</span>
          <div className="mt-2 card divide-y-2 divide-ink-900/10">
            <button
              onClick={handleLogout}
              className="w-full text-start p-4 text-clay-600 font-bold hover:bg-clay-50/40"
            >
              התנתקות
            </button>
          </div>
        </section>

        <p className="text-center text-xs text-ink-400 pt-2 tabular">
          POC v0.2 · נתונים נשמרים מקומית
        </p>
      </div>
    </>
  );
}
