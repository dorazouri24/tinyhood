import { useEffect } from "react";
import AppHeader from "../components/AppHeader";
import { BellIcon } from "../components/Icon";
import { useStore } from "../store";

const KIND_STYLES = {
  request: { bg: "bg-clay-100", text: "text-clay-700", emoji: "🤝" },
  accepted: { bg: "bg-olive-100", text: "text-olive-700", emoji: "✨" },
  message: { bg: "bg-rose-50", text: "text-rose-500", emoji: "💬" },
} as const;

export default function Notifications() {
  const { state, markNotificationsRead } = useStore();

  useEffect(() => {
    markNotificationsRead();
  }, [markNotificationsRead]);

  const sorted = [...state.notifications].sort(
    (a, b) => b.createdAt - a.createdAt
  );

  return (
    <>
      <AppHeader title="התראות" subtitle="היממה האחרונה" />
      <div className="screen-pad pt-4 pb-8">
        {sorted.length === 0 ? (
          <div className="card p-8 text-center mt-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-paper-200 border-2 border-ink-900 grid place-items-center">
              <BellIcon size={28} className="text-ink-500" />
            </div>
            <p className="mt-4 font-display text-lg text-ink-900">
              אין התראות חדשות
            </p>
            <p className="mt-1 text-sm text-ink-500">
              תקבל כאן עדכון כשתתקבל בקשת חיבור או הודעה חדשה
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {sorted.map((n) => {
              const s = KIND_STYLES[n.kind];
              return (
                <li
                  key={n.id}
                  className={`card p-3 flex items-start gap-3 ${
                    !n.read ? "ring-2 ring-clay-200" : ""
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-2xl border-2 border-ink-900 grid place-items-center text-xl ${s.bg}`}
                  >
                    {s.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-ink-900">{n.title}</p>
                    <p className="text-sm text-ink-600">{n.body}</p>
                    <p className="text-xs text-ink-400 mt-1 tabular">
                      {new Date(n.createdAt).toLocaleString("he-IL", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </p>
                  </div>
                  {!n.read && (
                    <span className="w-2.5 h-2.5 rounded-full bg-clay-500 mt-2" />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
