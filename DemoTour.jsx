import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, X, Presentation } from "lucide-react";
import api from "./api";
import { fileUrl } from "./components";

const STEPS = [
  {
    route: "/app",
    title: "The Morning Glance",
    text: "Open here every morning. Sales, food cost %, stock value, wastage and unexplained variance — the whole day on one screen. Point at the Needs Attention list: decisions, not data.",
  },
  {
    route: "/app/purchase",
    title: "Stock In, Ledger Updated",
    text: "When a supplier invoice arrives, one entry updates book stock and the latest purchase rate. Show the live Stock Impact Preview on the right — owners love this part.",
  },
  {
    route: "/app/issue",
    title: "Store to Kitchen",
    text: "The central store issues exactly what each department requests. From this moment, every gram is tracked against a department — not a godown register.",
  },
  {
    route: "/app/production",
    title: "The Magic Step",
    text: "Pick a dish, enter portions, and watch the Expected Consumption panel. On save, each ingredient auto-deducts per the recipe — no registers, no memory, no argument.",
  },
  {
    route: "/app/reconciliation",
    title: "The Money Moment",
    text: "At closing, type what the POS sold. Every produced portion must land somewhere: sold, complimentary, staff meal, wastage or closing stock. Chicken 65 shows over-sold — that's today's leak, found today.",
  },
  {
    route: "/app/variance",
    title: "Nothing Hides",
    text: "Book vs physical. Produced vs accounted. Issued vs consumed. What used to surface in a month-end audit now surfaces before dinner service.",
  },
  {
    route: "/app/reports",
    title: "Seven Days of Truth",
    text: "Close the pitch here: sales, food cost %, wastage and purchases in one table — the report an owner actually acts on every single morning.",
  },
];

const PHOTO_STEPS = new Set([3, 4]);

export default function DemoTour() {
  const [step, setStep] = useState(-1);
  const [dishes, setDishes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const start = () => setStep(0);
    window.addEventListener("ip:start-tour", start);
    return () => window.removeEventListener("ip:start-tour", start);
  }, []);

  useEffect(() => {
    if (step >= 0 && STEPS[step]) {
      navigate(STEPS[step].route);
      if (!dishes.length) api.get("/dishes").then((r) => setDishes(r.data)).catch(() => {});
    }
  }, [step, navigate]);

  if (step < 0 || !STEPS[step]) return null;
  const s = STEPS[step];
  const last = step === STEPS.length - 1;
  const photoDishes = dishes.filter((d) => d.image_url).slice(0, 4);

  return (
    <AnimatePresence>
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="glow-border fixed bottom-6 left-1/2 z-50 w-[min(92vw,560px)] -translate-x-1/2 rounded-2xl border border-white/10 bg-brand-obsidian/95 p-6 shadow-2xl backdrop-blur-xl"
        data-testid="demo-tour-overlay"
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-brand-terra">
            <Presentation className="size-3.5" /> Client Demo · Step {step + 1} of {STEPS.length}
          </span>
          <button onClick={() => setStep(-1)} data-testid="demo-tour-close-button"
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>
        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-bold tracking-tight" data-testid="demo-tour-title">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground" data-testid="demo-tour-text">{s.text}</p>
          </div>
          {PHOTO_STEPS.has(step) && photoDishes.length > 0 && (
            <div className="flex shrink-0 gap-2" data-testid="demo-tour-photos">
              {photoDishes.map((d) => (
                <img key={d.id} src={fileUrl(d.image_url)} alt={d.name} title={d.name}
                  data-testid={`tour-dish-photo-${d.id}`}
                  className="size-14 rounded-xl border border-white/10 object-cover" />
              ))}
            </div>
          )}
        </div>
        <div className="mt-5 flex items-center justify-between">
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? "w-6 bg-brand-terra" : "w-1.5 bg-white/15"}`} />
            ))}
          </div>
          <div className="flex gap-2">
            {step > 0 && (
              <button onClick={() => setStep(step - 1)} data-testid="demo-tour-back-button"
                className="flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground">
                <ArrowLeft className="size-3.5" /> Back
              </button>
            )}
            <button
              onClick={() => (last ? setStep(-1) : setStep(step + 1))}
              data-testid="demo-tour-next-button"
              className="flex items-center gap-1.5 rounded-full bg-brand-terra px-5 py-2 text-xs font-semibold text-white transition-transform hover:scale-[1.04]"
            >
              {last ? "Finish Demo" : <>Next <ArrowRight className="size-3.5" /></>}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
