import { parsePace, formatPace, getPacesFromRacePace } from "../running/paces";

describe("pace utilities", () => {
  it("parses and formats pace", () => {
    expect(parsePace("5:30")).toBe(330);
    expect(formatPace(330)).toBe("5:30");
  });

  it("calculates training paces from race pace", () => {
    const paces = getPacesFromRacePace(330);
    expect(paces).toEqual({
      easy: "6:53",
      marathon: "5:47",
      threshold: "5:14",
      interval: "4:57",
      race: "5:30",
    });
  });
});
