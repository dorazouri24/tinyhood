import { Link } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import { CheckIcon, XIcon } from "../components/Icon";
import { useStore } from "../store";

export default function Inbox() {
  const { state, acceptRequest, declineRequest } = useStore();
  const me = state.me!;

  const incoming = state.connections
    .filter((c) => c.toUserId === me.id && c.status === "pending")
    .sort((a, b) => b.createdAt - a.createdAt);

  const outgoing = state.connections
    .filter((c) => c.fromUserId === me.id && c.status === "pending")
    .sort((a, b) => b.createdAt - a.createdAt);

  const conversations = [...state.conversations].sort(
    (a, b) => b.lastMessageAt - a.lastMessageAt
  );

  return (
    <>
      <AppHeader title="חיבורים" subtitle="בקשות נכנסות ושיחות פעילות" />

      <div className="screen-pad pt-4 pb-8 space-y-7">
        {incoming.length > 0 && (
          <section>
            <div className="flex items-baseline justify-between">
              <span className="label-eyebrow">בקשות חדשות</span>
              <span className="text-xs font-bold text-ink-500 tabular">
                {incoming.length}
              </span>
            </div>
            <ul className="mt-2 space-y-3">
              {incoming.map((c) => {
                const from = state.profiles.find((p) => p.id === c.fromUserId);
                if (!from) return null;
                return (
                  <li
                    key={c.id}
                    className="card p-4 animate-slide-up relative overflow-hidden"
                  >
                    <span className="absolute top-0 right-0 w-1 h-full bg-clay-500" />
                    <div className="flex gap-3">
                      <img
                        src={from.photo}
                        alt=""
                        className="w-12 h-12 rounded-2xl bg-paper-200 border-2 border-ink-900 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/profile/${from.id}`}
                          className="font-display text-lg text-ink-900 leading-tight"
                        >
                          {from.name}
                        </Link>
                        <p className="text-xs text-ink-500 tabular">
                          {from.distanceKm?.toFixed(1)} ק"מ
                        </p>
                        <p className="mt-2 text-sm text-ink-700 leading-relaxed">
                          {c.message}
                        </p>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => acceptRequest(c.id)}
                            className="btn-olive py-2 px-4 text-sm"
                          >
                            <CheckIcon size={16} />
                            אישור
                          </button>
                          <button
                            onClick={() => declineRequest(c.id)}
                            className="btn-secondary py-2 px-4 text-sm"
                          >
                            <XIcon size={16} />
                            דחייה
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <section>
          <div className="flex items-baseline justify-between">
            <span className="label-eyebrow">שיחות</span>
            {conversations.length > 0 && (
              <span className="text-xs font-bold text-ink-500 tabular">
                {conversations.length}
              </span>
            )}
          </div>
          {conversations.length === 0 ? (
            <div className="mt-2 card p-6 text-center">
              <p className="text-5xl">💬</p>
              <p className="mt-3 font-display text-lg text-ink-900">
                אין עדיין שיחות
              </p>
              <p className="mt-1 text-sm text-ink-500">
                שלח בקשת חיבור מהפיד כדי להתחיל לדבר
              </p>
              <Link to="/feed" className="btn-secondary mt-4 inline-flex">
                לפיד הגילוי
              </Link>
            </div>
          ) : (
            <ul className="mt-2 space-y-2">
              {conversations.map((conv) => {
                const otherId = conv.participantIds.find((p) => p !== me.id);
                const other = state.profiles.find((p) => p.id === otherId);
                const lastMsg = [...state.messages]
                  .filter((m) => m.conversationId === conv.id)
                  .sort((a, b) => b.createdAt - a.createdAt)[0];
                const unread = state.messages.filter(
                  (m) =>
                    m.conversationId === conv.id &&
                    m.senderId !== me.id &&
                    !m.read
                ).length;
                if (!other) return null;
                return (
                  <li key={conv.id}>
                    <Link
                      to={`/chat/${conv.id}`}
                      className="card p-3 flex items-center gap-3 hover:bg-paper-200/40 active:translate-y-[2px] active:shadow-sticker-sm transition"
                    >
                      <img
                        src={other.photo}
                        alt=""
                        className="w-12 h-12 rounded-2xl bg-paper-200 border-2 border-ink-900 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-display text-base text-ink-900 truncate leading-tight">
                            {other.name}
                          </p>
                          {lastMsg && (
                            <span className="text-[11px] text-ink-400 shrink-0 ms-2 tabular">
                              {formatRelative(lastMsg.createdAt)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-ink-500 truncate">
                          {lastMsg?.content || "התחל את השיחה"}
                        </p>
                      </div>
                      {unread > 0 && (
                        <span className="h-6 min-w-6 px-1.5 rounded-full bg-rose-300 text-ink-900 text-xs font-extrabold grid place-items-center border-2 border-ink-900 tabular">
                          {unread}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {outgoing.length > 0 && (
          <section>
            <div className="flex items-baseline justify-between">
              <span className="label-eyebrow">ממתין לתגובה</span>
              <span className="text-xs font-bold text-ink-500 tabular">
                {outgoing.length}
              </span>
            </div>
            <ul className="mt-2 space-y-2">
              {outgoing.map((c) => {
                const to = state.profiles.find((p) => p.id === c.toUserId);
                if (!to) return null;
                return (
                  <li key={c.id} className="card-soft p-3 flex items-center gap-3">
                    <img
                      src={to.photo}
                      alt=""
                      className="w-10 h-10 rounded-xl bg-paper-200 border-2 border-ink-900/30"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-ink-800 truncate">
                        {to.name}
                      </p>
                      <p className="text-xs text-ink-500">
                        ממתין לאישור · {formatRelative(c.createdAt)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}

function formatRelative(ts: number) {
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "עכשיו";
  if (minutes < 60) return `${minutes} דק׳`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} שע׳`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ימים`;
  return new Date(ts).toLocaleDateString("he-IL");
}
