import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import api, { fmtErr } from "../api";
import { Card, DataTable, PageHead, fmtINR } from "../components";

const tooltipStyle = { background: "#131620", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 };

export default function Reports() {
  const [rows, setRows] = useState(null);
  useEffect(() => {
    api.get("/reports").then((r) => setRows(r.data)).catch((e) => toast.error(fmtErr(e)));
  }, []);
  if (!rows) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const totals = rows.reduce((a, r) => ({
    sales: a.sales + r.sales, sold: a.sold + r.portions_sold, produced: a.produced + r.produced,
    cost: a.cost + r.production_cost, wastage: a.wastage + r.wastage_value, purchases: a.purchases + r.purchases_value,
  }), { sales: 0, sold: 0, produced: 0, cost: 0, wastage: 0, purchases: 0 });

  return (
    <div data-testid="reports-page">
      <PageHead title="Reports" sub="Standard reports across the last 7 days" testId="reports-head" />
      <Card className="mb-8" testId="reports-chart">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Sales vs Food Cost % — 7 Days</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={rows}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar yAxisId="left" dataKey="sales" name="Sales (₹)" fill="#FF5722" radius={[6, 6, 0, 0]} barSize={26} />
              <Line yAxisId="right" dataKey="food_cost_pct" name="Food cost %" stroke="#E6A100" strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <DataTable
        testId="reports-table"
        cols={["Date", "Sales", "Portions Sold", "Produced", "Production Cost", "Food Cost %", "Wastage", "Purchases"]}
        rows={[
          ...rows.map((r) => [
            r.label,
            <span className="font-mono">{fmtINR(r.sales)}</span>,
            <span className="font-mono">{r.portions_sold}</span>,
            <span className="font-mono">{r.produced}</span>,
            <span className="font-mono">{fmtINR(r.production_cost)}</span>,
            <span className={`font-mono ${r.food_cost_pct <= 32 ? "text-brand-emerald" : "text-brand-gold"}`}>{r.food_cost_pct}%</span>,
            <span className="font-mono text-brand-gold">{fmtINR(r.wastage_value)}</span>,
            <span className="font-mono">{fmtINR(r.purchases_value)}</span>,
          ]),
          [
            <span className="font-semibold">7-day total</span>,
            <span className="font-mono font-semibold">{fmtINR(totals.sales)}</span>,
            <span className="font-mono font-semibold">{totals.sold}</span>,
            <span className="font-mono font-semibold">{totals.produced}</span>,
            <span className="font-mono font-semibold">{fmtINR(totals.cost)}</span>,
            <span className="font-mono font-semibold">{totals.sales ? ((totals.cost / totals.sales) * 100).toFixed(1) : 0}%</span>,
            <span className="font-mono font-semibold text-brand-gold">{fmtINR(totals.wastage)}</span>,
            <span className="font-mono font-semibold">{fmtINR(totals.purchases)}</span>,
          ],
        ]}
      />
    </div>
  );
}
