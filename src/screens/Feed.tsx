import { Link } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import { Sparkle } from "../components/Decor";
import { PinIcon } from "../components/Icon";
import { useStore } from "../store";
import type { Profile } from "../types";

function similarityScore(me: Profile, other: Profile) {
  const sharedInterests = me.interests.filter((i) =>
    other.interests.includes(i)
  ).length;
  const ageDiff = Math.min(
    ...me.kidsAges.flatMap((a) => other.kidsAges.map((b) => Math.abs(a - b)))
  );
  const ageScore = isFinite(ageDiff) ? Math.max(0, 5 - ageDiff) : 0;
  const proximityScore = other.distanceKm ? Math.max(0, 5 - other.distanceKm) : 0;
  return sharedInterests * 4 + ageScore * 2 + proximityScore;
}

export default function Feed() {
  const { state } = useStore();
  const me = state.me!;

  const ranked = [...state.profiles]
    .map((p) => ({ p, score: similarityScore(me, p) }))
    .sort((a, b) => b.score - a.score);

  return (
    <>
      <AppHeader
        eyebrow={`היי ${me.name.split(" ")[0]} 👋`}
        title="לוח השכונה"
        subtitle={`${ranked.length} הורים סמוכים אליך ב${me.neighborhood}`}
      />

      {/* Highlight banner */}
      <div className="screen-pad pt-3 pb-4">
        <div className="relative overflow-hidden rounded-2xl bg-clay-500 border-2 border-ink-900 shadow-sticker p-4 text-paper-50">
          <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-butter-300/30" />
          <div className="absolute -bottom-8 -right-4 w-28 h-28 rounded-full bg-rose-50/20" />
          <div className="relative flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-butter-300 border-2 border-ink-900 grid place-items-center shrink-0">
              <Sparkle className="w-5 h-5 text-ink-900" />
            </div>
            <div>
              <p className="font-display text-lg leading-tight">
                הורים שעשויים להתאים לך
              </p>
              <p className="text-sm text-paper-50/80 mt-0.5">
                ממוין לפי קרבה, גיל הילדים ותחומי עניין
              </p>
            </div>
          </div>
        </div>
      </div>

      <ul className="screen-pad pb-8 space-y-3">
        {ranked.map(({ p, score }, i) => (
          <ProfileCard key={p.id} me={me} profile={p} index={i} highlight={score > 14} />
        ))}
      </ul>
    </>
  );
}

const ACCENTS = [
  { bg: "bg-clay-100", text: "text-clay-700" },
  { bg: "bg-olive-100", text: "text-olive-700" },
  { bg: "bg-rose-50", text: "text-rose-500" },
  { bg: "bg-butter-200", text: "text-ink-900" },
];

function ProfileCard({
  me,
  profile,
  index,
  highlight,
}: {
  me: Profile;
  profile: Profile;
  index: number;
  highlight: boolean;
}) {
  const { state } = useStore();
  const shared = me.interests.filter((i) => profile.interests.includes(i));
  const requested = state.connections.find(
    (c) =>
      c.fromUserId === me.id &&
      c.toUserId === profile.id &&
      c.status !== "declined"
  );
  const accent = ACCENTS[index % ACCENTS.length];

  return (
    <li>
      <Link
        to={`/profile/${profile.id}`}
        className="card relative p-4 flex gap-3 items-start hover:bg-paper-200/40 transition active:translate-y-[2px] active:shadow-sticker-sm animate-slide-up block"
        style={{ animationDelay: `${index * 40}ms` }}
      >
        {highlight && index < 2 && (
          <span className="absolute -top-2 -right-2 sticker-yellow text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 tilt-l">
            התאמה גבוהה
          </span>
        )}
        <div className={`relative w-16 h-16 rounded-2xl ${accent.bg} border-2 border-ink-900 shrink-0 overflow-hidden`}>
          <img
            src={profile.photo}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <h3 className="font-display text-lg text-ink-900 truncate leading-tight">
              {profile.name}
            </h3>
            <span className="text-xs text-ink-500 tabular">{profile.age}</span>
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-500 font-medium">
            <PinIcon size={13} className="text-clay-500" />
            <span className="tabular">{profile.distanceKm?.toFixed(1)} ק"מ</span>
            <span className="text-ink-300">·</span>
            <span>ילדים: {profile.kidsAges.join(", ")}</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {profile.interests.slice(0, 3).map((i) => (
              <span
                key={i}
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full border-2 border-ink-900 ${
                  shared.includes(i)
                    ? "bg-ink-900 text-paper-50"
                    : "bg-paper-50 text-ink-700"
                }`}
              >
                {i}
              </span>
            ))}
            {shared.length > 0 && (
              <span className="text-[11px] font-bold text-olive-600">
                · {shared.length} משותפים ✨
              </span>
            )}
          </div>
          {requested && (
            <p className="mt-2 text-xs font-bold text-clay-600">
              {requested.status === "pending"
                ? "✓ בקשה נשלחה — ממתין לתגובה"
                : "מחוברים"}
            </p>
          )}
        </div>
      </Link>
    </li>
  );
}
