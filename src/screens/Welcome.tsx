import { Link } from "react-router-dom";
import { ArrowDoodle, HouseDoodle, Sparkle, Squiggle } from "../components/Decor";

export default function Welcome() {
  return (
    <div className="flex-1 flex flex-col safe-top">
      <div className="flex-1 screen-pad pt-10 pb-6">
        {/* Hero composition */}
        <div className="relative pt-2">
          <span className="label-eyebrow">קהילת הורים שכונתית</span>
          <h1 className="mt-3 font-display text-[44px] leading-[1.05] tracking-tight2 text-ink-900">
            השכן הכי טוב
            <br />
            <span className="relative inline-block">
              שלך עוד לא
              <Squiggle className="absolute left-0 right-0 -bottom-2 w-full h-2 text-clay-500" />
            </span>{" "}
            מכיר אותך
          </h1>
          <p className="mt-4 text-ink-600 text-[17px] leading-relaxed max-w-sm">
            הורים בני שכונה אחת — חיבורים אמיתיים בין משפחות שגרות ממש ליד.
            ללא אלגוריתמים מסובכים, ללא ערפל. רק מי שגר ברדיוס של 1.5 ק"מ.
          </p>

          {/* sticker collage */}
          <div className="relative mt-8 h-56">
            <div className="absolute right-0 top-2 w-36 h-36 rounded-blob bg-clay-100 border-2 border-ink-900 shadow-sticker tilt-l flex items-center justify-center">
              <span className="text-7xl" role="img" aria-label="בית">🏡</span>
            </div>
            <div className="absolute left-2 top-0 w-28 h-28 rounded-2xl bg-olive-100 border-2 border-ink-900 shadow-sticker tilt-r flex flex-col items-center justify-center gap-1">
              <span className="text-4xl">👨‍👩‍👧</span>
              <span className="text-xs font-bold text-olive-700">משפחות בסביבה</span>
            </div>
            <div className="absolute left-6 bottom-4 w-32 h-20 sticker-yellow tilt-l flex flex-col items-center justify-center gap-0.5 px-3 text-center">
              <span className="text-[11px] font-bold uppercase tracking-widest text-ink-700">רדיוס</span>
              <span className="font-display text-2xl text-ink-900">1.5 ק"מ</span>
            </div>
            <div className="absolute right-12 bottom-0 w-24 h-24 rounded-full bg-rose-50 border-2 border-ink-900 shadow-sticker grid place-items-center tilt-r">
              <span className="text-4xl">💌</span>
            </div>
            <Sparkle className="absolute right-2 top-0 w-5 h-5 text-butter-400 animate-wiggle-once" />
            <Sparkle className="absolute left-0 bottom-2 w-4 h-4 text-clay-500" />
          </div>

          {/* feature list */}
          <ul className="mt-2 space-y-3">
            {[
              { e: "📍", t: "הורים סמוכים", d: "ממוין לפי קרבה גיאוגרפית", color: "bg-clay-100" },
              { e: "👶", t: "ילדים בגיל דומה", d: "התאמה אוטומטית לפי גיל הילדים", color: "bg-olive-100" },
              { e: "✉️", t: "צ'אט פשוט", d: "ללא רעש, ללא אלגוריתמים", color: "bg-rose-50" },
            ].map((it, i) => (
              <li
                key={it.t}
                className="card p-3.5 flex items-center gap-3 animate-slide-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={`w-12 h-12 grid place-items-center rounded-2xl border-2 border-ink-900 ${it.color} text-2xl`}>
                  {it.e}
                </div>
                <div>
                  <p className="font-bold text-ink-900 leading-tight">{it.t}</p>
                  <p className="text-sm text-ink-500">{it.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="screen-pad pb-8 pt-2 safe-bottom">
        <Link to="/login" className="btn-primary w-full text-base py-4">
          בוא נתחיל
          <ArrowDoodle className="w-7 h-4 text-paper-50" style={{ transform: "scaleX(-1)" }} />
        </Link>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-ink-400">
          <HouseDoodle className="w-5 h-4 text-ink-400" />
          <span>POC • הנתונים נשמרים מקומית במכשיר שלך</span>
        </div>
      </div>
    </div>
  );
}
