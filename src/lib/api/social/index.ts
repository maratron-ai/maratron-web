import axios from "axios";
import type { SocialProfile, RunPost, Comment } from "@maratypes/social";

export const createSocialProfile = async (
  data: Pick<SocialProfile, "userId" | "username"> & Partial<SocialProfile>
): Promise<SocialProfile> => {
  const { data: profile } = await axios.post<SocialProfile>(
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
  data: Partial<SocialProfile>
): Promise<SocialProfile> => {
  const { data: profile } = await axios.put<SocialProfile>(
    `/api/social/profile/byId/${id}`,
    data
  );
  return profile;
};

export const likePost = async (
  postId: string,
  profileId: string
): Promise<void> => {
  await axios.post(`/api/social/posts/${postId}/like`, {
    socialProfileId: profileId,
  });
};

export const unlikePost = async (
  postId: string,
  profileId: string
): Promise<void> => {
  await axios.delete(`/api/social/posts/${postId}/like`, {
    data: { socialProfileId: profileId },
  });
};

export const addComment = async (
  postId: string,
  profileId: string,
  text: string
): Promise<Comment> => {
  const { data: comment } = await axios.post<Comment>(
    `/api/social/posts/${postId}/comments`,
    { socialProfileId: profileId, text }
  );
  return comment;
};

export const listComments = async (postId: string): Promise<Comment[]> => {
  const { data: comments } = await axios.get<Comment[]>(
    `/api/social/posts/${postId}/comments`
  );
  return comments;
};
