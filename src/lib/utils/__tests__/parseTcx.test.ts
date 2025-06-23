import { parseTcx } from "../running/parseTcx";

const sample = `<?xml version="1.0" encoding="UTF-8"?>
<TrainingCenterDatabase>
  <Activities>
    <Activity Sport="Running">
      <Id>2024-05-01T10:00:00Z</Id>
      <Lap StartTime="2024-05-01T10:00:00Z">
        <TotalTimeSeconds>1800</TotalTimeSeconds>
        <DistanceMeters>5000</DistanceMeters>
      </Lap>
    </Activity>
  </Activities>
</TrainingCenterDatabase>`;

describe("parseTcx", () => {
  it("parses a simple tcx run", () => {
    const run = parseTcx(sample, { userId: "user1", distanceUnit: "kilometers" });
    expect(run.date.toISOString()).toBe("2024-05-01T10:00:00.000Z");
    expect(run.duration).toBe("00:30:00");
    expect(run.distance).toBe(5);
    expect(run.distanceUnit).toBe("kilometers");
    expect(run.pace?.pace).toBe("06:00");
    expect(run.pace?.unit).toBe("kilometers");
  });
});
