// Shared, pure definitions of every live event. Used by the server (timing)
// and by the 3D world (what to show). No browser or server APIs here.

export type AreaKey = "house" | "lab" | "hangar" | "park" | "space";

export const AREAS: Record<AreaKey, { x: number; size: number; spawn: [number, number]; label: string }> = {
  house: { x: 0, size: 30, spawn: [0, 8], label: "Gru's House" },
  lab: { x: 70, size: 34, spawn: [70, 10], label: "Secret Lab" },
  hangar: { x: 140, size: 36, spawn: [140, 12], label: "Rocket Hangar" },
  park: { x: -90, size: 60, spawn: [-90, 20], label: "Banana Park" },
  space: { x: 300, size: 30, spawn: [300, 8], label: "Outer Space" },
};

type Base = { title: string; hint: string; area: AreaKey; duration: number };

export type Stage =
  | (Base & { kind: "cutscene"; lines: string[]; speaker?: "gru" | "bob"; cheer?: boolean; flight?: boolean })
  | (Base & { kind: "reach"; target: [number, number]; radius: number; marker: string })
  | (Base & { kind: "hold"; key: string; seconds: number; seats?: boolean; pose: "sit" | "dance" | "bow" | "eat" })
  | (Base & { kind: "spam"; key: string; goalPerPlayer: number; moon?: boolean; label: string })
  | (Base & { kind: "collect"; count: number });

export type LiveEvent = { key: string; name: string; emoji: string; blurb: string; stages: Stage[] };

const keyName = (k: string) => (k === " " ? "SPACE" : k.toUpperCase());
export { keyName };

export const EVENTS: LiveEvent[] = [
  {
    key: "steal-moon",
    name: "We Steal The Moon",
    emoji: "🌕",
    blurb: "Gru's house, the secret lab, the rocket, the speech, and the moon.",
    stages: [
      { kind: "cutscene", title: "Welcome to Gru's house", hint: "Everyone has been teleported!", area: "house", duration: 7, lines: ["Bello, minions!", "Find the secret place in my house..."], speaker: "gru" },
      { kind: "reach", title: "Find the secret place", hint: "Something behind the big bookshelf glows...", area: "house", duration: 90, target: [0, -12], radius: 2.5, marker: "bookshelf" },
      { kind: "reach", title: "Find the way to the rocket", hint: "Follow the lab tunnels to the rocket door", area: "lab", duration: 90, target: [82, -14], radius: 2.5, marker: "door" },
      { kind: "hold", title: "Take a seat", hint: "Walk to a chair and HOLD A to sit", area: "hangar", duration: 45, key: "a", seconds: 1.2, seats: true, pose: "sit" },
      { kind: "cutscene", title: "Gru's speech", hint: "Listen to Gru!", area: "hangar", duration: 13, speaker: "gru", cheer: true, lines: ["MINIONS...", "TONIGHT WE STEAL.....", "THE MOOOOON!!!"] },
      { kind: "cutscene", title: "Blast off!", hint: "Everyone is on the spaceship", area: "hangar", duration: 9, flight: true, lines: ["3... 2... 1... BLAST OFF!"] },
      { kind: "spam", title: "PULL THE MOON", hint: "SPAM SPACE to pull the moon!", area: "space", duration: 40, key: " ", goalPerPlayer: 60, moon: true, label: "Moon pulled" },
      { kind: "cutscene", title: "WE GOT THE MOON!", hint: "Best heist ever", area: "space", duration: 9, speaker: "gru", cheer: true, lines: ["WE DID IT!", "THE MOON IS OURS!"] },
    ],
  },
  {
    key: "banana-hunt", name: "Banana Hunt", emoji: "🍌", blurb: "Bananas everywhere in the park. Grab as many as you can!",
    stages: [
      { kind: "cutscene", title: "Banana Hunt", hint: "Get ready...", area: "park", duration: 6, lines: ["BANANAAAA!", "Find 15 bananas!"] },
      { kind: "collect", title: "Collect 15 bananas", hint: "Walk into bananas to grab them", area: "park", duration: 75, count: 15 },
      { kind: "cutscene", title: "Banana feast!", hint: "Nom nom", area: "park", duration: 6, cheer: true, lines: ["Bee-do bee-do!"] },
    ],
  },
  {
    key: "dance-party", name: "Bello Dance Party", emoji: "🕺", blurb: "Everyone dances together and fills the groove meter.",
    stages: [
      { kind: "hold", title: "Start dancing", hint: "HOLD D to dance", area: "park", duration: 30, key: "d", seconds: 2, pose: "dance" },
      { kind: "spam", title: "Fill the groove meter", hint: "SPAM D to the beat!", area: "park", duration: 30, key: "d", goalPerPlayer: 50, label: "Groove" },
      { kind: "cutscene", title: "Best party ever", hint: "", area: "park", duration: 6, cheer: true, lines: ["PAPOY!"] },
    ],
  },
  {
    key: "unicorn-race", name: "Fluffy Unicorn Race", emoji: "🦄", blurb: "Race across the park to the finish line.",
    stages: [
      { kind: "cutscene", title: "Line up!", hint: "Race starts soon", area: "park", duration: 5, lines: ["IT'S SO FLUFFY!", "Ready... set..."] },
      { kind: "reach", title: "RACE to the finish!", hint: "The finish line is at the far end of the park", area: "park", duration: 60, target: [-90, -26], radius: 4, marker: "finish" },
      { kind: "cutscene", title: "Race over", hint: "", area: "park", duration: 5, cheer: true, lines: ["Winner winner!"] },
    ],
  },
  {
    key: "king-bob", name: "King Bob's Coronation", emoji: "👑", blurb: "Gather at the throne and bow to King Bob.",
    stages: [
      { kind: "reach", title: "Go to the throne", hint: "The throne is in the corner of Gru's house", area: "house", duration: 60, target: [10, -10], radius: 3, marker: "throne" },
      { kind: "hold", title: "Bow to the king", hint: "HOLD B to bow", area: "house", duration: 25, key: "b", seconds: 2, pose: "bow" },
      { kind: "cutscene", title: "Long live King Bob", hint: "", area: "house", duration: 8, speaker: "bob", cheer: true, lines: ["I... AM... KING BOB!", "Bello my people!"] },
    ],
  },
  {
    key: "rocket-countdown", name: "Rocket Fuel Countdown", emoji: "🚀", blurb: "Sit down, fuel the rocket together, blast off.",
    stages: [
      { kind: "hold", title: "Take a seat", hint: "Walk to a chair and HOLD A to sit", area: "hangar", duration: 40, key: "a", seconds: 1.2, seats: true, pose: "sit" },
      { kind: "spam", title: "Fuel the rocket", hint: "SPAM SPACE to pump fuel", area: "hangar", duration: 30, key: " ", goalPerPlayer: 50, label: "Fuel" },
      { kind: "cutscene", title: "Blast off!", hint: "", area: "hangar", duration: 9, flight: true, lines: ["3... 2... 1... LIFT OFF!"] },
    ],
  },
  {
    key: "purple-escape", name: "Purple Minion Escape", emoji: "💜", blurb: "The purple minions are coming! Run to the safe vault.",
    stages: [
      { kind: "cutscene", title: "ALERT!", hint: "", area: "lab", duration: 5, lines: ["PURPLE MINIONS ARE COMING!", "RUN TO THE VAULT!"] },
      { kind: "reach", title: "Get to the safe vault", hint: "The vault is at the back of the lab", area: "lab", duration: 45, target: [56, -14], radius: 3, marker: "vault" },
      { kind: "cutscene", title: "Safe!", hint: "", area: "lab", duration: 5, cheer: true, lines: ["Phew... bee-do!"] },
    ],
  },
  {
    key: "minion-tower", name: "Minion Tower", emoji: "🗼", blurb: "Stack up into the tallest minion tower ever.",
    stages: [
      { kind: "reach", title: "Gather in the middle", hint: "Go to the glowing circle", area: "park", duration: 40, target: [-90, 0], radius: 5, marker: "circle" },
      { kind: "spam", title: "STACK UP!", hint: "SPAM SPACE to climb", area: "park", duration: 30, key: " ", goalPerPlayer: 60, label: "Tower height" },
      { kind: "cutscene", title: "Tallest tower!", hint: "", area: "park", duration: 6, cheer: true, lines: ["Whoaaaa!"] },
    ],
  },
  {
    key: "banana-rain", name: "Banana Rain", emoji: "🌧️", blurb: "It's raining bananas inside the hangar!",
    stages: [
      { kind: "collect", title: "Catch 25 bananas", hint: "Grab the bananas all over the hangar", area: "hangar", duration: 70, count: 25 },
      { kind: "cutscene", title: "Banana party!", hint: "", area: "hangar", duration: 6, cheer: true, lines: ["Tank yu!"] },
    ],
  },
  {
    key: "gelato-party", name: "Gelato Party", emoji: "🍨", blurb: "Run to the gelato truck and eat gelato together.",
    stages: [
      { kind: "reach", title: "Find the gelato truck", hint: "It's parked at the back of the park", area: "park", duration: 60, target: [-80, -20], radius: 4, marker: "truck" },
      { kind: "hold", title: "Eat gelato", hint: "HOLD E to eat", area: "park", duration: 25, key: "e", seconds: 3, pose: "eat" },
      { kind: "cutscene", title: "Gelato!", hint: "", area: "park", duration: 6, cheer: true, lines: ["Gelatooo!"] },
    ],
  },
];

export function getEvent(key: string | null | undefined) {
  return EVENTS.find((e) => e.key === key) ?? null;
}

/** A stage may auto-advance once its full duration has elapsed. */
export function canAutoAdvance(eventKey: string, stage: number, elapsedSeconds: number): boolean {
  const ev = getEvent(eventKey);
  const s = ev?.stages[stage];
  if (!s) return false;
  return elapsedSeconds >= s.duration - 0.5;
}

/** Returns the next state after a stage: next index, or null when the event ends. */
export function nextStage(eventKey: string, stage: number): number | null {
  const ev = getEvent(eventKey);
  if (!ev) return null;
  return stage + 1 < ev.stages.length ? stage + 1 : null;
}
