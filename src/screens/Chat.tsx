import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import { SendIcon } from "../components/Icon";
import { useStore } from "../store";

export default function Chat() {
  const { id } = useParams();
  const { state, sendMessage, markConversationRead } = useStore();
  const me = state.me!;
  const conv = state.conversations.find((c) => c.id === id);
  const otherId = conv?.participantIds.find((p) => p !== me.id);
  const other = state.profiles.find((p) => p.id === otherId);

  const messages = useMemo(
    () =>
      state.messages
        .filter((m) => m.conversationId === id)
        .sort((a, b) => a.createdAt - b.createdAt),
    [state.messages, id]
  );

  const [text, setText] = useState("");
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) markConversationRead(id);
  }, [id, markConversationRead, messages.length]);

  useEffect(() => {
    if (scroller.current) {
      scroller.current.scrollTop = scroller.current.scrollHeight;
    }
  }, [messages.length]);

  if (!conv || !other) {
    return (
      <div className="screen-pad pt-10 text-center">
        <p>שיחה לא נמצאה.</p>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    sendMessage(conv.id, t);
    setText("");
  };

  return (
    <div className="flex flex-col h-screen safe-top safe-bottom bg-paper-100">
      <AppHeader
        showBack
        title={other.name}
        subtitle={`${other.distanceKm?.toFixed(1)} ק"מ · ${other.neighborhood}`}
        right={
          <img
            src={other.photo}
            alt=""
            className="w-10 h-10 rounded-2xl bg-paper-200 border-2 border-ink-900 shadow-sticker-sm"
          />
        }
      />

      <div ref={scroller} className="flex-1 overflow-y-auto screen-pad py-4">
        <div className="space-y-2">
          {messages.map((m, i) => {
            const mine = m.senderId === me.id;
            const prev = messages[i - 1];
            const grouped = prev && prev.senderId === m.senderId;
            return (
              <div
                key={m.id}
                className={`flex ${mine ? "justify-start" : "justify-end"} animate-slide-up`}
              >
                <div
                  className={`max-w-[78%] px-4 py-2.5 text-[15px] leading-relaxed border-2 border-ink-900 ${
                    mine
                      ? "bg-clay-500 text-paper-50 rounded-[20px] rounded-bl-md shadow-sticker-sm"
                      : "bg-paper-50 text-ink-900 rounded-[20px] rounded-br-md shadow-sticker-sm"
                  } ${grouped ? "mt-0.5" : "mt-2"}`}
                >
                  <p className="whitespace-pre-wrap break-words">{m.content}</p>
                  <p
                    className={`mt-1 text-[10px] tabular ${
                      mine ? "text-paper-50/80" : "text-ink-400"
                    }`}
                  >
                    {new Date(m.createdAt).toLocaleTimeString("he-IL", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {mine && m.read ? " ✓✓" : mine ? " ✓" : ""}
                  </p>
                </div>
              </div>
            );
          })}
          {messages.length === 0 && (
            <div className="text-center text-ink-400 text-sm pt-6">
              שלחו הודעה ראשונה כדי להתחיל לדבר
            </div>
          )}
        </div>
      </div>

      <form
        onSubmit={submit}
        className="border-t-2 border-ink-900/10 bg-paper-50 screen-pad py-2.5 flex items-end gap-2"
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit(e as unknown as React.FormEvent);
            }
          }}
          rows={1}
          placeholder="הודעה..."
          className="input flex-1 resize-none max-h-32 py-2.5"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="btn-primary py-3 px-3"
          aria-label="שליחה"
        >
          <SendIcon size={20} />
        </button>
      </form>
    </div>
  );
}
