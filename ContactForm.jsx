import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { Send, Loader2, Mail, Phone } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const initial = { name: "", email: "", phone: "", restaurant_name: "", outlets: "1 Outlet", message: "" };

const inputCls =
  "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors duration-300 focus:border-brand-terra/60";

export default function ContactForm() {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/enquiry`, form);
      toast.success("Enquiry sent! Sai will reach out to you shortly.", {
        description: "Your details have been emailed directly to the InventoryPro.in team.",
      });
      setForm(initial);
    } catch (err) {
      toast.error("Could not send your enquiry", {
        description: err.response?.data?.detail || "Please try again or reach us on WhatsApp.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative py-28 sm:py-36">
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 h-[420px] w-[800px] -translate-x-1/2 rounded-full bg-brand-terra/10 blur-[140px]"
      />
      <div className="relative mx-auto grid max-w-7xl gap-16 px-5 sm:px-8 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-brand-gold">See It On Your Own Data</p>
          <h2 className="mt-4 font-display text-2xl font-bold tracking-tight sm:text-4xl">
            Book a live walkthrough for your restaurant.
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
            Tell us about your outlets and your biggest inventory headaches. Every
            enquiry lands directly in Sai's inbox — expect a call or WhatsApp message
            to schedule your personalised demo.
          </p>
          <div className="mt-10 space-y-4">
            <a
              href="mailto:saiprasad2318@gmail.com"
              data-testid="contact-email-link"
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-brand-slate p-5 transition-colors duration-300 hover:border-brand-terra/50"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-brand-terra/15 text-brand-terra">
                <Mail className="size-5" />
              </span>
              <span>
                <span className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Email</span>
                <span className="text-sm font-semibold">saiprasad2318@gmail.com</span>
              </span>
            </a>
            <a
              href="https://wa.me/919908659651"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="contact-whatsapp-link"
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-brand-slate p-5 transition-colors duration-300 hover:border-brand-emerald/50"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-brand-emerald/15 text-brand-emerald">
                <Phone className="size-5" />
              </span>
              <span>
                <span className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">WhatsApp</span>
                <span className="text-sm font-semibold">+91 99086 59651</span>
              </span>
            </a>
          </div>
        </motion.div>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="glow-border space-y-4 rounded-2xl border border-white/10 bg-brand-slate p-6 sm:p-8"
          data-testid="contact-form"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              required
              value={form.name}
              onChange={set("name")}
              placeholder="Your name"
              data-testid="contact-form-name-input"
              className={inputCls}
            />
            <input
              required
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="Email address"
              data-testid="contact-form-email-input"
              className={inputCls}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              required
              type="tel"
              value={form.phone}
              onChange={set("phone")}
              placeholder="WhatsApp / phone number"
              data-testid="contact-form-phone-input"
              className={inputCls}
            />
            <input
              required
              value={form.restaurant_name}
              onChange={set("restaurant_name")}
              placeholder="Restaurant / brand name"
              data-testid="contact-form-restaurant-input"
              className={inputCls}
            />
          </div>
          <select
            value={form.outlets}
            onChange={set("outlets")}
            data-testid="contact-form-outlets-select"
            className={`${inputCls} appearance-none`}
          >
            {["1 Outlet", "2-5 Outlets", "6-15 Outlets", "15+ Chain/Franchise"].map((o) => (
              <option key={o} value={o} className="bg-brand-slate">{o}</option>
            ))}
          </select>
          <textarea
            rows={4}
            value={form.message}
            onChange={set("message")}
            placeholder="Your biggest inventory challenges (optional)"
            data-testid="contact-form-message-input"
            className={`${inputCls} resize-none`}
          />
          <button
            type="submit"
            disabled={loading}
            data-testid="contact-form-submit-button"
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-brand-terra py-3.5 text-sm font-semibold text-white transition-transform duration-300 hover:scale-[1.02] disabled:opacity-60"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4 transition-transform duration-300 group-hover:translate-x-1" />}
            {loading ? "Sending..." : "Request My Live Demo"}
          </button>
          <p className="text-center text-xs text-muted-foreground">
            Goes straight to Sai's inbox — no spam, ever.
          </p>
        </motion.form>
      </div>
    </section>
  );
}
