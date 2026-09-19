import { useEffect, useState } from "react";
import { toast } from "sonner";
import api, { fmtErr } from "../api";
import { Card, DataTable, DEPARTMENTS, Field, PageHead, fmtINR, fmtNum, inputCls } from "../components";

const REASONS = ["Spoilage", "Overproduction", "Preparation Loss", "Burnt", "Damaged", "Expired", "Other"];

export default function Wastage() {
  const [type, setType] = useState("ingredient");
  const [ings, setIngs] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [log, setLog] = useState([]);
  const [form, setForm] = useState({ item_id: "", qty: "", reason: REASONS[0], dept: "Central Store", remarks: "" });
  const [saving, setSaving] = useState(false);

  const load = () => {
    api.get("/ingredients").then((r) => setIngs(r.data)).catch((e) => toast.error(fmtErr(e)));
    api.get("/dishes").then((r) => setDishes(r.data)).catch((e) => toast.error(fmtErr(e)));
    api.get("/wastage").then((r) => setLog(r.data)).catch((e) => toast.error(fmtErr(e)));
  };
  useEffect(() => { load(); }, []);

  const items = type === "ingredient" ? ings : dishes;
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const r = await api.post("/wastage", { item_type: type, ...form, qty: Number(form.qty) });
      toast.success(`Wastage recorded — ${fmtINR(r.data.value)} written off`);
      setForm((f) => ({ ...f, item_id: "", qty: "", remarks: "" }));
      load();
    } catch (e2) { toast.error(fmtErr(e2)); } finally { setSaving(false); }
  };

  return (
    <div data-testid="wastage-page">
      <PageHead title="Wastage" sub="Record spoilage, overproduction, prep loss and other losses" testId="wastage-head" />
      <Card className="mb-8" testId="wastage-form-card">
        <div className="mb-5 flex gap-2">
          {[["ingredient", "Ingredient"], ["dish", "Dish (finished)"]].map(([v, l]) => (
            <button key={v} type="button" onClick={() => { setType(v); setForm((f) => ({ ...f, item_id: "" })); }} data-testid={`wastage-type-${v}`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${type === v ? "bg-brand-terra text-white" : "border border-white/10 text-muted-foreground hover:text-foreground"}`}>
              {l}
            </button>
          ))}
        </div>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label={type === "ingredient" ? "Ingredient" : "Dish"}>
            <select required value={form.item_id} onChange={(e) => setForm((f) => ({ ...f, item_id: e.target.value }))} data-testid="wastage-item-select" className={`${inputCls} appearance-none`}>
              <option value="" className="bg-brand-slate">Select…</option>
              {items.map((i) => <option key={i.id} value={i.id} className="bg-brand-slate">{i.name}</option>)}
            </select>
          </Field>
          <Field label="Quantity"><input required type="number" step="any" min="0.001" value={form.qty} onChange={(e) => setForm((f) => ({ ...f, qty: e.target.value }))} data-testid="wastage-qty-input" className={inputCls} placeholder="0.5" /></Field>
          <Field label="Reason">
            <select value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))} data-testid="wastage-reason-select" className={`${inputCls} appearance-none`}>
              {REASONS.map((r) => <option key={r} className="bg-brand-slate">{r}</option>)}
            </select>
          </Field>
          <Field label="Department">
            <select value={form.dept} onChange={(e) => setForm((f) => ({ ...f, dept: e.target.value }))} data-testid="wastage-dept-select" className={`${inputCls} appearance-none`}>
              {["Central Store", ...DEPARTMENTS].map((d) => <option key={d} className="bg-brand-slate">{d}</option>)}
            </select>
          </Field>
          <Field label="Remarks"><input value={form.remarks} onChange={(e) => setForm((f) => ({ ...f, remarks: e.target.value }))} data-testid="wastage-remarks-input" className={inputCls} placeholder="Optional" /></Field>
          <div className="flex items-end">
            <button type="submit" disabled={saving} data-testid="wastage-submit-button" className="w-full rounded-xl bg-brand-terra py-2.5 text-sm font-semibold text-white disabled:opacity-60">
              {saving ? "Recording..." : "Record Wastage"}
            </button>
          </div>
        </form>
      </Card>
      <h2 className="mb-4 font-display text-lg font-bold">Wastage Log — Today</h2>
      <DataTable
        testId="wastage-log-table"
        cols={["Item", "Type", "Qty", "Reason", "Department", "Value", "By"]}
        rows={log.map((w) => [
          w.item_name,
          <span className="text-muted-foreground">{w.item_type}</span>,
          <span className="font-mono">{fmtNum(w.qty)}</span>,
          w.reason,
          w.dept,
          <span className="font-mono text-brand-gold">{fmtINR(w.value)}</span>,
          w.recorded_by,
        ])}
      />
    </div>
  );
}
