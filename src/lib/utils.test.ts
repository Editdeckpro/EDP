import { cn, formatSecondsToMinutes } from "./utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", true && "block")).toBe("base block");
  });

  it("handles tailwind conflict (last wins with twMerge)", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });
});

describe("formatSecondsToMinutes", () => {
  it("formats seconds only", () => {
    expect(formatSecondsToMinutes(45)).toBe("45 sec");
  });

  it("formats minutes and seconds", () => {
    expect(formatSecondsToMinutes(125)).toBe("2 min 5 sec");
  });

  it("formats minutes only", () => {
    expect(formatSecondsToMinutes(120)).toBe("2 min");
  });

  it("handles zero", () => {
    expect(formatSecondsToMinutes(0)).toBe("");
  });
});
