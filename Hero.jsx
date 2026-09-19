import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, MessageCircle, CheckCircle2 } from "lucide-react";

const lines = [
  { text: "Every gram.", accent: false },
  { text: "Every batch.", accent: false },
  { text: "Reconciled.", accent: true },
];

const ease = [0.16, 1, 0.3, 1];

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yFrame = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const yBadge = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="top" ref={ref} className="relative overflow-hidden pt-40 pb-24 sm:pt-48">
      <div
        aria-hidden="true"
        className="absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-brand-terra/12 blur-[140px]"
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease }}
            className="font-mono text-xs tracking-[0.3em] uppercase text-brand-gold"
            data-testid="hero-eyebrow"
          >
            Restaurant Inventory · Production · Food-Cost Control
          </motion.p>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            {lines.map((line, i) => (
              <span key={line.text} className="block overflow-hidden pb-1">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.25 + i * 0.13, duration: 0.9, ease }}
                  className={`block ${line.accent ? "text-brand-terra" : ""}`}
                >
                  {line.text}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.8, ease }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
            data-testid="hero-subtitle"
          >
            InventoryPro.in sits beside your existing POS and answers the one question
            no billing software can — where did every portion actually go? Live stock,
            batch-level recipe deduction, wastage and POS reconciliation, in one owner view.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8, ease }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#demo"
              data-testid="hero-cta-demo-button"
              className="group inline-flex items-center gap-2 rounded-full bg-brand-terra px-7 py-3.5 text-sm font-semibold text-white transition-transform duration-300 hover:scale-[1.04]"
            >
              Try the Live Demo
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="https://wa.me/919908659651?text=Hi%20Sai,%20I%20saw%20InventoryPro.in%20and%20want%20a%20live%20demo%20for%20my%20restaurant."
              target="_blank"
              rel="noopener noreferrer"
              data-testid="hero-cta-whatsapp-button"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-foreground transition-colors duration-300 hover:border-brand-emerald/60 hover:text-brand-emerald"
            >
              <MessageCircle className="size-4" />
              WhatsApp Us
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mt-10 flex flex-wrap gap-x-8 gap-y-3"
          >
            {["Works alongside any POS", "Batch-level recipe costing", "Same-day variance alerts"].map((t) => (
              <span key={t} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="size-4 text-brand-emerald" />
                {t}
              </span>
            ))}
          </motion.div>
        </div>

        <motion.div style={{ y: yFrame, opacity }} className="relative">
          <motion.div
            initial={{ opacity: 0, y: 60, rotate: 2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ delay: 0.5, duration: 1, ease }}
            className="spotlight-frame glow-border rounded-2xl border border-white/10 bg-brand-slate"
            data-testid="hero-dashboard-preview"
          >
            <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
              <span className="size-2.5 rounded-full bg-brand-terra/70" />
              <span className="size-2.5 rounded-full bg-brand-gold/70" />
              <span className="size-2.5 rounded-full bg-brand-emerald/70" />
              <span className="ml-3 font-mono text-[10px] tracking-widest text-muted-foreground">
                inventorypro.in/dashboard
              </span>
            </div>
            <div className="space-y-4 p-5">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Today's Sales", value: "₹69,800", tone: "text-foreground" },
                  { label: "Food Cost", value: "31.3%", tone: "text-brand-emerald" },
                  { label: "Variance", value: "4 portions", tone: "text-brand-gold" },
                ].map((k) => (
                  <div key={k.label} className="rounded-xl border border-white/8 bg-black/30 p-3">
                    <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{k.label}</p>
                    <p className={`mt-1 font-display text-sm font-bold sm:text-lg ${k.tone}`}>{k.value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-white/8 bg-black/30 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                    Chicken Biryani — Reconciliation
                  </p>
                  <span className="rounded-full bg-brand-emerald/15 px-2 py-0.5 font-mono text-[9px] text-brand-emerald">
                    FULLY RECONCILED
                  </span>
                </div>
                <div className="flex h-2.5 overflow-hidden rounded-full">
                  <span className="bg-brand-terra" style={{ width: "90%" }} />
                  <span className="bg-brand-gold" style={{ width: "3%" }} />
                  <span className="bg-brand-emerald" style={{ width: "2%" }} />
                  <span className="bg-white/20" style={{ width: "5%" }} />
                </div>
                <div className="mt-3 flex justify-between font-mono text-[9px] text-muted-foreground">
                  <span>POS Sold 90</span>
                  <span>Complimentary 2</span>
                  <span>Staff 1</span>
                  <span>Closing 5</span>
                </div>
              </div>
              <div className="flex items-end gap-1.5 rounded-xl border border-white/8 bg-black/30 p-4">
                {[42, 58, 50, 66, 61, 74, 80].map((h, i) => (
                  <motion.span
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 1 + i * 0.08, duration: 0.6, ease }}
                    className="w-full rounded-sm bg-gradient-to-t from-brand-terra/40 to-brand-terra"
                    style={{ minHeight: 4, height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
          <motion.div
            style={{ y: yBadge }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.7, ease }}
            className="absolute -bottom-8 -left-4 rounded-2xl border border-white/10 bg-brand-obsidian/90 px-5 py-4 shadow-2xl backdrop-blur-xl sm:-left-10"
            data-testid="hero-floating-badge"
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-brand-gold">Wastage today</p>
            <p className="mt-1 font-display text-2xl font-bold text-foreground">
              ₹74 <span className="text-sm font-medium text-brand-emerald">↓ 62% vs last week</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
