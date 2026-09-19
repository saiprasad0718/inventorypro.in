import { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { Flame, Loader2 } from "lucide-react";
import { useAuth } from "@/app/AuthContext";
import { fmtErr } from "@/app/api";

const inputCls =
  "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors duration-300 focus:border-brand-terra/60";

export default function Login() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/app" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      nav("/app");
    } catch (e2) {
      setErr(fmtErr(e2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-brand-obsidian text-foreground lg:grid-cols-2" data-testid="login-page">
      <div className="relative hidden flex-col justify-between overflow-hidden p-12 lg:flex">
        <div aria-hidden="true" className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-brand-terra/15 blur-[120px]" />
        <Link to="/" className="relative flex items-center gap-2" data-testid="login-brand-link">
          <span className="grid size-9 place-items-center rounded-lg bg-brand-terra/15 text-brand-terra">
            <Flame className="size-4" />
          </span>
          <span className="font-display text-lg font-bold">InventoryPro<span className="text-brand-terra">.in</span></span>
        </Link>
        <div className="relative">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-brand-gold">Staff Access</p>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.08] tracking-tight xl:text-5xl">
            Know where every<br />portion <span className="text-brand-terra">went.</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
            Live stock, batch-level recipe deduction, wastage logging and POS
            reconciliation — one command view for your whole kitchen.
          </p>
        </div>
        <p className="relative font-mono text-xs text-muted-foreground">© 2026 InventoryPro.in</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="glow-border w-full max-w-md rounded-2xl border border-white/10 bg-brand-slate p-8">
          <h2 className="font-display text-2xl font-bold tracking-tight">Sign in</h2>
          <p className="mt-1 text-sm text-muted-foreground">Use your staff account to open the app.</p>
          <form onSubmit={submit} className="mt-6 space-y-4" data-testid="login-form">
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="Email address"
              data-testid="login-email-input"
              className={inputCls}
            />
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="Password"
              data-testid="login-password-input"
              className={inputCls}
            />
            {err && (
              <p className="rounded-xl border border-brand-terra/40 bg-brand-terra/10 px-4 py-2.5 text-sm text-brand-terra" data-testid="login-error">
                {err}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              data-testid="login-submit-button"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-terra py-3 text-sm font-semibold text-white transition-transform duration-300 hover:scale-[1.02] disabled:opacity-60"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              {loading ? "Signing in..." : "Open the App"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
