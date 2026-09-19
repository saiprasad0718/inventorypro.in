import { useEffect, useState } from "react";
import { toast } from "sonner";
import api, { fmtErr } from "../api";
import { Card, DataTable, DEPARTMENTS, Field, PageHead, fmtNum, inputCls } from "../components";

export default function Production() {
  const [dishes, setDishes] = useState([]);
  const [log, setLog] = useState([]);
  const [form, setForm] = useState({ dish_id: "", qty: "", wastage_qty: 0, shift: "Lunch", dept: DEPARTMENTS[0] });
  const [saving, setSaving] = useState(false);

  const load = () => {
    api.get("/dishes").then((r) => setDishes(r.data)).catch((e) => toast.error(fmtErr(e)));
    api.get("/production").then((r) => setLog(r.data)).catch((e) => toast.error(fmtErr(e)));
  };
  useEffect(() => { load(); }, []);

  const dish = dishes.find((d) => d.id === form.dish_id);
  const qty = Number(form.qty) || 0;
  const expected = dish ? dish.items.map((it) => ({ name: it.ingredient_name, unit: it.unit, per: it.qty_per_portion, need: +(it.qty_per_portion * qty).toFixed(3) })) : [];

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const r = await api.post("/production", { ...form, qty: parseInt(form.qty, 10), wastage_qty: parseInt(form.wastage_qty, 10) || 0 });
      toast.success(`Batch ${r.data.batch_no} saved — raw materials auto-deducted from ${form.dept}`);
      setForm((f) => ({ ...f, qty: "", wastage_qty: 0 }));
      load();
    } catch (e2) { toast.error(fmtErr(e2)); } finally { setSaving(false); }
  };

  return (
    <div data-testid="production-page">
      <PageHead title="Production" sub="Log a finished batch — raw-material consumption is calculated and deducted automatically" testId="production-head" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card testId="production-form-card">
          <form onSubmit={submit} className="space-y-4">
            <Field label="Dish">
              <select required value={form.dish_id} onChange={(e) => setForm((f) => ({ ...f, dish_id: e.target.value }))} data-testid="production-dish-select" className={`${inputCls} appearance-none`}>
                <option value="" className="bg-brand-slate">Select dish…</option>
                {dishes.map((d) => <option key={d.id} value={d.id} className="bg-brand-slate">{d.name}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Quantity (portions)"><input required type="number" min="1" value={form.qty} onChange={(e) => setForm((f) => ({ ...f, qty: e.target.value }))} data-testid="production-qty-input" className={inputCls} placeholder="100" /></Field>
              <Field label="Wastage (portions)"><input type="number" min="0" value={form.wastage_qty} onChange={(e) => setForm((f) => ({ ...f, wastage_qty: e.target.value }))} data-testid="production-wastage-input" className={inputCls} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Shift">
                <select value={form.shift} onChange={(e) => setForm((f) => ({ ...f, shift: e.target.value }))} data-testid="production-shift-select" className={`${inputCls} appearance-none`}>
                  {["Lunch", "Dinner"].map((s) => <option key={s} className="bg-brand-slate">{s}</option>)}
                </select>
              </Field>
              <Field label="Department">
                <select value={form.dept} onChange={(e) => setForm((f) => ({ ...f, dept: e.target.value }))} data-testid="production-dept-select" className={`${inputCls} appearance-none`}>
                  {DEPARTMENTS.map((d) => <option key={d} className="bg-brand-slate">{d}</option>)}
                </select>
              </Field>
            </div>
            <button type="submit" disabled={saving} data-testid="production-submit-button" className="w-full rounded-xl bg-brand-terra py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.01] disabled:opacity-60">
              {saving ? "Saving..." : "Save Production"}
            </button>
            <p className="text-center text-xs text-muted-foreground">A batch number is generated automatically when you save.</p>
          </form>
        </Card>
        <Card testId="expected-consumption-card">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Expected Consumption — Live Calculation</p>
          {dish && qty > 0 ? (
            <ul className="mt-4 space-y-2.5" data-testid="expected-consumption-list">
              {expected.map((it) => (
                <li key={it.name} className="flex items-center justify-between rounded-xl border border-white/8 bg-black/20 px-4 py-2.5 text-sm">
                  <span>{it.name} <span className="text-muted-foreground">· {it.per} × {qty}</span></span>
                  <span className="font-mono font-semibold text-brand-gold">{fmtNum(it.need)} {it.unit}</span>
                </li>
              ))}
              <li className="flex items-center justify-between px-4 pt-2 text-sm">
                <span className="text-muted-foreground">Batch food cost</span>
                <span className="font-mono font-semibold">₹{fmtNum(dish.cost_per_portion * qty)} <span className="text-muted-foreground">({dish.food_cost_pct}% of price)</span></span>
              </li>
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Pick a dish and quantity — consumption per the recipe BOM appears here before you save.</p>
          )}
        </Card>
      </div>
      <h2 className="mb-4 mt-10 font-display text-lg font-bold">Production Log — Today</h2>
      <DataTable
        testId="production-log-table"
        cols={["Batch", "Dish", "Qty", "Wastage", "Shift", "Chef", "Department"]}
        rows={log.map((b) => [<span className="font-mono text-brand-terra">{b.batch_no}</span>, b.dish_name, <span className="font-mono">{b.qty}</span>, <span className="font-mono">{b.wastage_qty}</span>, b.shift, b.chef, b.dept])}
      />
    </div>
  );
}
