import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Pose = { x: number; y: number; z: number; ry: number; m: number; a: string };
export type Remote = Pose & { id: string; name: string; t: number; px: number; py: number; pz: number; pry: number };

export const self = { id: "", name: "", pose: { x: 0, y: 0, z: 0, ry: 0, m: 0, a: "" } as Pose };

/** Joins the shared world room: presence for the roster, broadcast for positions (10/sec). */
export function useMultiplayer(name: string | null) {
  const remotes = useRef(new Map<string, Remote>());
  const [roster, setRoster] = useState<{ id: string; name: string }[]>([]);
  useEffect(() => {
    if (!name) return;
    self.id = crypto.randomUUID();
    self.name = name;
    const ch = supabase.channel("minion-world-room", { config: { broadcast: { self: false }, presence: { key: self.id } } });
    ch.on("broadcast", { event: "p" }, ({ payload }) => {
      const p = payload as Pose & { id: string; name: string };
      const prev = remotes.current.get(p.id);
      remotes.current.set(p.id, {
        ...p, t: performance.now(),
        px: prev?.x ?? p.x, py: prev?.y ?? p.y, pz: prev?.z ?? p.z, pry: prev?.ry ?? p.ry,
      });
    });
    ch.on("presence", { event: "sync" }, () => {
      const st = ch.presenceState<{ name: string }>();
      const list = Object.entries(st).map(([id, v]) => ({ id, name: v[0]?.name ?? "Minion" }));
      for (const id of remotes.current.keys()) if (!st[id]) remotes.current.delete(id);
      setRoster(list);
    });
    ch.subscribe((status) => { if (status === "SUBSCRIBED") ch.track({ name }); });
    const r = (n: number) => Math.round(n * 100) / 100;
    const iv = setInterval(() => {
      const p = self.pose;
      ch.send({ type: "broadcast", event: "p", payload: { id: self.id, name, x: r(p.x), y: r(p.y), z: r(p.z), ry: r(p.ry), m: r(p.m), a: p.a } });
      const now = performance.now();
      for (const [id, v] of remotes.current) if (now - v.t > 8000) remotes.current.delete(id);
    }, 100);
    return () => { clearInterval(iv); supabase.removeChannel(ch); };
  }, [name]);
  return { remotes, roster };
}
