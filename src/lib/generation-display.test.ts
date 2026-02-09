import {
  formatGenerationsDisplay,
  isAtMonthlyLimit,
} from "./generation-display";

describe("formatGenerationsDisplay", () => {
  it("formats limited plan as used / limit", () => {
    expect(formatGenerationsDisplay(3, 5)).toBe("3 / 5");
    expect(formatGenerationsDisplay(0, 25)).toBe("0 / 25");
  });

  it("formats unlimited plan with (Unlimited)", () => {
    expect(formatGenerationsDisplay(10, null)).toBe("10 (Unlimited)");
    expect(formatGenerationsDisplay(0, null)).toBe("0 (Unlimited)");
  });
});

describe("isAtMonthlyLimit", () => {
  it("returns false when bypass is true", () => {
    expect(isAtMonthlyLimit(5, 5, true)).toBe(false);
    expect(isAtMonthlyLimit(100, 5, true)).toBe(false);
  });

  it("returns false when limit is null (unlimited)", () => {
    expect(isAtMonthlyLimit(100, null)).toBe(false);
  });

  it("returns true when used >= limit", () => {
    expect(isAtMonthlyLimit(5, 5)).toBe(true);
    expect(isAtMonthlyLimit(6, 5)).toBe(true);
  });

  it("returns false when used < limit", () => {
    expect(isAtMonthlyLimit(4, 5)).toBe(false);
    expect(isAtMonthlyLimit(0, 5)).toBe(false);
  });
});
