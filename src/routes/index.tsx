import { createFileRoute } from "@tanstack/react-router";
import MinionHome from "@/components/home/MinionHome";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "The Minions Project" },
      { name: "description", content: "The Minions Project - a cheerful, playful site with minion games and live events." },
      { property: "og:title", content: "The Minions Project" },
      { property: "og:description", content: "Playful minion games and live events everyone joins together." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MinionHome,
});
