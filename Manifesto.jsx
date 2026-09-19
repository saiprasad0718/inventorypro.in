import { motion } from "framer-motion";

const chapters = [
  {
    n: "01",
    title: "The Shrinkage Crisis",
    body: "Indian restaurants bleed 8–14% of raw ingredients to unrecorded pilferage, spoilage and eyeballed portions. Your POS only sees what was billed — never what left the store room.",
    accent: "text-brand-terra",
  },
  {
    n: "02",
    title: "Batch-Level Recipe Intelligence",
    body: "Log a production batch and InventoryPro.in auto-deducts every ingredient per the recipe BOM — biryani, curry bases, tandoori marinades — tracked to the gram, valued in rupees.",
    accent: "text-brand-gold",
  },
  {
    n: "03",
    title: "POS vs Actual Reconciliation",
    body: "Type in what the POS sold. Every produced portion is instantly traced to sales, complimentary, staff meals, wastage or closing stock. Variance stops hiding until the month-end audit.",
    accent: "text-brand-emerald",
  },
];

export default function Manifesto() {
  return (
    <section id="manifesto" className="mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36">
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="font-mono text-xs tracking-[0.3em] uppercase text-brand-gold"
      >
        The Manifesto
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="mt-4 max-w-3xl font-display text-2xl font-bold tracking-tight sm:text-4xl"
      >
        Kitchens don't lose money loudly. They lose it silently — one untracked
        portion at a time.
      </motion.h2>
      <div className="mt-16 space-y-0">
        {chapters.map((c, i) => (
          <motion.div
            key={c.n}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: i * 0.08 }}
            className="group grid gap-4 border-t border-white/8 py-10 transition-colors duration-500 hover:bg-white/[0.02] sm:grid-cols-[120px_1fr_1.4fr] sm:gap-10 sm:px-6"
            data-testid={`manifesto-chapter-${c.n}`}
          >
            <span className={`font-display text-5xl font-extrabold tracking-tight ${c.accent} opacity-90`}>
              {c.n}
            </span>
            <h3 className="font-display text-xl font-bold tracking-tight sm:text-2xl">{c.title}</h3>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground">{c.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
