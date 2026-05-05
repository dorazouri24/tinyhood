import { Link, useNavigate, useParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import { Squiggle } from "../components/Decor";
import { PinIcon } from "../components/Icon";
import { useStore } from "../store";

export default function ProfileView() {
  const { id } = useParams();
  const nav = useNavigate();
  const { state } = useStore();
  const profile = state.profiles.find((p) => p.id === id);
  const me = state.me!;

  if (!profile) {
    return (
      <div className="screen-pad pt-10 text-center">
        <p>הפרופיל לא נמצא.</p>
        <button onClick={() => nav(-1)} className="btn-secondary mt-4">
          חזרה
        </button>
      </div>
    );
  }

  const existing = state.connections.find(
    (c) =>
      c.fromUserId === me.id &&
      c.toUserId === profile.id &&
      c.status !== "declined"
  );

  const accepted = state.connections.find(
    (c) =>
      ((c.fromUserId === me.id && c.toUserId === profile.id) ||
        (c.fromUserId === profile.id && c.toUserId === me.id)) &&
      c.status === "accepted"
  );

  const conv = accepted
    ? state.conversations.find(
        (cv) =>
          cv.participantIds.includes(me.id) &&
          cv.participantIds.includes(profile.id)
      )
    : null;

  const shared = me.interests.filter((i) => profile.interests.includes(i));

  return (
    <>
      <AppHeader showBack title="פרופיל" />

      <div className="screen-pad pt-4 pb-32">
        {/* Hero card */}
        <div className="card relative p-6 text-center overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-clay-100 to-transparent" />
          <div className="relative">
            <div className="relative inline-block">
              <img
                src={profile.photo}
                alt=""
                className="w-28 h-28 rounded-3xl bg-paper-200 border-2 border-ink-900 shadow-sticker"
              />
              <span className="absolute -bottom-2 -right-2 sticker-yellow tilt-r px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider">
                {profile.distanceKm?.toFixed(1)} ק"מ
              </span>
            </div>
            <h2 className="mt-5 font-display text-3xl text-ink-900 tracking-tight2">
              {profile.name}
              <Squiggle className="mx-auto mt-1 w-24 h-2 text-clay-500" />
            </h2>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-sm text-ink-600 font-medium">
              <PinIcon size={15} className="text-clay-500" />
              <span>{profile.neighborhood}</span>
              <span className="text-ink-300">·</span>
              <span>בן/בת {profile.age}</span>
            </div>
          </div>
        </div>

        {profile.bio && (
          <section className="mt-5">
            <span className="label-eyebrow">על {profile.name.split(" ")[0]}</span>
            <div className="mt-2 card p-4 text-ink-800 leading-relaxed">
              <span className="font-display text-3xl text-clay-500 leading-none align-top -mt-1 ms-1 inline-block">"</span>
              {profile.bio}
            </div>
          </section>
        )}

        <section className="mt-5">
          <span className="label-eyebrow">ילדים</span>
          <div className="mt-2 card p-4 flex flex-wrap gap-2">
            {profile.kidsAges.map((a, i) => (
              <span
                key={i}
                className="chip-clay"
              >
                גיל {a}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-5">
          <span className="label-eyebrow">תחומי עניין</span>
          <div className="mt-2 card p-4 flex flex-wrap gap-2">
            {profile.interests.map((i) => (
              <span
                key={i}
                className={shared.includes(i) ? "chip-selected" : "chip"}
              >
                {i}
              </span>
            ))}
          </div>
          {shared.length > 0 && (
            <p className="mt-2 text-xs font-bold text-olive-600">
              {shared.length} תחומי עניין משותפים ✨
            </p>
          )}
        </section>
      </div>

      <div className="fixed bottom-0 inset-x-0 mx-auto max-w-md bg-paper-100/90 backdrop-blur border-t-2 border-ink-900/10 safe-bottom">
        <div className="screen-pad py-3">
          {accepted && conv ? (
            <Link to={`/chat/${conv.id}`} className="btn-olive w-full py-4">
              שליחת הודעה
            </Link>
          ) : existing ? (
            <button disabled className="btn-secondary w-full py-4">
              ✓ בקשה נשלחה — ממתין לתגובה
            </button>
          ) : (
            <Link
              to={`/request/${profile.id}`}
              className="btn-primary w-full py-4"
            >
              שליחת בקשת חיבור
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
