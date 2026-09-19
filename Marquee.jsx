const items = [
  "8–14% raw material quietly lost every month",
  "246 portions produced · 221 sold · every one accounted",
  "Recipe-level deduction, not gut feel",
  "POS says 90 sold — where are the other 10?",
  "One view. Zero surprises at month-end.",
];

export default function Marquee() {
  const row = [...items, ...items];
  return (
    <div className="border-y border-white/8 bg-[#0D1017] py-5" data-testid="editorial-marquee">
      <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="font-display text-lg font-medium tracking-tight text-muted-foreground">
              {t}
            </span>
            <span className="size-1.5 rounded-full bg-brand-terra" aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  );
}
