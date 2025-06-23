/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { connectDevice } from "../device";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("device api helpers", () => {
  afterEach(() => jest.clearAllMocks());

  it("connectDevice posts data", async () => {
    mockedAxios.post.mockResolvedValue({ data: { success: true } });
    const payload = { provider: "garmin", token: "abc", userId: "1" } as any;
    const res = await connectDevice(payload);
    expect(mockedAxios.post).toHaveBeenCalledWith("/api/devices/connect", payload);
    expect(res).toEqual({ success: true });
  });
});
