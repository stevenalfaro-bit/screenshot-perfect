import { describe, it, expect } from "vitest";
import { WORLD_ACTIONS, applyAction, DEFAULT_WORLD } from "@/live/world";

describe("admin world actions", () => {
  it("has 50 admin actions", () => {
    expect(WORLD_ACTIONS).toHaveLength(50);
    expect(new Set(WORLD_ACTIONS.map((a) => a.id)).size).toBe(50);
  });
  it("one-shot effects stamp a time", () => {
    const w = applyAction(DEFAULT_WORLD, "fireworks", 123)!;
    expect(w.effect).toBe("fireworks");
    expect(w.effectAt).toBe(123);
  });
  it("unknown actions are rejected", () => {
    expect(applyAction(DEFAULT_WORLD, "nope", 1)).toBeNull();
  });
});
