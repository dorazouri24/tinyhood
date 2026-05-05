import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ALL_INTERESTS, NEIGHBORHOODS } from "../data/interests";
import { useStore } from "../store";
import type { Interest, Profile } from "../types";

const TOTAL_STEPS = 3;
const STEP_TITLES = ["נעים להכיר", "קצת על המשפחה", "במה אתה מתעניין"];

export default function Onboarding() {
  const nav = useNavigate();
  const { state, completeOnboarding } = useStore();

  const [step, setStep] = useState(1);
  const [name, setName] = useState(state.me?.name || "");
  const [age, setAge] = useState<number | "">(state.me?.age || "");
  const [neighborhood, setNeighborhood] = useState(
    state.me?.neighborhood || NEIGHBORHOODS[0]
  );
  const [kidsAges, setKidsAges] = useState<number[]>(state.me?.kidsAges || [3]);
  const [interests, setInterests] = useState<Interest[]>(
    state.me?.interests || []
  );
  const [photo, setPhoto] = useState<string>(
    state.me?.photo ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`
  );

  const canNext =
    (step === 1 && name.trim().length > 1 && typeof age === "number" && age > 17) ||
    (step === 2 && kidsAges.length > 0 && neighborhood) ||
    (step === 3 && interests.length >= 3);

  const next = () => {
    if (!canNext) return;
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
      return;
    }
    const profile: Profile = {
      id: "me",
      name: name.trim(),
      age: typeof age === "number" ? age : 0,
      neighborhood,
      kidsAges,
      interests,
      photo,
      bio: "",
    };
    completeOnboarding(profile);
    nav("/feed", { replace: true });
  };

  const back = () => (step === 1 ? nav(-1) : setStep((s) => s - 1));

  const toggleInterest = (i: Interest) => {
    setInterests((curr) =>
      curr.includes(i) ? curr.filter((x) => x !== i) : [...curr, i]
    );
  };

  const updateKidAge = (idx: number, value: number) => {
    setKidsAges((curr) => curr.map((a, i) => (i === idx ? value : a)));
  };

  const addKid = () => setKidsAges((curr) => [...curr, 3]);
  const removeKid = (idx: number) =>
    setKidsAges((curr) => curr.filter((_, i) => i !== idx));

  const regenAvatar = () =>
    setPhoto(
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random().toString(36).slice(2)}`
    );

  return (
    <div className="flex-1 flex flex-col safe-top">
      <div className="screen-pad pt-6 pb-2">
        <button onClick={back} className="btn-ghost text-sm">
          → חזרה
        </button>

        <div className="mt-4 flex items-center gap-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full border-2 border-ink-900 transition ${
                i < step ? "bg-clay-500" : "bg-paper-50"
              }`}
            />
          ))}
        </div>
        <p className="mt-2 label-eyebrow">
          שלב {step} מתוך {TOTAL_STEPS} · {STEP_TITLES[step - 1]}
        </p>
      </div>

      <div className="flex-1 screen-pad pb-4 pt-2">
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <h1 className="font-display text-3xl text-ink-900 tracking-tight2">
              נעים להכיר 👋
            </h1>
            <p className="text-ink-500">איך לקרוא לך, ובן/בת כמה אתה?</p>

            <div>
              <label className="block text-sm font-bold text-ink-700 mb-2">
                שם פרטי
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="לדוגמה: דניאל"
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-ink-700 mb-2">
                גיל
              </label>
              <input
                type="number"
                inputMode="numeric"
                min={18}
                max={90}
                value={age}
                onChange={(e) => {
                  const v = e.target.value;
                  setAge(v === "" ? "" : Number(v));
                }}
                placeholder="36"
                className="input tabular"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <h1 className="font-display text-3xl text-ink-900 tracking-tight2">
              קצת על המשפחה
            </h1>
            <p className="text-ink-500">
              נמצא לך הורים סמוכים עם ילדים בגילאים דומים
            </p>

            <div>
              <label className="block text-sm font-bold text-ink-700 mb-2">
                שכונה
              </label>
              <select
                className="input"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
              >
                {NEIGHBORHOODS.map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-ink-700 mb-2">
                גילאי הילדים
              </label>
              <div className="space-y-2">
                {kidsAges.map((kAge, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={kAge}
                      onChange={(e) =>
                        updateKidAge(idx, Number(e.target.value))
                      }
                      className="input flex-1 tabular"
                    />
                    {kidsAges.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeKid(idx)}
                        className="px-3 py-2 rounded-full bg-paper-200 text-ink-700 text-sm font-bold border-2 border-ink-900 shadow-sticker-sm active:translate-y-[2px] active:shadow-none"
                      >
                        הסר
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addKid}
                className="mt-3 text-sm font-bold text-clay-600 hover:text-clay-700"
              >
                + הוספת ילד נוסף
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <h1 className="font-display text-3xl text-ink-900 tracking-tight2">
              במה אתה מתעניין?
            </h1>
            <p className="text-ink-500">
              בחר לפחות 3 — אנחנו נחבר אותך עם הורים עם תחומי עניין דומים
            </p>

            <div className="card p-4 flex items-center gap-4">
              <img
                src={photo}
                alt=""
                className="w-20 h-20 rounded-2xl bg-paper-200 border-2 border-ink-900"
              />
              <div className="flex-1">
                <p className="font-bold text-ink-900">תמונת פרופיל</p>
                <p className="text-xs text-ink-500 mb-2">בחר אווטאר אקראי</p>
                <button
                  type="button"
                  onClick={regenAvatar}
                  className="btn-secondary py-1.5 px-3 text-xs"
                >
                  החלפה ↻
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {ALL_INTERESTS.map((i) => {
                const selected = interests.includes(i);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleInterest(i)}
                    className={selected ? "chip-selected" : "chip"}
                  >
                    {i}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-ink-400 tabular">
              נבחרו {interests.length} מתוך 3+
            </p>
          </div>
        )}
      </div>

      <div className="screen-pad pb-6 safe-bottom">
        <button
          onClick={next}
          disabled={!canNext}
          className="btn-primary w-full py-4"
        >
          {step === TOTAL_STEPS ? "סיום והמשך" : "המשך"}
        </button>
      </div>
    </div>
  );
}
