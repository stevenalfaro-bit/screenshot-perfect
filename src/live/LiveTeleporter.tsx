import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useLiveState } from "./useLiveState";

/** When the admin starts a new live event, pull every visitor into the live world. */
export function LiveTeleporter() {
  const live = useLiveState();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const lastRun = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    if (!live) return;
    const prev = lastRun.current;
    lastRun.current = live.event_key ? live.run_id : null;
    if (prev === undefined) return; // first load: don't yank people around
    if (live.event_key && live.run_id !== prev && pathname !== "/live" && pathname !== "/admin") {
      navigate({ to: "/live" });
    }
  }, [live, pathname, navigate]);
  return null;
}
