import { useNavigate } from "react-router-dom";
import { ArrowRight } from "./Icon";

interface Props {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  right?: React.ReactNode;
  eyebrow?: string;
}

export default function AppHeader({
  title,
  subtitle,
  showBack = false,
  right,
  eyebrow,
}: Props) {
  const nav = useNavigate();
  return (
    <header className="safe-top sticky top-0 z-20 bg-paper-100/85 backdrop-blur border-b-2 border-ink-900/10">
      <div className="screen-pad flex items-center gap-3 py-3">
        {showBack ? (
          <button
            onClick={() => nav(-1)}
            className="w-10 h-10 grid place-items-center rounded-full bg-paper-50 border-2 border-ink-900 shadow-sticker-sm hover:bg-paper-200 active:translate-y-[2px] active:shadow-none"
            aria-label="חזרה"
          >
            <ArrowRight size={18} />
          </button>
        ) : null}
        <div className="flex-1 min-w-0">
          {eyebrow && (
            <span className="label-eyebrow">{eyebrow}</span>
          )}
          {title && (
            <h1 className="font-display text-2xl text-ink-900 leading-tight tracking-tight2 truncate">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-sm text-ink-500 truncate">{subtitle}</p>
          )}
        </div>
        {right}
      </div>
    </header>
  );
}
