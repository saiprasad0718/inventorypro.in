import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Trophy } from "lucide-react";
import api, { fmtErr } from "../api";
import { Card, DataTable, PageHead, fmtINR } from "../components";

const COLORS = ["#FF5722", "#E6A100", "#10B981", "#38BDF6", "#8B5CF6"];
const tooltipStyle = { background: "#131620", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 };

export default function Compare() {
  const [rows, setRows] = useState(null);
  useEffect(() => {
    api.get("/outlets/compare").then((r) => setRows(r.data)).catch((e) => toast.error(fmtErr(e)));
  }, []);
  if (!rows) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const best = rows.reduce((a, b) => (b.sales > (a?.sales || 0) ? b : a), null);
  const dates = rows[0]?.seven_day?.map((d) => d.date) || [];
  const chartData = dates.map((dt, i) => {
    const row = { date: dt };
    rows.forEach((o) => { row[o.name] = o.seven_day[i]?.sales || 0; });
    return row;
  });

  return (
    <div data-testid="compare-page">
      <PageHead title="Outlet Comparison" sub="Sales, food cost and wastage across branches — side by side, today" testId="compare-head" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((o, i) => (
          <Card key={o.name} testId={`compare-card-${o.name.toLowerCase().replace(/[^a-z]+/g, "-")}`} className={best && o.name === best.name && rows.length > 1 ? "glow-border" : ""}>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold tracking-tight">{o.name}</h3>
              {best && o.name === best.name && rows.length > 1 && (
                <span className="flex items-center gap-1.5 rounded-full bg-brand-gold/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-brand-gold">
                  <Trophy className="size-3" /> Top today
                </span>
              )}
            </div>
            <p className="mt-3 font-display text-3xl font-extrabold tracking-tight">{fmtINR(o.sales)}</p>
            <p className="text-xs text-muted-foreground">{o.portions_sold} portions sold today</p>
            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/8 pt-4 text-center">
              <div>
                <p className={`font-mono text-sm font-semibold ${o.food_cost_pct <= 32 ? "text-brand-emerald" : "text-brand-gold"}`}>{o.food_cost_pct}%</p>
                <p className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Food cost</p>
              </div>
              <div>
                <p className="font-mono text-sm font-semibold text-brand-terra">{fmtINR(o.wastage_value)}</p>
                <p className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Wastage</p>
              </div>
              <div>
                <p className="font-mono text-sm font-semibold">{fmtINR(o.stock_value)}</p>
                <p className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Stock</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6" testId="compare-chart">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">7-Day Sales by Outlet</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {rows.map((o, i) => (
                <Bar key={o.name} dataKey={o.name} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} barSize={18} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="mt-6">
        <DataTable
          testId="compare-table"
          cols={["Outlet", "Sales Today", "Portions", "Produced", "Food Cost %", "Wastage", "Stock Value"]}
          rows={rows.map((o) => [
            <span className="font-medium">{o.name}</span>,
            <span className="font-mono">{fmtINR(o.sales)}</span>,
            <span className="font-mono">{o.portions_sold}</span>,
            <span className="font-mono">{o.produced}</span>,
            <span className={`font-mono ${o.food_cost_pct <= 32 ? "text-brand-emerald" : "text-brand-gold"}`}>{o.food_cost_pct}%</span>,
            <span className="font-mono text-brand-terra">{fmtINR(o.wastage_value)}</span>,
            <span className="font-mono">{fmtINR(o.stock_value)}</span>,
          ])}
        />
      </div>
    </div>
  );
}
