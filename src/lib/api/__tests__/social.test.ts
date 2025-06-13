import axios from "axios";
import {
  createSocialProfile,
  followUser,
  unfollowUser,
  createPost,
  isFollowing,
  updateSocialProfile,
  likePost,
  unlikePost,
  addComment,
  listComments,
} from "../social";
import type { RunPost, Comment } from "@maratypes/social";

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
    const post: RunPost = { id: "1", socialProfileId: "p", distance: 1, time: "00:10:00", createdAt: new Date(), updatedAt: new Date() } as RunPost;
    mockedAxios.post.mockResolvedValue({ data: post });
    const result = await createPost({ distance: 1 });
    expect(mockedAxios.post).toHaveBeenCalledWith("/api/social/posts", { distance: 1 });
    expect(result).toEqual(post);
  });

  it("updateSocialProfile puts data", async () => {
    mockedAxios.put.mockResolvedValue({ data: { id: "p1", username: "t" } });
    const result = await updateSocialProfile("p1", { bio: "hi" });
    expect(mockedAxios.put).toHaveBeenCalledWith("/api/social/profile/byId/p1", { bio: "hi" });
    expect(result).toEqual({ id: "p1", username: "t" });
  });

  it("likePost posts data", async () => {
    mockedAxios.post.mockResolvedValue({ data: {} });
    await likePost("post1", "profile1");
    expect(mockedAxios.post).toHaveBeenCalledWith(
      "/api/social/posts/post1/like",
      { socialProfileId: "profile1" }
    );
  });

  it("unlikePost deletes data", async () => {
    mockedAxios.delete.mockResolvedValue({ data: {} });
    await unlikePost("post1", "profile1");
    expect(mockedAxios.delete).toHaveBeenCalledWith(
      "/api/social/posts/post1/like",
      { data: { socialProfileId: "profile1" } }
    );
  });

  it("addComment posts data", async () => {
    const comment: Comment = {
      id: "c1",
      postId: "p",
      socialProfileId: "s",
      text: "hi",
      createdAt: new Date(),
    } as Comment;
    mockedAxios.post.mockResolvedValue({ data: comment });
    const result = await addComment("p", "s", "hi");
    expect(mockedAxios.post).toHaveBeenCalledWith(
      "/api/social/posts/p/comments",
      { socialProfileId: "s", text: "hi" }
    );
    expect(result).toEqual(comment);
  });

  it("listComments gets data", async () => {
    const comments: Comment[] = [];
    mockedAxios.get.mockResolvedValue({ data: comments });
    const result = await listComments("p");
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "/api/social/posts/p/comments"
    );
    expect(result).toEqual(comments);
  });
});
