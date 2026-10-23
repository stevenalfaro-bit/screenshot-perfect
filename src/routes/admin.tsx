import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { adminStatus, lockAdmin, sendAnnouncement, skipStage, startEvent, stopEvent, unlockAdmin, worldAction } from "@/lib/live.functions";
import { ACTION_GROUPS, WORLD_ACTIONS } from "@/live/world";
import { EVENTS, getEvent } from "@/live/events";
import { useLiveState } from "@/live/useLiveState";

export const Route = createFileRoute("/admin")({
  loader: () => adminStatus(),
  head: () => ({
    meta: [
      { title: "Live Events Dashboard - The Minions Project" },
      { name: "description", content: "Password-protected dashboard to start live minion events." },
      { property: "og:title", content: "Live Events Dashboard" },
      { property: "og:description", content: "Start live minion events for everyone on the site." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const page = "min-h-screen bg-[linear-gradient(180deg,#fff8d8_0%,#f0f7ff_100%)] px-5 py-8";
const card = "rounded-[24px] bg-white/80 border-2 border-[#1d63d2]/10 shadow-[0_12px_30px_rgba(19,32,66,0.12)]";
const yellowBtn = "px-5 py-3 rounded-full font-extrabold text-[#123e9b] bg-[linear-gradient(135deg,#f9d93d,#f6bf2d)] hover:-translate-y-0.5 transition-transform disabled:opacity-50";

function AdminPage() {
  const { admin } = Route.useLoaderData();
  return admin ? <Dashboard /> : <Unlock />;
}

function Unlock() {
  const router = useRouter();
  const unlock = useServerFn(unlockAdmin);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  return (
    <div className={page + " flex items-center justify-center"}>
      <form
        className={card + " p-8 w-full max-w-sm"}
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          const password = new FormData(e.currentTarget).get("password") as string;
          const r = await unlock({ data: { password } });
          setBusy(false);
          if (r.ok) router.invalidate(); else setError(true);
        }}
      >
        <h1 className="text-3xl font-extrabold text-[#123e9b] mb-1" style={{ fontFamily: '"Baloo 2", cursive' }}>Admin</h1>
        <p className="text-gray-700/80 mb-4">Enter the password to open the live events dashboard.</p>
        <input name="password" type="password" autoFocus autoComplete="current-password"
          className="w-full rounded-xl border-2 border-[#1d63d2]/20 px-4 py-3 mb-3 outline-none focus:border-[#1d63d2]" placeholder="Password" />
        {error && <p className="text-red-600 font-bold mb-3">Wrong password</p>}
        <button disabled={busy} className={yellowBtn + " w-full"}>Unlock</button>
        <Link to="/" className="block text-center mt-4 font-bold text-[#123e9b] hover:underline">Back home</Link>
      </form>
    </div>
  );
}

function Dashboard() {
  const router = useRouter();
  const live = useLiveState();
  const start = useServerFn(startEvent);
  const skip = useServerFn(skipStage);
  const stop = useServerFn(stopEvent);
  const lock = useServerFn(lockAdmin);
  const [busy, setBusy] = useState(false);
  const current = getEvent(live?.event_key);
  const run = async (fn: () => Promise<unknown>) => { setBusy(true); try { await fn(); } finally { setBusy(false); } };

  return (
    <div className={page}>
      <div className="max-w-[1100px] mx-auto">
        <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h1 className="text-4xl font-extrabold text-[#123e9b]" style={{ fontFamily: '"Baloo 2", cursive' }}>Live Events Dashboard</h1>
          <div className="flex gap-3">
            <Link to="/live" className={yellowBtn}>Join the world</Link>
            <button className="px-5 py-3 rounded-full font-extrabold text-white bg-[#123e9b]" onClick={() => run(async () => { await lock(); router.invalidate(); })}>Lock</button>
          </div>
        </header>

        <section className={card + " p-6 mb-6"}>
          <p className="uppercase text-xs font-extrabold tracking-[0.14em] text-[#1d63d2] mb-1">Right now</p>
          {current && live ? (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-[#123e9b]">{current.emoji} {current.name}</h2>
                <p className="text-gray-700/80">Stage {live.stage + 1} of {current.stages.length}: <b>{current.stages[live.stage]?.title}</b></p>
              </div>
              <div className="flex gap-3">
                <button disabled={busy} className={yellowBtn} onClick={() => run(() => skip())}>Next stage</button>
                <button disabled={busy} className="px-5 py-3 rounded-full font-extrabold text-white bg-red-600 disabled:opacity-50" onClick={() => run(() => stop())}>End event</button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700/80 font-semibold">No live event running. Pick one below. Everyone on the site gets teleported in.</p>
          )}
        </section>

        <AnnounceBox />
        <WorldControls />

        <h2 className="text-2xl font-extrabold text-[#123e9b] mb-3" style={{ fontFamily: '"Baloo 2", cursive' }}>Live events</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {EVENTS.map((ev) => (
            <article key={ev.key} className={card + " p-6 flex flex-col"}>
              <div className="text-4xl mb-2">{ev.emoji}</div>
              <h3 className="text-xl font-extrabold text-[#123e9b]">{ev.name}</h3>
              <p className="text-gray-700/80 flex-1 mb-4">{ev.blurb}</p>
              <button disabled={busy} className={yellowBtn} onClick={() => run(() => start({ data: { key: ev.key } }))}>
                Start live event
              </button>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnnounceBox() {
  const send = useServerFn(sendAnnouncement);
  const [msg, setMsg] = useState("");
  const [style, setStyle] = useState<"info" | "party" | "alert">("info");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  return (
    <section className={card + " p-6 mb-6"}>
      <p className="uppercase text-xs font-extrabold tracking-[0.14em] text-[#1d63d2] mb-2">📣 Event announcement</p>
      <form className="flex flex-col gap-3" onSubmit={async (e) => {
        e.preventDefault();
        if (!msg.trim()) return;
        setBusy(true);
        try { await send({ data: { message: msg, style } }); setMsg(""); setSent(true); setTimeout(() => setSent(false), 2500); }
        finally { setBusy(false); }
      }}>
        <textarea value={msg} onChange={(e) => setMsg(e.target.value)} maxLength={280} rows={2}
          placeholder="Say anything to everyone on the site..."
          className="w-full rounded-xl border-2 border-[#1d63d2]/20 px-4 py-3 outline-none focus:border-[#1d63d2] resize-none" />
        <div className="flex flex-wrap items-center gap-2">
          {(["info", "party", "alert"] as const).map((s) => (
            <button type="button" key={s} onClick={() => setStyle(s)}
              className={"px-4 py-2 rounded-full font-bold border-2 " + (style === s ? "border-[#123e9b] bg-[#123e9b] text-white" : "border-[#1d63d2]/20 text-[#123e9b]")}>
              {s === "info" ? "💙 Info" : s === "party" ? "🎉 Party" : "🚨 Alert"}
            </button>
          ))}
          <span className="flex-1" />
          {sent && <span className="font-bold text-green-700">Sent to everyone!</span>}
          <span className="text-sm text-gray-500">{msg.length}/280</span>
          <button disabled={busy || !msg.trim()} className={yellowBtn}>Send</button>
        </div>
      </form>
    </section>
  );
}

function WorldControls() {
  const act = useServerFn(worldAction);
  const live = useLiveState();
  const [busy, setBusy] = useState<string | null>(null);
  const go = async (id: string) => { setBusy(id); try { await act({ data: { id } }); } finally { setBusy(null); } };
  const w = live?.world;
  return (
    <section className={card + " p-6 mb-6"}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <p className="uppercase text-xs font-extrabold tracking-[0.14em] text-[#1d63d2]">🌍 World controls ({WORLD_ACTIONS.length})</p>
          {w && <p className="text-sm text-gray-600">Hour {w.hour} · {w.weather} · speed ×{w.speed} · jump ×{w.jump} · gravity ×{w.gravity} · size ×{w.scale}{w.disco ? " · disco" : ""}</p>}
        </div>
        <button disabled={!!busy} onClick={() => go("reset")} className="px-4 py-2 rounded-full font-bold text-white bg-[#123e9b] disabled:opacity-50">Reset world</button>
      </div>
      {ACTION_GROUPS.map((g) => (
        <div key={g} className="mb-4">
          <h3 className="font-extrabold text-[#123e9b] mb-2">{g}</h3>
          <div className="flex flex-wrap gap-2">
            {WORLD_ACTIONS.filter((a) => a.group === g).map((a) => (
              <button key={a.id} disabled={!!busy} onClick={() => go(a.id)}
                className="px-3 py-2 rounded-xl font-bold text-sm bg-[#1d63d2]/[0.07] text-[#123e9b] hover:bg-[#f9d93d] transition-colors disabled:opacity-50">
                {a.emoji} {a.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
