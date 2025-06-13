/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import {
  updateRunnerProfile,
  createRunnerProfile,
  getRunnerProfile,
} from "../user/user";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("user api helpers", () => {
  afterEach(() => jest.clearAllMocks());

  it("updateRunnerProfile puts data", async () => {
    mockedAxios.put.mockResolvedValue({ data: { id: "1" } });
    const result = await updateRunnerProfile("1", { name: "joe" } as any);
    expect(mockedAxios.put).toHaveBeenCalledWith("/api/users/1", {
      name: "joe",
    });
    expect(result).toEqual({ id: "1" });
  });

  it("createRunnerProfile posts data", async () => {
    mockedAxios.post.mockResolvedValue({ data: { id: "1" } });
    const data = { name: "joe" };
    const result = await createRunnerProfile(data as any);
    expect(mockedAxios.post).toHaveBeenCalledWith("/api/users", data);
    expect(result).toEqual({ data: { id: "1" } });
  });

  it("getRunnerProfile fetches data", async () => {
    mockedAxios.get.mockResolvedValue({ data: { id: "1" } });
    const result = await getRunnerProfile("1");
    expect(mockedAxios.get).toHaveBeenCalledWith("/api/users/1");
    expect(result).toEqual({ id: "1" });
  });
});
