import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type LiveState = {
  event_key: string | null;
  stage: number;
  stage_started_at: string;
  run_id: string;
};

/** Current live event row, kept in sync in real time. */
export function useLiveState() {
  const [state, setState] = useState<LiveState | null>(null);
  useEffect(() => {
    let alive = true;
    supabase.from("live_event_state").select("event_key,stage,stage_started_at,run_id").eq("id", 1).single()
      .then(({ data }) => { if (alive && data) setState(data); });
    const ch = supabase
      .channel("live-event-state-" + Math.random().toString(36).slice(2))
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "live_event_state" }, (p) => {
        const r = p.new as LiveState;
        setState({ event_key: r.event_key, stage: r.stage, stage_started_at: r.stage_started_at, run_id: r.run_id });
      })
      .subscribe();
    return () => { alive = false; supabase.removeChannel(ch); };
  }, []);
  return state;
}
