export const inputCls =
  "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors duration-300 focus:border-brand-terra/60";

export const DEPARTMENTS = ["Main Kitchen", "Tandoor Section", "Biryani Station", "Curry Section"];

export function PageHead({ title, sub, testId }) {
  return (
    <div className="mb-8" data-testid={testId}>
      <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
      {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function Card({ children, className = "", testId }) {
  return (
    <div data-testid={testId} className={`rounded-2xl border border-white/10 bg-brand-slate p-5 ${className}`}>
      {children}
    </div>
  );
}

export function Stat({ label, value, sub, tone = "text-foreground", testId }) {
  return (
    <Card testId={testId}>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className={`mt-2 font-display text-2xl font-extrabold tracking-tight ${tone}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </Card>
  );
}

export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export function DataTable({ cols, rows, testId, empty = "No records yet." }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10" data-testid={testId}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-black/30">
            {cols.map((c) => (
              <th key={c} className="whitespace-nowrap px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={cols.length} className="px-4 py-8 text-center text-sm text-muted-foreground">{empty}</td></tr>
          ) : (
            rows.map((r, i) => (
              <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                {r.map((cell, j) => (
                  <td key={j} className="whitespace-nowrap px-4 py-3">{cell}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export const fmtINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
export const fmtNum = (n) => Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
export const fileUrl = (url) =>
  url ? `${process.env.REACT_APP_BACKEND_URL}${url}?auth=${localStorage.getItem("ip_token")}` : null;
