import { Flame } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/8 py-10" data-testid="site-footer">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 sm:flex-row sm:px-8">
        <span className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-lg bg-brand-terra/15 text-brand-terra">
            <Flame className="size-3.5" />
          </span>
          <span className="font-display text-base font-bold">
            InventoryPro<span className="text-brand-terra">.in</span>
          </span>
        </span>
        <p className="text-center text-xs text-muted-foreground">
          Restaurant inventory, production & food-cost control. Prototype demo — data shown is illustrative.
        </p>
        <p className="font-mono text-xs text-muted-foreground">© 2026 InventoryPro.in</p>
      </div>
    </footer>
  );
}
