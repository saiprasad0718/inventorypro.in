import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import api, { fmtErr } from "../api";
import { useAuth } from "../AuthContext";
import { Card, PageHead, fileUrl } from "../components";

const FIELDS = [
  ["sold", "POS Sold"],
  ["complimentary", "Complimentary"],
  ["staff_meal", "Staff Meal"],
  ["closing_stock", "Closing Stock"],
];

export default function Reconciliation() {
  const { user } = useAuth();
  const canEdit = ["owner", "manager"].includes(user.role);
  const [rows, setRows] = useState([]);
  const [saving, setSaving] = useState("");

  const load = () => api.get("/reconciliation").then((r) => setRows(r.data)).catch((e) => toast.error(fmtErr(e)));
  useEffect(() => { load(); }, []);

  const set = (id, k, v) => setRows((rs) => rs.map((r) => (r.dish_id === id ? { ...r, [k]: v } : r)));

  const save = async (r) => {
    setSaving(r.dish_id);
    try {
      await api.post("/pos-sales", { dish_id: r.dish_id, qty: Number(r.sold) || 0 });
      await api.post("/reconciliation", {
        dish_id: r.dish_id,
        complimentary: Number(r.complimentary) || 0,
        staff_meal: Number(r.staff_meal) || 0,
        closing_stock: Number(r.closing_stock) || 0,
      });
      toast.success(`${r.dish_name} reconciliation saved`);
      load();
    } catch (e) { toast.error(fmtErr(e)); } finally { setSaving(""); }
  };

  return (
    <div data-testid="reconciliation-page">
      <PageHead title="Reconciliation" sub="Type in what POS sold — every produced portion is traced to where it went" testId="reconciliation-head" />
      <div className="grid gap-5 lg:grid-cols-2">
        {rows.map((r) => {
          const accounted = (Number(r.sold) || 0) + (Number(r.complimentary) || 0) + (Number(r.staff_meal) || 0) + (Number(r.closing_stock) || 0) + r.wastage;
          const gap = r.produced - accounted;
          return (
            <Card key={r.dish_id} testId={`recon-card-${r.dish_id}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {fileUrl(r.image_url) ? (
                    <img src={fileUrl(r.image_url)} alt={r.dish_name} data-testid={`recon-photo-${r.dish_id}`}
                      className="size-12 shrink-0 rounded-xl border border-white/10 object-cover" />
                  ) : (
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-brand-terra/10 font-display text-sm font-extrabold text-brand-terra">
                      {r.dish_name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                    </span>
                  )}
                  <div>
                    <h3 className="font-display text-lg font-bold tracking-tight">{r.dish_name}</h3>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Produced {r.produced} · Batch wastage {r.wastage}
                    </p>
                  </div>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest ${gap === 0 && r.produced > 0 ? "bg-brand-emerald/15 text-brand-emerald" : gap < 0 ? "bg-brand-terra/15 text-brand-terra" : "bg-brand-gold/15 text-brand-gold"}`} data-testid={`recon-status-${r.dish_id}`}>
                  {r.produced === 0 ? "No production" : gap === 0 ? "Fully reconciled" : gap < 0 ? `${Math.abs(gap)} over-sold` : `${gap} unexplained`}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {FIELDS.map(([k, label]) => (
                  <label key={k} className="block">
                    <span className="mb-1 block font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{label}</span>
                    <input
                      type="number" min="0" disabled={!canEdit}
                      value={r[k]}
                      onChange={(e) => set(r.dish_id, k, e.target.value)}
                      data-testid={`recon-${k}-${r.dish_id}`}
                      className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none transition-colors focus:border-brand-terra/60 disabled:opacity-50"
                    />
                  </label>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Accounted <span className="font-mono font-semibold text-foreground">{accounted}</span> / {r.produced}
                </p>
                {canEdit && (
                  <button onClick={() => save(r)} disabled={saving === r.dish_id} data-testid={`recon-save-${r.dish_id}`}
                    className="flex items-center gap-2 rounded-full bg-brand-terra px-4 py-2 text-xs font-semibold text-white transition-transform hover:scale-[1.03] disabled:opacity-60">
                    {saving === r.dish_id && <Loader2 className="size-3.5 animate-spin" />} Save
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
