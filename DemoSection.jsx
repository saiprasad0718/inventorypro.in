import { motion } from "framer-motion";
import { ExternalLink, Play } from "lucide-react";

export default function DemoSection() {
  return (
    <section id="demo" className="mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36">
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="font-mono text-xs tracking-[0.3em] uppercase text-brand-gold"
      >
        Hands-On Prototype
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="mt-4 max-w-3xl font-display text-2xl font-bold tracking-tight sm:text-4xl"
      >
        Don't take our word for it. Click through the real working prototype.
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.18 }}
        className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground"
      >
        This is the actual InventoryPro.in prototype — seeded with a full day of demo
        restaurant data. Receive stock, log production, record wastage, and hit
        <span className="text-foreground"> "Run Demo Flow"</span> on the dashboard to watch reconciliation happen live.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8 }}
        className="spotlight-frame mt-12 overflow-hidden rounded-2xl border border-white/10 bg-brand-slate"
        data-testid="live-demo-frame"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-brand-terra/70" />
            <span className="size-2.5 rounded-full bg-brand-gold/70" />
            <span className="size-2.5 rounded-full bg-brand-emerald/70" />
            <span className="ml-3 hidden font-mono text-[10px] tracking-widest text-muted-foreground sm:block">
              inventorypro.in — live interactive prototype
            </span>
          </div>
          <a
            href="/demo/inventorypro.html"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="demo-open-fullscreen-link"
            className="flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-brand-terra/60 hover:text-foreground"
          >
            <ExternalLink className="size-3.5" />
            Open full screen
          </a>
        </div>
        <iframe
          src="/demo/inventorypro.html"
          title="InventoryPro.in live prototype demo"
          data-testid="demo-iframe"
          className="h-[78vh] min-h-[560px] w-full bg-white"
          loading="lazy"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mt-6 flex items-center gap-3 text-sm text-muted-foreground"
      >
        <span className="grid size-8 place-items-center rounded-full bg-brand-terra/15 text-brand-terra">
          <Play className="size-3.5" />
        </span>
        Tip for your walkthrough: open the prototype, press "Run Demo Flow", then show the Variance Center.
      </motion.div>
    </section>
  );
}
