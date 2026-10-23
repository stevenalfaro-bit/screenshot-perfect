import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { readWorld, type WorldState } from "./world";

export type LiveState = {
  event_key: string | null;
  stage: number;
  stage_started_at: string;
  run_id: string;
  world: WorldState;
};

type Row = { event_key: string | null; stage: number; stage_started_at: string; run_id: string; world: unknown };
const toState = (r: Row): LiveState => ({ event_key: r.event_key, stage: r.stage, stage_started_at: r.stage_started_at, run_id: r.run_id, world: readWorld(r.world) });

/** Current live event row, kept in sync in real time. */
export function useLiveState() {
  const [state, setState] = useState<LiveState | null>(null);
  useEffect(() => {
    let alive = true;
    supabase.from("live_event_state").select("event_key,stage,stage_started_at,run_id,world").eq("id", 1).single()
      .then(({ data }) => { if (alive && data) setState(toState(data as Row)); });
    const ch = supabase
      .channel("live-event-state-" + Math.random().toString(36).slice(2))
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "live_event_state" }, (p) => {
        setState(toState(p.new as Row));
      })
      .subscribe();
    return () => { alive = false; supabase.removeChannel(ch); };
  }, []);
  return state;
}
