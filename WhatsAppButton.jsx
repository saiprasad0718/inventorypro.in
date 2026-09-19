import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/919908659651?text=Hi%20Sai,%20I%20saw%20InventoryPro.in%20and%20want%20a%20live%20demo%20for%20my%20restaurant."
      target="_blank"
      rel="noopener noreferrer"
      data-testid="floating-whatsapp-chat-button"
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.6, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.05 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full border border-brand-emerald/40 bg-brand-obsidian/90 py-3 pl-4 pr-5 shadow-2xl shadow-brand-emerald/20 backdrop-blur-xl"
    >
      <span className="relative grid size-9 place-items-center rounded-full bg-brand-emerald text-white">
        <MessageCircle className="size-5" />
        <span className="pulse-dot absolute -right-0.5 -top-0.5 size-3 rounded-full border-2 border-brand-obsidian bg-brand-emerald" />
      </span>
      <span className="text-left leading-tight">
        <span className="block text-[10px] font-mono uppercase tracking-widest text-brand-emerald">Chat with Sai</span>
        <span className="block text-xs font-semibold text-foreground">Book your demo on WhatsApp</span>
      </span>
    </motion.a>
  );
}
