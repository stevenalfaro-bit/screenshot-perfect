import { describe, it, expect } from "vitest";
import { EVENTS, canAutoAdvance, nextStage, getEvent } from "@/live/events";

describe("live events", () => {
  it("has 10 live events", () => {
    expect(EVENTS).toHaveLength(10);
  });
  it("steal-the-moon has Gru's speech line", () => {
    const s = getEvent("steal-moon")!.stages.find((x) => x.kind === "cutscene" && x.lines.includes("THE MOOOOON!!!"));
    expect(s).toBeTruthy();
  });
  it("does not auto-advance before the stage time is up", () => {
    expect(canAutoAdvance("steal-moon", 1, 10)).toBe(false);
    expect(canAutoAdvance("steal-moon", 1, 90)).toBe(true);
  });
  it("ends after the last stage", () => {
    const last = getEvent("banana-rain")!.stages.length - 1;
    expect(nextStage("banana-rain", last)).toBeNull();
    expect(nextStage("banana-rain", 0)).toBe(1);
  });
});
