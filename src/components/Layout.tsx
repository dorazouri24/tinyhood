import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useUnreadCounts } from "../store";
import { BellIcon, HomeIcon, InboxIcon, UserIcon } from "./Icon";

const tabs = [
  { to: "/feed", label: "גילוי", Icon: HomeIcon, key: "feed" },
  { to: "/inbox", label: "חיבורים", Icon: InboxIcon, key: "inbox" },
  { to: "/notifications", label: "התראות", Icon: BellIcon, key: "notifications" },
  { to: "/me", label: "אני", Icon: UserIcon, key: "me" },
];

export default function Layout() {
  const { incoming, unreadMessages, unreadNotifications } = useUnreadCounts();
  const location = useLocation();

  const badgeFor = (key: string) => {
    if (key === "inbox") return incoming + unreadMessages;
    if (key === "notifications") return unreadNotifications;
    return 0;
  };

  const hideTabBar = location.pathname.startsWith("/chat/");

  return (
    <div className="screen pb-24 safe-bottom">
      <main className="flex-1 animate-fade-in">
        <Outlet />
      </main>

      {!hideTabBar && (
        <nav className="fixed bottom-3 inset-x-3 z-30 mx-auto max-w-[calc(28rem-1.5rem)] safe-bottom">
          <div className="rounded-full bg-paper-50 border-2 border-ink-900 shadow-sticker">
            <ul className="grid grid-cols-4">
              {tabs.map(({ to, label, Icon, key }) => {
                const badge = badgeFor(key);
                return (
                  <li key={key}>
                    <NavLink
                      to={to}
                      className={({ isActive }) =>
                        `relative flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-bold transition ${
                          isActive ? "text-clay-600" : "text-ink-500"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            className={`relative grid place-items-center rounded-full px-3 py-1 transition ${
                              isActive
                                ? "bg-clay-100 ring-2 ring-ink-900 -translate-y-0.5"
                                : ""
                            }`}
                          >
                            <Icon size={20} />
                            {badge > 0 && (
                              <span className="absolute -top-1 -start-1 min-w-[18px] h-[18px] rounded-full bg-rose-300 text-ink-900 text-[10px] font-extrabold grid place-items-center px-1 border-2 border-ink-900 tabular">
                                {badge > 9 ? "9+" : badge}
                              </span>
                            )}
                          </span>
                          <span>{label}</span>
                        </>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      )}
    </div>
  );
}
