import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import { useStore } from "../store";

const SUGGESTIONS = (firstName: string) => [
  `היי ${firstName}, יש לנו ילדים בגיל דומה — בא לך לקבוע מפגש בפארק בשבת?`,
  `שלום ${firstName}, ראיתי שגם אנחנו אוהבים לטייל בטבע. רצית להצטרף לטיול קצר השבוע?`,
  `היי ${firstName}, אני חדש/ה בשכונה. שמח/ה להכיר.`,
];

const MAX = 200;

export default function SendRequest() {
  const { id } = useParams();
  const nav = useNavigate();
  const { state, sendRequest } = useStore();
  const profile = state.profiles.find((p) => p.id === id);

  const [message, setMessage] = useState(
    profile ? SUGGESTIONS(profile.name.split(" ")[0])[0] : ""
  );

  const suggestions = useMemo(
    () => (profile ? SUGGESTIONS(profile.name.split(" ")[0]) : []),
    [profile]
  );

  if (!profile) {
    return (
      <div className="screen-pad pt-10 text-center">
        <p>הפרופיל לא נמצא.</p>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;
    sendRequest(profile.id, trimmed);
    nav(`/profile/${profile.id}`, { replace: true });
  };

  return (
    <>
      <AppHeader showBack title="שליחת בקשה" />
      <form onSubmit={submit} className="screen-pad pt-4 pb-36 space-y-5">
        <div className="card p-4 flex items-center gap-3">
          <img
            src={profile.photo}
            alt=""
            className="w-14 h-14 rounded-2xl bg-paper-200 border-2 border-ink-900"
          />
          <div>
            <p className="font-display text-lg text-ink-900 leading-tight">
              {profile.name}
            </p>
            <p className="text-xs text-ink-500 tabular">
              {profile.distanceKm?.toFixed(1)} ק"מ · {profile.neighborhood}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-ink-700 mb-2">
            הודעת פתיחה
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, MAX))}
            rows={5}
            className="input resize-none leading-relaxed"
            placeholder="כתוב/י משפט אחד או שניים — מי אתה ולמה אתה רוצה להכיר"
          />
          <div className="mt-1 flex justify-between text-xs text-ink-500">
            <span className="font-medium">
              הודעה אישית מקפיצה משמעותית את שיעור התגובה
            </span>
            <span className="tabular font-bold">
              {message.length} / {MAX}
            </span>
          </div>
        </div>

        <div>
          <span className="label-eyebrow">הצעות מהירות</span>
          <div className="mt-2 space-y-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setMessage(s)}
                className="w-full text-start card-soft p-3 text-sm text-ink-700 hover:bg-paper-200/40 transition leading-relaxed"
              >
                <span className="text-clay-500 font-bold">→ </span>
                {s}
              </button>
            ))}
          </div>
        </div>
      </form>

      <div className="fixed bottom-0 inset-x-0 mx-auto max-w-md bg-paper-100/90 backdrop-blur border-t-2 border-ink-900/10 safe-bottom">
        <div className="screen-pad py-3">
          <button
            onClick={submit}
            disabled={message.trim().length === 0}
            className="btn-primary w-full py-4"
          >
            שליחת בקשה
          </button>
        </div>
      </div>
    </>
  );
}
