import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Camera, Plus, X } from "lucide-react";
import api, { fmtErr } from "../api";
import { Card, Field, PageHead, fmtINR, inputCls } from "../components";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

export default function Recipes() {
  const [dishes, setDishes] = useState([]);
  const [ings, setIngs] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", sell_price: "", items: [{ ingredient_id: "", qty_per_portion: "" }] });

  const load = () => {
    api.get("/dishes").then((r) => setDishes(r.data)).catch((e) => toast.error(fmtErr(e)));
    api.get("/ingredients").then((r) => setIngs(r.data)).catch((e) => toast.error(fmtErr(e)));
  };
  useEffect(() => { load(); }, []);

  const setItem = (i, k, v) => setForm((f) => ({ ...f, items: f.items.map((it, j) => (j === i ? { ...it, [k]: v } : it)) }));

  const submit = async (e) => {
    e.preventDefault();
    const items = form.items.filter((it) => it.ingredient_id && Number(it.qty_per_portion) > 0)
      .map((it) => ({ ingredient_id: it.ingredient_id, qty_per_portion: Number(it.qty_per_portion) }));
    try {
      await api.post("/dishes", { name: form.name, category: form.category, sell_price: Number(form.sell_price), items });
      toast.success("Recipe saved");
      setShowAdd(false);
      setForm({ name: "", category: "", sell_price: "", items: [{ ingredient_id: "", qty_per_portion: "" }] });
      load();
    } catch (e2) { toast.error(fmtErr(e2)); }
  };

  const fileRefs = useRef({});
  const [uploading, setUploading] = useState("");
  const photoSrc = (d) =>
    d.image_url ? `${BACKEND}${d.image_url}?auth=${localStorage.getItem("ip_token")}` : null;
  const uploadPhoto = async (dishId, file) => {
    if (!file) return;
    setUploading(dishId);
    try {
      const fd = new FormData();
      fd.append("file", file);
      await api.post(`/dishes/${dishId}/photo`, fd);
      toast.success("Dish photo updated");
      load();
    } catch (e) { toast.error(fmtErr(e)); } finally { setUploading(""); }
  };

  return (
    <div data-testid="recipes-page">
      <div className="flex items-start justify-between gap-4">
        <PageHead title="Recipes / Bill of Materials" sub="Standard quantity of each ingredient per portion — this drives auto-deduction" testId="recipes-head" />
        <button onClick={() => setShowAdd((s) => !s)} data-testid="add-dish-toggle" className="flex shrink-0 items-center gap-2 rounded-full bg-brand-terra px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.03]">
          <Plus className="size-4" /> Add Dish
        </button>
      </div>

      {showAdd && (
        <Card className="mb-8" testId="add-dish-form">
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Dish Name"><input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} data-testid="add-dish-name" className={inputCls} placeholder="Veg Fried Rice" /></Field>
              <Field label="Category"><input required value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} data-testid="add-dish-category" className={inputCls} placeholder="Rice & Noodles" /></Field>
              <Field label="Sell Price (₹)"><input required type="number" step="any" min="1" value={form.sell_price} onChange={(e) => setForm((f) => ({ ...f, sell_price: e.target.value }))} data-testid="add-dish-price" className={inputCls} placeholder="160" /></Field>
            </div>
            <div className="space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Ingredients per portion</p>
              {form.items.map((it, i) => (
                <div key={i} className="flex gap-3">
                  <select value={it.ingredient_id} onChange={(e) => setItem(i, "ingredient_id", e.target.value)} data-testid={`add-dish-ing-${i}`} className={`${inputCls} appearance-none`}>
                    <option value="" className="bg-brand-slate">Select ingredient…</option>
                    {ings.map((g) => <option key={g.id} value={g.id} className="bg-brand-slate">{g.name} ({g.unit})</option>)}
                  </select>
                  <input type="number" step="any" min="0" value={it.qty_per_portion} onChange={(e) => setItem(i, "qty_per_portion", e.target.value)} data-testid={`add-dish-qty-${i}`} className={inputCls} placeholder="Qty / portion" />
                  {form.items.length > 1 && (
                    <button type="button" onClick={() => setForm((f) => ({ ...f, items: f.items.filter((_, j) => j !== i) }))} className="shrink-0 rounded-xl border border-white/10 px-3 text-muted-foreground hover:text-brand-terra" data-testid={`add-dish-remove-${i}`}><X className="size-4" /></button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => setForm((f) => ({ ...f, items: [...f.items, { ingredient_id: "", qty_per_portion: "" }] }))} data-testid="add-dish-add-item" className="text-sm text-brand-terra hover:underline">+ Add ingredient row</button>
            </div>
            <button type="submit" data-testid="add-dish-submit" className="w-full rounded-xl bg-brand-terra py-3 text-sm font-semibold text-white">Save Recipe</button>
          </form>
        </Card>
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {dishes.map((d) => (
          <Card key={d.id} testId={`recipe-card-${d.id}`} className="overflow-hidden p-0">
            <div className="relative h-36 w-full overflow-hidden bg-gradient-to-br from-brand-terra/25 via-brand-slate to-black">
              {photoSrc(d) ? (
                <img src={photoSrc(d)} alt={d.name} data-testid={`recipe-photo-${d.id}`} className="h-full w-full object-cover" />
              ) : (
                <span className="grid h-full place-items-center font-display text-3xl font-extrabold tracking-widest text-white/15">
                  {d.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </span>
              )}
              <input
                type="file" accept="image/*" className="hidden"
                ref={(el) => (fileRefs.current[d.id] = el)}
                onChange={(e) => { uploadPhoto(d.id, e.target.files?.[0]); e.target.value = ""; }}
                data-testid={`recipe-photo-input-${d.id}`}
              />
              <button
                type="button"
                onClick={() => fileRefs.current[d.id]?.click()}
                disabled={uploading === d.id}
                data-testid={`recipe-photo-btn-${d.id}`}
                className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur transition-colors hover:bg-brand-terra disabled:opacity-60"
              >
                <Camera className="size-3.5" />
                {uploading === d.id ? "Uploading..." : d.image_url ? "Change photo" : "Add photo"}
              </button>
            </div>
            <div className="p-5 pt-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-lg font-bold tracking-tight">{d.name}</h3>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{d.category}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 font-mono text-[10px] ${d.food_cost_pct <= 32 ? "bg-brand-emerald/15 text-brand-emerald" : "bg-brand-gold/15 text-brand-gold"}`}>
                FC {d.food_cost_pct}%
              </span>
            </div>
            <div className="mt-3 flex justify-between border-b border-white/8 pb-3 text-sm">
              <span className="text-muted-foreground">Price {fmtINR(d.sell_price)}</span>
              <span className="text-muted-foreground">Cost <span className="font-mono text-foreground">{fmtINR(d.cost_per_portion)}</span>/portion</span>
            </div>
            <ul className="mt-3 space-y-1.5 text-sm">
              {d.items.map((it) => (
                <li key={it.ingredient_id} className="flex justify-between text-muted-foreground">
                  <span>{it.ingredient_name}</span>
                  <span className="font-mono text-foreground">{it.qty_per_portion} {it.unit}</span>
                </li>
              ))}
            </ul>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
