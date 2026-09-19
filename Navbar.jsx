import { motion } from "framer-motion";
import { Flame } from "lucide-react";

const links = [
  { label: "The Problem", href: "#manifesto" },
  { label: "Owner View", href: "#dashboard" },
  { label: "Live Demo", href: "#demo" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <nav className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-brand-obsidian/70 px-5 py-3 backdrop-blur-xl">
          <a href="#top" data-testid="nav-brand-logo" className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-brand-terra/15 text-brand-terra">
              <Flame className="size-4" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight">
              InventoryPro<span className="text-brand-terra">.in</span>
            </span>
          </a>
          <div className="hidden items-center gap-7 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                data-testid={`nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </div>
          <a
            href="/login"
            data-testid="nav-staff-login-link"
            className="rounded-full border border-white/15 px-5 py-2 text-sm font-semibold text-muted-foreground transition-colors duration-300 hover:border-brand-gold/60 hover:text-foreground"
          >
            Staff Login
          </a>
          <a
            href="#contact"
            data-testid="nav-book-demo-button"
            className="rounded-full bg-brand-terra px-5 py-2 text-sm font-semibold text-white transition-transform duration-300 hover:scale-[1.04]"
          >
            Book a Demo
          </a>
        </nav>
      </div>
    </motion.header>
  );
}
