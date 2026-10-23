// Shared world settings the admin can change live. Pure data, safe everywhere.

export type Weather = "clear" | "rain" | "storm" | "snow" | "blizzard" | "fog" | "bananas" | "confetti" | "hearts" | "glitter" | "leaves" | "bubbles";
export type Skin = "yellow" | "gold" | "purple";

export type WorldState = {
  hour: number;
  weather: Weather;
  speed: number;
  jump: number;
  gravity: number;
  scale: number;
  disco: boolean;
  bigMoon: boolean;
  skin: Skin;
  effect?: string;
  effectAt?: number;
};

export const DEFAULT_WORLD: WorldState = {
  hour: 10, weather: "clear", speed: 1, jump: 1, gravity: 1, scale: 1, disco: false, bigMoon: false, skin: "yellow",
};

export function readWorld(raw: unknown): WorldState {
  return { ...DEFAULT_WORLD, ...(raw && typeof raw === "object" ? (raw as Partial<WorldState>) : {}) };
}

export type WorldAction = { id: string; label: string; emoji: string; group: string; patch?: Partial<WorldState>; effect?: string };

const t = (id: string, label: string, emoji: string, hour: number): WorldAction => ({ id, label, emoji, group: "Time of day", patch: { hour } });
const w = (id: Weather, label: string, emoji: string): WorldAction => ({ id: "weather-" + id, label, emoji, group: "Weather", patch: { weather: id } });
const m = (id: string, label: string, emoji: string, patch: Partial<WorldState>): WorldAction => ({ id, label, emoji, group: "Movement", patch });
const s = (id: string, label: string, emoji: string, scale: number): WorldAction => ({ id, label, emoji, group: "Size", patch: { scale } });
const e = (id: string, label: string, emoji: string): WorldAction => ({ id, label, emoji, group: "Effects", effect: id });
const f = (id: string, label: string, emoji: string, patch: Partial<WorldState>): WorldAction => ({ id, label, emoji, group: "Fun", patch });

export const WORLD_ACTIONS: WorldAction[] = [
  t("dawn", "Sunrise", "🌅", 6), t("morning", "Morning", "🌤️", 9), t("noon", "Noon", "☀️", 12),
  t("sunset", "Sunset", "🌇", 18), t("dusk", "Dusk", "🌆", 19.5), t("night", "Night", "🌙", 23),
  w("clear", "Clear sky", "🌈"), w("rain", "Rain", "🌧️"), w("storm", "Thunderstorm", "⛈️"), w("snow", "Snow", "🌨️"),
  w("blizzard", "Blizzard", "❄️"), w("fog", "Thick fog", "🌫️"), w("bananas", "Banana rain", "🍌"), w("confetti", "Confetti", "🎊"),
  w("hearts", "Hearts", "💖"), w("glitter", "Glitter", "✨"), w("leaves", "Falling leaves", "🍂"), w("bubbles", "Bubbles", "🫧"),
  m("speed-normal", "Normal speed", "🚶", { speed: 1 }), m("speed-fast", "Fast", "🏃", { speed: 1.8 }), m("speed-super", "Super speed", "⚡", { speed: 3 }),
  m("speed-slow", "Slow motion", "🐢", { speed: 0.45 }), m("jump-normal", "Normal jump", "⬆️", { jump: 1 }), m("jump-high", "High jump", "🦘", { jump: 1.8 }),
  m("jump-moon", "Mega jump", "🚀", { jump: 3 }), m("grav-low", "Low gravity", "🪐", { gravity: 0.3 }), m("grav-normal", "Normal gravity", "🌍", { gravity: 1 }),
  m("grav-heavy", "Heavy gravity", "🏋️", { gravity: 2.2 }),
  s("tiny", "Tiny minions", "🐜", 0.45), s("normal", "Normal size", "🙂", 1), s("big", "Big minions", "🦍", 1.8), s("giant", "GIANT minions", "🗿", 3.5),
  e("fireworks", "Fireworks", "🎆"), e("meteors", "Meteor shower", "☄️"), e("rainbow", "Rainbow", "🌈"), e("earthquake", "Earthquake", "🫨"),
  e("lightning", "Lightning flash", "🌩️"), e("banana-bomb", "Banana bomb", "💥"), e("launch", "Launch everyone", "🛫"), e("tp-spawn", "Teleport to spawn", "🏠"),
  e("tp-park", "Teleport to park", "🌳"), e("tp-lab", "Teleport to lab", "🧪"), e("tp-hangar", "Teleport to hangar", "🛸"), e("tp-space", "Teleport to space", "🌌"),
  f("disco-on", "Disco lights on", "🪩", { disco: true }), f("disco-off", "Disco lights off", "💡", { disco: false }),
  f("moon-on", "Giant moon", "🌕", { bigMoon: true }), f("moon-off", "Normal moon", "🌑", { bigMoon: false }),
  f("skin-gold", "Golden minions", "🏆", { skin: "gold" }), f("skin-purple", "Purple minions", "💜", { skin: "purple" }),
];

export const ACTION_GROUPS = [...new Set(WORLD_ACTIONS.map((a) => a.group))];

export function applyAction(world: WorldState, id: string, now: number): WorldState | null {
  const a = WORLD_ACTIONS.find((x) => x.id === id);
  if (!a) return null;
  const next = { ...world, ...(a.patch ?? {}) };
  if (a.effect) { next.effect = a.effect; next.effectAt = now; }
  return next;
}
