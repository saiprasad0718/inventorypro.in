import { motion } from "framer-motion";
import { ArrowRight, Presentation } from "lucide-react";

const steps = [
  ["01", "The Morning Glance", "Sales, food cost, stock, wastage — one screen before the first coffee."],
  ["02", "Stock In, Ledger Updated", "One supplier entry updates the book, with a live impact preview."],
  ["03", "Store to Kitchen", "Every gram issued against a department, not a godown register."],
  ["04", "The Magic Step", "Save a batch — each ingredient auto-deducts per the recipe."],
  ["05", "The Money Moment", "POS sold vs produced. Every portion lands somewhere, or flags red."],
  ["06", "Nothing Hides", "Book vs physical, issued vs consumed — before dinner, not month-end."],
  ["07", "Seven Days of Truth", "The morning report an owner actually acts on."],
];

export default function TourTeaser() {
  return (
    <section id="guided-demo" className="relative overflow-hidden py-28 sm:py-36" data-testid="tour-teaser-section">
      <div
        aria-hidden="true"
        className="absolute top-1/3 right-0 h-[420px] w-[600px] rounded-full bg-brand-gold/8 blur-[140px]"
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="font-mono text-xs tracking-[0.3em] uppercase text-brand-gold"
        >
          The 7-Minute Pitch
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-4 max-w-3xl font-display text-2xl font-bold tracking-tight sm:text-4xl"
        >
          A guided demo that walks the story for you — step by step.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.18 }}
          className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground"
        >
          Inside the app, one press of <span className="text-foreground font-semibold">Guided Client Demo</span> takes
          your client through the full day of a restaurant — with the exact talking points on screen at every step.
        </motion.p>

        <div className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-7 lg:overflow-visible">
          {steps.map(([n, title, text], i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.07 }}
              className="glow-border w-56 shrink-0 snap-start rounded-2xl border border-white/10 bg-brand-slate p-5 lg:w-auto"
              data-testid={`tour-step-${n}`}
            >
              <span className="font-display text-2xl font-extrabold text-brand-terra">{n}</span>
              <h3 className="mt-3 font-display text-sm font-bold tracking-tight">{title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{text}</p>
            </motion.div>
          ))}
        </div>

        <motion.a
          href="/login"
          data-testid="tour-teaser-login-link"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="group mt-10 inline-flex items-center gap-2 rounded-full border border-brand-terra/50 px-6 py-3 text-sm font-semibold text-brand-terra transition-colors duration-300 hover:bg-brand-terra hover:text-white"
        >
          <Presentation className="size-4" />
          Sign in and press Guided Client Demo
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </motion.a>
      </div>
    </section>
  );
}
