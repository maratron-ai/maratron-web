import { calculateVO2MaxJackDaniels } from "../calculateVO2MaxJackDaniels";

describe("VO2 Max Calculator", () => {
  it("calculates VO2 max for a 5K race in 20 minutes", () => {
    const distanceMeters = 5000; // 5 kilometers
    const timeSeconds = 1200; // 20 minutes in seconds
    const result = calculateVO2MaxJackDaniels(distanceMeters, timeSeconds);

    expect(result).toBeCloseTo(49.8, 1); 
  });

  it("calculates VO2 max for a 10K race in 50 minutes", () => {
    const distanceMeters = 10000; // 10 kilometers
    const timeSeconds = 3000; // 50 minutes in seconds
    const result = calculateVO2MaxJackDaniels(distanceMeters, timeSeconds);

    expect(result).toBeCloseTo(40.01, 1); 
  });

  it("handles extreme cases of very long races (marathon in 4 hours)", () => {
    const distanceMeters = 42195; // Marathon distance
    const timeSeconds = 14400; // 4 hours in seconds
    const result = calculateVO2MaxJackDaniels(distanceMeters, timeSeconds);

    expect(result).toBeCloseTo(37.9, 1);
  });
});
