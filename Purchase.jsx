import { useEffect, useState } from "react";
import { toast } from "sonner";
import api, { fmtErr } from "../api";
import { Card, DataTable, Field, PageHead, fmtINR, fmtNum, inputCls } from "../components";

export default function Purchase() {
  const [ings, setIngs] = useState([]);
  const [recent, setRecent] = useState([]);
  const [form, setForm] = useState({ ingredient_id: "", qty: "", rate: "", supplier: "", invoice_no: "" });
  const [saving, setSaving] = useState(false);

  const load = () => {
    api.get("/ingredients").then((r) => setIngs(r.data)).catch((e) => toast.error(fmtErr(e)));
    api.get("/purchases").then((r) => setRecent(r.data)).catch((e) => toast.error(fmtErr(e)));
  };
  useEffect(() => { load(); }, []);

  const ing = ings.find((i) => i.id === form.ingredient_id);
  const qty = Number(form.qty) || 0;
  const rate = Number(form.rate) || 0;

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/purchases", { ...form, qty, rate });
      toast.success(`Received ${qty} ${ing?.unit || ""} of ${ing?.name} — stock updated`);
      setForm({ ingredient_id: form.ingredient_id, qty: "", rate: form.rate, supplier: "", invoice_no: "" });
      load();
    } catch (e2) { toast.error(fmtErr(e2)); } finally { setSaving(false); }
  };

  return (
    <div data-testid="purchase-page">
      <PageHead title="Raw Material Receiving" sub="Record incoming stock from a supplier invoice" testId="purchase-head" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card testId="purchase-form-card">
          <form onSubmit={submit} className="space-y-4">
            <Field label="Ingredient">
              <select required value={form.ingredient_id} onChange={(e) => { const sel = ings.find((i) => i.id === e.target.value); setForm((f) => ({ ...f, ingredient_id: e.target.value, rate: sel ? sel.rate : f.rate })); }} data-testid="purchase-ingredient-select" className={`${inputCls} appearance-none`}>
                <option value="" className="bg-brand-slate">Select ingredient…</option>
                {ings.map((i) => <option key={i.id} value={i.id} className="bg-brand-slate">{i.name} ({i.unit})</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Quantity Received"><input required type="number" step="any" min="0.001" value={form.qty} onChange={(e) => setForm((f) => ({ ...f, qty: e.target.value }))} data-testid="purchase-qty-input" className={inputCls} placeholder="10" /></Field>
              <Field label="Rate (₹ per unit)"><input required type="number" step="any" min="0.01" value={form.rate} onChange={(e) => setForm((f) => ({ ...f, rate: e.target.value }))} data-testid="purchase-rate-input" className={inputCls} placeholder="220" /></Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Supplier"><input value={form.supplier} onChange={(e) => setForm((f) => ({ ...f, supplier: e.target.value }))} data-testid="purchase-supplier-input" className={inputCls} placeholder="Fresh Farms" /></Field>
              <Field label="Invoice Number"><input value={form.invoice_no} onChange={(e) => setForm((f) => ({ ...f, invoice_no: e.target.value }))} data-testid="purchase-invoice-input" className={inputCls} placeholder="INV-1042" /></Field>
            </div>
            <button type="submit" disabled={saving} data-testid="purchase-submit-button" className="w-full rounded-xl bg-brand-terra py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.01] disabled:opacity-60">
              {saving ? "Saving..." : "Record Purchase"}
            </button>
          </form>
        </Card>
        <Card testId="purchase-preview-card">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Stock Impact Preview</p>
          {ing && qty > 0 ? (
            <div className="mt-4 space-y-3 text-sm" data-testid="purchase-preview">
              <div className="flex justify-between border-b border-white/8 pb-2"><span className="text-muted-foreground">Total amount</span><span className="font-mono font-semibold">{fmtINR(qty * rate)}</span></div>
              <div className="flex justify-between border-b border-white/8 pb-2"><span className="text-muted-foreground">Current book stock</span><span className="font-mono">{fmtNum(ing.book_stock)} {ing.unit}</span></div>
              <div className="flex justify-between border-b border-white/8 pb-2"><span className="text-muted-foreground">Receiving</span><span className="font-mono text-brand-emerald">+{fmtNum(qty)} {ing.unit}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">New book stock</span><span className="font-mono font-semibold text-brand-emerald">{fmtNum(ing.book_stock + qty)} {ing.unit}</span></div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Pick an ingredient and quantity to see the ledger impact before saving.</p>
          )}
        </Card>
      </div>
      <h2 className="mb-4 mt-10 font-display text-lg font-bold">Recent Receiving</h2>
      <DataTable
        testId="purchase-recent-table"
        cols={["Date", "Ingredient", "Qty", "Rate", "Amount", "Supplier", "Invoice"]}
        rows={recent.map((p) => [p.date, p.ingredient_name, <span className="font-mono">{fmtNum(p.qty)}</span>, <span className="font-mono">{fmtINR(p.rate)}</span>, <span className="font-mono">{fmtINR(p.amount)}</span>, p.supplier || "—", p.invoice_no || "—"])}
      />
    </div>
  );
}
