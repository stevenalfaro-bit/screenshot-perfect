import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual, randomUUID } from "node:crypto";
import { z } from "zod";
import { canAutoAdvance, getEvent, nextStage } from "@/live/events";
import { applyAction, DEFAULT_WORLD, readWorld } from "@/live/world";

type AdminSession = { admin?: boolean };

function sessionConfig() {
  return {
    password: process.env["SESSION_SECRET"]!,
    name: "minion-admin",
    maxAge: 60 * 60 * 12,
    cookie: { httpOnly: true, secure: true, sameSite: "none" as const, path: "/" },
  };
}

function matches(input: string, expected: string) {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

async function requireAdmin() {
  const session = await useSession<AdminSession>(sessionConfig());
  if (!session.data.admin) throw new Error("Not unlocked");
}

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export const unlockAdmin = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string }) => z.object({ password: z.string().max(200) }).parse(d))
  .handler(async ({ data }) => {
    const expected = process.env["ADMIN_PASSWORD"];
    if (!expected) throw new Error("ADMIN_PASSWORD is not set");
    if (!matches(data.password, expected)) return { ok: false as const };
    const session = await useSession<AdminSession>(sessionConfig());
    await session.update({ admin: true });
    return { ok: true as const };
  });

export const adminStatus = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  return { admin: !!session.data.admin };
});

export const lockAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  await session.clear();
  return { ok: true };
});

export const startEvent = createServerFn({ method: "POST" })
  .inputValidator((d: { key: string }) => z.object({ key: z.string().max(60) }).parse(d))
  .handler(async ({ data }) => {
    await requireAdmin();
    if (!getEvent(data.key)) throw new Error("Unknown event");
    const db = await admin();
    const now = new Date().toISOString();
    const { error } = await db.from("live_event_state").update({
      event_key: data.key, stage: 0, stage_started_at: now, run_id: randomUUID(), updated_at: now,
    }).eq("id", 1);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const skipStage = createServerFn({ method: "POST" }).handler(async () => {
  await requireAdmin();
  const db = await admin();
  const { data: row } = await db.from("live_event_state").select("*").eq("id", 1).single();
  if (!row?.event_key) return { ok: true };
  const next = nextStage(row.event_key, row.stage);
  const now = new Date().toISOString();
  await db.from("live_event_state").update(
    next === null ? { event_key: null, stage: 0, updated_at: now } : { stage: next, stage_started_at: now, updated_at: now },
  ).eq("id", 1);
  return { ok: true };
});

export const stopEvent = createServerFn({ method: "POST" }).handler(async () => {
  await requireAdmin();
  const db = await admin();
  await db.from("live_event_state").update({ event_key: null, stage: 0, updated_at: new Date().toISOString() }).eq("id", 1);
  return { ok: true };
});

export const sendAnnouncement = createServerFn({ method: "POST" })
  .inputValidator((d: { message: string; style: string }) =>
    z.object({ message: z.string().trim().min(1).max(280), style: z.enum(["info", "party", "alert"]) }).parse(d))
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = await admin();
    const { error } = await db.from("announcements").insert({ message: data.message, style: data.style });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const worldAction = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => z.object({ id: z.string().max(40) }).parse(d))
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = await admin();
    const { data: row } = await db.from("live_event_state").select("world").eq("id", 1).single();
    const next = data.id === "reset" ? DEFAULT_WORLD : applyAction(readWorld(row?.world), data.id, Date.now());
    if (!next) throw new Error("Unknown action");
    await db.from("live_event_state").update({ world: next as never, updated_at: new Date().toISOString() }).eq("id", 1);
    return { ok: true };
  });

/** Public: anyone can nudge the event forward, but only once the server sees the stage time is up. */
export const autoAdvance = createServerFn({ method: "POST" })
  .inputValidator((d: { runId: string; stage: number }) =>
    z.object({ runId: z.string().uuid(), stage: z.number().int().min(0).max(50) }).parse(d))
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: row } = await db.from("live_event_state").select("*").eq("id", 1).single();
    if (!row?.event_key || row.run_id !== data.runId || row.stage !== data.stage) return { ok: false };
    const elapsed = (Date.now() - new Date(row.stage_started_at).getTime()) / 1000;
    if (!canAutoAdvance(row.event_key, row.stage, elapsed)) return { ok: false };
    const next = nextStage(row.event_key, row.stage);
    const now = new Date().toISOString();
    await db.from("live_event_state").update(
      next === null ? { event_key: null, stage: 0, updated_at: now } : { stage: next, stage_started_at: now, updated_at: now },
    ).eq("id", 1).eq("stage", data.stage).eq("run_id", data.runId);
    return { ok: true };
  });
