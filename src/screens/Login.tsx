import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkle } from "../components/Decor";
import { useStore } from "../store";

export default function Login() {
  const nav = useNavigate();
  const { login } = useStore();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isPhoneValid = /^0\d{8,9}$/.test(phone.replace(/[-\s]/g, ""));

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPhoneValid) {
      setError("מספר לא תקין. נסה שוב");
      return;
    }
    setError(null);
    setStep("otp");
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4) {
      setError("נא להקליד את 4 הספרות שנשלחו ב-SMS");
      return;
    }
    setError(null);
    login(phone);
    nav("/onboarding", { replace: true });
  };

  return (
    <div className="flex-1 flex flex-col safe-top">
      <div className="screen-pad pt-8 pb-6">
        <button
          onClick={() => (step === "otp" ? setStep("phone") : nav(-1))}
          className="btn-ghost text-sm"
        >
          → חזרה
        </button>
      </div>

      <div className="flex-1 screen-pad">
        {step === "phone" ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-6">
            <div>
              <span className="label-eyebrow">שלב 1 · אימות</span>
              <h1 className="mt-2 font-display text-3xl text-ink-900 tracking-tight2 leading-tight">
                ברוכים הבאים <Sparkle className="inline w-6 h-6 text-butter-400 align-baseline" />
              </h1>
              <p className="mt-2 text-ink-500">
                נשלח לך קוד חד-פעמי ב-SMS לאימות זהות
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-ink-700 mb-2">
                מספר טלפון
              </label>
              <input
                dir="ltr"
                inputMode="tel"
                autoComplete="tel"
                placeholder="0501234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input text-lg tracking-wider text-start tabular"
              />
              {error && (
                <p className="mt-2 text-sm text-clay-600 font-bold">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isPhoneValid}
              className="btn-primary w-full py-4"
            >
              שליחת קוד
            </button>

            <p className="text-xs text-ink-400 text-center leading-relaxed">
              בלחיצה על המשך אתה מסכים ל
              <span className="text-clay-600 font-bold"> תנאי השימוש </span>
              ול
              <span className="text-clay-600 font-bold"> מדיניות הפרטיות</span>
            </p>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div>
              <span className="label-eyebrow">שלב 2 · קוד</span>
              <h1 className="mt-2 font-display text-3xl text-ink-900 tracking-tight2 leading-tight">
                הקלד קוד אימות
              </h1>
              <p className="mt-2 text-ink-500">
                שלחנו קוד בן 4 ספרות ל-
                <span className="font-bold text-ink-700 tabular" dir="ltr">{phone}</span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-ink-700 mb-2">
                קוד אימות
              </label>
              <input
                dir="ltr"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="••••"
                value={otp}
                maxLength={4}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                className="input text-center font-display text-4xl tracking-[0.5em] tabular"
              />
              {error && (
                <p className="mt-2 text-sm text-clay-600 font-bold">{error}</p>
              )}
              <div className="mt-3 sticker-yellow inline-block px-3 py-1 text-xs font-bold tilt-l">
                ב-POC כל קוד בן 4 ספרות יעבוד 🎯
              </div>
            </div>

            <button
              type="submit"
              disabled={otp.length !== 4}
              className="btn-primary w-full py-4"
            >
              כניסה
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
