import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type A = { id: string; message: string; style: string };

const styles: Record<string, string> = {
  info: "linear-gradient(135deg,#1d63d2,#123e9b)",
  party: "linear-gradient(135deg,#f9d93d,#f08a24)",
  alert: "linear-gradient(135deg,#ef4444,#991b1b)",
};

/** Shows admin announcements to everyone on every page, live. */
export function Announcements() {
  const [items, setItems] = useState<A[]>([]);
  useEffect(() => {
    const ch = supabase
      .channel("announcements-" + Math.random().toString(36).slice(2))
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "announcements" }, (p) => {
        const a = p.new as A;
        setItems((xs) => [...xs.slice(-2), a]);
        setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== a.id)), 10000);
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);
  if (!items.length) return null;
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-[min(92vw,620px)] pointer-events-none">
      {items.map((a) => (
        <div key={a.id} className="rounded-2xl px-5 py-4 shadow-2xl animate-in slide-in-from-top-4 fade-in"
          style={{ background: styles[a.style] ?? styles.info, color: a.style === "party" ? "#123e9b" : "#fff" }}>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] opacity-80">📣 Announcement</p>
          <p className="text-lg font-extrabold leading-snug break-words" style={{ fontFamily: '"Baloo 2", cursive' }}>{a.message}</p>
        </div>
      ))}
    </div>
  );
}
