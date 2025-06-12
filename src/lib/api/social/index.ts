import axios from "axios";
import type { SocialUserProfile, RunPost } from "@maratypes/social";

export const createSocialProfile = async (
  data: Pick<SocialUserProfile, "userId" | "username"> & Partial<SocialUserProfile>
): Promise<SocialUserProfile> => {
  const { data: profile } = await axios.post<SocialUserProfile>(
    "/api/social/profile",
    data
  );
  return profile;
};

export const followUser = async (
  followerId: string,
  followingId: string
): Promise<void> => {
  await axios.post("/api/social/follow", { followerId, followingId });
};

export const unfollowUser = async (
  followerId: string,
  followingId: string
): Promise<void> => {
  await axios.delete("/api/social/follow", {
    data: { followerId, followingId },
  });
};

export const isFollowing = async (
  followerId: string,
  followingId: string
): Promise<boolean> => {
  const { data } = await axios.get<{ following: boolean }>(
    `/api/social/follow?followerId=${followerId}&followingId=${followingId}`
  );
  return data.following;
};

export const createPost = async (
  data: Partial<RunPost>
): Promise<RunPost> => {
  const { data: post } = await axios.post<RunPost>("/api/social/posts", data);
  return post;
};


export const updateSocialProfile = async (
  id: string,
  data: Partial<SocialUserProfile>
): Promise<SocialUserProfile> => {
  const { data: profile } = await axios.put<SocialUserProfile>(
    `/api/social/profile/byId/${id}`,
    data
  );
  return profile;
};
