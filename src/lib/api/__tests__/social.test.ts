import axios from "axios";
import { createSocialProfile, followUser, unfollowUser, createPost, isFollowing } from "../social";
import type { RunPost } from "@maratypes/social";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("social api helpers", () => {
  afterEach(() => jest.clearAllMocks());

  it("createSocialProfile posts data", async () => {
    mockedAxios.post.mockResolvedValue({ data: { id: "p1" } });
    const data = { userId: "u1", username: "tester" };
    const result = await createSocialProfile(data);
    expect(mockedAxios.post).toHaveBeenCalledWith("/api/social/profile", data);
    expect(result).toEqual({ id: "p1" });
  });

  it("followUser posts data", async () => {
    mockedAxios.post.mockResolvedValue({ data: {} });
    await followUser("a", "b");
    expect(mockedAxios.post).toHaveBeenCalledWith("/api/social/follow", { followerId: "a", followingId: "b" });
  });

  it("unfollowUser deletes data", async () => {
    mockedAxios.delete.mockResolvedValue({ data: {} });
    await unfollowUser("a", "b");
    expect(mockedAxios.delete).toHaveBeenCalledWith("/api/social/follow", { data: { followerId: "a", followingId: "b" } });
  });

  it("isFollowing fetches data", async () => {
    mockedAxios.get.mockResolvedValue({ data: { following: true } });
    const result = await isFollowing("a", "b");
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "/api/social/follow?followerId=a&followingId=b"
    );
    expect(result).toBe(true);
  });

  it("createPost posts data", async () => {
    const post: RunPost = { id: "1", userProfileId: "p", distance: 1, time: "00:10:00", createdAt: new Date(), updatedAt: new Date() } as RunPost;
    mockedAxios.post.mockResolvedValue({ data: post });
    const result = await createPost({ distance: 1 });
    expect(mockedAxios.post).toHaveBeenCalledWith("/api/social/posts", { distance: 1 });
    expect(result).toEqual(post);
  });
});
