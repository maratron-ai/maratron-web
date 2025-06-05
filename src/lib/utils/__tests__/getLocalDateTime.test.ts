import { getLocalDateTime } from "../time";

describe("getLocalDateTime", () => {
  it("returns ISO datetime without timezone offset", () => {
    const value = getLocalDateTime();
    expect(value).toHaveLength(16);
    expect(value).toMatch(/T/);
    const asDate = new Date(value);
    expect(asDate.toISOString().slice(0,16)).toBe(value);
  });
});
