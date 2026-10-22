import { createFileRoute, Link } from "@tanstack/react-router";
import { getEvent } from "@/live/events";
import { useLiveState } from "@/live/useLiveState";

export const Route = createFileRoute("/live")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Live Events - The Minions Project" },
      { name: "description", content: "Join live minion events with everyone on the site." },
      { property: "og:title", content: "Live Minion Events" },
      { property: "og:description", content: "Join live minion events with everyone on the site." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LivePage,
});

function LivePage() {
  const live = useLiveState();
  const ev = getEvent(live?.event_key);
  const stage = ev && live ? ev.stages[live.stage] : null;
  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(180deg,#fff8d8_0%,#f0f7ff_100%)] p-6">
      <div className="max-w-lg text-center rounded-[24px] bg-white/80 p-8">
        {ev && stage ? (
          <>
            <div className="text-5xl mb-2">{ev.emoji}</div>
            <h1 className="text-3xl font-extrabold text-[#123e9b]">{ev.name}</h1>
            <p className="mt-2 font-bold">{stage.title}</p>
            <p className="text-gray-700/80">{stage.hint}</p>
          </>
        ) : (
          <h1 className="text-2xl font-extrabold text-[#123e9b]">Waiting for a live event to start...</h1>
        )}
        <p className="mt-4 text-sm text-gray-600">The 3D world is still being built.</p>
        <Link to="/" className="inline-block mt-4 font-bold text-[#123e9b] hover:underline">Back home</Link>
      </div>
    </div>
  );
}
